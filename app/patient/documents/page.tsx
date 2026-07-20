"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Upload, CheckCircle, Trash2 } from "lucide-react";

function PatientDocumentsContent() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [reportType, setReportType] = useState("general_lab");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await fetch("/api/safety/profile/documents");
        if (res.ok) {
          const json = await res.json();
          setReports(json.documents || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const handleAddReport = async () => {
    if (!title || !fileUrl) return;
    setMsg("");
    try {
      const res = await fetch("/api/safety/profile/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: reportType, name: title, url: fileUrl })
      });
      if (res.ok) {
        setMsg("Medical report uploaded successfully!");
        setReports(prev => [{ type: reportType, name: title, url: fileUrl, uploaded_at: new Date().toISOString() }, ...prev]);
        setTitle("");
        setFileUrl("");
      }
    } catch (e) {
      setMsg("Error uploading document.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      <header className="border-b border-slate-850 bg-slate-900/60 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/patient/dashboard" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-bold text-white text-base">Medical Reports & Health Documents</h1>
            <p className="text-[11px] text-cyan-400 font-semibold tracking-wider uppercase">Clinical Records Vault</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 pt-8 space-y-6">
        {msg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle size={16} />
            {msg}
          </div>
        )}

        {/* Upload Card */}
        <div className="bg-slate-900/40 border border-slate-850 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Upload New Medical Report / Passport Scan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-slate-400 text-xs mb-1">Document Title</label>
              <input
                type="text"
                placeholder="e.g. Cardiac MRI Report / Blood Test"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Category</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-cyan-500"
              >
                <option value="general_lab">Blood / Lab Test</option>
                <option value="mri_ct_scan">MRI / CT Scan / X-Ray</option>
                <option value="doctor_summary">Doctor Clinical Summary</option>
                <option value="passport_visa">Passport / Visa Scan</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Document File URL</label>
              <input
                type="text"
                placeholder="https://storage..."
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <button onClick={handleAddReport} className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition flex items-center gap-2">
            <Upload size={14} />
            Upload Document
          </button>
        </div>

        {/* Existing Documents */}
        <div className="bg-slate-900/40 border border-slate-850 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Uploaded Documents ({reports.length})</h2>
          {reports.length > 0 ? (
            <div className="space-y-3">
              {reports.map((doc, i) => (
                <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-cyan-400" />
                    <div>
                      <p className="font-bold text-white text-sm">{doc.name || doc.type}</p>
                      <p className="text-xs text-slate-400">Uploaded: {new Date(doc.uploaded_at || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline">
                    View File
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">No medical documents uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PatientDocumentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-8">Loading Documents...</div>}>
      <PatientDocumentsContent />
    </Suspense>
  );
}
