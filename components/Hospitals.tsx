import Image from "next/image";
import { ArrowRight, ShieldCheck, Globe, HeartPulse } from "lucide-react";

export default function Hospitals() {
  const hospitals = [
    {
      name: "Apollo Hospitals",
      city: "Chennai",
      specialty: "Cardiology • Oncology • Organ Transplants",
      logo: "/images/apollo.png",
      url: "/hospitals/apollo",
    },
    {
      name: "Fortis Healthcare",
      city: "New Delhi",
      specialty: "Neurosurgery • Oncology • Cardiac Care",
      logo: "/images/fortis.png",
      url: "/hospitals/fortis",
    },
    {
      name: "Medanta",
      city: "Gurugram",
      specialty: "Multi-Specialty Advanced Care",
      logo: "/images/medanta.png",
      url: "/hospitals/medanta",
    },
    {
      name: "Max Healthcare",
      city: "New Delhi",
      specialty: "Orthopedics • Cardiology • Cancer Care",
      logo: "/images/max.png",
      url: "/hospitals/max",
    },
    {
      name: "Manipal Hospitals",
      city: "Bengaluru",
      specialty: "Advanced Surgery • Critical Care",
      logo: "/images/manipal.png",
      url: "/hospitals/manipal",
    },
    {
      name: "Narayana Health",
      city: "Bengaluru",
      specialty: "Cardiac Sciences • Transplants",
      logo: "/images/narayana.png",
      url: "/hospitals/narayana",
    },
  ];

  return (
    <section
      id="hospitals"
      className="py-28 bg-black"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6">

        <div className="text-center mb-20">

          <span className="text-blue-400 uppercase tracking-[4px] text-sm font-semibold">
            Hospital Network
          </span>

          <h2 className="text-5xl lg:text-6xl font-bold text-white mt-5">
            India's Most Trusted Hospitals
          </h2>

          <p className="text-slate-400 max-w-3xl mx-auto mt-6 text-lg">
            Access internationally accredited hospitals,
            world-renowned specialists and advanced treatment
            facilities across India.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {hospitals.map((hospital) => (

            <div
              key={hospital.name}
              className="
              group
              bg-slate-950
              border
              border-slate-800
              rounded-[32px]
              p-8
              hover:border-blue-500
              hover:-translate-y-2
              transition-all
              duration-500
              "
            >

              <div className="h-24 flex items-center justify-center mb-8">

                <Image
                  src={hospital.logo}
                  alt={hospital.name}
                  width={220}
                  height={120}
                  className="object-contain"
                />

              </div>

              <div className="flex items-center justify-center mb-3">

                <span className="bg-blue-600/10 border border-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs">
                  International Patient Center
                </span>

              </div>

              <h3 className="text-2xl font-bold text-white text-center">
                {hospital.name}
              </h3>

              <p className="text-cyan-400 text-center mt-2">
                {hospital.city}
              </p>

              <p className="text-slate-400 text-center mt-5 min-h-[60px]">
                {hospital.specialty}
              </p>

              <div className="space-y-3 mt-8">

                <div className="flex items-center gap-3 text-slate-300">

                  <ShieldCheck
                    size={18}
                    className="text-green-400"
                  />

                  Accredited Facility

                </div>

                <div className="flex items-center gap-3 text-slate-300">

                  <Globe
                    size={18}
                    className="text-blue-400"
                  />

                  International Patients

                </div>

                <div className="flex items-center gap-3 text-slate-300">

                  <HeartPulse
                    size={18}
                    className="text-red-400"
                  />

                  Advanced Healthcare

                </div>

              </div>

              <a
                href={hospital.url}
                className="
                mt-8
                flex
                items-center
                justify-center
                gap-2
                bg-blue-600
                hover:bg-blue-700
                text-white
                py-4
                rounded-2xl
                font-semibold
                transition
                "
              >

                View Hospital

                <ArrowRight size={18} />

              </a>

            </div>

          ))}

        </div>

        <div
          className="
          mt-24
          bg-gradient-to-r
          from-slate-950
          via-slate-900
          to-slate-950
          border
          border-slate-800
          rounded-[32px]
          p-12
          "
        >

          <div className="grid md:grid-cols-4 gap-10 text-center">

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
                Support
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}