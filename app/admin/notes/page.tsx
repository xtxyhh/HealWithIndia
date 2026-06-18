export default function NotesPage() {
  const notes = [
    {
      patient: "John Smith",
      note: "Patient requested updated quotation for bypass surgery.",
      date: "17 June 2026",
    },

    {
      patient: "Sarah Johnson",
      note: "Visa approved. Arrival expected next week.",
      date: "16 June 2026",
    },

    {
      patient: "Ahmed Ali",
      note: "Waiting for latest medical reports.",
      date: "15 June 2026",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-3">

          Patient Notes

        </h1>

        <p className="text-slate-400 mb-10">

          Internal notes and updates.

        </p>

        <div className="space-y-6">

          {notes.map((note) => (

            <div
              key={note.patient}
              className="bg-slate-950 border border-slate-800 rounded-3xl p-8"
            >

              <div className="flex justify-between items-center">

                <h2 className="text-2xl font-bold">

                  {note.patient}

                </h2>

                <span className="text-slate-500">

                  {note.date}

                </span>

              </div>

              <p className="mt-6 text-slate-300 leading-relaxed">

                {note.note}

              </p>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}