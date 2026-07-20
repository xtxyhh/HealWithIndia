"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Plane, FileText, Hotel, Car, CheckCircle, Save } from "lucide-react";

function PatientTravelContent() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [flightNumber, setFlightNumber] = useState("");
  const [airline, setAirline] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function loadTravel() {
      try {
        const res = await fetch("/api/patient/travel");
        if (res.ok) {
          const json = await res.json();
          setData(json);
          setFlightNumber(json.travel?.flight_number || "");
          setAirline(json.travel?.airline || "");
          setPassportNumber(json.visa?.passport_number || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTravel();
  }, []);

  const handleSaveFlight = async () => {
    setMsg("");
    try {
      const res = await fetch("/api/patient/travel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "flight", flight_number: flightNumber, airline })
      });
      if (res.ok) setMsg("Flight details updated & airport pickup requested!");
    } catch (e) {
      setMsg("Error saving details.");
    }
  };

  const handleSavePassport = async () => {
    setMsg("");
    try {
      const res = await fetch("/api/patient/travel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "visa", passport_number: passportNumber })
      });
      if (res.ok) setMsg("Passport information saved!");
    } catch (e) {
      setMsg("Error saving details.");
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
            <h1 className="font-bold text-white text-base">Travel & Medical Visa Management</h1>
            <p className="text-[11px] text-indigo-400 font-semibold tracking-wider uppercase">Logistics & Accommodation</p>
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

        {/* Visa Section */}
        <div className="bg-slate-900/40 border border-slate-850 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText size={20} className="text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Medical Visa (MED) Assistance</h2>
          </div>
          <p className="text-slate-400 text-xs mb-4">
            Status: <span className="text-indigo-300 font-bold">{data?.visa?.application_status || "Not Applied"}</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-xs mb-1">Passport Number</label>
              <input
                type="text"
                placeholder="e.g. A12345678"
                value={passportNumber}
                onChange={(e) => setPassportNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex items-end">
              <button onClick={handleSavePassport} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2">
                <Save size={14} />
                Save Passport Info
              </button>
            </div>
          </div>
        </div>

        {/* Flight & Pickup Section */}
        <div className="bg-slate-900/40 border border-slate-850 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Plane size={20} className="text-blue-400" />
            <h2 className="text-lg font-bold text-white">Flight Arrival & Free Airport Pickup</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-slate-400 text-xs mb-1">Airline</label>
              <input
                type="text"
                placeholder="e.g. Emirates / Air India"
                value={airline}
                onChange={(e) => setAirline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Flight Number</label>
              <input
                type="text"
                placeholder="e.g. EK-512"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <button onClick={handleSaveFlight} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition flex items-center gap-2">
            <Car size={14} />
            Update Flight & Request Airport Driver
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PatientTravelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-8">Loading Travel...</div>}>
      <PatientTravelContent />
    </Suspense>
  );
}
