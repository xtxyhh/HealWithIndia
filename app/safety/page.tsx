"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ProtectionStatus from "@/components/ProtectionStatus";
import AccountMenu from "@/components/AccountMenu";
import {
  ShieldCheck,
  UserRoundCheck,
  MapPin,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Phone,
  Clock,
  FileText,
  ArrowRight,
  ShieldAlert,
  Activity,
} from "lucide-react";
import {
  mapCheckInToTimeline,
  mapCaseToTimeline,
  mapChecklistToTimeline,
  mapCoordinatorToTimeline,
  sortTimelineByTimestamp,
  getTimelineStatusColorClasses,
} from "@/lib/safety/protection-timeline";

interface SafetyProfile {
  journey_stage: string;
  coordinator_assignment_id: string | null;
  treatment_destination: string | null;
  hospital_name: string | null;
  estimated_arrival_date: string | null;
}

interface CoordinatorVerification {
  coordinator_id: string;
  reference_id: string;
  full_name: string;
  phone: string;
  is_verified: boolean;
  is_active: boolean;
}

interface CheckIn {
  id: string;
  check_in_type: string;
  status: string;
  notes: string | null;
  created_at: string;
}

interface ChecklistItem {
  item_type: string;
  is_completed: boolean;
  completed_at: string | null;
}

interface RiskData {
  risk_level: string;
  patient_safe_status: string;
  explanation: string;
  recommended_actions: string[];
  evaluated_at: string;
}

interface ProtectionStatusData {
  protectionStatus: any;
  latestCheckIn: any;
  checklistProgress: any;
  coordinatorStatus: any;
  activeAssistance: any;
  recommendation: any;
}

export default function SafetyHubPage() {
  const [loading, setLoading] = useState(true);
  const [safetyProfile, setSafetyProfile] = useState<SafetyProfile | null>(null);
  const [coordinatorVerification, setCoordinatorVerification] = useState<CoordinatorVerification | null>(null);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [protectionStatusData, setProtectionStatusData] = useState<ProtectionStatusData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSafetyData();
  }, []);

  const loadSafetyData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Please log in to access your safety hub");
        setLoading(false);
        return;
      }

      // Load safety profile via API (no patient_id needed - resolved from auth)
      const profileResponse = await fetch(`/api/safety/profile`);
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setSafetyProfile(profileData.data);
        
        // If protection is not activated, don't load checklist data
        if (profileData.protection_status === 'NOT_ACTIVATED') {
          setChecklist([]);
        }
      } else {
        const errorData = await profileResponse.json();
        if (errorData.protection_status === 'NOT_ACTIVATED') {
          setSafetyProfile(null);
          setChecklist([]);
        }
      }

      // Load coordinator verification via API (no patient_id needed - resolved from auth)
      const coordinatorResponse = await fetch(`/api/safety/coordinator`);
      if (coordinatorResponse.ok) {
        const { data: coordinatorData } = await coordinatorResponse.json();
        setCoordinatorVerification(coordinatorData);
      }

      // Load check-ins via API (no patient_id needed - resolved from auth)
      const checkInsResponse = await fetch(`/api/safety/check-ins`);
      if (checkInsResponse.ok) {
        const { data: checkInsData } = await checkInsResponse.json();
        setCheckIns(checkInsData || []);
      }

      // Load checklist via API (no patient_id needed - resolved from auth)
      // Only load if protection is activated
      if (safetyProfile) {
        const checklistResponse = await fetch(`/api/safety/checklist`);
        if (checklistResponse.ok) {
          const { data: checklistData } = await checklistResponse.json();
          setChecklist(checklistData || []);
        }
      }

      // Load risk assessment via API (no patient_id needed - resolved from auth)
      const riskResponse = await fetch(`/api/safety/risk`);
      if (riskResponse.ok) {
        const riskData = await riskResponse.json();
        setRiskData(riskData);
      }

      // Load unified protection status via API
      const protectionStatusResponse = await fetch(`/api/safety/protection-status`);
      if (protectionStatusResponse.ok) {
        const protectionData = await protectionStatusResponse.json();
        setProtectionStatusData(protectionData);
      }

    } catch (err: any) {
      console.error("Error loading safety data:", err);
      setError("Unable to load safety information. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  const getStageLabel = (stage: string) => {
    const labels: Record<string, string> = {
      initial: "Initial Consultation",
      visa_processing: "Visa Processing",
      travel_confirmed: "Travel Confirmed",
      arrived: "Arrived in India",
      treatment_in_progress: "Treatment In Progress",
      discharged: "Discharged",
      follow_up: "Follow-Up Care",
      completed: "Journey Completed",
    };
    return labels[stage] || stage;
  };

  const getCheckInLabel = (type: string) => {
    const labels: Record<string, string> = {
      arrival_india: "Arrival in India",
      airport_pickup: "Airport Pickup",
      accommodation_arrival: "Accommodation Arrival",
      hospital_arrival: "Hospital Arrival",
      treatment_milestone: "Treatment Milestone",
      discharge: "Discharge",
      return_travel: "Return Travel",
    };
    return labels[type] || type;
  };

  const getChecklistLabel = (item: string) => {
    const labels: Record<string, string> = {
      passport_visa: "Passport/Visa Documents Ready",
      hospital_confirmed: "Hospital Details Confirmed",
      coordinator_verified: "Coordinator Identity Checked",
      pickup_confirmed: "Pickup Details Confirmed",
      accommodation_confirmed: "Accommodation Details Confirmed",
      emergency_contacts: "Emergency Contacts Saved",
      treatment_documents: "Treatment Documents Available",
      discharge_plan: "Discharge Plan Received",
      follow_up_instructions: "Follow-Up Instructions Received",
    };
    return labels[item] || item;
  };

  const toggleChecklistItem = async (itemType: string, isCompleted: boolean) => {
    try {
      setError(null);
      const response = await fetch("/api/safety/checklist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_type: itemType,
          is_completed: isCompleted,
        }),
      });

      if (response.ok) {
        // Reload checklist to refresh state
        await loadSafetyData();
      } else {
        const errorData = await response.json();
        setError(`Failed to update checklist: ${errorData.error || 'Please try again'}`);
        // Revert UI state by reloading data
        await loadSafetyData();
      }
    } catch (err) {
      console.error("Error updating checklist:", err);
      setError("Unable to update checklist. Please check your connection and try again.");
      // Revert UI state by reloading data
      await loadSafetyData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading safety information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertTriangle size={48} className="text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Unable to Load Safety Hub</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
          >
            Return to Home
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-slate-950 to-cyan-950 py-16">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[150px] rounded-full" />
        
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ShieldCheck size={32} className="text-green-400" />
              <span className="text-green-400 font-semibold tracking-wide">SMART TOURIST PROTECTION SYSTEM — PATIENT SAFETY HUB</span>
            </div>
            <AccountMenu />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Your Safety Dashboard
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Monitor your protection journey, verify your coordinator, access safety resources, and stay connected throughout your medical travel in India.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        {/* Protection Not Activated Message */}
        {!safetyProfile && (
          <div className="rounded-[32px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl p-8">
            <div className="flex items-center gap-4 mb-4">
              <ShieldCheck size={32} className="text-slate-500" />
              <h2 className="text-2xl font-bold text-white">Smart Tourist Protection Not Activated</h2>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed">
              Smart Tourist Protection has not been activated for your journey yet. Please contact your HealWithIndia coordinator to activate protection access.
            </p>
          </div>
        )}

        {/* Unified Protection Status - Top Priority */}
        {protectionStatusData && safetyProfile && (
          <ProtectionStatus
            status={protectionStatusData.protectionStatus}
            latestCheckIn={protectionStatusData.latestCheckIn}
            checklistProgress={protectionStatusData.checklistProgress}
            coordinatorStatus={protectionStatusData.coordinatorStatus}
            activeAssistance={protectionStatusData.activeAssistance}
            recommendation={protectionStatusData.recommendation}
          />
        )}

        {/* Urgent Assistance - High Visibility */}
        <div className={`rounded-[32px] p-6 lg:p-8 border ${
          protectionStatusData?.protectionStatus?.urgency === 'critical' || protectionStatusData?.protectionStatus?.urgency === 'high'
            ? 'bg-red-950/20 border-red-800'
            : 'bg-gradient-to-r from-red-950 to-orange-950 border-orange-800'
        }`}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`h-16 w-16 rounded-2xl ${
                protectionStatusData?.protectionStatus?.urgency === 'critical' || protectionStatusData?.protectionStatus?.urgency === 'high'
                  ? 'bg-red-500/20 border-red-500/30'
                  : 'bg-orange-500/20 border-orange-500/30'
              } flex items-center justify-center`}>
                <AlertTriangle size={32} className={
                  protectionStatusData?.protectionStatus?.urgency === 'critical' || protectionStatusData?.protectionStatus?.urgency === 'high'
                    ? 'text-red-400'
                    : 'text-orange-400'
                } />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Urgent Assistance</h3>
                <p className="text-slate-400">
                  {protectionStatusData?.activeAssistance?.hasActive
                    ? `You have ${protectionStatusData.activeAssistance.count} active assistance case(s).`
                    : 'Request immediate help if you need urgent support.'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="tel:+919116734675"
                className="inline-flex items-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-700 rounded-2xl font-semibold transition"
              >
                <Phone size={24} />
                Call Emergency
              </a>
              <a
                href="/safety/urgent-help"
                className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition ${
                  protectionStatusData?.protectionStatus?.urgency === 'critical' || protectionStatusData?.protectionStatus?.urgency === 'high'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                <AlertTriangle size={24} />
                {protectionStatusData?.activeAssistance?.hasActive ? 'View Cases' : 'Request Help'}
              </a>
            </div>
          </div>
        </div>

        {/* Journey Stage Card */}
        {safetyProfile ? (
          <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin size={24} className="text-blue-400" />
              <h2 className="text-2xl font-bold">Current Journey Stage</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <p className="text-slate-400 text-sm mb-2">Status</p>
                <p className="text-xl font-semibold text-blue-400">
                  {getStageLabel(safetyProfile.journey_stage)}
                </p>
              </div>
              
              {safetyProfile.treatment_destination && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <p className="text-slate-400 text-sm mb-2">Destination</p>
                  <p className="text-xl font-semibold">{safetyProfile.treatment_destination}</p>
                </div>
              )}
              
              {safetyProfile.hospital_name && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <p className="text-slate-400 text-sm mb-2">Hospital</p>
                  <p className="text-xl font-semibold">{safetyProfile.hospital_name}</p>
                </div>
              )}
              
              {safetyProfile.estimated_arrival_date && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <p className="text-slate-400 text-sm mb-2">Estimated Arrival</p>
                  <p className="text-xl font-semibold flex items-center gap-2">
                    <Calendar size={20} className="text-cyan-400" />
                    {new Date(safetyProfile.estimated_arrival_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8 text-center">
            <AlertTriangle size={48} className="text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Active Journey Found</h3>
            <p className="text-slate-400">
              Your safety profile has not been set up yet. Please contact your coordinator.
            </p>
          </div>
        )}

        {/* Protection Timeline - Unified View */}
        <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8">
          <div className="flex items-center gap-3 mb-6">
            <Activity size={24} className="text-purple-400" />
            <h2 className="text-2xl font-bold">Protection Timeline</h2>
          </div>
          
          <div className="space-y-4">
            {[
              ...(checkIns?.map(mapCheckInToTimeline) || []),
              ...(checklist?.map(mapChecklistToTimeline) || []),
              ...(coordinatorVerification ? [mapCoordinatorToTimeline(coordinatorVerification)] : []),
            ].length > 0 ? (
              sortTimelineByTimestamp([
                ...(checkIns?.map(mapCheckInToTimeline) || []),
                ...(checklist?.map(mapChecklistToTimeline) || []),
                ...(coordinatorVerification ? [mapCoordinatorToTimeline(coordinatorVerification)] : []),
              ]).slice(0, 10).map((event) => {
                const colors = getTimelineStatusColorClasses(event.status);
                return (
                  <div
                    key={event.id}
                    className={`flex items-center gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors`}
                  >
                    <div className={`p-2 rounded-lg ${colors.bg} ${colors.border}`}>
                      {event.status === 'safe' ? (
                        <CheckCircle size={18} className={colors.icon} />
                      ) : event.status === 'verified' ? (
                        <UserRoundCheck size={18} className={colors.icon} />
                      ) : event.status === 'completed' ? (
                        <CheckCircle size={18} className={colors.icon} />
                      ) : event.status === 'active' ? (
                        <AlertTriangle size={18} className={colors.icon} />
                      ) : (
                        <Clock size={18} className={colors.icon} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{event.title}</p>
                      <p className="text-slate-400 text-sm">{event.description}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-medium px-2 py-1 rounded-full ${colors.badge}`}>
                        {event.status}
                      </p>
                      <p className="text-slate-500 text-xs mt-1">
                        {new Date(event.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-400">
                No protection events recorded yet
              </div>
            )}
          </div>
        </div>

        {/* Coordinator Information */}
        {coordinatorVerification && coordinatorVerification.is_verified ? (
          <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8">
            <div className="flex items-center gap-3 mb-6">
              <UserRoundCheck size={24} className="text-green-400" />
              <h2 className="text-2xl font-bold">Your Care Coordinator</h2>
              {coordinatorVerification.is_verified && (
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <CheckCircle size={14} />
                  Verified
                </span>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <p className="text-slate-400 text-sm mb-2">Coordinator Name</p>
                <p className="text-xl font-semibold">{coordinatorVerification.full_name}</p>
              </div>
              
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <p className="text-slate-400 text-sm mb-2">Official Reference ID</p>
                <p className="text-xl font-semibold text-blue-400">{coordinatorVerification.reference_id}</p>
              </div>
              
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <p className="text-slate-400 text-sm mb-2">Contact Number</p>
                <p className="text-xl font-semibold flex items-center gap-2">
                  <Phone size={20} className="text-green-400" />
                  {coordinatorVerification.phone}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8 text-center">
            <UserRoundCheck size={48} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Coordinator Not Assigned</h3>
            <p className="text-slate-400">
              Your verified coordinator information will appear here once assigned by HealWithIndia.
            </p>
          </div>
        )}

        {/* Fraud Protection */}
        <div className="bg-gradient-to-r from-pink-950 to-red-950 border border-pink-800 rounded-[32px] p-8">
          <div className="flex items-center gap-3 mb-6">
            <ShieldAlert size={24} className="text-pink-400" />
            <h2 className="text-2xl font-bold">Fraud Protection</h2>
          </div>
          
          <div className="mb-6">
            <p className="text-slate-300 mb-4">
              HealWithIndia will never ask for payments outside official channels. Verify all coordinator contacts using the official reference ID above.
            </p>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-1" />
                <span>Only trust contacts with verified reference IDs from this safety hub</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-1" />
                <span>Report suspicious payment requests or unknown contacts immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-1" />
                <span>Never share personal or financial information with unverified sources</span>
              </li>
            </ul>
          </div>
          
          <a
            href="/safety/urgent-help"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition"
          >
            <ShieldAlert size={20} />
            Report Suspicious Activity
          </a>
        </div>

        {/* Safety Checklist */}
        <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText size={24} className="text-purple-400" />
            <h2 className="text-2xl font-bold">Journey Safety Checklist</h2>
          </div>
          
          {checklist.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {checklist.map((item) => (
                <button
                  key={item.item_type}
                  onClick={() => toggleChecklistItem(item.item_type, !item.is_completed)}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    item.is_completed
                      ? "bg-green-500/10 border-green-500/30 hover:bg-green-500/20"
                      : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {item.is_completed ? (
                    <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                  ) : (
                    <Clock size={20} className="text-slate-500 flex-shrink-0" />
                  )}
                  <span className="text-sm text-left">{getChecklistLabel(item.item_type)}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              No checklist items available yet
            </div>
          )}
        </div>

        {/* Recent Check-ins */}
        <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ShieldCheck size={24} className="text-cyan-400" />
              <h2 className="text-2xl font-bold">Recent Safety Check-ins</h2>
            </div>
            <a
              href="/safety/check-ins"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition text-sm"
            >
              New Check-in
              <ArrowRight size={16} />
            </a>
          </div>
          
          {checkIns.length > 0 ? (
            <div className="space-y-4">
              {checkIns.slice(0, 5).map((checkIn) => (
                <div
                  key={checkIn.id}
                  className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      checkIn.status === 'safe' ? 'bg-green-500/20' :
                      checkIn.status === 'needs_assistance' ? 'bg-red-500/20' :
                      'bg-yellow-500/20'
                    }`}>
                      {checkIn.status === 'safe' ? (
                        <CheckCircle size={20} className="text-green-400" />
                      ) : checkIn.status === 'needs_assistance' ? (
                        <AlertTriangle size={20} className="text-red-400" />
                      ) : (
                        <Clock size={20} className="text-yellow-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{getCheckInLabel(checkIn.check_in_type)}</p>
                      <p className="text-slate-400 text-sm">
                        {new Date(checkIn.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    checkIn.status === 'safe' ? 'bg-green-500/20 text-green-400' :
                    checkIn.status === 'needs_assistance' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {checkIn.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              No check-ins recorded yet
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
