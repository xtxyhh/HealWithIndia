"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, CheckCircle, AlertTriangle } from "lucide-react";

function CoordinatorCasesContent() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCases() {
      try {
        const res = await fetch("/api/coordinator/dashboard");
        if (res.ok) {
          const json = await res.json();
          setCases(json.active_cases || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCases();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      <header className="border-b border-slate-850 bg-slate-900/60 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/coordinator/dashboard" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-bold text-white text-base">Safety & Emergency Case Operations</h1>
            <p className="text-[11px] text-red-400 font-semibold tracking-wider uppercase">Urgent Assistance Queue</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 pt-8 space-y-6">
        <div className="bg-slate-900/40 border border-slate-850 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Active Safety Support Cases ({cases.length})</h2>
          {cases.length > 0 ? (
            <div className="space-y-4">
              {cases.map((sc) => (
                <div key={sc.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert size={18} className="text-red-400" />
                      <span className="font-bold text-white text-sm capitalize">{sc.category?.replace("_", " ")}</span>
                    </div>
                    <span className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-full uppercase">
                      {sc.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{sc.description}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>Filed: {new Date(sc.created_at).toLocaleString()}</span>
                    <Link href={`/admin/safety/case/${sc.id}`} className="text-blue-400 hover:underline">
                      View Case Workspace →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              No active safety cases. All assigned patients are safe and on track.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CoordinatorCasesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-8">Loading Cases...</div>}>
      <CoordinatorCasesContent />
    </Suspense>
  );
}
