import Image from "next/image";
import {
  ShieldCheck,
  Globe,
  Building2,
  UserRoundCheck,
} from "lucide-react";

export default function Hero() {
  return (
    <>
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-black via-slate-950 to-blue-950 text-white"
      >
        {/* Background Glow */}

        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 blur-[140px] rounded-full" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[140px] rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-20 lg:py-28">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}

            <div>

              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm">

                Trusted By International Patients

              </div>

              <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">

                Trusted Medical Care

                <br />

                In

                <span className="gradient-text">
                  {" "}India
                </span>

                <br />

                Save Up To

                <span className="text-green-400">
                  {" "}90%
                </span>

                {" "}Without

                <br />

                Compromising Quality

              </h1>

              <p className="mt-8 text-lg lg:text-xl text-slate-300 max-w-2xl leading-relaxed">

                Access JCI & NABH accredited hospitals,
                internationally trained doctors and personalized
                healthcare support for Cardiology, Oncology,
                Organ Transplants, IVF and advanced treatments.

              </p>

              {/* Treatment Pills */}

              <div className="flex flex-wrap gap-3 mt-8">

                {[
                  "Cardiology",
                  "Oncology",
                  "Organ Transplants",
                  "Orthopedics",
                  "IVF",
                ].map((item) => (

                  <div
                    key={item}
                    className="px-4 py-2 rounded-full border border-slate-700 bg-slate-900/60 backdrop-blur-xl text-sm text-slate-200"
                  >
                    {item}
                  </div>

                ))}

              </div>

              {/* CTA */}

              <div className="flex flex-col sm:flex-row gap-4 mt-10">

                <a
                  href="#consultation"
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl font-semibold text-center shadow-xl transition"
                >
                  Get Free Medical Opinion
                </a>

                <a
                  href="/treatments"
                  className="px-8 py-4 rounded-2xl border border-slate-700 bg-slate-900/50 hover:border-blue-500 text-center transition"
                >
                  Explore Treatments
                </a>

              </div>

              {/* Trust Row */}

              <div className="flex flex-wrap gap-6 mt-10">

                <div className="flex items-center gap-2">

                  <ShieldCheck
                    size={18}
                    className="text-green-400"
                  />

                  <span className="text-slate-300 text-sm">

                    HIPAA Compliant

                  </span>

                </div>

                <div className="flex items-center gap-2">

                  <Building2
                    size={18}
                    className="text-blue-400"
                  />

                  <span className="text-slate-300 text-sm">

                    JCI Hospitals

                  </span>

                </div>

                <div className="flex items-center gap-2">

                  <UserRoundCheck
                    size={18}
                    className="text-cyan-400"
                  />

                  <span className="text-slate-300 text-sm">

                    Dedicated Coordinator

                  </span>

                </div>

              </div>

              {/* Stats */}

              <div className="grid grid-cols-3 gap-8 mt-14">

                <div>

                  <div className="text-4xl font-bold text-blue-400">

                    50+

                  </div>

                  <p className="text-slate-400 mt-2">

                    Hospitals

                  </p>

                </div>

                <div>

                  <div className="text-4xl font-bold text-green-400">

                    90%

                  </div>

                  <p className="text-slate-400 mt-2">

                    Savings

                  </p>

                </div>

                <div>

                  <div className="text-4xl font-bold text-cyan-400">

                    24/7

                  </div>

                  <p className="text-slate-400 mt-2">

                    Support

                  </p>

                </div>

              </div>

              {/* Countries */}

              <div className="mt-12">

                <p className="text-slate-400 mb-4">

                  Patients From

                </p>

                <div className="flex flex-wrap gap-3">

                  {[
                    "🇺🇸 USA",
                    "🇬🇧 UK",
                    "🇦🇪 UAE",
                    "🇳🇬 Nigeria",
                    "🇨🇦 Canada",
                    "🇦🇺 Australia",
                  ].map((country) => (

                    <span
                      key={country}
                      className="px-4 py-2 rounded-full border border-slate-700 bg-slate-900/60 text-sm"
                    >
                      {country}
                    </span>

                  ))}

                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div>

              <div className="relative">

                <Image
                  src="/images/hero-doctor.png"
                  alt="HealWithIndia"
                  width={900}
                  height={900}
                  priority
                  className="rounded-[32px] object-cover"
                />

                <div className="absolute inset-0 rounded-[32px] bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Top Badge */}

                <div className="absolute top-8 left-8 bg-slate-900/80 backdrop-blur-xl px-5 py-4 rounded-2xl border border-slate-700">

                  <p className="text-sm text-slate-300">

                    JCI & NABH Accredited

                  </p>

                  <p className="font-bold text-white">

                    Partner Hospitals

                  </p>

                </div>

                {/* Savings */}

                <div className="absolute top-8 right-8 bg-slate-900/80 backdrop-blur-xl rounded-2xl px-5 py-4 border border-slate-700">

                  <div className="text-3xl font-bold text-green-400">

                    90%

                  </div>

                  <div className="text-sm text-slate-300">

                    Cost Savings

                  </div>

                </div>

                {/* Countries */}

                <div className="absolute bottom-8 left-8 bg-slate-900/80 backdrop-blur-xl rounded-2xl px-5 py-4 border border-slate-700">

                  <div className="text-3xl font-bold text-blue-400">

                    100+

                  </div>

                  <div className="text-sm text-slate-300">

                    Countries Served

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Hospital Logos */}

      <section className="bg-black border-y border-slate-800 py-14">

        <div className="max-w-7xl mx-auto px-6">

          <p className="text-center text-slate-500 mb-10 uppercase tracking-[3px] text-sm">

            Trusted Hospital Network Across India

          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

            {[
              "apollo",
              "fortis",
              "medanta",
              "max",
              "manipal",
              "narayana",
            ].map((hospital) => (

              <div
                key={hospital}
                className="bg-slate-950 border border-slate-800 rounded-2xl h-28 flex items-center justify-center hover:border-blue-500 transition"
              >

                <Image
                  src={`/images/${hospital}.png`}
                  alt={hospital}
                  width={150}
                  height={60}
                  className="object-contain"
                />

              </div>

            ))}

          </div>

        </div>

      </section>
    </>
  );
}