import { createClient } from "@/lib/supabaseServer";
import { DollarSign } from "lucide-react";
import Link from "next/link";

export default async function RevenuePage() {
  const supabase = await createClient();
  const { data: patients, error } = await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !patients) {
    return (
      <main className="p-10 text-white">
        <h1 className="text-3xl font-bold">Failed to load revenue data</h1>
        <p className="text-red-400 mt-2">{error?.message}</p>
      </main>
    );
  }

  const totalLeads = patients.length;
  const converted = patients.filter(p => ["Converted", "Completed", "Treatment Started", "Hospital Assigned"].includes(p.status || "")).length;

  let totalContractValue = 0;
  let totalPaidRevenue = 0;
  let totalRemainingBalance = 0;

  // Group by Treatment
  const treatmentGroup: Record<string, number> = {};
  // Group by Country
  const countryGroup: Record<string, number> = {};

  patients.forEach(p => {
    let cost = p.estimated_revenue || 0;
    let paid = p.estimated_revenue || 0;

    try {
      const fin = JSON.parse(p.notes || "{}");
      if (fin.estimated_cost !== undefined) {
        cost = Number(fin.estimated_cost) || 0;
        paid = Number(fin.paid_amount) || 0;
      }
    } catch(e) {}

    totalContractValue += cost;
    totalPaidRevenue += paid;
    totalRemainingBalance += (cost - paid);

    const treat = p.treatment || "Other";
    treatmentGroup[treat] = (treatmentGroup[treat] || 0) + paid;

    const country = p.country || "Other";
    countryGroup[country] = (countryGroup[country] || 0) + paid;
  });

  const averageRevenue = converted > 0 ? totalPaidRevenue / converted : 0;

  const topTreatments = Object.entries(treatmentGroup)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topCountries = Object.entries(countryGroup)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="uppercase tracking-[4px] text-blue-400 text-sm font-semibold">CRM Financials</p>
          <h1 className="text-5xl font-bold mt-3">Revenue Dashboard</h1>
          <p className="text-slate-400 mt-3">Dynamic financial pipeline, conversion value, and medical metrics.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <div className="bg-slate-950 border border-slate-800 p-8 rounded-3xl shadow">
          <h2 className="text-slate-500 font-semibold text-sm uppercase tracking-wider">Total Leads</h2>
          <p className="text-5xl font-bold mt-4">{totalLeads}</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-8 rounded-3xl shadow">
          <h2 className="text-slate-500 font-semibold text-sm uppercase tracking-wider">Total Contract Value</h2>
          <p className="text-5xl font-bold mt-4 text-blue-400">${totalContractValue.toLocaleString()}</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-8 rounded-3xl shadow">
          <h2 className="text-slate-500 font-semibold text-sm uppercase tracking-wider">Received Revenue</h2>
          <p className="text-5xl font-bold mt-4 text-green-400">${totalPaidRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-8 rounded-3xl shadow">
          <h2 className="text-slate-500 font-semibold text-sm uppercase tracking-wider">Outstanding Balance</h2>
          <p className="text-5xl font-bold mt-4 text-yellow-500">${totalRemainingBalance.toLocaleString()}</p>
        </div>
      </div>

      {/* Breakdown grids */}
      <div className="grid xl:grid-cols-2 gap-8 mb-10">
        {/* Top Treatments */}
        <div className="bg-slate-950 border border-slate-800 p-8 rounded-[32px]">
          <h2 className="text-2xl font-bold mb-6">Top Treatment Sectors</h2>
          <div className="space-y-4">
            {topTreatments.map(([name, val]) => (
              <div key={name} className="flex justify-between items-center py-3 border-b border-slate-900">
                <span className="text-slate-300 font-medium">{name}</span>
                <span className="text-green-400 font-semibold">${val.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-slate-950 border border-slate-800 p-8 rounded-[32px]">
          <h2 className="text-2xl font-bold mb-6">Top Market Countries</h2>
          <div className="space-y-4">
            {topCountries.map(([name, val]) => (
              <div key={name} className="flex justify-between items-center py-3 border-b border-slate-900">
                <span className="text-slate-300 font-medium">{name}</span>
                <span className="text-green-400 font-semibold">${val.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Revenue List */}
      <div className="bg-slate-950 border border-slate-800 rounded-[32px] overflow-hidden">
        <div className="px-8 py-7 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Patient Billings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-6 py-5 text-slate-400 font-medium text-sm">Patient</th>
                <th className="px-6 py-5 text-slate-400 font-medium text-sm">Country</th>
                <th className="px-6 py-5 text-slate-400 font-medium text-sm">Treatment</th>
                <th className="px-6 py-5 text-slate-400 font-medium text-sm">Status</th>
                <th className="px-6 py-5 text-slate-400 font-medium text-sm">Estimated Revenue</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p.id} className="border-b border-slate-800 hover:bg-slate-900/50 transition">
                  <td className="px-6 py-5">
                    <Link href={`/admin/patient/${p.id}`} className="font-semibold hover:text-blue-400">
                      {p.full_name || "Unknown"}
                    </Link>
                  </td>
                  <td className="px-6 py-5 text-slate-300 text-sm">{p.country || "—"}</td>
                  <td className="px-6 py-5 text-slate-300 text-sm">{p.treatment || "—"}</td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300">
                      {p.status || "New"}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-green-400 font-semibold">${(p.estimated_revenue || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}