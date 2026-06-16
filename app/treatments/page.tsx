export default function TreatmentsPage() {
  const treatments = [
    {
      name: "Cardiology",
      cost: "$5,000 - $8,000",
      savings: "Up to 90%",
      link: "/treatments/cardiology",
      icon: "❤️",
    },
    {
      name: "Orthopedics",
      cost: "$4,000 - $7,000",
      savings: "Up to 85%",
      link: "/treatments/orthopedics",
      icon: "🦴",
    },
    {
      name: "Oncology",
      cost: "$3,000 - $20,000",
      savings: "Up to 80%",
      link: "/treatments/oncology",
      icon: "🎗️",
    },
    {
      name: "IVF Treatment",
      cost: "$2,000 - $4,000",
      savings: "Up to 80%",
      link: "/treatments/ivf",
      icon: "👶",
    },
    {
      name: "Kidney Transplant",
      cost: "$8,000 - $15,000",
      savings: "Up to 95%",
      link: "/treatments/kidney-transplant",
      icon: "🩺",
    },
    {
      name: "Liver Transplant",
      cost: "$20,000 - $35,000",
      savings: "Up to 85%",
      link: "/treatments/liver-transplant",
      icon: "🏥",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-900">

      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white py-24">

        <div className="max-w-7xl mx-auto px-4 text-center">

          <span className="text-blue-400 font-semibold uppercase">
            Medical Treatments
          </span>

          <h1 className="text-5xl lg:text-7xl font-bold mt-6">
            World-Class Treatment
            <br />
            At Affordable Costs
          </h1>

          <p className="max-w-4xl mx-auto mt-8 text-xl text-slate-300">
            Access advanced healthcare from India's leading
            hospitals and specialists while saving significantly
            on treatment costs.
          </p>

        </div>

      </section>

      <section className="py-24">

        <div className="max-w-7xl mx-auto px-4">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {treatments.map((treatment) => (
              <div
                key={treatment.name}
                className="bg-slate-950 rounded-3xl p-8 shadow hover:shadow-xl transition"
              >

                <div className="text-6xl mb-6">
                  {treatment.icon}
                </div>

                <h2 className="text-2xl font-bold">
                  {treatment.name}
                </h2>

                <div className="mt-6">

                  <p className="text-slate-500">
                    Typical Cost In India
                  </p>

                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {treatment.cost}
                  </p>

                </div>

                <div className="mt-6">

                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                    {treatment.savings} Savings
                  </span>

                </div>

                <a
                  href={treatment.link}
                  className="mt-8 block text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
                >
                  View Details
                </a>

              </div>
            ))}

          </div>

        </div>

      </section>

      <section className="bg-slate-950 py-20">

        <div className="max-w-5xl mx-auto px-4 text-center">

          <h2 className="text-4xl font-bold">
            Need Help Choosing A Treatment?
          </h2>

          <p className="text-slate-400 mt-6 text-lg">
            Submit your medical reports and receive hospital
            recommendations, treatment options and estimated costs.
          </p>

          <a
            href="/#consultation"
            className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold"
          >
            Get Free Consultation
          </a>

        </div>

      </section>

    </main>
  );
}