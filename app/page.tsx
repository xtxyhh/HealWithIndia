import Image from "next/image";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TrustBar from "../components/TrustBar";
import Hospitals from "../components/Hospitals";
import PatientJourney from "../components/PatientJourney";
import Testimonials from "../components/Testimonials";
import ConsultationForm from "../components/ConsultationForm";

export default function Home() {
  return (
    <main className="overflow-x-hidden">

      <Navbar />

      <Hero />

      <TrustBar />

      {/* Treatments Section */}

      <section
        id="treatments"
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">

            <span className="text-blue-600 font-semibold uppercase tracking-wider">
              Treatments
            </span>

            <h2 className="text-5xl font-bold mt-4">
              Popular Treatments
            </h2>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-white rounded-3xl shadow overflow-hidden">
              <Image
                src="/images/cardiology.jpg"
                alt="Cardiology"
                width={600}
                height={400}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold">
                  Cardiology
                </h3>
                <p className="text-slate-600 mt-3">
                  Advanced heart care, bypass surgery,
                  valve replacement and cardiac treatments.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow overflow-hidden">
              <Image
                src="/images/orthopedics.jpg"
                alt="Orthopedics"
                width={600}
                height={400}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold">
                  Orthopedics
                </h3>
                <p className="text-slate-600 mt-3">
                  Knee replacement, hip replacement,
                  spine surgery and rehabilitation.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow overflow-hidden">
              <Image
                src="/images/oncology.jpg"
                alt="Oncology"
                width={600}
                height={400}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold">
                  Oncology
                </h3>
                <p className="text-slate-600 mt-3">
                  Comprehensive cancer diagnosis,
                  treatment and specialist care.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      <Hospitals />

      <PatientJourney />

      {/* About India */}

      <section className="py-24 bg-slate-50">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div>

              <Image
                src="/images/hospital-building.png"
                alt="Hospital"
                width={700}
                height={500}
                className="rounded-3xl"
              />

            </div>

            <div>

              <span className="text-blue-600 font-semibold uppercase">
                Why India
              </span>

              <h2 className="text-5xl font-bold mt-4">
                Global Healthcare Destination
              </h2>

              <p className="text-slate-600 text-lg mt-6">
                India offers internationally accredited
                hospitals, highly experienced doctors,
                modern medical technology and significantly
                lower treatment costs.
              </p>

              <div className="grid grid-cols-2 gap-6 mt-10">

                <div>
                  <h3 className="text-4xl font-bold text-blue-600">
                    70%
                  </h3>
                  <p>Lower Costs</p>
                </div>

                <div>
                  <h3 className="text-4xl font-bold text-blue-600">
                    50+
                  </h3>
                  <p>Partner Hospitals</p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      <Testimonials />

      <ConsultationForm />

      {/* WhatsApp Floating Button */}

      <a
        href="https://wa.me/919116734675"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-4 rounded-full shadow-xl z-50"
      >
        WhatsApp
      </a>

      {/* Footer */}

      <footer className="bg-slate-950 text-white py-12">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold">
            HealWithIndia
          </h2>

          <p className="text-slate-400 mt-4">
            Trusted International Healthcare Concierge
          </p>

          <p className="text-slate-500 mt-8">
            © 2026 HealWithIndia. All rights reserved.
          </p>

        </div>

      </footer>

    </main>
  );
}