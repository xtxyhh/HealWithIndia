import Image from "next/image";
import { Quote, Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      image: "/images/testimonials/patient1.jpg",
      name: "Michael R.",
      country: "Texas, USA",
      treatment: "Heart Bypass Surgery",
      saved: "$110,000",
      quote:
        "The quality of care was exceptional. HealWithIndia coordinated everything from hospital selection to travel and recovery support.",
    },
    {
      image: "/images/testimonials/patient2.jpg",
      name: "Sarah W.",
      country: "London, UK",
      treatment: "Knee Replacement",
      saved: "$35,000",
      quote:
        "The doctors were outstanding and the entire journey was stress-free. The savings compared to treatment in the UK were significant.",
    },
    {
      image: "/images/testimonials/patient3.jpg",
      name: "Daniel O.",
      country: "Lagos, Nigeria",
      treatment: "IVF Treatment",
      saved: "$12,000",
      quote:
        "Professional support from start to finish. We received excellent care and achieved the results we hoped for.",
    },
  ];

  return (
    <section className="py-28 bg-black">

      <div className="max-w-7xl mx-auto px-4 lg:px-6">

        <div className="text-center mb-20">

          <span className="text-blue-400 uppercase tracking-[4px] text-sm font-semibold">
            Success Stories
          </span>

          <h2 className="text-5xl lg:text-6xl font-bold text-white mt-5">
            Trusted By Patients Worldwide
          </h2>

          <p className="text-slate-400 max-w-3xl mx-auto mt-6 text-lg">
            Patients from around the world choose India for
            advanced healthcare, experienced specialists and
            significant cost savings.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {testimonials.map((patient) => (

            <div
              key={patient.name}
              className="
              bg-slate-950
              border
              border-slate-800
              rounded-[32px]
              overflow-hidden
              hover:border-blue-500
              hover:-translate-y-2
              transition-all
              duration-500
              "
            >

              <div className="relative">

                <Image
                  src={patient.image}
                  alt={patient.name}
                  width={500}
                  height={350}
                  className="w-full h-64 object-cover"
                />

                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur rounded-full p-3">

                  <Quote
                    size={20}
                    className="text-blue-400"
                  />

                </div>

              </div>

              <div className="p-8">

                <div className="flex gap-1 mb-5">

                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />

                </div>

                <p className="text-slate-300 leading-relaxed">
                  "{patient.quote}"
                </p>

                <div className="border-t border-slate-800 mt-8 pt-6">

                  <h3 className="text-white text-xl font-bold">
                    {patient.name}
                  </h3>

                  <p className="text-slate-400 mt-1">
                    {patient.country}
                  </p>

                  <p className="text-blue-400 mt-4 font-medium">
                    {patient.treatment}
                  </p>

                  <p className="text-green-400 mt-2 font-semibold">
                    Saved {patient.saved}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
