"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Activity, Plus, CheckCircle, ArrowLeft } from "lucide-react";

function AdminTreatmentsContent() {
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Cardiology");
  const [minCost, setMinCost] = useState(3000);
  const [maxCost, setMaxCost] = useState(8000);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function loadTreatments() {
      try {
        const res = await fetch("/api/treatments");
        if (res.ok) {
          const json = await res.json();
          setTreatments(json.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadTreatments();
  }, []);

  const handleCreateTreatment = async () => {
    if (!name) return;
    setMsg("");
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    try {
      const res = await fetch("/api/treatments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          category,
          cost_usd_min: minCost,
          cost_usd_max: maxCost
        })
      });
      if (res.ok) {
        setMsg("Treatment procedure added successfully!");
        setTreatments(prev => [{ name, category, cost_usd_min: minCost, cost_usd_max: maxCost }, ...prev]);
        setName("");
      }
    } catch (e) {
      setMsg("Error adding procedure.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      <header className="border-b border-slate-850 bg-slate-900/60 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-bold text-white text-base">Treatments & Procedures Catalog</h1>
            <p className="text-[11px] text-blue-400 font-semibold tracking-wider uppercase">Surgical & Clinical Portfolio</p>
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

        <div className="bg-slate-900/40 border border-slate-850 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Add Medical Procedure</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-slate-400 text-xs mb-1">Procedure Name</label>
              <input
                type="text"
                placeholder="Robotic Knee Replacement"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-blue-500"
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="IVF & Fertility">IVF & Fertility</option>
                <option value="Oncology">Oncology</option>
                <option value="Neurology">Neurology</option>
                <option value="Transplant">Organ Transplant</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Min Cost ($ USD)</label>
              <input
                type="number"
                value={minCost}
                onChange={(e) => setMinCost(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Max Cost ($ USD)</label>
              <input
                type="number"
                value={maxCost}
                onChange={(e) => setMaxCost(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <button onClick={handleCreateTreatment} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition flex items-center gap-2">
            <Plus size={14} />
            Add Procedure
          </button>
        </div>

        <div className="bg-slate-900/40 border border-slate-850 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Procedure Catalog ({treatments.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {treatments.map((t, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">{t.name}</h3>
                  <p className="text-xs text-blue-400 mt-0.5">{t.category}</p>
                  <p className="text-xs font-semibold text-white mt-2">${t.cost_usd_min?.toLocaleString()} - ${t.cost_usd_max?.toLocaleString()} USD</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminTreatmentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-8">Loading Treatments...</div>}>
      <AdminTreatmentsContent />
    </Suspense>
  );
}
