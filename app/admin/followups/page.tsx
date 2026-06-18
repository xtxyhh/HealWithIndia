export default function FollowupsPage() {
  const followups = [
    {
      patient: "John Smith",
      country: "USA",
      treatment: "Heart Bypass Surgery",
      nextFollowup: "18 June 2026",
      status: "Pending",
    },

    {
      patient: "Sarah Johnson",
      country: "UK",
      treatment: "IVF Treatment",
      nextFollowup: "20 June 2026",
      status: "Completed",
    },

    {
      patient: "Ahmed Ali",
      country: "UAE",
      treatment: "Kidney Transplant",
      nextFollowup: "21 June 2026",
      status: "Pending",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">

          Follow Ups

        </h1>

        <p className="text-slate-400 mb-10">

          Manage patient follow-up schedules.

        </p>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-800 text-left">

                <th className="py-4">Patient</th>

                <th>Country</th>

                <th>Treatment</th>

                <th>Next Follow Up</th>

                <th>Status</th>

              </tr>

            </thead>

            <tbody>

              {followups.map((item) => (

                <tr
                  key={item.patient}
                  className="border-b border-slate-900"
                >

                  <td className="py-6 font-semibold">

                    {item.patient}

                  </td>

                  <td>{item.country}</td>

                  <td>{item.treatment}</td>

                  <td>{item.nextFollowup}</td>

                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        item.status === "Completed"
                          ? "bg-green-500/20 text-green-400"
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

      </div>

    </main>
  );
}