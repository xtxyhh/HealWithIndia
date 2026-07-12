// Incident Escalation Logic
// Integrates monitoring signals with existing safety_cases system
// Implements deterministic deduplication and automatic escalation

import { Signal } from './signalDetector';

export interface EscalationAction {
  action_type: 'create_case' | 'escalate_priority' | 'flag_case' | 'require_acknowledgement';
  patient_id: bigint;
  case_id?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  metadata?: Record<string, any>;
}

export class IncidentEscalator {
  /**
   * Determine escalation actions based on detected signals
   */
  static determineEscalationActions(signals: Signal[], existingCases: any[]): EscalationAction[] {
    const actions: EscalationAction[] = [];
    const patientId = signals[0]?.patient_id;

    if (!patientId) {
      return actions;
    }

    // Check for critical incident signal
    const criticalSignal = signals.find(s => s.signal_type === 'critical_incident_reported');
    if (criticalSignal) {
      // Check if there's already an active critical case
      const existingCriticalCase = existingCases.find(
        c => c.priority === 'critical' && c.status !== 'closed' && c.status !== 'resolved'
      );

      if (!existingCriticalCase) {
        actions.push({
          action_type: 'create_case',
          patient_id: patientId,
          category: 'medical_emergency',
          priority: 'critical',
          description: 'Critical incident reported by patient',
          metadata: {
            signal_id: criticalSignal.source_entity_id,
            signal_type: 'critical_incident_reported'
          }
        });
      }
    }

    // Check for assistance requested signal
    const assistanceSignal = signals.find(s => s.signal_type === 'assistance_requested');
    if (assistanceSignal) {
      // Check if there's already an active case for this assistance request
      const existingAssistanceCase = existingCases.find(
        c => c.category === 'other' && 
             c.description?.includes('Check-in assistance needed') &&
             c.status !== 'closed' && c.status !== 'resolved'
      );

      if (!existingAssistanceCase) {
        actions.push({
          action_type: 'create_case',
          patient_id: patientId,
          category: 'other',
          priority: 'high',
          description: `Check-in assistance needed: ${assistanceSignal.metadata?.check_in_type || 'unknown'}`,
          metadata: {
            signal_id: assistanceSignal.source_entity_id,
            signal_type: 'assistance_requested'
          }
        });
      }
    }

    // Check for repeated assistance requests
    const repeatedAssistanceSignal = signals.find(s => s.signal_type === 'repeated_assistance_requests');
    if (repeatedAssistanceSignal) {
      // Escalate any existing assistance case to critical
      const existingAssistanceCase = existingCases.find(
        c => c.category === 'other' && 
             c.description?.includes('Check-in assistance needed') &&
             c.status !== 'closed' && c.status !== 'resolved'
      );

      if (existingAssistanceCase) {
        actions.push({
          action_type: 'escalate_priority',
          patient_id: patientId,
          case_id: existingAssistanceCase.id,
          priority: 'critical',
          description: 'Escalated due to repeated assistance requests',
          metadata: {
            signal_id: repeatedAssistanceSignal.source_entity_id,
            signal_type: 'repeated_assistance_requests',
            previous_priority: existingAssistanceCase.priority
          }
        });
      }
    }

    // Check for missed critical arrival milestone
    const missedArrivalSignal = signals.find(s => 
      ['hospital_arrival_missed', 'accommodation_arrival_missed', 'pickup_check_in_missed'].includes(s.signal_type)
    );
    if (missedArrivalSignal) {
      // Check if there's already an active case for this missed milestone
      const existingMilestoneCase = existingCases.find(
        c => c.category === 'transport_issue' || c.category === 'hospital_coordination' ||
             c.category === 'accommodation_issue' &&
             c.status !== 'closed' && c.status !== 'resolved'
      );

      if (!existingMilestoneCase) {
        const category = missedArrivalSignal.signal_type === 'hospital_arrival_missed' 
          ? 'hospital_coordination' 
          : missedArrivalSignal.signal_type === 'accommodation_arrival_missed'
          ? 'accommodation_issue'
          : 'transport_issue';

        actions.push({
          action_type: 'create_case',
          patient_id: patientId,
          category: category,
          priority: 'high',
          description: `Critical arrival milestone missed: ${missedArrivalSignal.signal_type}`,
          metadata: {
            signal_id: missedArrivalSignal.source_entity_id,
            signal_type: missedArrivalSignal.signal_type
          }
        });
      }
    }

    // Check for unresolved fraud concern
    const fraudSignal = signals.find(s => s.signal_type === 'suspicious_contact_reported');
    if (fraudSignal) {
      // Fraud reports already create cases in the fraud API, so we just flag for attention
      const existingFraudCase = existingCases.find(
        c => c.category === 'suspected_fraud' && c.status !== 'closed' && c.status !== 'resolved'
      );

      if (existingFraudCase && existingFraudCase.priority !== 'critical') {
        actions.push({
          action_type: 'escalate_priority',
          patient_id: patientId,
          case_id: existingFraudCase.id,
          priority: 'high',
          description: 'Fraud concern requires immediate attention',
          metadata: {
            signal_id: fraudSignal.source_entity_id,
            signal_type: 'suspicious_contact_reported',
            previous_priority: existingFraudCase.priority
          }
        });
      }
    }

    // Check for critical response delay
    const responseDelaySignal = signals.find(s => s.signal_type === 'critical_case_response_delay');
    if (responseDelaySignal) {
      // Flag the critical case for immediate attention
      const criticalCase = existingCases.find(
        c => c.priority === 'critical' && c.status === 'open'
      );

      if (criticalCase) {
        actions.push({
          action_type: 'require_acknowledgement',
          patient_id: patientId,
          case_id: criticalCase.id,
          description: 'Critical case unacknowledged beyond response threshold',
          metadata: {
            signal_id: responseDelaySignal.source_entity_id,
            signal_type: 'critical_case_response_delay',
            hours_since_creation: responseDelaySignal.metadata?.hours_since_creation
          }
        });
      }
    }

    return actions;
  }

  /**
   * Generate deduplication key for a signal to prevent duplicate active signals
   */
  static getDeduplicationKey(signal: Signal): string {
    return `${signal.patient_id}_${signal.signal_type}_${signal.source_entity_id || 'no_entity'}`;
  }

  /**
   * Check if a signal should be suppressed due to an existing similar signal
   */
  static shouldSuppressSignal(signal: Signal, existingSignals: Signal[]): boolean {
    // Check for exact duplicate
    const exactDuplicate = existingSignals.find(s => 
      s.patient_id === signal.patient_id &&
      s.signal_type === signal.signal_type &&
      s.source_entity_id === signal.source_entity_id &&
      s.status === 'active'
    );

    if (exactDuplicate) {
      return true;
    }

    // Check for superseding signals (higher severity supersedes lower)
    const severityHierarchy = ['info', 'warning', 'high', 'critical'];
    const existingHigherSeverity = existingSignals.find(s =>
      s.patient_id === signal.patient_id &&
      s.signal_type === signal.signal_type &&
      severityHierarchy.indexOf(s.severity) > severityHierarchy.indexOf(signal.severity) &&
      s.status === 'active'
    );

    if (existingHigherSeverity) {
      return true;
    }

    return false;
  }

  /**
   * Check if case creation should be suppressed to prevent spam
   */
  static shouldSuppressCaseCreation(
    patientId: bigint,
    category: string,
    existingCases: any[]
  ): boolean {
    // Check for recent duplicate case (within last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentDuplicate = existingCases.find(c =>
      c.patient_id === patientId &&
      c.category === category &&
      new Date(c.created_at) > oneHourAgo &&
      c.status !== 'closed' && c.status !== 'resolved'
    );

    if (recentDuplicate) {
      return true;
    }

    // Check for case spam (more than 3 cases in last hour)
    const recentCases = existingCases.filter(c =>
      c.patient_id === patientId &&
      new Date(c.created_at) > oneHourAgo
    );

    if (recentCases.length >= 3) {
      return true;
    }

    return false;
  }
}
