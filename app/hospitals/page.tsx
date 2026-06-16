export const metadata = {
  title: "Top Hospitals in India | HealWithIndia",
  description:
    "Explore India's leading hospitals for international patients including Apollo, Fortis, Medanta, Max, Manipal and Narayana Health.",
};

import Image from "next/image";

export default function HospitalsPage() {
  const hospitals = [
    {
      name: "Apollo Hospitals",
      city: "Chennai",
      specialty: "Cardiology, Oncology & Transplants",
      logo: "/images/apollo.png",
      link: "/hospitals/apollo",
    },
    {
      name: "Fortis Healthcare",
      city: "New Delhi",
      specialty: "Neurosurgery & Cancer Care",
      logo: "/images/fortis.png",
      link: "/hospitals/fortis",
    },
    {
      name: "Medanta",
      city: "Gurugram",
      specialty: "Multi-Specialty Excellence",
      logo: "/images/medanta.png",
      link: "/hospitals/medanta",
    },
    {
      name: "Max Healthcare",
      city: "New Delhi",
      specialty: "Orthopedics & Cardiology",
      logo: "/images/max.png",
      link: "/hospitals/max",
    },
    {
      name: "Manipal Hospitals",
      city: "Bengaluru",
      specialty: "Advanced Surgery",
      logo: "/images/manipal.png",
      link: "/hospitals/manipal",
    },
    {
      name: "Narayana Health",
      city: "Bengaluru",
      specialty: "Cardiac Sciences",
      logo: "/images/narayana.png",
      link: "/hospitals/narayana",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-24">

        <div className="max-w-7xl mx-auto px-4 text-center">

          <span className="text-blue-400 font-semibold uppercase tracking-[3px]">
            Trusted Hospital Network
          </span>

          <h1 className="text-5xl lg:text-7xl font-bold mt-6">
            India's Leading
            <br />
            Healthcare Institutions
          </h1>

          <div className="flex flex-wrap justify-center gap-3 mt-8">

            <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm">
              50+ Partner Hospitals
            </span>

            <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm">
              JCI & NABH Accredited
            </span>

            <span className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full text-sm">
              International Patient Support
            </span>

          </div>

          <p className="max-w-4xl mx-auto mt-8 text-xl text-slate-300">
            Access internationally recognized hospitals,
            experienced specialists and advanced treatment
            facilities trusted by patients worldwide.
          </p>

        </div>

      </section>

      {/* HOSPITALS GRID */}

      <section className="py-24">

        <div className="max-w-7xl mx-auto px-4">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {hospitals.map((hospital) => (
              <a
                href={hospital.link}
                key={hospital.name}
                className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden block hover:border-blue-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]"
              >

                <div className="h-28 flex items-center justify-center p-6 border-b border-slate-800">

                  <Image
                    src={hospital.logo}
                    alt={hospital.name}
                    width={220}
                    height={100}
                    className="object-contain"
                  />

                </div>

                <div className="p-8">

                  <h2 className="text-2xl font-bold text-center">
                    {hospital.name}
                  </h2>

                  <p className="text-blue-400 text-center mt-2">
                    {hospital.city}
                  </p>

                  <p className="text-slate-400 text-center mt-5 min-h-[50px]">
                    {hospital.specialty}
                  </p>

                  <div className="mt-6 space-y-3 text-slate-300">

                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      International Patient Department
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      Advanced Medical Technology
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-cyan-500" />
                      Experienced Specialists
                    </div>

                  </div>

                  <div className="mt-8 text-blue-400 font-semibold">
                    View Hospital →
                  </div>

                </div>

              </a>
            ))}

          </div>

        </div>

      </section>

      {/* TRUST NUMBERS */}

      <section className="py-20 border-t border-slate-800">

        <div className="max-w-7xl mx-auto px-4">

          <div className="grid md:grid-cols-4 gap-8 text-center">

            <div>
              <h3 className="text-5xl font-bold text-blue-400">
                50+
              </h3>
              <p className="text-slate-400 mt-3">
                Partner Hospitals
              </p>
            </div>

            <div>
              <h3 className="text-5xl font-bold text-green-400">
                100+
              </h3>
              <p className="text-slate-400 mt-3">
                Countries Served
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
                Patient Support
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="py-24 bg-gradient-to-r from-blue-950 via-slate-950 to-cyan-950">

        <div className="max-w-5xl mx-auto px-4 text-center">

          <h2 className="text-5xl lg:text-6xl font-bold">
            Need Help Choosing A Hospital?
          </h2>

          <p className="text-slate-400 mt-6 text-lg">
            Our healthcare team can review your case,
            compare hospitals and recommend the most
            suitable specialists for your treatment.
          </p>

          <a
            href="/#consultation"
            className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-2xl font-semibold shadow-xl hover:scale-105 transition-all duration-300"
          >
            Get Free Medical Opinion
          </a>

        </div>

      </section>

    </main>
  );
}