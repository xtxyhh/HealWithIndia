import {
  Building2,
  HeartHandshake,
  Plane,
  BadgeDollarSign,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Trusted Hospitals",
    description:
      "Partnering with India's leading multi-specialty hospitals and internationally experienced doctors.",
  },

  {
    icon: BadgeDollarSign,
    title: "Affordable Care",
    description:
      "Save up to 90% compared to treatment costs in many Western countries.",
  },

  {
    icon: Plane,
    title: "Medical Travel Support",
    description:
      "Complete assistance with visas, accommodation, airport pickup and travel.",
  },

  {
    icon: HeartHandshake,
    title: "Dedicated Coordinator",
    description:
      "A single point of contact to guide you throughout your medical journey.",
  },
];

const process = [
  "Submit Medical Reports",

  "Medical Evaluation",

  "Hospital Matching",

  "Visa & Travel Support",

  "Treatment & Recovery",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-br from-black via-slate-950 to-blue-950 py-28">

        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 text-center">

          <span className="text-blue-400 uppercase tracking-[4px] text-sm font-semibold">

            About HealWithIndia

          </span>

          <h1 className="text-5xl lg:text-7xl font-bold mt-6 leading-tight">

            Making Quality Healthcare

            <br />

            Accessible Worldwide

          </h1>

          <p className="max-w-4xl mx-auto mt-8 text-xl text-slate-300 leading-relaxed">

            HealWithIndia connects international patients with

            India's leading hospitals, experienced specialists

            and affordable world-class treatment through

            personalized end-to-end medical travel support.

          </p>

          <div className="flex justify-center gap-4 flex-wrap mt-10">

            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4">

              <h3 className="text-3xl font-bold text-blue-400">

                50+

              </h3>

              <p className="text-slate-400">

                Hospitals

              </p>

            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4">

              <h3 className="text-3xl font-bold text-green-400">

                90%

              </h3>

              <p className="text-slate-400">

                Savings

              </p>

            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4">

              <h3 className="text-3xl font-bold text-cyan-400">

                24/7

              </h3>

              <p className="text-slate-400">

                Support

              </p>

            </div>

          </div>

        </div>

      </section>


      {/* MISSION */}

      <section className="py-28">

        <div className="max-w-7xl mx-auto px-4">

          <div className="grid lg:grid-cols-2 gap-14">

            <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-10">

              <h2 className="text-4xl font-bold">

                Our Mission

              </h2>

              <p className="text-slate-400 mt-8 text-lg leading-relaxed">

                To connect patients around the world with

                high-quality healthcare solutions in India

                while simplifying the entire medical travel

                experience.

              </p>

              <p className="text-slate-400 mt-6 text-lg leading-relaxed">

                We believe everyone deserves access to

                affordable treatment, expert doctors and

                compassionate healthcare.

              </p>

            </div>


            <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-10">

              <h2 className="text-4xl font-bold">

                Our Vision

              </h2>

              <p className="text-slate-400 mt-8 text-lg leading-relaxed">

                To become the world's most trusted healthcare

                concierge helping patients make informed

                treatment decisions and access exceptional

                medical expertise.

              </p>

              <p className="text-slate-400 mt-6 text-lg leading-relaxed">

                We aim to make international healthcare

                transparent, affordable and accessible

                for everyone.

              </p>

            </div>

          </div>

        </div>

      </section>


      {/* FEATURES */}

      <section className="py-28 bg-slate-950">

        <div className="max-w-7xl mx-auto px-4">

          <div className="text-center mb-16">

            <h2 className="text-5xl font-bold">

              Why Patients Choose Us

            </h2>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {features.map((item) => {

              const Icon = item.icon;

              return (

                <div
                  key={item.title}
                  className="bg-black border border-slate-800 rounded-[28px] p-8 hover:border-blue-500 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]"
                >

                  <Icon
                    size={42}
                    className="text-blue-400"
                  />

                  <h3 className="text-2xl font-bold mt-6">

                    {item.title}

                  </h3>

                  <p className="text-slate-400 mt-5 leading-relaxed">

                    {item.description}

                  </p>

                </div>

              );

            })}

          </div>

        </div>

      </section>


      {/* PROCESS */}

      <section className="py-28">

        <div className="max-w-7xl mx-auto px-4">

          <div className="text-center mb-16">

            <h2 className="text-5xl font-bold">

              How We Work

            </h2>

          </div>

          <div className="grid md:grid-cols-5 gap-8">

            {process.map((step, i) => (

              <div
                key={step}
                className="text-center"
              >

                <div className="w-20 h-20 mx-auto rounded-full bg-blue-600/20 border border-blue-500 flex items-center justify-center">

                  <span className="text-3xl font-bold text-blue-400">

                    {i + 1}

                  </span>

                </div>

                <p className="mt-6 text-lg">

                  {step}

                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="py-28 bg-gradient-to-r from-blue-950 via-slate-950 to-cyan-950">

        <div className="max-w-5xl mx-auto px-4 text-center">

          <CheckCircle2
            size={60}
            className="mx-auto text-green-400"
          />

          <h2 className="text-5xl font-bold mt-8">

            Ready To Begin?

          </h2>

          <p className="text-slate-300 mt-6 text-xl">

            Submit your reports and receive

            personalized hospital recommendations.

          </p>

          <a
            href="/#consultation"
            className="inline-block mt-10 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl font-semibold text-white transition"
          >

            Get Free Consultation

          </a>

        </div>

      </section>

    </main>
  );
}