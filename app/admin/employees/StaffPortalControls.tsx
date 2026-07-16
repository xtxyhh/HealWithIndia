"use client";

import { useState } from "react";
import { ShieldCheck, Mail, Lock, Unlock, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface StaffPortalControlsProps {
  staffId: string;
  staffEmail: string;
  currentRole?: string;
  portalStatus?: string;
  authUserId?: string;
}

export default function StaffPortalControls({ 
  staffId, 
  staffEmail, 
  currentRole = "Sales Executive",
  portalStatus = "NOT_ENABLED",
  authUserId 
}: StaffPortalControlsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(portalStatus);
  const [role, setRole] = useState(currentRole);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleAction = async (action: string, payload?: any) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/staff/portal-access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staff_id: staffId,
          action,
          ...payload
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update staff portal access");
        return;
      }

      if (data.portal_status) {
        setStatus(data.portal_status);
      }
      if (data.role) {
        setRole(data.role);
      }
    } catch (error) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "text-blue-400";
      case "safety_operator": return "text-green-400";
      case "super_admin": return "text-purple-400";
      default: return "text-slate-400";
    }
  };

  return (
    <div className="space-y-4">
      {/* PORTAL STATUS */}
      <div className="flex justify-between items-center">
        <span className="text-slate-400">Portal Status</span>
        <span className={`font-semibold ${getPortalStatusColor(status)}`}>
          {status.replace("_", " ")}
        </span>
      </div>

      {/* EMAIL */}
      <div className="flex justify-between items-center">
        <span className="text-slate-400">Email</span>
        <span className="text-slate-300">{staffEmail}</span>
      </div>

      {/* ROLE */}
      <div className="flex justify-between items-center">
        <span className="text-slate-400">Role</span>
        <span className={`font-semibold ${getRoleColor(role)}`}>
          {role.replace("_", " ")}
        </span>
      </div>

      {/* AUTH ACCOUNT */}
      <div className="flex justify-between items-center">
        <span className="text-slate-400">Auth Account</span>
        <span className="text-slate-300">
          {authUserId ? "Linked" : "Not Linked"}
        </span>
      </div>

      {error && (
        <div className="rounded-[20px] border border-red-500/20 bg-red-500/10 text-red-400 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex gap-3 pt-4">
        {status === "NOT_ENABLED" && (
          <button
            onClick={() => handleAction("invite", { 
              email: staffEmail, 
              full_name: staffEmail.split("@")[0],
              role: role.toLowerCase() === "admin" ? "admin" : "safety_operator"
            })}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
          >
            {loading ? "Processing..." : "Invite Staff"}
          </button>
        )}

        {status === "INVITE_PENDING" && (
          <>
            <button
              onClick={() => handleAction("resend")}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
            >
              {loading ? "Processing..." : "Resend Invite"}
            </button>
            <button
              onClick={() => handleAction("suspend")}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
            >
              {loading ? "Processing..." : "Suspend"}
            </button>
          </>
        )}

        {status === "ACTIVE" && (
          <>
            <button
              onClick={() => setShowRoleModal(true)}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
            >
              {loading ? "Processing..." : "Change Role"}
            </button>
            <button
              onClick={() => handleAction("suspend")}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
            >
              {loading ? "Processing..." : "Suspend"}
            </button>
          </>
        )}

        {status === "SUSPENDED" && (
          <button
            onClick={() => handleAction("restore")}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
          >
            {loading ? "Processing..." : "Restore Access"}
          </button>
        )}
      </div>

      {/* ROLE CHANGE MODAL */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Change Staff Role</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  handleAction("change_role", { role: "admin" });
                  setShowRoleModal(false);
                }}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition"
              >
                Admin
              </button>
              <button
                onClick={() => {
                  handleAction("change_role", { role: "safety_operator" });
                  setShowRoleModal(false);
                }}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-50 transition"
              >
                Safety Operator
              </button>
              <button
                onClick={() => setShowRoleModal(false)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
