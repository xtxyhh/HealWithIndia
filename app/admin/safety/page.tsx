import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";

import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle,
  ArrowRight,
  Filter,
} from "lucide-react";

export default async function SafetyOperationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Server-side authorization check - only allow authorized admins
  // Use trusted app_metadata (not user-editable user_metadata)
  const appMetadata = user.app_metadata;
  const isAdmin = appMetadata?.role === "admin" || appMetadata?.role === "super_admin" || appMetadata?.role === "safety_operator";

  if (!isAdmin) {
    return (
      <main className="p-10 text-white">
        <h1 className="text-4xl font-bold text-red-400">
          Access Denied
        </h1>
        <p className="text-slate-400 mt-4">
          You do not have permission to access safety operations.
        </p>
      </main>
    );
  }

  // Fetch safety cases with patient info (limited to prevent data leakage)
  const { data: safetyCases, error: casesError } = await supabase
    .from("safety_cases")
    .select(`
      id,
      category,
      priority,
      status,
      description,
      created_at,
      assigned_coordinator_id,
      patient_id,
      patients (
        id,
        full_name,
        country
      )
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  // Fetch fraud reports
  const { data: fraudReports, error: fraudError } = await supabase
    .from("fraud_reports")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (casesError || fraudError) {
    return (
      <main className="p-10 text-white">
        <h1 className="text-4xl font-bold text-white">
          Failed to load safety data
        </h1>
        <p className="text-red-400 mt-4">
          {(casesError?.message || "") + (fraudError?.message || "")}
        </p>
      </main>
    );
  }

  const activeCases = safetyCases?.filter(c => c.status !== "closed" && c.status !== "resolved") || [];
  const criticalCases = activeCases.filter(c => c.priority === "critical");
  const highPriorityCases = activeCases.filter(c => c.priority === "high");
  const unacknowledgedCases = activeCases.filter(c => c.status === "open");

  return (
    <main className="p-10 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Safety Operations</h1>
          <p className="text-slate-400">
            Monitor and manage patient safety cases and fraud reports
          </p>
        </div>
        <Link
          href="/admin"
          className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
        >
          Back to Dashboard
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <ShieldCheck className="text-blue-400" size={24} />
            <span className="text-3xl font-bold">{activeCases.length}</span>
          </div>
          <p className="text-slate-400 text-sm">Active Cases</p>
        </div>

        <div className="bg-slate-950 border border-red-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="text-red-400" size={24} />
            <span className="text-3xl font-bold">{criticalCases.length}</span>
          </div>
          <p className="text-slate-400 text-sm">Critical Priority</p>
        </div>

        <div className="bg-slate-950 border border-orange-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="text-orange-400" size={24} />
            <span className="text-3xl font-bold">{unacknowledgedCases.length}</span>
          </div>
          <p className="text-slate-400 text-sm">Unacknowledged</p>
        </div>

        <div className="bg-slate-950 border border-pink-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <ShieldCheck className="text-pink-400" size={24} />
            <span className="text-3xl font-bold">{fraudReports?.length || 0}</span>
          </div>
          <p className="text-slate-400 text-sm">Fraud Reports</p>
        </div>
      </div>

      {/* Active Cases Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden mb-10">
        <div className="flex justify-between items-center px-8 py-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold">Active Safety Cases</h2>
          <div className="flex items-center gap-2 text-slate-400">
            <Filter size={16} />
            <span className="text-sm">Showing {activeCases.length} active cases</span>
          </div>
        </div>

        {activeCases.length === 0 ? (
          <div className="text-center py-20">
            <ShieldCheck size={70} className="mx-auto text-slate-700" />
            <h2 className="text-2xl font-bold mt-8">No Active Cases</h2>
            <p className="text-slate-400 mt-3">
              All safety cases have been resolved.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900">
                <tr>
                  <th className="text-left px-6 py-4">Patient</th>
                  <th className="text-left px-6 py-4">Category</th>
                  <th className="text-left px-6 py-4">Priority</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Created</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeCases.map((caseItem) => (
                  <tr
                    key={caseItem.id}
                    className="border-b border-slate-800 hover:bg-slate-900/50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">
                          {caseItem.patients?.[0]?.full_name || "Unknown"}
                        </p>
                        <p className="text-slate-500 text-sm">
                          {caseItem.patients?.[0]?.country || "Unknown"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 capitalize">
                      {caseItem.category.replace(/_/g, " ")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        caseItem.priority === "critical" ? "bg-red-500/20 text-red-400" :
                        caseItem.priority === "high" ? "bg-orange-500/20 text-orange-400" :
                        caseItem.priority === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-slate-500/20 text-slate-400"
                      }`}>
                        {caseItem.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        caseItem.status === "open" ? "bg-blue-500/20 text-blue-400" :
                        caseItem.status === "acknowledged" ? "bg-green-500/20 text-green-400" :
                        caseItem.status === "in_progress" ? "bg-purple-500/20 text-purple-400" :
                        "bg-slate-500/20 text-slate-400"
                      }`}>
                        {caseItem.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(caseItem.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/safety/case/${caseItem.id}`}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fraud Reports */}
      <div className="bg-slate-950 border border-pink-800 rounded-2xl overflow-hidden">
        <div className="flex justify-between items-center px-8 py-6 border-b border-pink-800">
          <h2 className="text-2xl font-bold">Fraud Reports</h2>
          <div className="flex items-center gap-2 text-pink-400">
            <ShieldCheck size={16} />
            <span className="text-sm">{fraudReports?.length || 0} reports</span>
          </div>
        </div>

        {(!fraudReports || fraudReports.length === 0) ? (
          <div className="text-center py-20">
            <ShieldCheck size={70} className="mx-auto text-slate-700" />
            <h2 className="text-2xl font-bold mt-8">No Fraud Reports</h2>
            <p className="text-slate-400 mt-3">
              No fraud reports have been submitted.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900">
                <tr>
                  <th className="text-left px-6 py-4">Report Type</th>
                  <th className="text-left px-6 py-4">Priority</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Created</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fraudReports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-slate-800 hover:bg-slate-900/50"
                  >
                    <td className="px-6 py-4 text-slate-300 capitalize">
                      {report.report_type.replace(/_/g, " ")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        report.priority === "critical" ? "bg-red-500/20 text-red-400" :
                        report.priority === "high" ? "bg-orange-500/20 text-orange-400" :
                        "bg-slate-500/20 text-slate-400"
                      }`}>
                        {report.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        report.status === "pending_review" ? "bg-yellow-500/20 text-yellow-400" :
                        report.status === "under_investigation" ? "bg-blue-500/20 text-blue-400" :
                        report.status === "confirmed_fraud" ? "bg-red-500/20 text-red-400" :
                        "bg-slate-500/20 text-slate-400"
                      }`}>
                        {report.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(report.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/safety/fraud/${report.id}`}
                        className="text-pink-400 hover:text-pink-300 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
