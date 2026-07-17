"use client";

import { useState } from "react";
import { ShieldCheck, UserPlus, Lock, Unlock, CheckCircle, Clock, AlertCircle, Settings, DollarSign, X } from "lucide-react";

interface PatientControlsProps {
  patientId: string;
  patientEmail: string | null;
  portalAccess: any;
  protectionStatus: any;
  financials: {
    estimatedCost: number;
    paidAmount: number;
    currency: string;
    invoiceStatus: string;
    notesText: string;
  };
}

export default function PatientControls({ patientId, patientEmail, portalAccess, protectionStatus, financials }: PatientControlsProps) {
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
        window.location.reload();
      } else {
        setFinError(data.error || "Failed to save financials");
      }
    } catch (e) {
      setFinError("Network error saving financials");
    } finally {
      setFinLoading(false);
    }
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
    } catch (error) {
      setProtectionError("Network error occurred");
    } finally {
      setProtectionLoading(false);
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
    <div className="space-y-8">
      {/* PORTAL ACCESS SECTION */}
      <div className="rounded-[36px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <UserPlus size={28} className="text-blue-400" />
          <h2 className="text-2xl font-bold">Patient Portal Access</h2>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Status</span>
            <span className={`font-semibold ${getPortalStatusColor(portalStatus)}`}>
              {portalStatus.replace("_", " ")}
            </span>
          </div>

          {patientEmail && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Email</span>
              <span className="text-slate-300">{patientEmail}</span>
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
          <div className="flex justify-between items-center">
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

      {/* FINANCIAL BILLINGS & NOTES SECTION */}
      <div className="rounded-[36px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Settings size={28} className="text-yellow-400" />
          <h2 className="text-2xl font-bold">Billing & Internal Notes</h2>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Total Contract Cost</span>
            <span className="text-slate-200 font-semibold">{curr} {cost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Amount Paid</span>
            <span className="text-green-400 font-semibold">{curr} {paid.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Remaining Balance</span>
            <span className="text-yellow-400 font-semibold">{curr} {(cost - paid).toLocaleString()}</span>
          </div>

          <button
            onClick={() => setShowFinModal(true)}
            className="w-full mt-4 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-yellow-600 hover:bg-yellow-500 transition font-semibold text-white"
          >
            Edit Billings & Notes
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
    </div>
  );
}
