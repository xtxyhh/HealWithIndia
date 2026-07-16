"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Phone,
  Search,
  Eye,
  Globe,
  HeartPulse,
  Plus,
} from "lucide-react";
import CreatePatientModal from "./CreatePatientModal";

interface Patient {
  id: string | number;
  full_name?: string;
  email?: string;
  country?: string;
  treatment?: string;
  status?: string;
  phone?: string;
}

interface Stats {
  totalPatients: number;
  uniqueTreatments: number;
  uniqueCountries: number;
  contacted: number;
}

interface PatientPageClientProps {
  patients: Patient[];
  stats: Stats;
}

export default function PatientPageClient({
  patients,
  stats,
}: PatientPageClientProps) {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = patients.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.full_name?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.country?.toLowerCase().includes(q) ||
      p.treatment?.toLowerCase().includes(q)
    );
  });

  return (
    <>
      {/* Add Patient Modal */}
      {showModal && (
        <CreatePatientModal onClose={() => setShowModal(false)} />
      )}

      {/* Page Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="uppercase tracking-[4px] text-blue-400 text-sm font-semibold">
            Patients
          </p>
          <h1 className="text-5xl font-bold mt-3">International Patients</h1>
          <p className="text-slate-400 mt-3">
            Manage treatment progress and patient journey.
          </p>
        </div>

        <button
          id="add-patient-btn"
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-2xl flex items-center gap-3 transition font-semibold"
        >
          <Plus size={20} />
          Add Patient
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-slate-950 border border-slate-800 rounded-[28px] p-7">
          <Users size={34} className="text-blue-400" />
          <p className="text-slate-400 mt-6">Total Patients</p>
          <h2 className="text-5xl font-bold mt-2">{stats.totalPatients}</h2>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-[28px] p-7">
          <HeartPulse size={34} className="text-red-400" />
          <p className="text-slate-400 mt-6">Treatments</p>
          <h2 className="text-5xl font-bold mt-2">{stats.uniqueTreatments}</h2>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-[28px] p-7">
          <Globe size={34} className="text-green-400" />
          <p className="text-slate-400 mt-6">Countries</p>
          <h2 className="text-5xl font-bold mt-2">{stats.uniqueCountries}</h2>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-[28px] p-7">
          <Phone size={34} className="text-cyan-400" />
          <p className="text-slate-400 mt-6">Contacted</p>
          <h2 className="text-5xl font-bold mt-2">{stats.contacted}</h2>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search
          size={18}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patients by name, email, country or treatment..."
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-14 pr-5 py-4 text-white outline-none focus:border-blue-500 transition"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-[32px] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <Users size={70} className="mx-auto text-slate-700" />
            <h2 className="text-3xl font-bold mt-8">
              {search ? "No matching patients" : "No Patients Found"}
            </h2>
            <p className="text-slate-400 mt-3">
              {search
                ? "Try a different search term."
                : "Click 'Add Patient' to create the first patient record."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900">
                <tr>
                  <th className="text-left px-6 py-5 text-slate-400 font-medium text-sm">Patient</th>
                  <th className="text-left px-6 py-5 text-slate-400 font-medium text-sm">Country</th>
                  <th className="text-left px-6 py-5 text-slate-400 font-medium text-sm">Treatment</th>
                  <th className="text-left px-6 py-5 text-slate-400 font-medium text-sm">Status</th>
                  <th className="text-left px-6 py-5 text-slate-400 font-medium text-sm">Phone</th>
                  <th className="text-left px-6 py-5 text-slate-400 font-medium text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b border-slate-800 hover:bg-slate-900/50 transition"
                  >
                    <td className="px-6 py-5">
                      <div>
                        <h3 className="font-semibold">
                          {patient.full_name || "Unknown"}
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">
                          {patient.email}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-slate-300 text-sm">
                      {patient.country || "—"}
                    </td>

                    <td className="px-6 py-5 text-slate-300 text-sm">
                      {patient.treatment || "—"}
                    </td>

                    <td className="px-6 py-5">
                      <span className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                        {patient.status || "New"}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-slate-300 text-sm">
                      {patient.phone || "—"}
                    </td>

                    <td className="px-6 py-5">
                      <Link
                        href={`/admin/patient/${patient.id}`}
                        className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl inline-flex transition"
                      >
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
