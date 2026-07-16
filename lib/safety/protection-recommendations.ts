/**
 * Smart Tourist Protection System - Next Recommended Action Engine
 * 
 * Deterministic recommendation helper based on actual protection state.
 * This is NOT AI - it's rule-based business logic.
 */

// Recommendation types
export type RecommendationType =
  | 'COMPLETE_CHECKLIST'
  | 'SUBMIT_CHECK_IN'
  | 'REVIEW_COORDINATOR'
  | 'FOLLOW_ASSISTANCE_CASE'
  | 'NO_ACTION_REQUIRED';

// Recommendation metadata
export interface Recommendation {
  type: RecommendationType;
  title: string;
  description: string;
  actionText: string | null;
  actionHref: string | null;
  priority: number; // 1 = lowest, 5 = highest
}

// Input data for recommendation calculation
export interface RecommendationInput {
  protectionStatus: string;
  checklistCompletion: number;
  incompleteChecklistItems: string[];
  hasVerifiedCoordinator: boolean;
  activeCases: number;
  latestCheckIn: {
    status: string | null;
    createdAt: string | null;
  };
  journeyStage: string | null;
}

// Calculate next recommended action
export function calculateRecommendation(input: RecommendationInput): Recommendation {
  const {
    protectionStatus,
    checklistCompletion,
    incompleteChecklistItems,
    hasVerifiedCoordinator,
    activeCases,
    latestCheckIn,
    journeyStage,
  } = input;

  // Priority 1: Active assistance case - follow it
  if (activeCases > 0) {
    return {
      type: 'FOLLOW_ASSISTANCE_CASE',
      title: 'Follow Your Active Assistance Case',
      description: 'You have an active assistance case. Monitor its progress and respond to any requests.',
      actionText: 'View Case',
      actionHref: '/safety?focus=active-cases',
      priority: 5,
    };
  }

  // Priority 2: Setup required - complete checklist
  if (protectionStatus === 'SETUP_REQUIRED' && checklistCompletion < 100) {
    const nextItem = incompleteChecklistItems[0] || 'safety checklist';
    return {
      type: 'COMPLETE_CHECKLIST',
      title: 'Complete Your Safety Checklist',
      description: `Complete your ${nextItem} to activate protection.`,
      actionText: 'Complete Checklist',
      actionHref: '/safety?focus=checklist',
      priority: 4,
    };
  }

  // Priority 3: Preparing - complete remaining checklist items
  if (protectionStatus === 'PREPARING' && incompleteChecklistItems.length > 0) {
    const nextItem = incompleteChecklistItems[0] || 'safety checklist';
    return {
      type: 'COMPLETE_CHECKLIST',
      title: 'Complete Your Safety Checklist',
      description: `Complete your ${nextItem} before travel.`,
      actionText: 'Complete Checklist',
      actionHref: '/safety?focus=checklist',
      priority: 3,
    };
  }

  // Priority 4: No verified coordinator - review coordinator status
  if (!hasVerifiedCoordinator && journeyStage && journeyStage !== 'initial') {
    return {
      type: 'REVIEW_COORDINATOR',
      title: 'Review Coordinator Status',
      description: 'Your coordinator information is not verified. Contact HealWithIndia support.',
      actionText: 'Contact Support',
      actionHref: '/safety?focus=coordinator',
      priority: 3,
    };
  }

  // Priority 5: Check-in needed (if journey is active and no recent check-in)
  if (journeyStage && journeyStage !== 'initial' && journeyStage !== 'visa_processing') {
    const hoursSinceCheckIn = latestCheckIn.createdAt
      ? (Date.now() - new Date(latestCheckIn.createdAt).getTime()) / (1000 * 60 * 60)
      : Infinity;

    // If no check-in in last 24 hours, recommend check-in
    if (hoursSinceCheckIn > 24 || !latestCheckIn.createdAt) {
      return {
        type: 'SUBMIT_CHECK_IN',
        title: 'Submit a Safety Check-In',
        description: 'Submit your current safety status to keep your protection timeline updated.',
        actionText: 'Submit Check-In',
        actionHref: '/safety/check-ins',
        priority: 2,
      };
    }
  }

  // Default: No action required
  return {
    type: 'NO_ACTION_REQUIRED',
    title: 'No Immediate Action Required',
    description: 'Your protection journey is on track. Continue regular check-ins.',
    actionText: null as string | null,
    actionHref: null,
    priority: 1,
  };
}

// Get checklist item labels for recommendations
export function getChecklistItemLabel(itemType: string): string {
  const labels: Record<string, string> = {
    passport_visa: 'Passport/Visa Documents',
    hospital_confirmed: 'Hospital Confirmation',
    coordinator_verified: 'Coordinator Verification',
    pickup_confirmed: 'Pickup Details',
    accommodation_confirmed: 'Accommodation Details',
    emergency_contacts: 'Emergency Contacts',
    treatment_documents: 'Treatment Documents',
    discharge_plan: 'Discharge Plan',
    follow_up_instructions: 'Follow-Up Instructions',
  };
  return labels[itemType] || itemType;
}
