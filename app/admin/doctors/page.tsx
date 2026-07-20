"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Stethoscope, Plus, CheckCircle, ArrowLeft } from "lucide-react";

function AdminDoctorsContent() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [experience, setExperience] = useState(10);
  const [fee, setFee] = useState(50);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function loadDoctors() {
      try {
        const res = await fetch("/api/doctors");
        if (res.ok) {
          const json = await res.json();
          setDoctors(json.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadDoctors();
  }, []);

  const handleCreateDoctor = async () => {
    if (!fullName || !specialty) return;
    setMsg("");
    try {
      const res = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          specialty,
          experience_years: experience,
          consultation_fee_usd: fee
        })
      });
      if (res.ok) {
        setMsg("Doctor added successfully!");
        setDoctors(prev => [{ full_name: fullName, specialty, experience_years: experience, consultation_fee_usd: fee }, ...prev]);
        setFullName("");
        setSpecialty("");
      }
    } catch (e) {
      setMsg("Error adding doctor.");
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
            <h1 className="font-bold text-white text-base">Doctors Directory Management</h1>
            <p className="text-[11px] text-cyan-400 font-semibold tracking-wider uppercase">Medical Specialist Network</p>
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
          <h2 className="text-lg font-bold text-white mb-4">Add Specialist Doctor Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-slate-400 text-xs mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Dr. Rajesh Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Specialty</label>
              <input
                type="text"
                placeholder="Cardiology / Neurosurgery"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Experience (Years)</label>
              <input
                type="number"
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Consultation Fee ($ USD)</label>
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <button onClick={handleCreateDoctor} className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition flex items-center gap-2">
            <Plus size={14} />
            Add Doctor
          </button>
        </div>

        <div className="bg-slate-900/40 border border-slate-850 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Doctor Profiles ({doctors.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctors.map((doc, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{doc.full_name}</h3>
                  <p className="text-xs text-cyan-400">{doc.specialty}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{doc.experience_years} Years Exp • ${doc.consultation_fee_usd} USD</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDoctorsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-8">Loading Doctors...</div>}>
      <AdminDoctorsContent />
    </Suspense>
  );
}
