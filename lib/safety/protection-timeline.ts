/**
 * Smart Tourist Protection System - Protection Timeline Model
 * 
 * Unified timeline event types for protection journey records.
 * Combines check-ins, cases, checklist updates, and coordinator events.
 */

// Database types for timeline mapping
interface CheckIn {
  id: string;
  check_in_type: string;
  status: string;
  notes: string | null;
  created_at: string;
}

interface SafetyCase {
  id: string;
  category: string;
  status: string;
  description: string | null;
  created_at: string;
}

interface ChecklistItem {
  item_type: string;
  is_completed: boolean;
  completed_at: string | null;
  id?: string;
  created_at?: string;
}

interface CoordinatorVerification {
  coordinator_id: string;
  full_name: string;
  reference_id: string;
  phone: string;
  is_verified: boolean;
  is_active: boolean;
  assigned_at?: string;
}

// Timeline event types
export type TimelineEventType =
  | 'PROTECTION_INITIATED'
  | 'CHECKLIST_UPDATED'
  | 'CHECK_IN_SUBMITTED'
  | 'ASSISTANCE_REQUESTED'
  | 'CASE_STATUS_CHANGED'
  | 'COORDINATOR_ASSIGNED'
  | 'PROTECTION_READINESS_CHANGED';

// Timeline event metadata
export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  timestamp: string;
  status: 'safe' | 'verified' | 'completed' | 'pending' | 'active' | 'resolved';
  category: 'check_in' | 'case' | 'checklist' | 'coordinator' | 'system';
}

// Map database check-in to timeline event
export function mapCheckInToTimeline(checkIn: CheckIn): TimelineEvent {
  const statusMap: Record<string, 'safe' | 'pending' | 'active'> = {
    safe: 'safe',
    needs_assistance: 'active',
    pending: 'pending',
  };

  const typeLabels: Record<string, string> = {
    arrival_india: 'Arrival in India',
    airport_pickup: 'Airport Pickup',
    accommodation_arrival: 'Accommodation Arrival',
    hospital_arrival: 'Hospital Arrival',
    treatment_milestone: 'Treatment Milestone',
    discharge: 'Discharge',
    return_travel: 'Return Travel',
  };

  const checkInType = checkIn.check_in_type;
  const checkInStatus = checkIn.status;
  const checkInCreatedAt = checkIn.created_at;

  return {
    id: checkIn.id,
    type: 'CHECK_IN_SUBMITTED',
    title: `Check-in: ${typeLabels[checkInType] || checkInType}`,
    description: checkInStatus === 'safe' 
      ? 'Confirmed safe at current location'
      : checkInStatus === 'needs_assistance'
      ? 'Assistance requested'
      : 'Check-in pending',
    timestamp: checkInCreatedAt,
    status: statusMap[checkInStatus] || 'pending',
    category: 'check_in',
  };
}

// Map safety case to timeline event
export function mapCaseToTimeline(caseItem: SafetyCase): TimelineEvent {
  const statusMap: Record<string, 'active' | 'resolved' | 'pending'> = {
    open: 'active',
    acknowledged: 'active',
    in_progress: 'active',
    resolved: 'resolved',
    closed: 'resolved',
  };

  const categoryLabels: Record<string, string> = {
    medical_emergency: 'Medical Emergency',
    lost_unsafe: 'Lost or Unsafe',
    transport_issue: 'Transport Issue',
    hospital_coordination: 'Hospital Coordination',
    accommodation_issue: 'Accommodation Issue',
    suspected_fraud: 'Suspected Fraud',
    other: 'Other',
  };

  const caseCategory = caseItem.category;
  const caseStatus = caseItem.status;
  const caseDescription = caseItem.description || 'Assistance case';
  const caseCreatedAt = caseItem.created_at;

  return {
    id: caseItem.id,
    type: caseStatus === 'open' ? 'ASSISTANCE_REQUESTED' : 'CASE_STATUS_CHANGED',
    title: `${categoryLabels[caseCategory] || caseCategory}: ${caseStatus.replace(/_/g, ' ')}`,
    description: caseDescription,
    timestamp: caseCreatedAt,
    status: statusMap[caseStatus] || 'pending',
    category: 'case',
  };
}

// Map checklist item to timeline event
export function mapChecklistToTimeline(item: ChecklistItem): TimelineEvent {
  const itemLabels: Record<string, string> = {
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

  const itemType = item.item_type;
  const itemIsCompleted = item.is_completed;
  const itemCompletedAt = item.completed_at;
  const itemCreatedAt = item.created_at || new Date().toISOString();
  const itemId = item.id || `${itemType}-${itemCreatedAt}`;

  return {
    id: itemId,
    type: 'CHECKLIST_UPDATED',
    title: `Checklist: ${itemLabels[itemType] || itemType}`,
    description: itemIsCompleted 
      ? 'Completed'
      : 'Pending completion',
    timestamp: itemCompletedAt || itemCreatedAt,
    status: itemIsCompleted ? 'completed' : 'pending',
    category: 'checklist',
  };
}

// Map coordinator assignment to timeline event
export function mapCoordinatorToTimeline(coordinator: CoordinatorVerification): TimelineEvent {
  const coordinatorId = coordinator.coordinator_id;
  const coordinatorFullName = coordinator.full_name;
  const coordinatorReferenceId = coordinator.reference_id;
  const coordinatorAssignedAt = coordinator.assigned_at;

  return {
    id: coordinatorId,
    type: 'COORDINATOR_ASSIGNED',
    title: 'Coordinator Assigned',
    description: `${coordinatorFullName} (Ref: ${coordinatorReferenceId})`,
    timestamp: coordinatorAssignedAt || new Date().toISOString(),
    status: 'verified',
    category: 'coordinator',
  };
}

// Sort timeline events by timestamp (newest first)
export function sortTimelineByTimestamp(events: TimelineEvent[]): TimelineEvent[] {
  return events.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// Get visual styling for timeline status
export function getTimelineStatusColorClasses(status: TimelineEvent['status']) {
  switch (status) {
    case 'safe':
      return {
        bg: 'bg-green-500/20',
        border: 'border-green-500/30',
        text: 'text-green-400',
        icon: 'text-green-400',
        badge: 'bg-green-500/20 text-green-400',
      };
    case 'verified':
      return {
        bg: 'bg-blue-500/20',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        icon: 'text-blue-400',
        badge: 'bg-blue-500/20 text-blue-400',
      };
    case 'completed':
      return {
        bg: 'bg-purple-500/20',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        icon: 'text-purple-400',
        badge: 'bg-purple-500/20 text-purple-400',
      };
    case 'pending':
      return {
        bg: 'bg-yellow-500/20',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
        icon: 'text-yellow-400',
        badge: 'bg-yellow-500/20 text-yellow-400',
      };
    case 'active':
      return {
        bg: 'bg-red-500/20',
        border: 'border-red-500/30',
        text: 'text-red-400',
        icon: 'text-red-400',
        badge: 'bg-red-500/20 text-red-400',
      };
    case 'resolved':
      return {
        bg: 'bg-green-500/20',
        border: 'border-green-500/30',
        text: 'text-green-400',
        icon: 'text-green-400',
        badge: 'bg-green-500/20 text-green-400',
      };
  }
}
