"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { UserCheck, ShieldAlert, Activity, Users, Phone, ChevronRight } from "lucide-react";

function CoordinatorDashboardContent() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCoordinatorDashboard() {
      try {
        const res = await fetch("/api/coordinator/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCoordinatorDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8 flex items-center justify-center">
        <div className="animate-pulse text-center">Loading Coordinator Workspace...</div>
      </div>
    );
  }

  const assignedPatients = data?.assigned_patients || [];
  const activeCases = data?.active_cases || [];
  const checkIns = data?.recent_check_ins || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      <header className="border-b border-slate-850 bg-slate-900/60 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
            <UserCheck size={24} className="text-purple-400" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base">HealWithIndia</h1>
            <p className="text-[11px] text-purple-400 font-semibold tracking-wider uppercase">Medical Coordinator Operations</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-8 space-y-8">
        {/* Header metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Assigned Patients</span>
              <Users size={18} className="text-purple-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{data?.total_assigned_patients || 0}</p>
            <p className="text-xs text-slate-400 mt-1">Active patients under your care</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Active Safety Alerts</span>
              <ShieldAlert size={18} className="text-red-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{data?.active_safety_cases || 0}</p>
            <p className="text-xs text-slate-400 mt-1">Open emergency / support cases</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Recent Check-Ins</span>
              <Activity size={18} className="text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{checkIns.length}</p>
            <p className="text-xs text-slate-400 mt-1">Check-ins received in last 24h</p>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/coordinator/patients" className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 flex items-center justify-between hover:border-purple-500/40 transition">
            <div>
              <h3 className="font-bold text-white text-base">Patient Roster & Stage Management</h3>
              <p className="text-xs text-slate-400 mt-1">Advance patient lifecycle stages, upload reports & notes</p>
            </div>
            <ChevronRight size={20} className="text-purple-400" />
          </Link>
          <Link href="/coordinator/cases" className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 flex items-center justify-between hover:border-red-500/40 transition">
            <div>
              <h3 className="font-bold text-white text-base">Safety Cases & Emergency Response</h3>
              <p className="text-xs text-slate-400 mt-1">Respond to SOS alerts, update priority & resolution</p>
            </div>
            <ChevronRight size={20} className="text-red-400" />
          </Link>
        </div>

        {/* Assigned Patients Table */}
        <div className="bg-slate-900/40 border border-slate-850 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Assigned Patients</h2>
          {assignedPatients.length > 0 ? (
            <div className="space-y-3">
              {assignedPatients.map((item: any) => (
                <div key={item.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-white text-sm">{item.patients?.full_name || `Patient #${item.patient_id}`}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Country: {item.patients?.country || "N/A"} • Treatment: {item.patients?.treatment || "General"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full font-semibold">
                      {item.patients?.status || "Active"}
                    </span>
                    <Link href="/coordinator/patients" className="text-xs text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg">
                      Manage →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">No active patient assignments currently.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CoordinatorDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-8">Loading Coordinator Dashboard...</div>}>
      <CoordinatorDashboardContent />
    </Suspense>
  );
}
