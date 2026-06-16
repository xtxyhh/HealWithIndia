import { supabase } from "../../lib/supabase";
import StatusDropdown from "../../components/StatusDropdown";

export default async function AdminPage() {
  const { data: patients } = await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });

  const totalLeads = patients?.length || 0;

  const newLeads =
    patients?.filter(
      (p) => (p.status || "New") === "New"
    ).length || 0;

  const contactedLeads =
    patients?.filter(
      (p) => p.status === "Contacted"
    ).length || 0;

  const convertedLeads =
    patients?.filter(
      (p) => p.status === "Converted"
    ).length || 0;

  const totalRevenue =
    patients?.reduce(
      (sum, p) =>
        sum + Number(p.estimated_revenue || 0),
      0
    ) || 0;

  return (
    <div className="min-h-screen bg-black text-white p-8">

      <div className="mb-10">
        <p className="uppercase tracking-[4px] text-blue-400 text-sm">
          Admin Dashboard
        </p>

        <h1 className="text-5xl font-bold mt-2">
          HealWithIndia CRM
        </h1>
      </div>

      <div className="grid md:grid-cols-5 gap-6 mb-10">

        <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow">
          <p className="text-gray-500">Total Leads</p>
          <h2 className="text-4xl font-bold mt-2">
            {totalLeads}
          </h2>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow">
          <p className="text-gray-500">New Leads</p>
          <h2 className="text-4xl font-bold mt-2">
            {newLeads}
          </h2>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow">
          <p className="text-gray-500">Contacted</p>
          <h2 className="text-4xl font-bold mt-2">
            {contactedLeads}
          </h2>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow">
          <p className="text-gray-500">Converted</p>
          <h2 className="text-4xl font-bold mt-2">
            {convertedLeads}
          </h2>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow">
          <p className="text-gray-500">Revenue</p>
          <h2 className="text-2xl font-bold mt-2">
            ${totalRevenue}
          </h2>
        </div>

      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow overflow-auto">

        <table className="w-full">

          <thead className="bg-slate-900">
            <tr>
              <th className="text-left p-4 text-slate-300">Name</th>
              <th className="text-left p-4 text-slate-300">Email</th>
              <th className="text-left p-4 text-slate-300">Country</th>
              <th className="text-left p-4 text-slate-300">Treatment</th>
              <th className="text-left p-4 text-slate-300">Hospital</th>
              <th className="text-left p-4 text-slate-300">Revenue</th>
              <th className="text-left p-4 text-slate-300">Description</th>
              <th className="text-left p-4 text-slate-300">Medical Report</th>
              <th className="text-left p-4 text-slate-300">Status</th>
            </tr>
          </thead>

          <tbody>

            {patients?.map((patient) => (
              <tr
                key={patient.id}
                className="border-b border-slate-800 hover:bg-slate-900/50"
              >
                <td className="p-4 font-medium">
                  <a
                    href={`/admin/patient/${patient.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {patient.full_name}
                  </a>
                </td>

                <td className="p-4 text-slate-300">
                  {patient.email}
                </td>

                <td className="p-4 text-slate-300">
                  {patient.country}
                </td>

                <td className="p-4 text-slate-300">
                  {patient.treatment}
                </td>

                <td className="p-4 text-slate-300">
                  {patient.assigned_hospital ||
                    "Unassigned"}
                </td>

                <td className="p-4 text-slate-300">
                  $
                  {patient.estimated_revenue || 0}
                </td>

                <td className="p-4 max-w-xs">
                  <div className="truncate">
                    {patient.description}
                  </div>
                </td>

                <td className="p-4 text-slate-300">
                  {patient.report_url ? (
                    <a
                      href={patient.report_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm"
                    >
                      View Report
                    </a>
                  ) : (
                    <span className="text-gray-400">
                      No File
                    </span>
                  )}
                </td>

                <td className="p-4 text-slate-300">
                  <StatusDropdown
                    patientId={patient.id}
                    currentStatus={
                      patient.status || "New"
                    }
                  />
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}