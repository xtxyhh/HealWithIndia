export default function OrthopedicsPage() {
  return (
    <main className="min-h-screen bg-slate-950">

      <section className="bg-gradient-to-br from-blue-900 to-slate-950 text-white py-24">
        <div className="max-w-6xl mx-auto px-4">

          <h1 className="text-5xl lg:text-7xl font-bold">
            Orthopedic Treatment In India
          </h1>

          <p className="text-xl text-slate-300 mt-8">
            Advanced orthopedic care from leading surgeons for joint replacement,
            spine surgery and sports injuries while saving significantly on costs.
          </p>

        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">

          <h2 className="text-4xl font-bold">
            Common Procedures
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mt-10">

            <div className="bg-slate-900 p-8 rounded-3xl">Knee Replacement</div>
            <div className="bg-slate-900 p-8 rounded-3xl">Hip Replacement</div>
            <div className="bg-slate-900 p-8 rounded-3xl">Spine Surgery</div>
            <div className="bg-slate-900 p-8 rounded-3xl">Sports Injury Treatment</div>

          </div>

          <div className="bg-blue-50 rounded-3xl p-10 mt-16">
            <h3 className="text-3xl font-bold">Estimated Cost In India</h3>
            <p className="mt-4 text-lg">$4,000 - $7,000</p>
            <p className="text-slate-400 mt-4">
              Save up to 85% compared to treatment costs abroad.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}