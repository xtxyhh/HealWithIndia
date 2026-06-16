export default function OncologyPage() {
  return (
    <main className="min-h-screen bg-slate-950">

      <section className="bg-gradient-to-br from-purple-900 to-slate-950 text-white py-24">
        <div className="max-w-6xl mx-auto px-4">

          <h1 className="text-5xl lg:text-7xl font-bold">
            Cancer Treatment In India
          </h1>

          <p className="text-xl text-slate-300 mt-8">
            Comprehensive cancer treatment with experienced oncologists,
            modern technology and internationally recognized hospitals.
          </p>

        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">

          <h2 className="text-4xl font-bold">
            Available Treatments
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mt-10">

            <div className="bg-slate-900 p-8 rounded-3xl">Chemotherapy</div>
            <div className="bg-slate-900 p-8 rounded-3xl">Radiation Therapy</div>
            <div className="bg-slate-900 p-8 rounded-3xl">Surgical Oncology</div>
            <div className="bg-slate-900 p-8 rounded-3xl">Immunotherapy</div>

          </div>

          <div className="bg-purple-50 rounded-3xl p-10 mt-16">
            <h3 className="text-3xl font-bold">Estimated Cost In India</h3>
            <p className="mt-4 text-lg">$3,000 - $20,000</p>
            <p className="text-slate-400 mt-4">
              Up to 80% lower than many western countries.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}