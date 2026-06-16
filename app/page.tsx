  import Image from "next/image";

  import Navbar from "../components/Navbar";
  import Hero from "../components/Hero";
  import TrustBar from "../components/TrustBar";
  import Hospitals from "../components/Hospitals";
  import PatientJourney from "../components/PatientJourney";
  import Testimonials from "../components/Testimonials";
  import ConsultationForm from "../components/ConsultationForm";
  import FAQ from "../components/FAQ";
  import Footer from "../components/Footer";
  import CostCalculator from "../components/CostCalculator";
  import Stats from "../components/Stats";
  import CTASection from "../components/CTASection";
  import { Phone, MessageCircle } from "lucide-react";

  export default function Home() {
    return (
      <main className="overflow-x-hidden">

        <Navbar />

        <Hero />

        <Stats />

        <TrustBar />

        <section className="py-24 bg-black">

          <div className="max-w-7xl mx-auto px-6">

            <div className="text-center mb-16">

              <span className="text-blue-400 uppercase tracking-[4px] text-sm font-semibold">
                Why Choose India
              </span>

              <h2 className="text-5xl lg:text-6xl font-bold text-white mt-5">
                World-Class Healthcare At Affordable Costs
              </h2>

              <p className="text-slate-400 max-w-3xl mx-auto mt-6 text-lg">
                International patients travel to India for advanced
                medical treatments, experienced specialists and
                significant healthcare savings.
              </p>

            </div>

            <div className="grid md:grid-cols-4 gap-8">

              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center">
                <h3 className="text-5xl font-bold text-blue-400">90%</h3>
                <p className="text-slate-400 mt-3">Cost Savings</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center">
                <h3 className="text-5xl font-bold text-green-400">50+</h3>
                <p className="text-slate-400 mt-3">Partner Hospitals</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center">
                <h3 className="text-5xl font-bold text-cyan-400">20+</h3>
                <p className="text-slate-400 mt-3">Specialties</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center">
                <h3 className="text-5xl font-bold text-purple-400">24/7</h3>
                <p className="text-slate-400 mt-3">Support</p>
              </div>

            </div>

          </div>

        </section>

    
        {/* Treatments Section */}

        <section
          id="treatments"
          className="py-24 bg-slate-950"
        >
          <div className="max-w-7xl mx-auto px-6">

            <div className="text-center mb-16">

              <span className="text-blue-600 font-semibold uppercase tracking-wider">
                Treatments
              </span>

              <h2 className="text-5xl font-bold mt-4">
                Popular Treatments
              </h2>

              <p className="text-slate-400 mt-6 max-w-3xl mx-auto">
                Access advanced medical treatments from India's leading
                hospitals while saving significantly on healthcare costs.
              </p>

            </div>

            <div className="grid md:grid-cols-3 gap-8">

              <a
                href="/treatments/cardiology"
                className="bg-slate-950 rounded-3xl shadow overflow-hidden block hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
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

                  <p className="text-slate-400 mt-3">
                    Advanced heart care, bypass surgery,
                    valve replacement and cardiac treatments.
                  </p>

                  <div className="mt-5 text-blue-600 font-semibold">
                    View Details →
                  </div>

                </div>
              </a>

              <a
                href="/treatments/orthopedics"
                className="bg-slate-950 rounded-3xl shadow overflow-hidden block hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
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

                  <p className="text-slate-400 mt-3">
                    Knee replacement, hip replacement,
                    spine surgery and rehabilitation.
                  </p>

                  <div className="mt-5 text-blue-600 font-semibold">
                    View Details →
                  </div>

                </div>
              </a>

              <a
                href="/treatments/oncology"
                className="bg-slate-950 rounded-3xl shadow overflow-hidden block hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
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

                  <p className="text-slate-400 mt-3">
                    Comprehensive cancer diagnosis,
                    treatment and specialist care.
                  </p>

                  <div className="mt-5 text-blue-600 font-semibold">
                    View Details →
                  </div>

                </div>
              </a>

            </div>

          </div>
        </section>



        <CostCalculator />

        <Hospitals />

        <PatientJourney />

        <Testimonials />

        <FAQ />

        <CTASection />

        <ConsultationForm />

        {/* WhatsApp Floating Button */}

        

        <a
          href="tel:+919116734675"
          className="fixed bottom-28 right-6 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-110 transition"
        >
          <Phone size={28} />
        </a>

        <a
          href="https://wa.me/919116734675"
          target="_blank"
          className="fixed bottom-8 right-6 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-110 transition"
        >
          <MessageCircle size={28} />
        </a>


        {/* Footer */}

        <Footer />

      </main>
    );
  }