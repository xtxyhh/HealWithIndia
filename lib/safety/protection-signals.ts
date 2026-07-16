/**
 * Smart Tourist Protection System - Protection Signal Model
 * 
 * Coherent visual and semantic signal system for protection states.
 * Used across patient hub, operations, and future interfaces.
 */

// Signal categories - mapped to real system states
export type ProtectionSignal = 'NORMAL' | 'ACTION_REQUIRED' | 'ASSISTANCE_REQUESTED' | 'URGENT';

// Signal metadata
export interface ProtectionSignalInfo {
  signal: ProtectionSignal;
  label: string;
  description: string;
  color: 'green' | 'blue' | 'yellow' | 'red';
  priority: number; // 1 = lowest, 4 = highest
}

// Map system states to protection signals
export function mapToProtectionSignal(
  status: string,
  priority: string,
  riskLevel: string | null
): ProtectionSignalInfo {
  // Urgent takes highest priority
  if (status === 'needs_assistance' || priority === 'critical' || riskLevel === 'critical') {
    return {
      signal: 'URGENT',
      label: 'Urgent',
      description: 'Immediate attention required',
      color: 'red',
      priority: 4,
    };
  }

  // High priority or elevated risk
  if (priority === 'high' || riskLevel === 'high' || riskLevel === 'elevated') {
    return {
      signal: 'ASSISTANCE_REQUESTED',
      label: 'Assistance Requested',
      description: 'Assistance case in progress',
      color: 'yellow',
      priority: 3,
    };
  }

  // Action required states
  if (status === 'pending' || priority === 'medium' || riskLevel === 'watch') {
    return {
      signal: 'ACTION_REQUIRED',
      label: 'Action Required',
      description: 'Action needed to maintain protection',
      color: 'blue',
      priority: 2,
    };
  }

  // Normal state
  return {
    signal: 'NORMAL',
    label: 'Normal',
    description: 'Protection systems operational',
    color: 'green',
    priority: 1,
  };
}

// Get visual styling for signal
export function getSignalColorClasses(color: ProtectionSignalInfo['color']) {
  switch (color) {
    case 'green':
      return {
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        text: 'text-green-400',
        icon: 'text-green-400',
        badge: 'bg-green-500/20 text-green-400',
      };
    case 'blue':
      return {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        icon: 'text-blue-400',
        badge: 'bg-blue-500/20 text-blue-400',
      };
    case 'yellow':
      return {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
        icon: 'text-yellow-400',
        badge: 'bg-yellow-500/20 text-yellow-400',
      };
    case 'red':
      return {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        icon: 'text-red-400',
        badge: 'bg-red-500/20 text-red-400',
      };
  }
}

// Sort items by signal priority (highest first)
export function sortBySignalPriority<T extends { signal: ProtectionSignalInfo }>(
  items: T[]
): T[] {
  return items.sort((a, b) => b.signal.priority - a.signal.priority);
}
