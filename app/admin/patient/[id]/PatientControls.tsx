"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  UserPlus, 
  Lock, 
  Unlock, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Settings, 
  DollarSign, 
  X, 
  UserCheck, 
  Building, 
  Activity, 
  AlertOctagon 
} from "lucide-react";

interface PatientControlsProps {
  patientId: string;
  patientEmail: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  portalAccess: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protectionStatus: any;
  financials: {
    estimatedCost: number;
    paidAmount: number;
    currency: string;
    invoiceStatus: string;
    notesText: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hospitals: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coordinators: any[];
  assignedCoordinatorId: string;
  riskLevel: string;
  journeyStage: string;
  patientName: string;
  patientPhone: string | null;
  patientCountry: string | null;
  patientTreatment: string | null;
  assignedHospital: string | null;
}

export default function PatientControls({
  patientId,
  patientEmail,
  portalAccess,
  protectionStatus,
  financials,
  hospitals,
  coordinators,
  assignedCoordinatorId,
  riskLevel,
  journeyStage,
  patientName,
  patientPhone,
  patientCountry,
  patientTreatment,
  assignedHospital
}: PatientControlsProps) {
  const router = useRouter();

  const [portalLoading, setPortalLoading] = useState(false);
  const [protectionLoading, setProtectionLoading] = useState(false);
  const [portalError, setPortalError] = useState("");
  const [protectionError, setProtectionError] = useState("");
  const [portalStatus, setPortalStatus] = useState(portalAccess?.portal_access_status || "NOT_ENABLED");
  const [protectionState, setProtectionState] = useState(protectionStatus?.protection_status || "NOT_ACTIVATED");

  const [showFinModal, setShowFinModal] = useState(false);
  const [cost, setCost] = useState(financials?.estimatedCost || 0);
  const [paid, setPaid] = useState(financials?.paidAmount || 0);
  const [curr, setCurr] = useState(financials?.currency || "USD");
  const [invStatus, setInvStatus] = useState(financials?.invoiceStatus || "UNPAID");
  const [notes, setNotes] = useState(financials?.notesText || "");
  const [finLoading, setFinLoading] = useState(false);
  const [finError, setFinError] = useState("");

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [name, setName] = useState(patientName || "");
  const [phone, setPhone] = useState(patientPhone || "");
  const [country, setCountry] = useState(patientCountry || "");
  const [treatment, setTreatment] = useState(patientTreatment || "");
  const [hospital, setHospital] = useState(assignedHospital || "");
  const [coordinatorId, setCoordinatorId] = useState(assignedCoordinatorId || "none");
  const [stage, setStage] = useState(journeyStage || "initial");
  const [risk, setRisk] = useState(riskLevel || "normal");
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const showSuccessMsg = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  // Sync state with updated server props
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPortalStatus(portalAccess?.portal_access_status || "NOT_ENABLED");
  }, [portalAccess]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProtectionState(protectionStatus?.protection_status || "NOT_ACTIVATED");
  }, [protectionStatus]);

  useEffect(() => {
    if (financials) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCost(financials.estimatedCost);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPaid(financials.paidAmount);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurr(financials.currency);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInvStatus(financials.invoiceStatus);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotes(financials.notesText);
    }
  }, [financials]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(patientName || "");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhone(patientPhone || "");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCountry(patientCountry || "");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTreatment(patientTreatment || "");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHospital(assignedHospital || "");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCoordinatorId(assignedCoordinatorId || "none");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStage(journeyStage || "initial");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRisk(riskLevel || "normal");
  }, [patientName, patientPhone, patientCountry, patientTreatment, assignedHospital, assignedCoordinatorId, journeyStage, riskLevel]);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#edit-details") {
        setShowDetailsModal(true);
      }
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    window.history.pushState("", document.title, window.location.pathname + window.location.search);
  };

  const handlePortalAction = async (action: string) => {
    setPortalLoading(true);
    setPortalError("");

    try {
      const response = await fetch(`/api/admin/patient/portal-access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          action,
          auth_user_id: portalAccess?.auth_user_id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setPortalError(data.error || "Failed to update portal access");
        return;
      }

      setPortalStatus(data.portal_access_status);
      showSuccessMsg(`Portal access successfully updated to ${data.portal_access_status.replace('_', ' ')}!`);
      router.refresh();
    } catch (error) {
      setPortalError("Network error occurred");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleProtectionAction = async (action: string) => {
    setProtectionLoading(true);
    setProtectionError("");

    try {
      const response = await fetch(`/api/admin/patient/protection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          action
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setProtectionError(data.error || "Failed to update protection status");
        return;
      }

      setProtectionState(data.protection_status);
      showSuccessMsg(`Smart Tourist Protection status updated to ${data.protection_status}!`);
      router.refresh();
    } catch (error) {
      setProtectionError("Network error occurred");
    } finally {
      setProtectionLoading(false);
    }
  };

  const handleSaveFinancials = async () => {
    setFinLoading(true);
    setFinError("");
    try {
      const res = await fetch("/api/admin/patient/financials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          estimated_cost: cost,
          paid_amount: paid,
          currency: curr,
          invoice_status: invStatus,
          notes_text: notes
        })
      });
      const data = await res.json();
      if (res.ok) {
        setShowFinModal(false);
        showSuccessMsg("Patient contract billings updated successfully!");
        router.refresh();
      } else {
        setFinError(data.error || "Failed to save financials");
      }
    } catch (e) {
      setFinError("Network error saving financials");
    } finally {
      setFinLoading(false);
    }
  };

  const handleSaveDetails = async () => {
    setDetailsLoading(true);
    setDetailsError("");
    try {
      const res = await fetch("/api/admin/patient/financials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          full_name: name,
          phone,
          country,
          treatment,
          assigned_hospital: hospital,
          assigned_coordinator_id: coordinatorId,
          journey_stage: stage,
          risk_level: risk,
          // maintain financials
          estimated_cost: cost,
          paid_amount: paid,
          currency: curr,
          invoice_status: invStatus,
          notes_text: notes
        })
      });
      const data = await res.json();
      if (res.ok) {
        handleCloseDetailsModal();
        showSuccessMsg("Patient profile details updated successfully!");
        router.refresh();
      } else {
        setDetailsError(data.error || "Failed to save patient details");
      }
    } catch (e) {
      setDetailsError("Network error saving patient details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const getPortalStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "text-green-400";
      case "INVITE_PENDING": return "text-yellow-400";
      case "SUSPENDED": return "text-red-400";
      default: return "text-slate-400";
    }
  };

  const getProtectionStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "text-green-400";
      case "PREPARING": return "text-blue-400";
      case "COMPLETED": return "text-cyan-400";
      case "SUSPENDED": return "text-red-400";
      default: return "text-slate-400";
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Toast Alert */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl border border-green-500/20 bg-green-950/85 backdrop-blur-md text-green-400 px-6 py-4 shadow-2xl animate-in fade-in slide-in-from-top-6 duration-300 flex items-center gap-3">
          <CheckCircle size={22} className="text-green-400" />
          <span className="font-semibold text-sm">{successMessage}</span>
        </div>
      )}

      {/* PORTAL ACCESS SECTION */}
      <div className="rounded-[36px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <UserPlus size={28} className="text-blue-400" />
          <h2 className="text-2xl font-bold">Patient Portal Access</h2>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Status</span>
            <span className={`font-semibold ${getPortalStatusColor(portalStatus)}`}>
              {portalStatus.replace("_", " ")}
            </span>
          </div>

          {patientEmail && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Linked Account</span>
              <span className="text-slate-300 truncate max-w-[200px]">{patientEmail}</span>
            </div>
          )}

          {portalError && (
            <div className="rounded-[20px] border border-red-500/20 bg-red-500/10 text-red-400 px-4 py-3 text-sm">
              {portalError}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {portalStatus === "NOT_ENABLED" && (
              <button
                onClick={() => handlePortalAction("enable")}
                disabled={portalLoading || !patientEmail}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
              >
                {portalLoading ? "Processing..." : "Enable Patient Portal"}
              </button>
            )}

            {portalStatus === "INVITE_PENDING" && (
              <>
                <button
                  onClick={() => handlePortalAction("resend")}
                  disabled={portalLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                >
                  {portalLoading ? "Processing..." : "Resend Invite"}
                </button>
                <button
                  onClick={() => handlePortalAction("suspend")}
                  disabled={portalLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                >
                  {portalLoading ? "Processing..." : "Suspend Access"}
                </button>
              </>
            )}

            {portalStatus === "ACTIVE" && (
              <button
                onClick={() => handlePortalAction("suspend")}
                disabled={portalLoading}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
              >
                {portalLoading ? "Processing..." : "Suspend Access"}
              </button>
            )}

            {portalStatus === "SUSPENDED" && (
              <button
                onClick={() => handlePortalAction("restore")}
                disabled={portalLoading}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
              >
                {portalLoading ? "Processing..." : "Restore Access"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SMART TOURIST PROTECTION SECTION */}
      <div className="rounded-[36px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck size={28} className="text-green-400" />
          <h2 className="text-2xl font-bold">Smart Tourist Protection</h2>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Status</span>
            <span className={`font-semibold ${getProtectionStatusColor(protectionState)}`}>
              {protectionState.replace("_", " ")}
            </span>
          </div>

          {protectionError && (
            <div className="rounded-[20px] border border-red-500/20 bg-red-500/10 text-red-400 px-4 py-3 text-sm">
              {protectionError}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {protectionState === "NOT_ACTIVATED" && (
              <button
                onClick={() => handleProtectionAction("activate")}
                disabled={protectionLoading}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
              >
                {protectionLoading ? "Processing..." : "Activate Protection"}
              </button>
            )}

            {protectionState === "PREPARING" && (
              <>
                <button
                  onClick={() => handleProtectionAction("activate")}
                  disabled={protectionLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                >
                  {protectionLoading ? "Processing..." : "Activate Protection"}
                </button>
                <button
                  onClick={() => handleProtectionAction("suspend")}
                  disabled={protectionLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                >
                  {protectionLoading ? "Processing..." : "Suspend Protection"}
                </button>
              </>
            )}

            {protectionState === "ACTIVE" && (
              <>
                <button
                  onClick={() => handleProtectionAction("suspend")}
                  disabled={protectionLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                >
                  {protectionLoading ? "Processing..." : "Suspend Protection"}
                </button>
                <button
                  onClick={() => handleProtectionAction("complete")}
                  disabled={protectionLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                >
                  {protectionLoading ? "Processing..." : "Complete Journey"}
                </button>
              </>
            )}

            {protectionState === "SUSPENDED" && (
              <button
                onClick={() => handleProtectionAction("activate")}
                disabled={protectionLoading}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
              >
                {protectionLoading ? "Processing..." : "Restore Protection"}
              </button>
            )}

            {protectionState === "COMPLETED" && (
              <div className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 text-slate-400">
                <CheckCircle size={20} />
                Journey Completed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OPERATIONS ACTIONS */}
      <div className="rounded-[36px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Settings size={28} className="text-yellow-400" />
          <h2 className="text-2xl font-bold">CRM Quick Operations</h2>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => setShowDetailsModal(true)}
            className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition font-semibold text-white text-sm"
          >
            Edit Profile details (Timeline, Risk, Coordinator)
          </button>
          
          <button
            onClick={() => setShowFinModal(true)}
            className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-yellow-600 hover:bg-yellow-500 transition font-semibold text-white text-sm"
          >
            Edit Billings & Financials
          </button>
        </div>
      </div>

      {/* FINANCIAL EDIT MODAL */}
      {showFinModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 bg-slate-900 flex justify-between items-center border-b border-slate-800">
              <h3 className="text-2xl font-bold">Edit Contract Billings</h3>
              <button onClick={() => setShowFinModal(false)} className="text-slate-400 hover:text-white transition"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              {finError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 px-4 py-3 text-sm">
                  {finError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-xs font-semibold">Currency</label>
                  <select
                    value={curr}
                    onChange={e => setCurr(e.target.value)}
                    className="w-full mt-2 bg-black border border-slate-800 rounded-xl px-4 py-3 outline-none text-sm text-slate-300"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs font-semibold">Invoice Status</label>
                  <select
                    value={invStatus}
                    onChange={e => setInvStatus(e.target.value)}
                    className="w-full mt-2 bg-black border border-slate-800 rounded-xl px-4 py-3 outline-none text-sm text-slate-300"
                  >
                    <option value="UNPAID">UNPAID</option>
                    <option value="PARTIALLY_PAID">PARTIALLY PAID</option>
                    <option value="PAID">PAID</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs font-semibold">Estimated Cost</label>
                <input
                  type="number"
                  value={cost}
                  onChange={e => setCost(Number(e.target.value))}
                  className="w-full mt-2 bg-black border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs font-semibold">Paid Amount</label>
                <input
                  type="number"
                  value={paid}
                  onChange={e => setPaid(Number(e.target.value))}
                  className="w-full mt-2 bg-black border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs font-semibold">Internal Notes / Case Summary</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={4}
                  className="w-full mt-2 bg-black border border-slate-800 rounded-xl p-4 outline-none focus:border-blue-500 text-sm text-white resize-none"
                  placeholder="Case notes..."
                />
              </div>
            </div>
            <div className="px-8 py-5 bg-slate-900 border-t border-slate-800 flex justify-end gap-4">
              <button onClick={() => setShowFinModal(false)} className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold text-sm transition">Cancel</button>
              <button onClick={handleSaveFinancials} disabled={finLoading} className="px-6 py-3 rounded-xl bg-yellow-600 hover:bg-yellow-500 font-semibold text-sm transition">
                {finLoading ? "Saving..." : "Save Contract"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PATIENT DETAILS EDIT MODAL */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 bg-slate-900 flex justify-between items-center border-b border-slate-800">
              <h3 className="text-2xl font-bold">Edit Patient Details</h3>
              <button onClick={handleCloseDetailsModal} className="text-slate-400 hover:text-white transition"><X size={24} /></button>
            </div>
            
            <div className="p-8 space-y-5 max-h-[60vh] overflow-y-auto">
              {detailsError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 px-4 py-3 text-sm">
                  {detailsError}
                </div>
              )}

              <div>
                <label className="text-slate-400 text-xs font-semibold">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full mt-2 bg-black border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-xs font-semibold">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full mt-2 bg-black border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs font-semibold">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full mt-2 bg-black border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-xs font-semibold">Treatment Department</label>
                  <input
                    type="text"
                    value={treatment}
                    onChange={e => setTreatment(e.target.value)}
                    className="w-full mt-2 bg-black border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs font-semibold">Assigned Hospital</label>
                  <select
                    value={hospital}
                    onChange={e => setHospital(e.target.value)}
                    className="w-full mt-2 bg-black border border-slate-800 rounded-xl px-4 py-3 outline-none text-sm text-slate-300"
                  >
                    <option value="">Not Assigned</option>
                    {hospitals.map(h => (
                      <option key={h.id} value={h.name}>{h.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-xs font-semibold">Assigned Coordinator</label>
                  <select
                    value={coordinatorId}
                    onChange={e => setCoordinatorId(e.target.value)}
                    className="w-full mt-2 bg-black border border-slate-800 rounded-xl px-4 py-3 outline-none text-sm text-slate-300"
                  >
                    <option value="none">None Assigned</option>
                    {coordinators.map(c => (
                      <option key={c.id} value={c.id}>{c.full_name} ({c.reference_id})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs font-semibold">Safety Journey Stage</label>
                  <select
                    value={stage}
                    onChange={e => setStage(e.target.value)}
                    className="w-full mt-2 bg-black border border-slate-800 rounded-xl px-4 py-3 outline-none text-sm text-slate-300"
                  >
                    <option value="initial">Initial Consultation</option>
                    <option value="visa_processing">Visa Processing</option>
                    <option value="travel_confirmed">Travel Confirmed</option>
                    <option value="arrived">Arrived in India</option>
                    <option value="treatment_in_progress">Treatment In Progress</option>
                    <option value="discharged">Discharged</option>
                    <option value="follow_up">Follow Up Stage</option>
                    <option value="completed">Completed Journey</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs font-semibold">Safety Risk Level</label>
                <select
                  value={risk}
                  onChange={e => setRisk(e.target.value)}
                  className="w-full mt-2 bg-black border border-slate-800 rounded-xl px-4 py-3 outline-none text-sm text-slate-300"
                >
                  <option value="normal">Normal (Low Risk)</option>
                  <option value="watch">Watch list</option>
                  <option value="elevated">Elevated</option>
                  <option value="high">High Risk</option>
                  <option value="critical">Critical Emergency</option>
                </select>
              </div>
            </div>

            <div className="px-8 py-5 bg-slate-900 border-t border-slate-800 flex justify-end gap-4">
              <button onClick={handleCloseDetailsModal} className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold text-sm transition">Cancel</button>
              <button onClick={handleSaveDetails} disabled={detailsLoading} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm transition">
                {detailsLoading ? "Saving..." : "Save Details"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
