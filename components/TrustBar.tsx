export default function TrustBar() {
  return (
    <section className="bg-white py-16 border-b">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">

          <span className="text-blue-600 font-semibold uppercase tracking-wider">
            Why Patients Trust HealWithIndia
          </span>

          <h2 className="text-4xl font-bold text-slate-900 mt-3">
            Complete End-to-End Medical Travel Support
          </h2>

          <p className="text-slate-600 mt-4 max-w-3xl mx-auto">
            From medical evaluation and hospital selection to
            visa assistance, accommodation, and recovery support,
            we simplify every step of your treatment journey.
          </p>

        </div>

        <div className="grid md:grid-cols-4 gap-8">

          <div className="bg-slate-50 p-8 rounded-2xl text-center">

            <div className="text-5xl mb-4">🏥</div>

            <h3 className="font-bold text-xl text-slate-900">
              Accredited Hospitals
            </h3>

            <p className="text-slate-600 mt-3">
              Access internationally recognized hospitals and
              highly experienced specialists.
            </p>

          </div>

          <div className="bg-slate-50 p-8 rounded-2xl text-center">

            <div className="text-5xl mb-4">✈️</div>

            <h3 className="font-bold text-xl text-slate-900">
              Visa Assistance
            </h3>

            <p className="text-slate-600 mt-3">
              Dedicated support for medical visas and travel
              documentation.
            </p>

          </div>

          <div className="bg-slate-50 p-8 rounded-2xl text-center">

            <div className="text-5xl mb-4">🚗</div>

            <h3 className="font-bold text-xl text-slate-900">
              Travel Support
            </h3>

            <p className="text-slate-600 mt-3">
              Airport pickup, accommodation guidance and local
              transportation assistance.
            </p>

          </div>

          <div className="bg-slate-50 p-8 rounded-2xl text-center">

            <div className="text-5xl mb-4">📞</div>

            <h3 className="font-bold text-xl text-slate-900">
              24/7 Patient Care
            </h3>

            <p className="text-slate-600 mt-3">
              A dedicated coordinator available throughout your
              treatment journey.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}
