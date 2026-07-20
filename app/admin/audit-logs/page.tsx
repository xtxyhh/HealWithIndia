"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

function AdminAuditLogsContent() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch("/api/admin/audit-logs");
        if (res.ok) {
          const json = await res.json();
          setLogs(json.logs || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      <header className="border-b border-slate-850 bg-slate-900/60 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-bold text-white text-base">Security & System Audit Logs</h1>
            <p className="text-[11px] text-emerald-400 font-semibold tracking-wider uppercase">Compliance & Audit Trail</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 pt-8 space-y-6">
        <div className="bg-slate-900/40 border border-slate-850 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Audit Trail Events ({logs.length})</h2>
          {logs.length > 0 ? (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-emerald-400" />
                      <span className="font-bold text-white uppercase">{log.action}</span>
                      <span className="text-slate-400">• Resource: {log.resource}</span>
                    </div>
                    <p className="text-slate-400 mt-1">{JSON.stringify(log.details)}</p>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              Audit logging engine active. System events and security actions will populate here in real-time.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminAuditLogsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-8">Loading Audit Logs...</div>}>
      <AdminAuditLogsContent />
    </Suspense>
  );
}
