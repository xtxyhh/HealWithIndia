"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Circle, ArrowLeft, ShieldCheck } from "lucide-react";

const STAGES = [
  { id: "Inquiry", title: "Inquiry Received", desc: "Initial inquiry submitted via portal/website." },
  { id: "Lead", title: "Lead Logged", desc: "Patient case logged in CRM system." },
  { id: "Review", title: "Medical Review", desc: "Senior medical panel analyzing medical reports." },
  { id: "Coordinator Assigned", title: "Coordinator Assigned", desc: "Personal medical coordinator assigned to guide your trip." },
  { id: "Medical Reports", title: "Medical Reports Verified", desc: "Diagnostics and clinical summaries confirmed by hospital." },
  { id: "Hospital", title: "Hospital Selected", desc: "Top JCI/NABH hospital chosen for procedure." },
  { id: "Doctor", title: "Chief Specialist Assigned", desc: "Leading surgeon/consultant aligned for consultation." },
  { id: "Treatment Plan", title: "Treatment Plan Finalized", desc: "Customized treatment protocol and stay itinerary ready." },
  { id: "Quote", title: "Official Quote Issued", desc: "Itemized treatment and accommodation cost estimate provided." },
  { id: "Invoice", title: "Proforma Invoice Issued", desc: "Official billing statement generated." },
  { id: "Payment", title: "Deposit / Payment Confirmed", desc: "Payment processed securely." },
  { id: "Visa", title: "Medical Visa (MED) Approved", desc: "Official Embassy recommendation & visa issued." },
  { id: "Travel", title: "Flight Booked & Confirmed", desc: "Flight ticket details logged with airport team." },
  { id: "Arrival", title: "Airport Reception & Transfer", desc: "Personal coordinator driver greeting at airport." },
  { id: "Treatment", title: "Hospital Admission & Procedure", desc: "Super-specialty treatment and inpatient care executed." },
  { id: "Recovery", title: "Post-Op Recovery & Hotel Stay", desc: "Guided rehabilitation with daily health check-ins." },
  { id: "Follow-up", title: "Tele-Consultation Follow-up", desc: "Post-discharge monitoring with home doctor." },
  { id: "Completed", title: "Journey Completed Successfully", desc: "Safe return home with full health recovery." }
];

function PatientJourneyContent() {
  const [journeyStages, setJourneyStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJourney() {
      try {
        const res = await fetch("/api/patient/journey");
        if (res.ok) {
          const json = await res.json();
          setJourneyStages(json.stages || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadJourney();
  }, []);

  const completedMap = new Map(journeyStages.map((s: any) => [s.stage, s.status]));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      <header className="border-b border-slate-850 bg-slate-900/60 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/patient/dashboard" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-bold text-white text-base">17-Stage Patient Medical Journey</h1>
            <p className="text-[11px] text-blue-400 font-semibold tracking-wider uppercase">End-to-End Care Protocol</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 pt-8">
        <div className="bg-slate-900/40 border border-slate-850 rounded-3xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-white">Medical Tourism Lifecycle Tracker</h2>
            <p className="text-slate-400 text-sm mt-1">
              Every step of your medical trip to India is verified and protected by HealWithIndia.
            </p>
          </div>

          <div className="space-y-6 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
            {STAGES.map((s, idx) => {
              const status = completedMap.get(s.id);
              const isDone = status === "completed";
              const isInProgress = status === "in_progress";

              return (
                <div key={s.id} className="relative flex items-start gap-4 pl-2">
                  <div className={`z-10 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    isDone ? "bg-emerald-500 text-slate-950" : isInProgress ? "bg-blue-500 text-white animate-pulse" : "bg-slate-800 text-slate-500"
                  }`}>
                    {isDone ? <CheckCircle2 size={18} /> : isInProgress ? <Clock size={16} /> : <Circle size={14} />}
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex-1 hover:border-slate-700 transition">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-blue-400">Step {idx + 1}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isDone ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : isInProgress ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-slate-800 text-slate-400"
                      }`}>
                        {isDone ? "Completed" : isInProgress ? "In Progress" : "Pending"}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm mt-1">{s.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PatientJourneyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-8">Loading Journey...</div>}>
      <PatientJourneyContent />
    </Suspense>
  );
}
