"use client";

import Link from "next/link";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserRoundCheck,
  ArrowRight,
} from "lucide-react";
import {
  ProtectionStatusInfo,
  getStatusColorClasses,
} from "@/lib/safety/protection-status";
import { Recommendation } from "@/lib/safety/protection-recommendations";

interface ProtectionStatusProps {
  status: ProtectionStatusInfo;
  latestCheckIn: {
    status: string | null;
    createdAt: string | null;
  } | null;
  checklistProgress: {
    completed: number;
    total: number;
  };
  coordinatorStatus: {
    verified: boolean;
    name: string | null;
  };
  activeAssistance: {
    hasActive: boolean;
    count: number;
  };
  recommendation: Recommendation;
}

export default function ProtectionStatus({
  status,
  latestCheckIn,
  checklistProgress,
  coordinatorStatus,
  activeAssistance,
  recommendation,
}: ProtectionStatusProps) {
  const colors = getStatusColorClasses(status.color);

  const formatTimeSince = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className={`bg-slate-950 border ${colors.border} rounded-[32px] p-6 lg:p-8`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`h-12 w-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
          <ShieldCheck size={24} className={colors.icon} />
        </div>
        <div>
          <p className={`text-xs font-semibold tracking-wide ${colors.text} mb-1`}>
            SMART TOURIST PROTECTION SYSTEM
          </p>
          <h2 className="text-2xl lg:text-3xl font-bold text-white">
            {status.label}
          </h2>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-lg mb-8 leading-relaxed">
        {status.description}
      </p>

      {/* Status Indicators Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Latest Check-in */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-500 text-xs mb-2">Latest Check-in</p>
          {latestCheckIn?.createdAt ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                {latestCheckIn.status === 'safe' ? (
                  <CheckCircle size={16} className="text-green-400" />
                ) : latestCheckIn.status === 'needs_assistance' ? (
                  <AlertTriangle size={16} className="text-red-400" />
                ) : (
                  <Clock size={16} className="text-yellow-400" />
                )}
                <p className="font-semibold text-white capitalize">
                  {latestCheckIn.status === 'safe' ? 'Safe' : latestCheckIn.status === 'needs_assistance' ? 'Assistance' : 'Pending'}
                </p>
              </div>
              <p className="text-slate-400 text-sm">
                {formatTimeSince(latestCheckIn.createdAt)}
              </p>
            </>
          ) : (
            <p className="text-slate-400 text-sm">No check-ins yet</p>
          )}
        </div>

        {/* Journey Readiness */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-500 text-xs mb-2">Journey Readiness</p>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={16} className={checklistProgress.completed === checklistProgress.total ? "text-green-400" : "text-blue-400"} />
            <p className="font-semibold text-white">
              {checklistProgress.completed} / {checklistProgress.total}
            </p>
          </div>
          <p className="text-slate-400 text-sm">
            {checklistProgress.total > 0
              ? `${Math.round((checklistProgress.completed / checklistProgress.total) * 100)}% complete`
              : '0% complete'}
          </p>
        </div>

        {/* Coordinator */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-500 text-xs mb-2">Coordinator</p>
          <div className="flex items-center gap-2 mb-1">
            {coordinatorStatus.verified ? (
              <UserRoundCheck size={16} className="text-green-400" />
            ) : (
              <Clock size={16} className="text-slate-500" />
            )}
            <p className="font-semibold text-white">
              {coordinatorStatus.verified ? 'Verified' : 'Not Assigned'}
            </p>
          </div>
          {coordinatorStatus.name && (
            <p className="text-slate-400 text-sm truncate">
              {coordinatorStatus.name}
            </p>
          )}
        </div>

        {/* Active Assistance */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-500 text-xs mb-2">Active Assistance</p>
          <div className="flex items-center gap-2 mb-1">
            {activeAssistance.hasActive ? (
              <AlertTriangle size={16} className="text-red-400" />
            ) : (
              <CheckCircle size={16} className="text-green-400" />
            )}
            <p className="font-semibold text-white">
              {activeAssistance.hasActive ? `${activeAssistance.count} Active` : 'None'}
            </p>
          </div>
          <p className="text-slate-400 text-sm">
            {activeAssistance.hasActive ? 'Cases in progress' : 'No active cases'}
          </p>
        </div>
      </div>

      {/* Next Recommended Action */}
      <div className={`bg-slate-900/50 border border-slate-800 rounded-xl p-5`}>
        <div className="flex items-start gap-4">
          <div className={`h-10 w-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0`}>
            {status.urgency === 'critical' || status.urgency === 'high' ? (
              <AlertTriangle size={20} className={colors.icon} />
            ) : (
              <CheckCircle size={20} className={colors.icon} />
            )}
          </div>
          <div className="flex-1">
            <p className="text-slate-500 text-xs font-semibold mb-1">NEXT RECOMMENDED ACTION</p>
            <p className="text-white font-semibold mb-2">{recommendation.title}</p>
            <p className="text-slate-400 text-sm mb-4">{recommendation.description}</p>
            {recommendation.actionText && recommendation.actionHref && (
              <Link
                href={recommendation.actionHref}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${colors.bg} ${colors.text} ${colors.border} font-semibold text-sm hover:opacity-80 transition-opacity`}
              >
                {recommendation.actionText}
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
