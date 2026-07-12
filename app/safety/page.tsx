"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
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
} from "lucide-react";

interface SafetyProfile {
  journey_stage: string;
  coordinator_name: string | null;
  coordinator_reference_id: string | null;
  coordinator_phone: string | null;
  coordinator_verified: boolean;
  treatment_destination: string | null;
  hospital_name: string | null;
  estimated_arrival_date: string | null;
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

export default function SafetyHubPage() {
  const [loading, setLoading] = useState(true);
  const [safetyProfile, setSafetyProfile] = useState<SafetyProfile | null>(null);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
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

      // Load safety profile
      const { data: profile } = await supabase
        .from("patient_safety_profiles")
        .select("*")
        .eq("patient_id", user.id)
        .single();

      setSafetyProfile(profile);

      // Load check-ins
      const { data: checkInsData } = await supabase
        .from("safety_check_ins")
        .select("*")
        .eq("patient_id", user.id)
        .order("created_at", { ascending: false });

      setCheckIns(checkInsData || []);

      // Load checklist
      const { data: checklistData } = await supabase
        .from("journey_safety_checklist")
        .select("*")
        .eq("patient_id", user.id);

      setChecklist(checklistData || []);

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
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck size={32} className="text-green-400" />
            <span className="text-green-400 font-semibold tracking-wide">PATIENT SAFETY HUB</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Your Safety Dashboard
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Monitor your medical journey, verify your coordinator, and access safety resources.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
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

        {/* Coordinator Information */}
        {safetyProfile && safetyProfile.coordinator_name ? (
          <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8">
            <div className="flex items-center gap-3 mb-6">
              <UserRoundCheck size={24} className="text-green-400" />
              <h2 className="text-2xl font-bold">Your Care Coordinator</h2>
              {safetyProfile.coordinator_verified && (
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <CheckCircle size={14} />
                  Verified
                </span>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <p className="text-slate-400 text-sm mb-2">Coordinator Name</p>
                <p className="text-xl font-semibold">{safetyProfile.coordinator_name}</p>
              </div>
              
              {safetyProfile.coordinator_reference_id && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <p className="text-slate-400 text-sm mb-2">Reference ID</p>
                  <p className="text-xl font-semibold text-blue-400">{safetyProfile.coordinator_reference_id}</p>
                </div>
              )}
              
              {safetyProfile.coordinator_phone && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <p className="text-slate-400 text-sm mb-2">Contact Number</p>
                  <p className="text-xl font-semibold flex items-center gap-2">
                    <Phone size={20} className="text-green-400" />
                    {safetyProfile.coordinator_phone}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8 text-center">
            <UserRoundCheck size={48} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Coordinator Not Assigned</h3>
            <p className="text-slate-400">
              Your coordinator information will appear here once assigned.
            </p>
          </div>
        )}

        {/* Safety Checklist */}
        <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText size={24} className="text-purple-400" />
            <h2 className="text-2xl font-bold">Journey Safety Checklist</h2>
          </div>
          
          {checklist.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {checklist.map((item) => (
                <div
                  key={item.item_type}
                  className={`flex items-center gap-3 p-4 rounded-xl border ${
                    item.is_completed
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-slate-900/50 border-slate-800"
                  }`}
                >
                  {item.is_completed ? (
                    <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                  ) : (
                    <Clock size={20} className="text-slate-500 flex-shrink-0" />
                  )}
                  <span className="text-sm">{getChecklistLabel(item.item_type)}</span>
                </div>
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
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck size={24} className="text-cyan-400" />
            <h2 className="text-2xl font-bold">Recent Safety Check-ins</h2>
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

        {/* Emergency Contact */}
        <div className="bg-gradient-to-r from-green-950 to-emerald-950 border border-green-800 rounded-[32px] p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Need Immediate Assistance?</h3>
              <p className="text-slate-400">
                Contact our emergency support line for urgent help during your journey.
              </p>
            </div>
            <a
              href="tel:+919116734675"
              className="inline-flex items-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-700 rounded-2xl font-semibold transition"
            >
              <Phone size={24} />
              Emergency Contact
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
