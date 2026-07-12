"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  ShieldCheck,
  ArrowLeft,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Loader2,
} from "lucide-react";

export default function SafetyCaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [safetyCase, setSafetyCase] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [caseId, setCaseId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { id } = await params;
      setCaseId(id);
      loadCaseData(id);
    };
    init();
  }, [params]);

  const loadCaseData = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/safety/cases/${id}`);
      
      if (!response.ok) {
        if (response.status === 403) {
          router.push("/login");
          return;
        }
        const errorData = await response.json();
        setError(errorData.error || "Failed to load case");
        setLoading(false);
        return;
      }

      const { data } = await response.json();
      setSafetyCase(data);
      
      // Load events separately (would need separate API endpoint)
      // For now, we'll show the case without events
      setEvents([]);
    } catch (err) {
      setError("Failed to load case data");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (status: string) => {
    if (!caseId) return;
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/admin/safety/cases/${caseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update case");
        setLoading(false);
        return;
      }

      // Reload case data
      if (caseId) {
        await loadCaseData(caseId);
      }
    } catch (err) {
      setError("Failed to update case");
      setLoading(false);
    }
  };

  if (loading && !safetyCase) {
    return (
      <main className="p-10 text-white flex items-center justify-center">
        <Loader2 size={48} className="animate-spin" />
      </main>
    );
  }

  if (error && !safetyCase) {
    return (
      <main className="p-10 text-white">
        <h1 className="text-4xl font-bold text-white">Error</h1>
        <p className="text-slate-400 mt-4">{error}</p>
        <Link
          href="/admin/safety"
          className="text-blue-400 hover:text-blue-300 mt-4 inline-block"
        >
          Back to Safety Operations
        </Link>
      </main>
    );
  }

  if (!safetyCase) {
    return (
      <main className="p-10 text-white">
        <h1 className="text-4xl font-bold text-white">Case Not Found</h1>
        <p className="text-slate-400 mt-4">Unable to load safety case details.</p>
        <Link
          href="/admin/safety"
          className="text-blue-400 hover:text-blue-300 mt-4 inline-block"
        >
          Back to Safety Operations
        </Link>
      </main>
    );
  }

  return (
    <main className="p-10 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/safety"
            className="p-2 bg-slate-900 rounded-xl hover:bg-slate-800 transition"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-1">Safety Case Details</h1>
            <p className="text-slate-400 text-sm">Case ID: {safetyCase.id}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Case Info */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="text-blue-400" size={24} />
              <h2 className="text-2xl font-bold">Case Information</h2>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-slate-400 text-sm mb-2">Category</p>
                <p className="font-semibold capitalize">
                  {safetyCase.category.replace(/_/g, " ")}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-2">Priority</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  safetyCase.priority === "critical" ? "bg-red-500/20 text-red-400" :
                  safetyCase.priority === "high" ? "bg-orange-500/20 text-orange-400" :
                  safetyCase.priority === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-slate-500/20 text-slate-400"
                }`}>
                  {safetyCase.priority}
                </span>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-2">Status</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  safetyCase.status === "open" ? "bg-blue-500/20 text-blue-400" :
                  safetyCase.status === "acknowledged" ? "bg-green-500/20 text-green-400" :
                  safetyCase.status === "in_progress" ? "bg-purple-500/20 text-purple-400" :
                  safetyCase.status === "resolved" ? "bg-cyan-500/20 text-cyan-400" :
                  "bg-slate-500/20 text-slate-400"
                }`}>
                  {safetyCase.status.replace(/_/g, " ")}
                </span>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-2">Created</p>
                <p className="font-semibold">
                  {new Date(safetyCase.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <p className="text-slate-400 text-sm mb-2">Description</p>
              <p className="text-slate-200">{safetyCase.description}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="text-purple-400" size={24} />
              <h2 className="text-2xl font-bold">Case Timeline</h2>
            </div>

            {(!events || events.length === 0) ? (
              <div className="text-center py-8 text-slate-400">
                No timeline events recorded yet.
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-xl"
                  >
                    <div className={`p-2 rounded-lg ${
                      event.event_type === "created" ? "bg-blue-500/20" :
                      event.event_type === "acknowledged" ? "bg-green-500/20" :
                      event.event_type === "resolved" ? "bg-cyan-500/20" :
                      "bg-slate-500/20"
                    }`}>
                      {event.event_type === "created" ? (
                        <ShieldCheck size={16} className="text-blue-400" />
                      ) : event.event_type === "acknowledged" ? (
                        <CheckCircle size={16} className="text-green-400" />
                      ) : event.event_type === "resolved" ? (
                        <CheckCircle size={16} className="text-cyan-400" />
                      ) : (
                        <MessageSquare size={16} className="text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold capitalize">
                        {event.event_type.replace(/_/g, " ")}
                      </p>
                      {event.description && (
                        <p className="text-slate-400 text-sm mt-1">{event.description}</p>
                      )}
                      <p className="text-slate-500 text-xs mt-2">
                        {new Date(event.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Patient Info */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <User className="text-green-400" size={24} />
              <h2 className="text-xl font-bold">Patient</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm mb-1">Name</p>
                <p className="font-semibold">
                  {safetyCase.patients?.[0]?.full_name || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Country</p>
                <p className="font-semibold">
                  {safetyCase.patients?.[0]?.country || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Email</p>
                <p className="font-semibold text-sm">
                  {safetyCase.patients?.[0]?.email || "Unknown"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="text-orange-400" size={24} />
              <h2 className="text-xl font-bold">Actions</h2>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => handleAction("acknowledged")}
                disabled={loading}
                className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                Acknowledge Case
              </button>
              <button 
                onClick={() => handleAction("in_progress")}
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <User size={18} />}
                Assign Coordinator
              </button>
              <button 
                onClick={() => handleAction("in_progress")}
                disabled={loading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <MessageSquare size={18} />}
                Update Status
              </button>
              <button 
                onClick={() => handleAction("resolved")}
                disabled={loading}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                Resolve Case
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
