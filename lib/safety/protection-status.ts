/**
 * Smart Tourist Protection System - Protection Status Model
 * 
 * Server-derived unified protection status based on real system data.
 * This is NOT AI - it's deterministic business logic based on database state.
 */

// Protection status states - derived from actual system data
export type ProtectionStatus = 
  | 'SETUP_REQUIRED'
  | 'PREPARING'
  | 'PROTECTION_READY'
  | 'ATTENTION_NEEDED'
  | 'ASSISTANCE_ACTIVE';

// Protection status metadata
export interface ProtectionStatusInfo {
  status: ProtectionStatus;
  label: string;
  description: string;
  color: 'green' | 'blue' | 'yellow' | 'orange' | 'red';
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

// Input data for status calculation
export interface ProtectionStatusInput {
  hasSafetyProfile: boolean;
  journeyStage: string | null;
  checklistCompletion: number; // 0-100
  hasVerifiedCoordinator: boolean;
  activeCases: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  latestCheckIn: {
    status: string | null;
    type: string | null;
    createdAt: string | null;
  };
  riskLevel: 'normal' | 'watch' | 'elevated' | 'high' | 'critical' | null;
}

// Status calculation rules
export function calculateProtectionStatus(input: ProtectionStatusInput): ProtectionStatusInfo {
  const {
    hasSafetyProfile,
    journeyStage,
    checklistCompletion,
    hasVerifiedCoordinator,
    activeCases,
    latestCheckIn,
    riskLevel,
  } = input;

  // Priority 1: Active critical assistance
  if (activeCases.critical > 0) {
    return {
      status: 'ASSISTANCE_ACTIVE',
      label: 'Assistance Active',
      description: 'Critical assistance case in progress. Safety operations team is responding.',
      color: 'red',
      urgency: 'critical',
    };
  }

  // Priority 2: High priority assistance
  if (activeCases.high > 0) {
    return {
      status: 'ATTENTION_NEEDED',
      label: 'Attention Needed',
      description: 'High-priority assistance case requires your attention.',
      color: 'orange',
      urgency: 'high',
    };
  }

  // Priority 3: Latest check-in indicates assistance needed
  if (latestCheckIn.status === 'needs_assistance') {
    return {
      status: 'ATTENTION_NEEDED',
      label: 'Attention Needed',
      description: 'Your latest check-in indicates you need assistance.',
      color: 'orange',
      urgency: 'high',
    };
  }

  // Priority 4: Critical or high risk level
  if (riskLevel === 'critical' || riskLevel === 'high') {
    return {
      status: 'ATTENTION_NEEDED',
      label: 'Attention Needed',
      description: 'Elevated risk level detected. Please review your protection status.',
      color: 'orange',
      urgency: 'high',
    };
  }

  // Priority 5: Setup required - no profile or low checklist completion
  if (!hasSafetyProfile || checklistCompletion < 50) {
    return {
      status: 'SETUP_REQUIRED',
      label: 'Setup Required',
      description: 'Complete your safety profile and checklist to activate protection.',
      color: 'blue',
      urgency: 'low',
    };
  }

  // Priority 6: Preparing - checklist incomplete but journey not active
  if (checklistCompletion < 90 && (!journeyStage || journeyStage === 'initial' || journeyStage === 'visa_processing')) {
    return {
      status: 'PREPARING',
      label: 'Preparing',
      description: 'Complete your safety checklist before travel to ensure full protection.',
      color: 'blue',
      urgency: 'medium',
    };
  }

  // Priority 7: Protection ready - all conditions met
  if (checklistCompletion >= 90 && hasVerifiedCoordinator && activeCases.critical === 0 && activeCases.high === 0) {
    return {
      status: 'PROTECTION_READY',
      label: 'Protection Ready',
      description: 'Your protection journey is active. All systems operational.',
      color: 'green',
      urgency: 'low',
    };
  }

  // Default: Attention needed for medium/low cases or other conditions
  if (activeCases.medium > 0 || activeCases.low > 0) {
    return {
      status: 'ATTENTION_NEEDED',
      label: 'Attention Needed',
      description: 'You have active assistance cases requiring attention.',
      color: 'yellow',
      urgency: 'medium',
    };
  }

  // Fallback to protection ready if journey is active
  if (journeyStage && journeyStage !== 'initial' && journeyStage !== 'visa_processing') {
    return {
      status: 'PROTECTION_READY',
      label: 'Protection Ready',
      description: 'Your protection journey is active. All systems operational.',
      color: 'green',
      urgency: 'low',
    };
  }

  // Default fallback
  return {
    status: 'SETUP_REQUIRED',
    label: 'Setup Required',
    description: 'Complete your safety profile and checklist to activate protection.',
    color: 'blue',
    urgency: 'low',
  };
}

// Get visual styling for status
export function getStatusColorClasses(color: ProtectionStatusInfo['color']) {
  switch (color) {
    case 'green':
      return {
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        text: 'text-green-400',
        icon: 'text-green-400',
      };
    case 'blue':
      return {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        icon: 'text-blue-400',
      };
    case 'yellow':
      return {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
        icon: 'text-yellow-400',
      };
    case 'orange':
      return {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
        icon: 'text-orange-400',
      };
    case 'red':
      return {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        icon: 'text-red-400',
      };
  }
}
