export default function IVFPage() {
  return (
    <main className="min-h-screen bg-slate-950">

      <section className="bg-gradient-to-br from-pink-700 to-slate-950 text-white py-24">
        <div className="max-w-6xl mx-auto px-4">

          <h1 className="text-5xl lg:text-7xl font-bold">
            IVF Treatment In India
          </h1>

          <p className="text-xl text-slate-300 mt-8">
            Affordable fertility treatments with high success rates
            and experienced reproductive specialists.
          </p>

        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">

          <h2 className="text-4xl font-bold">
            Fertility Services
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mt-10">

            <div className="bg-slate-900 p-8 rounded-3xl">IVF</div>
            <div className="bg-slate-900 p-8 rounded-3xl">ICSI</div>
            <div className="bg-slate-900 p-8 rounded-3xl">Egg Donation</div>
            <div className="bg-slate-900 p-8 rounded-3xl">Fertility Preservation</div>

          </div>

          <div className="bg-pink-50 rounded-3xl p-10 mt-16">
            <h3 className="text-3xl font-bold">Estimated Cost In India</h3>
            <p className="mt-4 text-lg">$2,000 - $4,000</p>
            <p className="text-slate-400 mt-4">
              Save up to 80% compared to fertility treatment abroad.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}