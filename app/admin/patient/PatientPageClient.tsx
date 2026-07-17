"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import {
  Users,
  Phone,
  Search,
  Eye,
  Globe,
  HeartPulse,
  Plus,
  ChevronDown,
  ChevronUp,
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
  notes?: string;
  assigned_hospital?: string;
  patient_auth_mapping?: {
    portal_access_status: string;
    invite_sent_at?: string;
    portal_access_enabled_at?: string;
  } | null;
  patient_safety_profiles?: {
    protection_status: string;
    journey_stage: string;
    protection_activated_at?: string;
    protection_completed_at?: string;
  } | null;
  coordinator_assignments?: {
    is_active: boolean;
    official_coordinators?: {
      full_name: string;
      reference_id: string;
    } | null;
  }[];
  risk_assessments?: {
    is_current: boolean;
    risk_level: string;
  }[];
  auth_user?: {
    last_sign_in_at?: string;
    created_at?: string;
  } | null;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Record<string | number, boolean>>({});
  const itemsPerPage = 10;

  const toggleRow = (id: string | number) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleExportCSV = () => {
    const headers = ["ID", "Full Name", "Email", "Country", "Treatment", "Status", "Phone", "Portal Status", "Risk Level"];
    const rows = filtered.map(p => [
      p.id,
      p.full_name || "",
      p.email || "",
      p.country || "",
      p.treatment || "",
      p.status || "",
      p.phone || "",
      p.patient_auth_mapping?.portal_access_status || "NOT_ENABLED",
      p.risk_assessments?.find(r => r.is_current)?.risk_level || "normal"
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `patients_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPortalStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "INVITE_PENDING": return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "SUSPENDED": return "bg-red-500/20 text-red-400 border border-red-500/30";
      default: return "bg-slate-800 text-slate-400 border border-slate-700";
    }
  };

  const getProtectionStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-500/25 text-green-400";
      case "COMPLETED": return "bg-cyan-500/25 text-cyan-400";
      case "SUSPENDED": return "bg-red-500/25 text-red-400";
      default: return "bg-slate-900 text-slate-500";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical": return "text-red-500 font-bold";
      case "high": return "text-orange-400 font-semibold";
      case "elevated": return "text-yellow-400";
      case "watch": return "text-blue-400";
      default: return "text-slate-400";
    }
  };

  const getStageProgress = (stage: string) => {
    switch (stage) {
      case 'initial': return { percent: 10, label: "Consultation" };
      case 'visa_processing': return { percent: 25, label: "Visa Processing" };
      case 'travel_confirmed': return { percent: 45, label: "Travel Confirmed" };
      case 'arrived': return { percent: 60, label: "Arrived in India" };
      case 'treatment_in_progress': return { percent: 75, label: "In Treatment" };
      case 'discharged': return { percent: 90, label: "Discharged" };
      case 'follow_up': return { percent: 95, label: "Follow-up" };
      case 'completed': return { percent: 100, label: "Journey Completed" };
      default: return { percent: 0, label: "None" };
    }
  };

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

        <div className="flex gap-4">
          <button
            onClick={handleExportCSV}
            className="bg-slate-900 border border-slate-800 hover:border-blue-500 px-6 py-4 rounded-2xl flex items-center gap-3 transition font-semibold"
          >
            Export CSV
          </button>
          <button
            id="add-patient-btn"
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-2xl flex items-center gap-3 transition font-semibold"
          >
            <Plus size={20} />
            Add Patient
          </button>
        </div>
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
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
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
              <thead className="bg-slate-900 border-b border-slate-800">
                <tr>
                  <th className="text-left px-6 py-5 text-slate-400 font-medium text-sm">Patient</th>
                  <th className="text-left px-6 py-5 text-slate-400 font-medium text-sm">Portal Access</th>
                  <th className="text-left px-6 py-5 text-slate-400 font-medium text-sm">Protection</th>
                  <th className="text-left px-6 py-5 text-slate-400 font-medium text-sm">Risk</th>
                  <th className="text-left px-6 py-5 text-slate-400 font-medium text-sm">Balance Due</th>
                  <th className="text-left px-6 py-5 text-slate-400 font-medium text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPatients.map((patient) => {
                  const mapping = patient.patient_auth_mapping;
                  const safety = patient.patient_safety_profiles;
                  
                  const portalStatus = mapping?.portal_access_status || "NOT_ENABLED";
                  const lastInviteDate = mapping?.invite_sent_at ? new Date(mapping.invite_sent_at).toLocaleDateString() : "Never";
                  const lastLoginDate = patient.auth_user?.last_sign_in_at ? new Date(patient.auth_user.last_sign_in_at).toLocaleDateString() : "Never";
                  const passwordSet = portalStatus === "ACTIVE" || portalStatus === "SUSPENDED";
                  
                  const protectionStatusStr = safety?.protection_status || "NOT_ACTIVATED";
                  const journeyStageStr = safety?.journey_stage || "initial";
                  
                  const activeAssignment = patient.coordinator_assignments?.find(c => c.is_active);
                  const coordinatorName = activeAssignment?.official_coordinators?.full_name || "None Assigned";
                  
                  const currentRisk = patient.risk_assessments?.find(r => r.is_current);
                  const riskLevelStr = currentRisk?.risk_level || "normal";
                  
                  // Parse financials
                  let estimatedCost = 0;
                  let paidAmount = 0;
                  let currency = "USD";
                  let invoiceStatus = "UNPAID";
                  
                  try {
                    const finData = JSON.parse(patient?.notes || "{}");
                    if (finData.estimated_cost !== undefined) {
                      estimatedCost = Number(finData.estimated_cost) || 0;
                      paidAmount = Number(finData.paid_amount) || 0;
                      currency = finData.currency || "USD";
                      invoiceStatus = finData.invoice_status || "UNPAID";
                    }
                  } catch (e) {}
                  
                  const outstandingBalance = estimatedCost - paidAmount;
                  
                  const formatVal = (val: number) => {
                    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(val);
                  };
                  
                  const totalCostFormatted = formatVal(estimatedCost);
                  const paidAmountFormatted = formatVal(paidAmount);
                  const outstandingFormatted = formatVal(outstandingBalance);
                  
                  const stageProgress = getStageProgress(journeyStageStr);
                  const isExpanded = !!expandedRows[patient.id];

                  return (
                    <Fragment key={patient.id}>
                      <tr
                        className={`border-b border-slate-800 hover:bg-slate-900/40 transition cursor-pointer select-none`}
                        onClick={() => toggleRow(patient.id)}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            {isExpanded ? <ChevronUp size={18} className="text-blue-400" /> : <ChevronDown size={18} className="text-slate-500" />}
                            <div>
                              <h3 className="font-semibold text-white">
                                {patient.full_name || "Unknown"}
                              </h3>
                              <p className="text-slate-500 text-xs mt-0.5">
                                {patient.email} • {patient.country || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getPortalStatusColor(portalStatus)}`}>
                            {portalStatus.replace("_", " ")}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getProtectionStatusColor(protectionStatusStr)}`}>
                            {protectionStatusStr.replace("_", " ")}
                          </span>
                        </td>

                        <td className={`px-6 py-5 text-sm uppercase tracking-wider font-semibold ${getRiskColor(riskLevelStr)}`}>
                          {riskLevelStr}
                        </td>

                        <td className="px-6 py-5 text-sm font-semibold text-white">
                          {outstandingBalance > 0 ? (
                            <span className="text-yellow-400">{outstandingFormatted}</span>
                          ) : (
                            <span className="text-green-400">Paid</span>
                          )}
                        </td>

                        <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/patient/${patient.id}`}
                              className="bg-slate-900 border border-slate-800 hover:border-blue-500 p-2.5 rounded-xl inline-flex transition text-slate-400 hover:text-white"
                            >
                              <Eye size={16} />
                            </Link>
                          </div>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-slate-900/30 border-b border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                          <td colSpan={6} className="px-8 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
                              {/* Section 1: Portal & Auth */}
                              <div className="space-y-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Portal & Access</h4>
                                <div className="flex justify-between text-slate-300">
                                  <span>Portal Access:</span>
                                  <span className="font-semibold text-white">{portalStatus.replace("_", " ")}</span>
                                </div>
                                <div className="flex justify-between text-slate-300">
                                  <span>Last Invite:</span>
                                  <span>{lastInviteDate}</span>
                                </div>
                                <div className="flex justify-between text-slate-300">
                                  <span>Last Login:</span>
                                  <span>{lastLoginDate}</span>
                                </div>
                                <div className="flex justify-between text-slate-300">
                                  <span>Password Created:</span>
                                  <span className={passwordSet ? "text-green-400 font-semibold" : "text-red-400"}>
                                    {passwordSet ? "Yes" : "No"}
                                  </span>
                                </div>
                              </div>

                              {/* Section 2: Safety & Case */}
                              <div className="space-y-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Safety & Monitoring</h4>
                                <div className="flex justify-between text-slate-300">
                                  <span>Protection Status:</span>
                                  <span className="font-semibold text-white">{protectionStatusStr.replace("_", " ")}</span>
                                </div>
                                <div className="flex justify-between text-slate-300">
                                  <span>Journey Stage:</span>
                                  <span className="capitalize">{journeyStageStr.replace("_", " ")}</span>
                                </div>
                                <div className="flex justify-between text-slate-300">
                                  <span>Risk level:</span>
                                  <span className={`font-semibold uppercase ${getRiskColor(riskLevelStr)}`}>{riskLevelStr}</span>
                                </div>
                              </div>

                              {/* Section 3: Partner Info */}
                              <div className="space-y-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Assignments</h4>
                                <div className="flex justify-between text-slate-300">
                                  <span>Partner Hospital:</span>
                                  <span className="truncate max-w-[150px] font-medium text-white">{patient.assigned_hospital || "Not Assigned"}</span>
                                </div>
                                <div className="flex justify-between text-slate-300">
                                  <span>Assigned Coordinator:</span>
                                  <span className="font-medium text-white">{coordinatorName}</span>
                                </div>
                              </div>

                              {/* Section 4: Financial Balance & Timeline */}
                              <div className="space-y-3">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Financials & Timeline</h4>
                                <div className="flex justify-between text-slate-300 text-xs">
                                  <span>Est Cost: {totalCostFormatted}</span>
                                  <span>Paid: {paidAmountFormatted}</span>
                                </div>
                                <div className="flex justify-between text-slate-300 border-t border-slate-800 pt-1 mt-1 text-xs">
                                  <span className="font-semibold">Outstanding Due:</span>
                                  <span className={`font-semibold ${outstandingBalance > 0 ? "text-yellow-400" : "text-green-400"}`}>
                                    {outstandingFormatted}
                                  </span>
                                </div>
                                <div className="pt-2 border-t border-slate-800">
                                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                                    <span>Timeline Progress</span>
                                    <span>{stageProgress.percent}%</span>
                                  </div>
                                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${stageProgress.percent}%` }} />
                                  </div>
                                  <p className="text-[10px] text-slate-500 mt-1 truncate">{stageProgress.label}</p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center px-8 py-5 bg-slate-900 border-t border-slate-800">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition text-sm font-semibold"
                >
                  Previous
                </button>
                <span className="text-slate-400 text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition text-sm font-semibold"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
