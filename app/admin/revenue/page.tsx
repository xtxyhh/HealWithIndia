export default function RevenuePage() {
  return (
    <div className="p-10">

      <h1 className="text-4xl font-bold mb-10">
        Revenue Dashboard
      </h1>

      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-slate-950 border border-slate-800 p-8 rounded-3xl shadow">
          <h2 className="text-slate-500">
            Total Leads
          </h2>

          <p className="text-5xl font-bold mt-4">
            132
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-8 rounded-3xl shadow">
          <h2 className="text-slate-500">
            Qualified
          </h2>

          <p className="text-5xl font-bold mt-4">
            48
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-8 rounded-3xl shadow">
          <h2 className="text-slate-500">
            Converted
          </h2>

          <p className="text-5xl font-bold mt-4">
            19
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-8 rounded-3xl shadow">
          <h2 className="text-slate-500">
            Pipeline
          </h2>

          <p className="text-5xl font-bold mt-4 text-green-600">
            $425K
          </p>
        </div>

      </div>

    </div>
  );
}