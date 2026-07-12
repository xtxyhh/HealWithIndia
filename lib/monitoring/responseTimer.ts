// Response SLA/Timer Engine
// Tracks operational response targets and generates delay signals

import { RESPONSE_TARGETS } from './riskEngine';

export interface ResponseMetrics {
  case_id: string;
  priority: string;
  detected_at: Date;
  acknowledged_at?: Date;
  first_response_at?: Date;
  patient_contacted_at?: Date;
  resolved_at?: Date;
  time_to_acknowledge_minutes?: number;
  time_to_first_response_minutes?: number;
  time_to_patient_contact_minutes?: number;
  time_to_resolution_minutes?: number;
  acknowledgement_target_minutes: number;
  first_response_target_minutes: number;
  acknowledgement_missed: boolean;
  first_response_missed: boolean;
}

export class ResponseTimer {
  /**
   * Calculate response metrics for a safety case
   */
  static calculateMetrics(safetyCase: any): ResponseMetrics {
    const priority = safetyCase.priority || 'medium';
    const targets = RESPONSE_TARGETS[priority as keyof typeof RESPONSE_TARGETS] || RESPONSE_TARGETS.medium;
    
    const detectedAt = new Date(safetyCase.created_at);
    const acknowledgedAt = safetyCase.acknowledged_at ? new Date(safetyCase.acknowledged_at) : undefined;
    const firstResponseAt = safetyCase.first_response_at ? new Date(safetyCase.first_response_at) : undefined;
    const patientContactedAt = safetyCase.patient_contacted_at ? new Date(safetyCase.patient_contacted_at) : undefined;
    const resolvedAt = safetyCase.resolved_at ? new Date(safetyCase.resolved_at) : undefined;

    const timeToAcknowledge = acknowledgedAt 
      ? (acknowledgedAt.getTime() - detectedAt.getTime()) / (1000 * 60)
      : undefined;
    
    const timeToFirstResponse = firstResponseAt
      ? (firstResponseAt.getTime() - detectedAt.getTime()) / (1000 * 60)
      : undefined;
    
    const timeToPatientContact = patientContactedAt
      ? (patientContactedAt.getTime() - detectedAt.getTime()) / (1000 * 60)
      : undefined;
    
    const timeToResolution = resolvedAt
      ? (resolvedAt.getTime() - detectedAt.getTime()) / (1000 * 60)
      : undefined;

    const acknowledgementMissed = !acknowledgedAt && 
      (Date.now() - detectedAt.getTime()) > (targets.acknowledgement_target_minutes * 60 * 1000);

    const firstResponseMissed = !firstResponseAt && 
      (Date.now() - detectedAt.getTime()) > (targets.first_response_target_minutes * 60 * 1000);

    return {
      case_id: safetyCase.id,
      priority,
      detected_at: detectedAt,
      acknowledged_at: acknowledgedAt,
      first_response_at: firstResponseAt,
      patient_contacted_at: patientContactedAt,
      resolved_at: resolvedAt,
      time_to_acknowledge_minutes: timeToAcknowledge ? Math.round(timeToAcknowledge) : undefined,
      time_to_first_response_minutes: timeToFirstResponse ? Math.round(timeToFirstResponse) : undefined,
      time_to_patient_contact_minutes: timeToPatientContact ? Math.round(timeToPatientContact) : undefined,
      time_to_resolution_minutes: timeToResolution ? Math.round(timeToResolution) : undefined,
      acknowledgement_target_minutes: targets.acknowledgement_target_minutes,
      first_response_target_minutes: targets.first_response_target_minutes,
      acknowledgement_missed: acknowledgementMissed,
      first_response_missed: firstResponseMissed
    };
  }

  /**
   * Check if a case should generate a response delay signal
   */
  static shouldGenerateDelaySignal(safetyCase: any): boolean {
    const metrics = this.calculateMetrics(safetyCase);
    
    // Only generate delay signals for critical/high priority cases
    if (safetyCase.priority !== 'critical' && safetyCase.priority !== 'high') {
      return false;
    }

    // Only generate if case is still open/detected
    if (safetyCase.status === 'resolved' || safetyCase.status === 'closed') {
      return false;
    }

    // Generate if acknowledgement is missed
    if (metrics.acknowledgement_missed) {
      return true;
    }

    return false;
  }

  /**
   * Get human-readable delay message for display
   */
  static getDelayMessage(metrics: ResponseMetrics): string {
    if (metrics.acknowledgement_missed) {
      const overdueMinutes = Math.round(
        (Date.now() - metrics.detected_at.getTime()) / (1000 * 60) - metrics.acknowledgement_target_minutes
      );
      return `Critical case has not been acknowledged within configured response threshold (${overdueMinutes}m overdue)`;
    }

    if (metrics.first_response_missed) {
      const overdueMinutes = Math.round(
        (Date.now() - metrics.detected_at.getTime()) / (1000 * 60) - metrics.first_response_target_minutes
      );
      return `Critical case has not received first response within configured target (${overdueMinutes}m overdue)`;
    }

    return '';
  }

  /**
   * Get response performance summary for admin display
   */
  static getPerformanceSummary(allCases: any[]): {
    total_cases: number;
    acknowledged_within_target: number;
    responded_within_target: number;
    average_acknowledgement_time: number;
    average_response_time: number;
  } {
    const metrics = allCases.map(c => this.calculateMetrics(c));
    
    const acknowledgedWithinTarget = metrics.filter(m => 
      m.time_to_acknowledge_minutes !== undefined && 
      m.time_to_acknowledge_minutes <= m.acknowledgement_target_minutes
    ).length;

    const respondedWithinTarget = metrics.filter(m => 
      m.time_to_first_response_minutes !== undefined && 
      m.time_to_first_response_minutes <= m.first_response_target_minutes
    ).length;

    const acknowledgementTimes = metrics
      .map(m => m.time_to_acknowledge_minutes)
      .filter((t): t is number => t !== undefined);
    
    const responseTimes = metrics
      .map(m => m.time_to_first_response_minutes)
      .filter((t): t is number => t !== undefined);

    const averageAcknowledgementTime = acknowledgementTimes.length > 0
      ? Math.round(acknowledgementTimes.reduce((a, b) => a + b, 0) / acknowledgementTimes.length)
      : 0;

    const averageResponseTime = responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0;

    return {
      total_cases: metrics.length,
      acknowledged_within_target: acknowledgedWithinTarget,
      responded_within_target: respondedWithinTarget,
      average_acknowledgement_time: averageAcknowledgementTime,
      average_response_time: averageResponseTime
    };
  }
}
