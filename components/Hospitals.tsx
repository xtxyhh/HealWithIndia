import Image from "next/image";

export default function Hospitals() {
  const hospitals = [
    {
      name: "Apollo Hospitals",
      city: "Chennai",
      specialty: "Cardiology & Transplants",
      logo: "/images/apollo.png",
    },
    {
      name: "Fortis Healthcare",
      city: "Delhi",
      specialty: "Oncology & Neurosurgery",
      logo: "/images/fortis.png",
    },
    {
      name: "Medanta",
      city: "Gurugram",
      specialty: "Multi-Specialty Care",
      logo: "/images/medanta.png",
    },
    {
      name: "Max Healthcare",
      city: "Delhi",
      specialty: "Orthopedics & Cardiology",
      logo: "/images/max.png",
    },
    {
      name: "Manipal Hospitals",
      city: "Bengaluru",
      specialty: "Advanced Surgery",
      logo: "/images/manipal.png",
    },
    {
      name: "Narayana Health",
      city: "Bengaluru",
      specialty: "Cardiac Sciences",
      logo: "/images/narayana.png",
    },
  ];

  return (
    <section
      id="hospitals"
      className="py-24 bg-slate-50"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="text-blue-600 font-semibold uppercase tracking-wider">
            Partner Hospitals
          </span>

          <h2 className="text-5xl font-bold text-slate-900 mt-4">
            India's Leading Healthcare Institutions
          </h2>

          <p className="text-slate-600 max-w-3xl mx-auto mt-6 text-lg">
            Access internationally recognized hospitals,
            highly experienced doctors, and world-class
            treatment facilities across India.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {hospitals.map((hospital) => (
            <div
              key={hospital.name}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
            >

              <div className="h-20 flex items-center mb-6">
                <Image
                  src={hospital.logo}
                  alt={hospital.name}
                  width={180}
                  height={70}
                  className="object-contain"
                />
              </div>

              <h3 className="text-2xl font-bold text-slate-900">
                {hospital.name}
              </h3>

              <p className="text-blue-600 font-medium mt-2">
                {hospital.city}
              </p>

              <p className="text-slate-600 mt-4">
                {hospital.specialty}
              </p>

              <div className="mt-6 flex items-center gap-2 text-green-600">
                <span>✓</span>
                <span>
                  International Patient Program
                </span>
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}