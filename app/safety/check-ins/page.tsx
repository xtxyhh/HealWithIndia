"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
  Plane,
  Car,
  Building,
  Home,
  HeartPulse,
  ArrowRight,
  Loader2,
} from "lucide-react";

const CHECK_IN_TYPES = [
  {
    id: "arrival_india",
    title: "Arrival in India",
    description: "Confirm your safe arrival in India",
    icon: Plane,
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
  },
  {
    id: "airport_pickup",
    title: "Airport Pickup",
    description: "Confirm you've met your pickup driver",
    icon: Car,
    color: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-400",
  },
  {
    id: "accommodation_arrival",
    title: "Accommodation Arrival",
    description: "Confirm you've arrived at your accommodation",
    icon: Home,
    color: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400",
  },
  {
    id: "hospital_arrival",
    title: "Hospital Arrival",
    description: "Confirm you've arrived at the hospital",
    icon: Building,
    color: "from-orange-500/20 to-yellow-500/20",
    iconColor: "text-orange-400",
  },
  {
    id: "treatment_milestone",
    title: "Treatment Milestone",
    description: "Confirm a treatment procedure milestone",
    icon: HeartPulse,
    color: "from-red-500/20 to-pink-500/20",
    iconColor: "text-red-400",
  },
  {
    id: "discharge",
    title: "Discharge",
    description: "Confirm hospital discharge",
    icon: CheckCircle,
    color: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-400",
  },
  {
    id: "return_travel",
    title: "Return Travel",
    description: "Confirm departure for return travel",
    icon: Plane,
    color: "from-indigo-500/20 to-purple-500/20",
    iconColor: "text-indigo-400",
  },
];

export default function CheckInsPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentCheckIns, setRecentCheckIns] = useState<any[]>([]);

  useEffect(() => {
    loadRecentCheckIns();
  }, []);

  const loadRecentCheckIns = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const response = await fetch(`/api/safety/check-ins`);
      if (response.ok) {
        const { data } = await response.json();
        setRecentCheckIns(data || []);
      }
    } catch (err) {
      console.error("Error loading check-ins:", err);
    }
  };

  const handleCheckIn = async (status: "safe" | "needs_assistance") => {
    setError("");

    if (!selectedType) {
      setError("Please select a check-in type.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/safety/check-ins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          check_in_type: selectedType,
          status,
          notes: notes.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          router.push("/patient/login");
          return;
        }
        setError(errorData.error || "Unable to submit check-in. Please try again.");
        setLoading(false);
        return;
      }

      // Reload recent check-ins
      await loadRecentCheckIns();
      
      // Reset form
      setSelectedType(null);
      setNotes("");
      
      if (status === "needs_assistance") {
        router.push("/safety");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const getCheckInLabel = (type: string) => {
    const item = CHECK_IN_TYPES.find(t => t.id === type);
    return item ? item.title : type;
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-slate-950 to-cyan-950 py-16">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[150px] rounded-full" />
        
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck size={32} className="text-green-400" />
            <span className="text-green-400 font-semibold tracking-wide">SAFETY CHECK-INS</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Journey Check-Ins
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Confirm your safety at key milestones throughout your medical journey.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Recent Check-ins */}
        {recentCheckIns.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Recent Check-ins</h2>
            <div className="space-y-4">
              {recentCheckIns.slice(0, 5).map((checkIn) => (
                <div
                  key={checkIn.id}
                  className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl"
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
          </div>
        )}

        {/* Check-in Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Select Check-in Type</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHECK_IN_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`relative overflow-hidden rounded-2xl border p-6 text-left transition-all duration-300 hover:-translate-y-1 ${
                    selectedType === type.id
                      ? `bg-gradient-to-br ${type.color} ring-2 ring-white/20`
                      : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
                  }`}
                >
                  <Icon size={32} className={type.iconColor} />
                  <h3 className="text-lg font-bold mt-4">{type.title}</h3>
                  <p className="text-slate-400 text-sm mt-2">{type.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Check-in Form */}
        {selectedType && (
          <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {getCheckInLabel(selectedType)}
              </h2>
              <p className="text-slate-400">
                Confirm your status for this check-in
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-slate-400 text-sm mb-3">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any relevant details..."
                rows={3}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all resize-none"
              />
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 px-4 py-3">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleCheckIn("safe")}
                disabled={loading}
                className="flex-1 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 py-4 font-semibold text-lg hover:scale-[1.02] disabled:opacity-50 transition-all duration-300 shadow-[0_0_50px_rgba(34,197,94,.35)] flex items-center justify-center gap-3"
              >
                {loading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    <CheckCircle size={24} />
                    I'm Safe
                  </>
                )}
              </button>

              <button
                onClick={() => handleCheckIn("needs_assistance")}
                disabled={loading}
                className="flex-1 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 py-4 font-semibold text-lg hover:scale-[1.02] disabled:opacity-50 transition-all duration-300 shadow-[0_0_50px_rgba(239,68,68,.35)] flex items-center justify-center gap-3"
              >
                {loading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    <AlertTriangle size={24} />
                    I Need Assistance
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => {
                setSelectedType(null);
                setNotes("");
              }}
              className="w-full mt-4 rounded-2xl border border-slate-800 py-4 font-semibold text-lg hover:bg-slate-900/50 transition-all"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
