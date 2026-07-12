// Risk Assessment Logic
// Evaluates patient risk level based on detected signals and explainable rules

import { RISK_RULES, type RiskRule } from './riskEngine';
import { Signal } from './signalDetector';

export interface RiskAssessment {
  patient_id: bigint;
  risk_level: 'normal' | 'watch' | 'elevated' | 'high' | 'critical';
  contributing_signal_ids: string[];
  rule_ids: string[];
  explanation: string;
  evaluated_at: Date;
}

export class RiskAssessor {
  /**
   * Evaluate risk level for a patient based on active signals
   */
  static evaluateRisk(
    patientId: bigint,
    activeSignals: Signal[]
  ): RiskAssessment {
    const signalTypes = activeSignals.map(s => s.signal_type);
    const triggeredRules: RiskRule[] = [];
    const contributingSignalIds: string[] = activeSignals.map(s => s.source_entity_id || '').filter(Boolean);

    // Evaluate each rule
    for (const rule of RISK_RULES) {
      if (this.ruleMatches(rule, signalTypes)) {
        triggeredRules.push(rule);
      }
    }

    // Determine highest risk level from triggered rules
    const riskLevel = this.getHighestRiskLevel(triggeredRules);

    // Generate explanation
    const explanation = this.generateExplanation(triggeredRules, riskLevel);

    return {
      patient_id: patientId,
      risk_level: riskLevel,
      contributing_signal_ids: contributingSignalIds,
      rule_ids: triggeredRules.map(r => r.id),
      explanation,
      evaluated_at: new Date()
    };
  }

  /**
   * Check if a rule matches the current signal types
   */
  private static ruleMatches(rule: RiskRule, signalTypes: string[]): boolean {
    if (rule.requiredSignals.length === 0) {
      // Normal journey rule - no signals required
      return signalTypes.length === 0;
    }

    // Check if all required signals are present
    return rule.requiredSignals.every(signal => signalTypes.includes(signal));
  }

  /**
   * Get highest risk level from triggered rules
   */
  private static getHighestRiskLevel(rules: RiskRule[]): 'normal' | 'watch' | 'elevated' | 'high' | 'critical' {
    const riskHierarchy = ['normal', 'watch', 'elevated', 'high', 'critical'];
    
    if (rules.length === 0) {
      return 'normal';
    }

    let highestIndex = 0;
    for (const rule of rules) {
      const index = riskHierarchy.indexOf(rule.riskLevel);
      if (index > highestIndex) {
        highestIndex = index;
      }
    }

    return riskHierarchy[highestIndex] as 'normal' | 'watch' | 'elevated' | 'high' | 'critical';
  }

  /**
   * Generate human-readable explanation
   */
  private static generateExplanation(triggeredRules: RiskRule[], riskLevel: string): string {
    if (triggeredRules.length === 0) {
      return 'Your journey is on track with regular check-ins.';
    }

    // Use explanation from highest priority rule
    const highestRule = triggeredRules.reduce((prev, current) => {
      const hierarchy = ['normal', 'watch', 'elevated', 'high', 'critical'];
      return hierarchy.indexOf(current.riskLevel) > hierarchy.indexOf(prev.riskLevel) ? current : prev;
    });

    return highestRule.explanation;
  }

  /**
   * Get patient-safe status message for display
   */
  static getPatientSafeStatus(riskLevel: string, activeSignals: Signal[]): string {
    const signalTypes = activeSignals.map(s => s.signal_type);

    switch (riskLevel) {
      case 'normal':
        return 'Journey on track';
      case 'watch':
        if (signalTypes.includes('expected_milestone_missed')) {
          return 'Check-in due soon';
        }
        return 'Journey on track';
      case 'elevated':
        if (signalTypes.includes('check_in_overdue')) {
          return 'Check-in overdue';
        }
        if (signalTypes.includes('assistance_requested')) {
          return 'Assistance request received';
        }
        return 'Review recommended';
      case 'high':
        if (signalTypes.includes('repeated_assistance_requests')) {
          return 'Safety team reviewing your concern';
        }
        if (signalTypes.includes('hospital_arrival_missed') || signalTypes.includes('accommodation_arrival_missed')) {
          return 'Milestone confirmation needed';
        }
        if (signalTypes.includes('suspicious_contact_reported')) {
          return 'Coordinator follow-up in progress';
        }
        return 'Safety team reviewing';
      case 'critical':
        if (signalTypes.includes('critical_incident_reported')) {
          return 'Critical case - team responding';
        }
        if (signalTypes.includes('critical_case_response_delay')) {
          return 'Emergency response in progress';
        }
        return 'Critical - immediate attention';
      default:
        return 'Journey on track';
    }
  }

  /**
   * Get recommended actions for patient
   */
  static getRecommendedActions(riskLevel: string, activeSignals: Signal[]): string[] {
    const signalTypes = activeSignals.map(s => s.signal_type);
    const actions: string[] = [];

    switch (riskLevel) {
      case 'watch':
        if (signalTypes.includes('expected_milestone_missed')) {
          actions.push('Confirm your hospital arrival');
          actions.push('Verify your assigned coordinator');
        }
        break;
      case 'elevated':
        if (signalTypes.includes('check_in_overdue')) {
          actions.push('Complete your overdue check-in');
        }
        if (signalTypes.includes('assistance_requested')) {
          actions.push('Your case has been recorded');
          actions.push('Safety team will contact you if needed');
        }
        break;
      case 'high':
        if (signalTypes.includes('hospital_arrival_missed') || signalTypes.includes('accommodation_arrival_missed')) {
          actions.push('Confirm your arrival status');
          actions.push('Contact your coordinator');
        }
        if (signalTypes.includes('suspicious_contact_reported')) {
          actions.push('Verify coordinator before sharing payment details');
          actions.push('Do not share sensitive information');
        }
        if (signalTypes.includes('repeated_assistance_requests')) {
          actions.push('Safety team is actively reviewing your case');
        }
        break;
      case 'critical':
        actions.push('Emergency response in progress');
        actions.push('Stay available for contact');
        if (signalTypes.includes('critical_incident_reported')) {
          actions.push('If immediate danger, call local emergency services');
        }
        break;
    }

    return actions;
  }
}
