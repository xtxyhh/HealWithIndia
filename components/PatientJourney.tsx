export default function PatientJourney() {
  const steps = [
    {
      icon: "📄",
      title: "Submit Medical Reports",
      description:
        "Share your reports and medical history for a free preliminary assessment.",
    },
    {
      icon: "👨‍⚕️",
      title: "Expert Medical Review",
      description:
        "Our team reviews your case and identifies the best treatment options.",
    },
    {
      icon: "🏥",
      title: "Hospital Matching",
      description:
        "Receive recommendations from India's leading hospitals and specialists.",
    },
    {
      icon: "✈️",
      title: "Travel Assistance",
      description:
        "Visa support, airport pickup, accommodation and complete travel guidance.",
    },
    {
      icon: "❤️",
      title: "Treatment & Recovery",
      description:
        "Dedicated support throughout treatment and post-treatment recovery.",
    },
  ];

  return (
    <section
      id="journey"
      className="py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="text-blue-600 font-semibold uppercase tracking-wider">
            Patient Journey
          </span>

          <h2 className="text-5xl font-bold text-slate-900 mt-4">
            Your Treatment Journey Simplified
          </h2>

          <p className="text-slate-600 text-lg max-w-3xl mx-auto mt-6">
            We manage every stage of your healthcare journey
            so you can focus on recovery.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">

          {steps.map((step, index) => (
            <div
              key={step.title}
              className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all"
            >

              <div className="text-5xl mb-6">
                {step.icon}
              </div>

              <div className="text-blue-600 font-bold mb-3">
                Step {index + 1}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {step.title}
              </h3>

              <p className="text-slate-600">
                {step.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}