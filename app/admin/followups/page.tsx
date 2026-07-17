import { createClient } from "@/lib/supabaseServer";
import Link from "next/link";

export default async function FollowupsPage() {
  const supabase = await createClient();
  const { data: patients, error } = await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !patients) {
    return (
      <main className="p-10 text-white">
        <h1 className="text-3xl font-bold">Failed to load follow-up schedule</h1>
        <p className="text-red-400 mt-2">{error?.message}</p>
      </main>
    );
  }

  // Derive followups: patients who are in "Converted", "Completed", "Treatment Started", "Hospital Assigned"
  const activePatients = patients.filter(p => ["Converted", "Completed", "Treatment Started", "Hospital Assigned"].includes(p.status || ""));

  const followups = activePatients.map(p => {
    const createdAt = new Date(p.created_at);
    // Followup date is 30 days after creation
    const followupDate = new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000);
    const isOverdue = followupDate.getTime() < new Date().getTime();
    
    return {
      id: p.id,
      patient: p.full_name || "Unknown Patient",
      country: p.country || "—",
      treatment: p.treatment || "—",
      nextFollowup: followupDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: p.status === "Completed" ? "Completed" : isOverdue ? "Overdue" : "Scheduled",
    };
  });

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto">
        <p className="uppercase tracking-[4px] text-blue-400 text-sm font-semibold">Operations</p>
        <h1 className="text-5xl font-bold mt-3 mb-2">Follow Ups</h1>
        <p className="text-slate-400 mb-10">Manage and track dynamic patient follow-up schedules automatically.</p>

        <div className="bg-slate-950 border border-slate-800 rounded-[32px] overflow-hidden">
          {followups.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">No active follow-ups scheduled at this time.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900">
                  <tr className="border-b border-slate-800">
                    <th className="px-6 py-5 text-slate-400 font-medium text-sm">Patient</th>
                    <th className="px-6 py-5 text-slate-400 font-medium text-sm">Country</th>
                    <th className="px-6 py-5 text-slate-400 font-medium text-sm">Treatment</th>
                    <th className="px-6 py-5 text-slate-400 font-medium text-sm">Next Follow Up</th>
                    <th className="px-6 py-5 text-slate-400 font-medium text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {followups.map((item) => (
                    <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-900/50 transition">
                      <td className="px-6 py-5">
                        <Link href={`/admin/patient/${item.id}`} className="font-semibold hover:text-blue-400">
                          {item.patient}
                        </Link>
                      </td>
                      <td className="px-6 py-5 text-slate-300 text-sm">{item.country}</td>
                      <td className="px-6 py-5 text-slate-300 text-sm">{item.treatment}</td>
                      <td className="px-6 py-5 text-slate-300 text-sm">{item.nextFollowup}</td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                            item.status === "Completed"
                              ? "bg-green-500/20 text-green-400"
                              : item.status === "Overdue"
                              ? "bg-red-500/20 text-red-400 animate-pulse"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}