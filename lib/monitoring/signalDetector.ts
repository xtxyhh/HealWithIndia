// Signal Detection Logic
// Detects monitoring signals from journey data, check-ins, incidents, and coordinator activity

import { CHECK_IN_THRESHOLDS, ASSISTANCE_REQUEST_THRESHOLD } from './riskEngine';

export interface Signal {
  patient_id: bigint;
  signal_type: string;
  severity: 'info' | 'warning' | 'high' | 'critical';
  source: 'check_in' | 'case' | 'fraud_report' | 'coordinator' | 'monitoring_engine';
  source_entity_id?: string;
  source_entity_type?: string;
  metadata?: Record<string, any>;
  status?: 'active' | 'resolved' | 'superseded';
}

export class SignalDetector {
  /**
   * Detect signals from check-in data
   */
  static detectCheckInSignals(
    patientId: bigint,
    checkInType: string,
    status: string,
    lastCheckInTime?: Date
  ): Signal[] {
    const signals: Signal[] = [];

    // Check-in overdue signal
    if (lastCheckInTime) {
      const threshold = CHECK_IN_THRESHOLDS[checkInType as keyof typeof CHECK_IN_THRESHOLDS];
      if (threshold) {
        const overdueHours = (Date.now() - lastCheckInTime.getTime()) / (1000 * 60 * 60);
        if (overdueHours > threshold.overdue_hours) {
          signals.push({
            patient_id: patientId,
            signal_type: 'check_in_overdue',
            severity: 'warning',
            source: 'check_in',
            metadata: {
              check_in_type: checkInType,
              overdue_hours: Math.round(overdueHours * 10) / 10
            }
          });
        }
      }
    }

    // Assistance requested signal
    if (status === 'needs_assistance') {
      signals.push({
        patient_id: patientId,
        signal_type: 'assistance_requested',
        severity: 'high',
        source: 'check_in',
        metadata: {
          check_in_type: checkInType
        }
      });
    }

    return signals;
  }

  /**
   * Detect signals from safety case data
   */
  static detectCaseSignals(
    patientId: bigint,
    category: string,
    priority: string,
    status: string,
    createdAt: Date
  ): Signal[] {
    const signals: Signal[] = [];

    // Critical incident signal
    if (category === 'medical_emergency' || category === 'lost_unsafe') {
      signals.push({
        patient_id: patientId,
        signal_type: 'critical_incident_reported',
        severity: 'critical',
        source: 'case',
        source_entity_id: undefined, // Will be set by caller
        source_entity_type: 'safety_case',
        metadata: {
          category,
          priority
        }
      });
    }

    // Case unacknowledged signal (for critical/high priority cases)
    if ((priority === 'critical' || priority === 'high') && status === 'open') {
      const hoursSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
      const responseTarget = priority === 'critical' ? 0.083 : 0.25; // 5 min for critical, 15 min for high
      
      if (hoursSinceCreation > responseTarget) {
        signals.push({
          patient_id: patientId,
          signal_type: 'critical_case_response_delay',
          severity: 'critical',
          source: 'case',
          source_entity_id: undefined,
          source_entity_type: 'safety_case',
          metadata: {
            priority,
            hours_since_creation: Math.round(hoursSinceCreation * 10) / 10
          }
        });
      }
    }

    return signals;
  }

  /**
   * Detect signals from fraud report data
   */
  static detectFraudSignals(
    patientId: bigint,
    reportType: string,
    status: string
  ): Signal[] {
    const signals: Signal[] = [];

    if (status !== 'resolved' && status !== 'false_positive') {
      signals.push({
        patient_id: patientId,
        signal_type: 'suspicious_contact_reported',
        severity: 'high',
        source: 'fraud_report',
        metadata: {
          report_type: reportType,
          status
        }
      });
    }

    return signals;
  }

  /**
   * Detect signals from coordinator assignment data
   */
  static detectCoordinatorSignals(
    patientId: bigint,
    hasActiveAssignment: boolean,
    coordinatorVerified: boolean
  ): Signal[] {
    const signals: Signal[] = [];

    if (!hasActiveAssignment) {
      signals.push({
        patient_id: patientId,
        signal_type: 'coordinator_unassigned',
        severity: 'warning',
        source: 'coordinator',
        metadata: {
          has_active_assignment: false
        }
      });
    }

    if (hasActiveAssignment && !coordinatorVerified) {
      signals.push({
        patient_id: patientId,
        signal_type: 'coordinator_verification_concern',
        severity: 'warning',
        source: 'coordinator',
        metadata: {
          coordinator_verified: false
        }
      });
    }

    return signals;
  }

  /**
   * Detect correlated signals (multiple risk factors)
   */
  static detectCorrelatedSignals(
    patientId: bigint,
    existingSignals: Signal[]
  ): Signal[] {
    const signals: Signal[] = [];

    const signalTypes = existingSignals.map(s => s.signal_type);
    
    // Check for repeated assistance requests
    const assistanceSignals = existingSignals.filter(s => s.signal_type === 'assistance_requested');
    if (assistanceSignals.length >= ASSISTANCE_REQUEST_THRESHOLD.count) {
      // Check if within time window
      const oldestAssistance = assistanceSignals[0];
      const newestAssistance = assistanceSignals[assistanceSignals.length - 1];
      const timeDiff = (newestAssistance.metadata?.detected_at || Date.now()) - (oldestAssistance.metadata?.detected_at || Date.now());
      const windowMs = ASSISTANCE_REQUEST_THRESHOLD.window_minutes * 60 * 1000;
      
      if (timeDiff < windowMs) {
        signals.push({
          patient_id: patientId,
          signal_type: 'repeated_assistance_requests',
          severity: 'high',
          source: 'monitoring_engine',
          metadata: {
            count: assistanceSignals.length,
            window_minutes: ASSISTANCE_REQUEST_THRESHOLD.window_minutes
          }
        });
      }
    }

    // Check for correlated risk signals
    const highRiskSignals = signalTypes.filter(t => 
      ['check_in_overdue', 'assistance_requested', 'coordinator_unassigned'].includes(t)
    );
    if (highRiskSignals.length >= 2) {
      signals.push({
        patient_id: patientId,
        signal_type: 'correlated_risk_signals',
        severity: 'high',
        source: 'monitoring_engine',
        metadata: {
          signal_types: highRiskSignals
        }
      });
    }

    return signals;
  }
}
