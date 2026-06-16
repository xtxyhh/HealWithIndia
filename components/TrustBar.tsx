export default function TrustBar() {
  const features = [
    {
      icon: "🏥",
      title: "JCI & NABH Hospitals",
      description:
        "Access internationally accredited hospitals trusted by patients from over 100 countries.",
    },
    {
      icon: "💰",
      title: "Transparent Cost Savings",
      description:
        "Save 70% to 90% on major treatments compared to healthcare costs in the US, UK and Europe.",
    },
    {
      icon: "✈️",
      title: "Medical Visa & Travel Support",
      description:
        "Complete assistance with invitation letters, medical visas, airport pickup and accommodation.",
    },
    {
      icon: "👨‍⚕️",
      title: "Dedicated Patient Coordinator",
      description:
        "A single case manager guides you throughout consultation, treatment and recovery.",
    },
    {
      icon: "🌍",
      title: "International Patient Services",
      description:
        "Interpreter support, foreign currency assistance and personalized care for overseas patients.",
    },
    {
      icon: "📋",
      title: "Free Medical Review",
      description:
        "Our medical team reviews reports and connects patients with suitable specialists.",
    },
  ];

  return (
    <section className="bg-slate-950 py-20">

      <div className="max-w-7xl mx-auto px-4 lg:px-6">

        <div className="text-center mb-16">

          <span className="text-blue-600 font-semibold uppercase tracking-wider">
            Why Patients Trust HealWithIndia
          </span>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mt-4">
            Complete End-To-End Medical Travel Support
          </h2>

          <p className="text-slate-400 max-w-4xl mx-auto mt-6 text-lg">
            From medical evaluation and hospital selection to
            visa assistance, accommodation, airport transfers,
            treatment coordination and post-treatment follow-up,
            we manage every step of your healthcare journey.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-slate-900 rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-all duration-300"
            >

              <div className="text-5xl mb-5">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-white">
                {feature.title}
              </h3>

              <p className="text-slate-400 mt-4 leading-relaxed">
                {feature.description}
              </p>

            </div>
          ))}

        </div>

        {/* Statistics */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20">

          <div className="text-center">

            <h3 className="text-4xl lg:text-5xl font-bold text-blue-600">
              70-90%
            </h3>

            <p className="text-slate-400 mt-3">
              Average Cost Savings
            </p>

          </div>

          <div className="text-center">

            <h3 className="text-4xl lg:text-5xl font-bold text-blue-600">
              50+
            </h3>

            <p className="text-slate-400 mt-3">
              Partner Hospitals
            </p>

          </div>

          <div className="text-center">

            <h3 className="text-4xl lg:text-5xl font-bold text-blue-600">
              20+
            </h3>

            <p className="text-slate-400 mt-3">
              Treatment Specialties
            </p>

          </div>

          <div className="text-center">

            <h3 className="text-4xl lg:text-5xl font-bold text-blue-600">
              24/7
            </h3>

            <p className="text-slate-400 mt-3">
              Patient Support
            </p>

          </div>

        </div>

        {/* Trust Badges */}

        <div className="mt-20 bg-slate-900 text-white rounded-3xl p-10">

          <div className="grid md:grid-cols-4 gap-8 text-center">

            <div>
              <div className="text-3xl mb-3">✅</div>
              <h4 className="font-bold">
                Accredited Hospitals
              </h4>
            </div>

            <div>
              <div className="text-3xl mb-3">🛡️</div>
              <h4 className="font-bold">
                Secure Patient Data
              </h4>
            </div>

            <div>
              <div className="text-3xl mb-3">🌎</div>
              <h4 className="font-bold">
                Global Patient Support
              </h4>
            </div>

            <div>
              <div className="text-3xl mb-3">⭐</div>
              <h4 className="font-bold">
                Transparent Pricing
              </h4>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}