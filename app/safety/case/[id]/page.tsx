"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  FileText,
  MessageCircle,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";

interface CaseEvent {
  id: string;
  event_type: string;
  description: string;
  created_by: string;
  created_at: string;
}

interface SafetyCaseDetail {
  id: string;
  category: string;
  priority: string;
  status: string;
  response_state: string | null;
  description: string | null;
  assigned_coordinator_id: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  resolution_category: string | null;
  response_operator_id: string | null;
  safety_case_events: CaseEvent[];
}

export default function SafetyCaseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [safetyCase, setSafetyCase] = useState<SafetyCaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadCase = async () => {
      setLoading(true);
      setError(null);
      const { id } = await params;

      try {
        const response = await fetch(`/api/safety/cases/${id}`);
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/patient/login");
            return;
          }

          const data = await response.json();
          setError(data.error || "Unable to load case details.");
          return;
        }

        const { data } = await response.json();
        setSafetyCase(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load case details.");
      } finally {
        setLoading(false);
      }
    };

    loadCase();
  }, [params, router]);

  const submitPatientNote = async () => {
    if (!noteText.trim()) {
      setError("Please enter a note before submitting.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { id } = await params;
      const response = await fetch(`/api/safety/cases/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: noteText.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Unable to submit note.");
        return;
      }

      setNoteText("");
      setSuccessMessage("Your update has been added to the case timeline.");
      await new Promise((resolve) => setTimeout(resolve, 400));
      const refreshResponse = await fetch(`/api/safety/cases/${id}`);
      const { data } = await refreshResponse.json();
      setSafetyCase(data);
    } catch (err) {
      console.error(err);
      setError("Unable to submit note.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin mx-auto text-blue-400" />
          <p className="mt-4 text-slate-400">Loading case details...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
        <div className="max-w-md text-center bg-slate-950 border border-slate-800 rounded-3xl p-8">
          <AlertTriangle size={40} className="mx-auto text-yellow-400 mb-4" />
          <h1 className="text-2xl font-bold mb-3">Unable to load case</h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => router.push("/safety")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-2xl font-semibold"
          >
            Back to Safety Hub
          </button>
        </div>
      </main>
    );
  }

  if (!safetyCase) {
    return null;
  }

  const statusBadges: Record<string, string> = {
    open: "bg-blue-500/10 text-blue-300 border border-blue-500/20",
    acknowledged: "bg-purple-500/10 text-purple-300 border border-purple-500/20",
    in_progress: "bg-orange-500/10 text-orange-300 border border-orange-500/20",
    resolved: "bg-green-500/10 text-green-300 border border-green-500/20",
    closed: "bg-slate-500/10 text-slate-300 border border-slate-500/20",
  };

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/safety"
              className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <p className="text-sm text-slate-500">Safety Case</p>
              <h1 className="text-3xl font-bold">Case #{safetyCase.id.slice(0, 8)}</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${statusBadges[safetyCase.status] || statusBadges.open}`}>
              <ShieldCheck size={16} />
              {safetyCase.status.replace(/_/g, " ")}
            </span>
            {safetyCase.response_state && (
              <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm bg-slate-900 border border-slate-800 text-slate-300">
                {safetyCase.response_state.replace(/_/g, " ")}
              </span>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
          <section className="space-y-6">
            <div className="rounded-[32px] border border-slate-800 bg-slate-950 p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Case Summary</h2>
                  <p className="text-slate-400 leading-relaxed">Track live updates for this case, add new patient notes, and see response progress from the HealWithIndia safety team.</p>
                </div>
                <div className="text-sm text-slate-500 space-y-1">
                  <div>Filed: {new Date(safetyCase.created_at).toLocaleString()}</div>
                  <div>Updated: {new Date(safetyCase.updated_at).toLocaleString()}</div>
                </div>
              </div>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
                  <p className="text-slate-400 text-xs uppercase tracking-[0.2em] mb-2">Category</p>
                  <p className="font-semibold text-slate-100">{safetyCase.category.replace(/_/g, " ")}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
                  <p className="text-slate-400 text-xs uppercase tracking-[0.2em] mb-2">Priority</p>
                  <p className="font-semibold text-slate-100">{safetyCase.priority}</p>
                </div>
              </div>
              <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-slate-400 text-xs uppercase tracking-[0.2em] mb-3">Description</p>
                <p className="text-slate-200 whitespace-pre-line">{safetyCase.description || "No description provided."}</p>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-800 bg-slate-950 p-8">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle size={24} className="text-blue-400" />
                <h2 className="text-2xl font-bold">Add an Update</h2>
              </div>
              <p className="text-slate-400 text-sm mb-4">Share your observations or additional details with the safety team.</p>
              <textarea
                value={noteText}
                onChange={(event) => setNoteText(event.target.value)}
                rows={5}
                className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe what happened or how you are feeling..."
              />
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-slate-500 text-sm">Your note will be added to the case timeline.</p>
                <button
                  onClick={submitPatientNote}
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Submit Update"}
                </button>
              </div>
              {successMessage && <p className="mt-3 text-green-400">{successMessage}</p>}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-slate-800 bg-slate-950 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Clock size={24} className="text-slate-400" />
                <h2 className="text-2xl font-bold">Case Progress</h2>
              </div>
              <div className="space-y-4 text-sm text-slate-300">
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-slate-400 text-xs uppercase tracking-[0.18em] mb-2">Response state</p>
                  <p>{safetyCase.response_state ? safetyCase.response_state.replace(/_/g, " ") : "Unknown"}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-slate-400 text-xs uppercase tracking-[0.18em] mb-2">Resolution category</p>
                  <p>{safetyCase.resolution_category ? safetyCase.resolution_category.replace(/_/g, " ") : "Not resolved"}</p>
                </div>
                {safetyCase.resolved_at && (
                  <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                    <p className="text-slate-400 text-xs uppercase tracking-[0.18em] mb-2">Resolved at</p>
                    <p>{new Date(safetyCase.resolved_at).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-800 bg-slate-950 p-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText size={24} className="text-cyan-400" />
                <h2 className="text-2xl font-bold">Timeline</h2>
              </div>
              <div className="space-y-4">
                {safetyCase.safety_case_events?.length > 0 ? (
                  safetyCase.safety_case_events
                    .slice()
                    .sort(
                      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    )
                    .map((event) => (
                      <div key={event.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <p className="text-slate-100 font-semibold">{event.event_type.replace(/_/g, " ")}</p>
                          <span className="text-xs text-slate-500">{new Date(event.created_at).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-400 text-sm whitespace-pre-line">{event.description || "No details available."}</p>
                        <p className="text-slate-500 text-xs mt-3">By {event.created_by || "system"}</p>
                      </div>
                    ))
                ) : (
                  <p className="text-slate-500">No timeline events recorded yet.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
