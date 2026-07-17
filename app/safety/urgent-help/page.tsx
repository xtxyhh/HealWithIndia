"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import TrustVerificationBar from "@/components/TrustVerificationBar";
import {
  AlertTriangle,
  Phone,
  MapPin,
  HeartPulse,
  Car,
  Building,
  Home,
  ShieldAlert,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  Loader2,
} from "lucide-react";

const ISSUE_CATEGORIES = [
  {
    id: "medical_emergency",
    title: "Medical Emergency",
    description: "Life-threatening medical situation requiring immediate attention",
    icon: HeartPulse,
    color: "from-red-500/20 to-red-600/20",
    iconColor: "text-red-400",
    borderColor: "border-red-500/30",
    isEmergency: true,
  },
  {
    id: "lost_unsafe",
    title: "Lost / Feel Unsafe",
    description: "Lost location or feeling unsafe in your surroundings",
    icon: MapPin,
    color: "from-orange-500/20 to-orange-600/20",
    iconColor: "text-orange-400",
    borderColor: "border-orange-500/30",
    isEmergency: true,
  },
  {
    id: "transport_issue",
    title: "Transport Issue",
    description: "Problem with airport pickup, taxi, or arranged transport",
    icon: Car,
    color: "from-yellow-500/20 to-yellow-600/20",
    iconColor: "text-yellow-400",
    borderColor: "border-yellow-500/30",
    isEmergency: false,
  },
  {
    id: "hospital_coordination",
    title: "Hospital Coordination",
    description: "Issue with hospital admission, doctor communication, or treatment",
    icon: Building,
    color: "from-blue-500/20 to-blue-600/20",
    iconColor: "text-blue-400",
    borderColor: "border-blue-500/30",
    isEmergency: false,
  },
  {
    id: "accommodation_issue",
    title: "Accommodation Issue",
    description: "Problem with hotel, guest house, or arranged accommodation",
    icon: Home,
    color: "from-purple-500/20 to-purple-600/20",
    iconColor: "text-purple-400",
    borderColor: "border-purple-500/30",
    isEmergency: false,
  },
  {
    id: "suspected_fraud",
    title: "Suspected Fraud",
    description: "Suspicious contact, payment request, or scam attempt",
    icon: ShieldAlert,
    color: "from-pink-500/20 to-pink-600/20",
    iconColor: "text-pink-400",
    borderColor: "border-pink-500/30",
    isEmergency: false,
  },
  {
    id: "other",
    title: "Other Urgent Concern",
    description: "Any other issue requiring immediate assistance",
    icon: HelpCircle,
    color: "from-cyan-500/20 to-cyan-600/20",
    iconColor: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    isEmergency: false,
  },
];

const PRIORITIES = [
  { value: "low", label: "Low", color: "text-slate-400" },
  { value: "medium", label: "Medium", color: "text-yellow-400" },
  { value: "high", label: "High", color: "text-orange-400" },
  { value: "critical", label: "Critical", color: "text-red-400" },
];

export default function UrgentHelpPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priority, setPriority] = useState("medium");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedCategoryData = ISSUE_CATEGORIES.find(c => c.id === selectedCategory);

  const handleSubmit = async () => {
    setError("");

    if (!selectedCategory) {
      setError("Please select an issue category.");
      return;
    }

    if (!description.trim()) {
      setError("Please provide a description of your situation.");
      return;
    }

    try {
      setLoading(true);

      // If this is a fraud report, use the fraud API
      if (selectedCategory === "suspected_fraud") {
        const fraudResponse = await fetch("/api/safety/fraud", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            report_type: "other",
            description: description.trim(),
          }),
        });

        if (!fraudResponse.ok) {
          const errorData = await fraudResponse.json();
          if (fraudResponse.status === 401) {
            router.push("/patient/login");
            return;
          }
          setError(errorData.error || "Unable to submit your report. Please try again.");
          setLoading(false);
          return;
        }
      } else {
        // Regular safety case
        const response = await fetch("/api/safety/cases", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: selectedCategory,
            priority: selectedCategoryData?.isEmergency ? "critical" : priority,
            description: description.trim(),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            router.push("/patient/login");
            return;
          }
          setError(errorData.error || "Unable to submit your request. Please try again or call emergency services.");
          setLoading(false);
          return;
        }
      }

      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please call emergency services if this is urgent.");
    }

    setLoading(false);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="h-24 w-24 mx-auto rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-6">
            <CheckCircle size={48} className="text-green-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Request Submitted</h2>
          <p className="text-slate-400 mb-6">
            Your safety case has been created. Our team will review and respond as soon as possible.
          </p>
          <p className="text-slate-500 text-sm mb-8">
            Case ID will be provided once assigned.
          </p>
          <button
            onClick={() => router.push("/safety")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
          >
            Return to Safety Hub
            <ArrowRight size={18} />
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <TrustVerificationBar />
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-950 via-slate-950 to-orange-950 py-16">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-red-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-500/10 blur-[150px] rounded-full" />
        
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={32} className="text-red-400" />
            <span className="text-red-400 font-semibold tracking-wide">URGENT HELP</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Request Immediate Assistance
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            If you are experiencing a life-threatening emergency, please contact local emergency services first.
          </p>
        </div>
      </section>

      {/* Emergency Warning */}
      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="bg-red-950 border border-red-800 rounded-[32px] p-6 flex items-center gap-4">
          <Phone size={32} className="text-red-400 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-red-400 text-lg">Life-Threatening Emergency?</h3>
            <p className="text-slate-400">
              Call <span className="text-white font-semibold">112</span> (India Emergency) or your local emergency number immediately.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Issue Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Select Your Issue</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ISSUE_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`relative overflow-hidden rounded-2xl border p-6 text-left transition-all duration-300 hover:-translate-y-1 ${
                    selectedCategory === category.id
                      ? `${category.borderColor} bg-gradient-to-br ${category.color} ring-2 ring-white/20`
                      : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
                  }`}
                >
                  {category.isEmergency && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold">
                      Emergency
                    </div>
                  )}
                  <Icon size={32} className={category.iconColor} />
                  <h3 className="text-lg font-bold mt-4">{category.title}</h3>
                  <p className="text-slate-400 text-sm mt-2">{category.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        {selectedCategory && selectedCategoryData && (
          <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8">
            <div className="flex items-center gap-3 mb-6">
              {(() => {
                const Icon = selectedCategoryData.icon;
                return <Icon size={24} className={selectedCategoryData.iconColor} />;
              })()}
              <h2 className="text-2xl font-bold">{selectedCategoryData.title}</h2>
            </div>

            {!selectedCategoryData.isEmergency && (
              <div className="mb-6">
                <label className="block text-slate-400 text-sm mb-3">Priority Level</label>
                <div className="flex flex-wrap gap-3">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPriority(p.value)}
                      className={`px-4 py-2 rounded-xl border transition-all ${
                        priority === p.value
                          ? `${p.color} bg-slate-900/50 border-white/20`
                          : "border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-slate-400 text-sm mb-3">
                Describe Your Situation
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide details about your situation. Include your current location if applicable..."
                rows={5}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all resize-none"
              />
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 px-4 py-3">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 py-4 font-semibold text-lg hover:scale-[1.02] disabled:opacity-50 transition-all duration-300 shadow-[0_0_50px_rgba(239,68,68,.35)]"
            >
              {loading ? (
                <div className="flex justify-center">
                  <Loader2 size={24} className="animate-spin" />
                </div>
              ) : (
                "Submit Request"
              )}
            </button>

            <button
              onClick={() => router.push("/safety")}
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
