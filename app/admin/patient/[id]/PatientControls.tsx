"use client";

import { useState } from "react";
import { ShieldCheck, UserPlus, Lock, Unlock, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface PatientControlsProps {
  patientId: string;
  patientEmail: string | null;
  portalAccess: any;
  protectionStatus: any;
}

export default function PatientControls({ patientId, patientEmail, portalAccess, protectionStatus }: PatientControlsProps) {
  const [portalLoading, setPortalLoading] = useState(false);
  const [protectionLoading, setProtectionLoading] = useState(false);
  const [portalError, setPortalError] = useState("");
  const [protectionError, setProtectionError] = useState("");
  const [portalStatus, setPortalStatus] = useState(portalAccess?.portal_access_status || "NOT_ENABLED");
  const [protectionState, setProtectionState] = useState(protectionStatus?.protection_status || "NOT_ACTIVATED");

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
    </div>
  );
}
