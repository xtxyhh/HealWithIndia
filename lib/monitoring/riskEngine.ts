// Risk Engine Configuration
// Centralized rule definitions for explainable risk assessment

export interface RiskRule {
  id: string;
  name: string;
  description: string;
  requiredSignals: string[];
  riskLevel: 'normal' | 'watch' | 'elevated' | 'high' | 'critical';
  explanation: string;
}

export const RISK_RULES: RiskRule[] = [
  {
    id: 'rule_normal_journey',
    name: 'Normal Journey Progress',
    description: 'Journey progressing with expected check-ins',
    requiredSignals: [],
    riskLevel: 'normal',
    explanation: 'Your journey is on track with regular check-ins.'
  },
  {
    id: 'rule_upcoming_milestone',
    name: 'Upcoming Milestone',
    description: 'Upcoming milestone has no confirmation',
    requiredSignals: ['expected_milestone_missed'],
    riskLevel: 'watch',
    explanation: 'An upcoming journey milestone requires confirmation.'
  },
  {
    id: 'rule_check_in_overdue',
    name: 'Check-in Overdue',
    description: 'Check-in significantly overdue',
    requiredSignals: ['check_in_overdue'],
    riskLevel: 'elevated',
    explanation: 'A scheduled check-in is overdue.'
  },
  {
    id: 'rule_assistance_requested',
    name: 'Assistance Requested',
    description: 'Patient requested assistance',
    requiredSignals: ['assistance_requested'],
    riskLevel: 'elevated',
    explanation: 'You have requested assistance. Your case has been recorded.'
  },
  {
    id: 'rule_repeated_assistance',
    name: 'Repeated Assistance Requests',
    description: 'Multiple assistance requests within short timeframe',
    requiredSignals: ['repeated_assistance_requests'],
    riskLevel: 'high',
    explanation: 'Multiple assistance requests have been received.'
  },
  {
    id: 'rule_missed_arrival',
    name: 'Missed Critical Arrival',
    description: 'Missed critical arrival milestone',
    requiredSignals: ['hospital_arrival_missed', 'accommodation_arrival_missed', 'pickup_check_in_missed'],
    riskLevel: 'high',
    explanation: 'A critical arrival milestone was missed.'
  },
  {
    id: 'rule_unresolved_fraud',
    name: 'Unresolved Fraud Concern',
    description: 'Unresolved suspected fraud report',
    requiredSignals: ['suspicious_contact_reported'],
    riskLevel: 'high',
    explanation: 'A fraud concern is under review.'
  },
  {
    id: 'rule_correlated_risks',
    name: 'Correlated Risk Signals',
    description: 'Multiple correlated risk signals detected',
    requiredSignals: ['check_in_overdue', 'assistance_requested', 'coordinator_unassigned'],
    riskLevel: 'high',
    explanation: 'Multiple safety concerns require attention.'
  },
  {
    id: 'rule_critical_incident',
    name: 'Critical Incident',
    description: 'Patient explicitly reports immediate danger',
    requiredSignals: ['critical_incident_reported'],
    riskLevel: 'critical',
    explanation: 'A critical incident has been reported.'
  },
  {
    id: 'rule_response_delay',
    name: 'Critical Response Delay',
    description: 'Critical case unacknowledged beyond threshold',
    requiredSignals: ['critical_case_response_delay'],
    riskLevel: 'critical',
    explanation: 'Critical case requires immediate attention.'
  }
];

export const RESPONSE_TARGETS = {
  critical: {
    acknowledgement_target_minutes: 5,
    first_response_target_minutes: 15
  },
  high: {
    acknowledgement_target_minutes: 15,
    first_response_target_minutes: 30
  },
  medium: {
    acknowledgement_target_minutes: 30,
    first_response_target_minutes: 60
  },
  elevated: {
    acknowledgement_target_minutes: 30,
    first_response_target_minutes: 60
  },
  watch: {
    acknowledgement_target_minutes: 60,
    first_response_target_minutes: 120
  },
  normal: {
    acknowledgement_target_minutes: 120,
    first_response_target_minutes: 240
  }
};

export const CHECK_IN_THRESHOLDS = {
  arrival_india: { overdue_hours: 24 },
  airport_pickup: { overdue_hours: 4 },
  accommodation_arrival: { overdue_hours: 6 },
  hospital_arrival: { overdue_hours: 8 },
  treatment_milestone: { overdue_hours: 48 },
  discharge: { overdue_hours: 24 },
  return_travel: { overdue_hours: 24 }
};

export const ASSISTANCE_REQUEST_THRESHOLD = {
  count: 2,
  window_minutes: 45
};
