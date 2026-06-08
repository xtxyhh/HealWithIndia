import Image from "next/image";

export default function Testimonials() {
  const testimonials = [
    {
      country: "United States",
      treatment: "Knee Replacement",
      quote:
        "The treatment quality exceeded my expectations and the cost savings were remarkable.",
    },
    {
      country: "United Kingdom",
      treatment: "Cardiac Surgery",
      quote:
        "Everything from hospital selection to travel support was professionally managed.",
    },
    {
      country: "Nigeria",
      treatment: "IVF Treatment",
      quote:
        "The doctors were exceptional and the entire process felt safe and transparent.",
    },
  ];

  return (
    <section className="bg-slate-950 text-white py-24">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="text-blue-400 font-semibold uppercase tracking-wider">
            Patient Success Stories
          </span>

          <h2 className="text-5xl font-bold mt-4">
            Trusted By Patients Worldwide
          </h2>

          <p className="text-slate-400 text-lg mt-6 max-w-3xl mx-auto">
            Patients from around the world choose India
            for affordable, high-quality healthcare.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div>

            <Image
              src="/images/patient-success.png"
              alt="Happy Patient"
              width={700}
              height={500}
              className="rounded-3xl shadow-2xl"
            />

          </div>

          <div className="space-y-6">

            {testimonials.map((testimonial) => (
              <div
                key={testimonial.country}
                className="bg-slate-900 p-6 rounded-2xl border border-slate-800"
              >

                <div className="text-yellow-400 text-xl mb-3">
                  ★★★★★
                </div>

                <p className="text-slate-300">
                  "{testimonial.quote}"
                </p>

                <div className="mt-4">
                  <h3 className="font-bold">
                    Patient from {testimonial.country}
                  </h3>

                  <p className="text-blue-400">
                    {testimonial.treatment}
                  </p>
                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}