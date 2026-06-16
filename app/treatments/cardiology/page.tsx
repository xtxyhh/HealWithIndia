export default function CardiologyPage() {
  return (
    <main className="min-h-screen bg-slate-950">

      <section className="bg-gradient-to-br from-red-900 to-slate-950 text-white py-24">
        <div className="max-w-6xl mx-auto px-4">

          <h1 className="text-5xl lg:text-7xl font-bold">
            Cardiology Treatment In India
          </h1>

          <p className="text-xl text-slate-300 mt-8">
            Access world-class cardiac care from leading heart specialists
            while saving up to 90% compared to treatment costs abroad.
          </p>

        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">

          <h2 className="text-4xl font-bold">
            Common Cardiac Procedures
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mt-10">

            <div className="bg-slate-900 p-8 rounded-3xl">Heart Bypass Surgery</div>
            <div className="bg-slate-900 p-8 rounded-3xl">Valve Replacement</div>
            <div className="bg-slate-900 p-8 rounded-3xl">Angioplasty</div>
            <div className="bg-slate-900 p-8 rounded-3xl">Pacemaker Implantation</div>

          </div>

          <div className="bg-blue-50 rounded-3xl p-10 mt-16">
            <h3 className="text-3xl font-bold">
              Estimated Cost In India
            </h3>

            <p className="mt-4 text-lg">
              $5,000 - $8,000
            </p>

            <p className="text-slate-400 mt-4">
              Compared to $70,000 - $150,000 in many western countries.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}