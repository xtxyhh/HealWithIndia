"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, UserCheck, CheckCircle } from "lucide-react";

const STAGES = [
  "Inquiry", "Lead", "Review", "Coordinator Assigned", "Medical Reports",
  "Hospital", "Doctor", "Treatment Plan", "Quote", "Invoice",
  "Payment", "Visa", "Travel", "Arrival", "Treatment",
  "Recovery", "Follow-up", "Completed"
];

function CoordinatorPatientsContent() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedStage, setSelectedStage] = useState<string>("Medical Reports");
  const [notes, setNotes] = useState<string>("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function loadPatients() {
      try {
        const res = await fetch("/api/coordinator/patients");
        if (res.ok) {
          const json = await res.json();
          setPatients(json.patients || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, []);

  const handleUpdateStage = async () => {
    if (!selectedPatientId) return;
    setMsg("");
    try {
      const res = await fetch("/api/coordinator/patients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: selectedPatientId,
          stage: selectedStage,
          notes,
          status: selectedStage
        })
      });
      if (res.ok) {
        setMsg(`Patient stage advanced to "${selectedStage}"!`);
        setPatients(prev => prev.map(p => p.id == selectedPatientId ? { ...p, status: selectedStage } : p));
      }
    } catch (e) {
      setMsg("Failed to update patient stage.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      <header className="border-b border-slate-850 bg-slate-900/60 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/coordinator/dashboard" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-bold text-white text-base">Patient Lifecycle Management</h1>
            <p className="text-[11px] text-purple-400 font-semibold tracking-wider uppercase">Stage Transition Controls</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 pt-8 space-y-6">
        {msg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle size={16} />
            {msg}
          </div>
        )}

        {/* Update Control Card */}
        <div className="bg-slate-900/40 border border-slate-850 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Advance Patient Journey Stage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-slate-400 text-xs mb-1">Select Patient</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-purple-500"
              >
                <option value="">-- Choose Patient --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.full_name} ({p.country}) - Current: {p.status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Target 17-Stage Step</label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-purple-500"
              >
                {STAGES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Stage Notes / Comments</label>
              <input
                type="text"
                placeholder="e.g. Visa invitation issued"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>
          </div>
          <button onClick={handleUpdateStage} className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition">
            Advance Patient Stage
          </button>
        </div>

        {/* Patients Roster */}
        <div className="bg-slate-900/40 border border-slate-850 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Patient Roster ({patients.length})</h2>
          <div className="space-y-3">
            {patients.map(p => (
              <div key={p.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white text-sm">{p.full_name}</h3>
                  <p className="text-xs text-slate-400">Email: {p.email} • Country: {p.country} • Treatment: {p.treatment}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
                    {p.status || "Inquiry"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoordinatorPatientsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-8">Loading Patients...</div>}>
      <CoordinatorPatientsContent />
    </Suspense>
  );
}
