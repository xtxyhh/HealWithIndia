import { supabase } from "../../../../lib/supabase";

export default async function PatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: patient } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .single();

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Patient Not Found
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-8">

        <h1 className="text-4xl font-bold mb-8">
          Patient Details
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <strong>Name:</strong>
            <p>{patient.full_name}</p>
          </div>

          <div>
            <strong>Email:</strong>
            <p>{patient.email}</p>
          </div>

          <div>
            <strong>Phone:</strong>
            <p>{patient.phone || "Not provided"}</p>
          </div>

          <div>
            <strong>Country:</strong>
            <p>{patient.country}</p>
          </div>

          <div>
            <strong>Treatment:</strong>
            <p>{patient.treatment}</p>
          </div>

          <div>
            <strong>Status:</strong>
            <p>{patient.status || "New"}</p>
          </div>

          <div>
            <strong>Assigned Hospital:</strong>
            <p>
              {patient.assigned_hospital ||
                "Not Assigned"}
            </p>
          </div>

          <div>
            <strong>Estimated Revenue:</strong>
            <p>
              $
              {patient.estimated_revenue || 0}
            </p>
          </div>

        </div>

        <div className="mt-8">
          <strong>Description:</strong>

          <div className="bg-slate-50 p-4 rounded-xl mt-2">
            {patient.description}
          </div>
        </div>

        <div className="mt-8">
          <strong>Internal Notes:</strong>

          <div className="bg-yellow-50 p-4 rounded-xl mt-2 min-h-24">
            {patient.notes || "No notes yet"}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">

          <a
            href={`mailto:${patient.email}`}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl"
          >
            Email Patient
          </a>

          {patient.phone && (
            <a
              href={`https://wa.me/${patient.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-5 py-3 rounded-xl"
            >
              WhatsApp Patient
            </a>
          )}

          {patient.report_url && (
            <a
              href={patient.report_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 text-white px-5 py-3 rounded-xl"
            >
              Medical Report
            </a>
          )}

        </div>

      </div>

    </div>
  );
}