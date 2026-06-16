export default function PatientJourney() {
  const steps = [
    {
      step: "01",
      title: "Submit Medical Reports",
      description:
        "Share your reports, scans and medical history for a confidential review.",
    },
    {
      step: "02",
      title: "Medical Evaluation",
      description:
        "Our healthcare team reviews your case and identifies suitable treatment options.",
    },
    {
      step: "03",
      title: "Hospital Selection",
      description:
        "Receive recommendations from India's leading hospitals and specialists.",
    },
    {
      step: "04",
      title: "Travel & Visa Support",
      description:
        "Assistance with medical visa documentation, travel planning and accommodation.",
    },
    {
      step: "05",
      title: "Treatment In India",
      description:
        "Dedicated coordination throughout treatment, hospitalization and recovery.",
    },
    {
      step: "06",
      title: "Follow-Up Care",
      description:
        "Continued support and communication after you return home.",
    },
  ];

  return (
    <section
      id="journey"
      className="py-24 bg-black text-white"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-20">

          <span className="text-blue-400 uppercase tracking-[4px] font-semibold">
            Patient Journey
          </span>

          <h2 className="text-5xl lg:text-6xl font-bold mt-4">
            Your Treatment Journey
          </h2>

          <p className="text-slate-400 text-lg max-w-3xl mx-auto mt-6">
            A seamless end-to-end experience designed for
            international patients seeking treatment in India.
          </p>

        </div>

        <div className="relative">

          {/* Center Timeline */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 to-cyan-500 hidden lg:block" />

          <div className="space-y-10">

            {steps.map((step, index) => (

              <div
                key={step.step}
                className={`flex ${
                  index % 2 === 0
                    ? "lg:justify-start"
                    : "lg:justify-end"
                }`}
              >

                <div className="w-full lg:w-[45%]">

                  <div className="
                    bg-slate-950
                    border border-slate-800
                    rounded-3xl
                    p-8
                    hover:border-blue-500
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]
                  ">

                    <div className="text-blue-400 text-5xl font-bold mb-5">
                      {step.step}
                    </div>

                    <h3 className="text-2xl font-bold mb-4">
                      {step.title}
                    </h3>

                    <p className="text-slate-400 leading-relaxed">
                      {step.description}
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>
    </section>
  );
}
