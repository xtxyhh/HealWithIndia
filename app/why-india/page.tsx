import {
  BadgeCheck,
  DollarSign,
  Globe,
  Stethoscope,
  Plane,
  HeartHandshake,
} from "lucide-react";

export const metadata = {
  title: "Why Choose India For Medical Treatment | HealWithIndia",
  description:
    "Discover why international patients choose India for affordable, world-class healthcare and advanced treatments.",
};

const reasons = [
  {
    icon: DollarSign,
    title: "Affordable Treatment",
    description:
      "Save up to 90% compared to treatment costs in the US, UK and Europe without compromising quality.",
    color: "text-green-400",
  },

  {
    icon: BadgeCheck,
    title: "Accredited Hospitals",
    description:
      "Access internationally accredited hospitals equipped with advanced technology and modern facilities.",
    color: "text-blue-400",
  },

  {
    icon: Stethoscope,
    title: "Experienced Doctors",
    description:
      "Highly experienced specialists trained at leading institutions around the world.",
    color: "text-cyan-400",
  },

  {
    icon: Globe,
    title: "International Patients",
    description:
      "Hospitals with dedicated international patient departments and multilingual support.",
    color: "text-purple-400",
  },

  {
    icon: Plane,
    title: "Easy Medical Travel",
    description:
      "Medical visa assistance, airport pickup and accommodation support.",
    color: "text-orange-400",
  },

  {
    icon: HeartHandshake,
    title: "End-To-End Support",
    description:
      "Dedicated patient coordinators throughout your treatment journey.",
    color: "text-pink-400",
  },
];

export default function WhyIndiaPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-br from-orange-950 via-slate-950 to-blue-950 py-28">

        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-500/10 blur-[150px] rounded-full" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full" />

        <div className="relative max-w-6xl mx-auto px-4 text-center">

          <span className="uppercase tracking-[4px] text-orange-300 text-sm font-semibold">

            Medical Tourism In India

          </span>

          <h1 className="text-5xl lg:text-7xl font-bold mt-6">

            Why Choose India

            <br />

            For Medical Treatment?

          </h1>

          <p className="text-xl text-slate-300 mt-8 max-w-3xl mx-auto">

            India combines world-class hospitals,

            experienced specialists and significantly

            lower treatment costs, making it one of

            the world's leading healthcare destinations.

          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-10">

            <span className="bg-green-500/20 text-green-300 px-5 py-2 rounded-full">

              Up To 90% Savings

            </span>

            <span className="bg-blue-500/20 text-blue-300 px-5 py-2 rounded-full">

              50+ Partner Hospitals

            </span>

            <span className="bg-cyan-500/20 text-cyan-300 px-5 py-2 rounded-full">

              24/7 Patient Support

            </span>

          </div>

        </div>

      </section>


      {/* STATS */}

      <section className="py-20 border-b border-slate-800">

        <div className="max-w-7xl mx-auto px-4">

          <div className="grid md:grid-cols-4 gap-8 text-center">

            <div>

              <h3 className="text-5xl font-bold text-green-400">

                90%

              </h3>

              <p className="text-slate-400 mt-3">

                Cost Savings

              </p>

            </div>

            <div>

              <h3 className="text-5xl font-bold text-blue-400">

                50+

              </h3>

              <p className="text-slate-400 mt-3">

                Hospitals

              </p>

            </div>

            <div>

              <h3 className="text-5xl font-bold text-cyan-400">

                20+

              </h3>

              <p className="text-slate-400 mt-3">

                Specialties

              </p>

            </div>

            <div>

              <h3 className="text-5xl font-bold text-purple-400">

                24/7

              </h3>

              <p className="text-slate-400 mt-3">

                Support

              </p>

            </div>

          </div>

        </div>

      </section>


      {/* REASONS */}

      <section className="py-28">

        <div className="max-w-7xl mx-auto px-4">

          <div className="text-center mb-20">

            <h2 className="text-5xl font-bold">

              Why Patients Trust India

            </h2>

            <p className="text-slate-400 mt-6 max-w-3xl mx-auto">

              India has become one of the most trusted

              healthcare destinations for international

              patients seeking affordable, advanced and

              reliable medical treatment.

            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {reasons.map((reason) => {

              const Icon = reason.icon;

              return (

                <div
                  key={reason.title}
                  className="bg-slate-950 border border-slate-800 rounded-[30px] p-8 hover:border-blue-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]"
                >

                  <Icon
                    size={50}
                    className={reason.color}
                  />

                  <h3 className="text-2xl font-bold mt-6">

                    {reason.title}

                  </h3>

                  <p className="text-slate-400 mt-5 leading-relaxed">

                    {reason.description}

                  </p>

                </div>

              );

            })}

          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="py-24 bg-gradient-to-r from-orange-950 via-slate-950 to-blue-950">

        <div className="max-w-5xl mx-auto px-4 text-center">

          <h2 className="text-5xl lg:text-6xl font-bold">

            Ready To Begin

            <br />

            Your Treatment Journey?

          </h2>

          <p className="text-slate-300 mt-8 text-xl">

            Submit your medical reports and receive

            hospital recommendations, treatment options

            and estimated costs.

          </p>

          <a
            href="/#consultation"
            className="inline-block mt-10 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl font-semibold transition"
          >

            Get Free Medical Opinion

          </a>

        </div>

      </section>

    </main>
  );
}