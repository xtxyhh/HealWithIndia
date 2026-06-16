import {
  Mail,
  Phone,
  Clock,
  Globe,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";

const benefits = [
  "Free Medical Case Review",
  "Hospital Recommendations",
  "Treatment Cost Estimates",
  "Medical Visa Assistance",
  "Accommodation Guidance",
  "Dedicated Patient Coordinator",
];

const contactCards = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "+91 91167 34675",
    link: "https://wa.me/919116734675",
    color: "text-green-400",
  },

  {
    icon: Mail,
    title: "Email",
    value: "care@healwithindia.com",
    link: "mailto:care@healwithindia.com",
    color: "text-blue-400",
  },

  {
    icon: Clock,
    title: "Response Time",
    value: "Within 24 Hours",
    link: "#",
    color: "text-cyan-400",
  },

  {
    icon: Globe,
    title: "Patient Support",
    value: "Worldwide Assistance",
    link: "#",
    color: "text-purple-400",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-br from-black via-slate-950 to-blue-950 py-28">

        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full" />

        <div className="relative max-w-5xl mx-auto px-4 text-center">

          <span className="text-blue-400 uppercase tracking-[4px] text-sm font-semibold">

            Contact HealWithIndia

          </span>

          <h1 className="text-5xl lg:text-7xl font-bold mt-6">

            Speak With Our

            <br />

            Healthcare Team

          </h1>

          <p className="text-slate-300 mt-8 text-xl max-w-3xl mx-auto">

            Get treatment guidance, hospital recommendations

            and cost estimates from our international

            patient support team.

          </p>

        </div>

      </section>


      {/* CONTACT CARDS */}

      <section className="py-20">

        <div className="max-w-7xl mx-auto px-4">

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {contactCards.map((card) => {

              const Icon = card.icon;

              return (

                <a
                  key={card.title}
                  href={card.link}
                  className="bg-slate-950 border border-slate-800 rounded-[28px] p-8 hover:border-blue-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]"
                >

                  <Icon
                    size={42}
                    className={card.color}
                  />

                  <h3 className="text-2xl font-bold mt-6">

                    {card.title}

                  </h3>

                  <p className="text-slate-400 mt-4">

                    {card.value}

                  </p>

                </a>

              );

            })}

          </div>

        </div>

      </section>


      {/* MAIN SECTION */}

      <section className="pb-28">

        <div className="max-w-7xl mx-auto px-4">

          <div className="grid lg:grid-cols-2 gap-12">

            {/* LEFT */}

            <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-10">

              <span className="text-blue-400 uppercase tracking-[4px] text-sm">

                Why Contact Us

              </span>

              <h2 className="text-4xl font-bold mt-5">

                Personalized Healthcare Guidance

              </h2>

              <p className="text-slate-400 text-lg mt-6">

                Our team helps you understand treatment

                options, hospital choices and expected

                costs before travelling to India.

              </p>

              <div className="space-y-5 mt-10">

                {benefits.map((item) => (

                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >

                    <CheckCircle2
                      className="text-green-400"
                    />

                    <span className="text-slate-300">

                      {item}

                    </span>

                  </div>

                ))}

              </div>

            </div>


            {/* RIGHT */}

            <div className="bg-gradient-to-br from-blue-950 via-slate-950 to-cyan-950 rounded-[32px] p-10 border border-slate-800">

              <h2 className="text-4xl font-bold">

                Ready To Start?

              </h2>

              <p className="text-slate-300 mt-6 text-lg">

                Submit your medical reports and receive

                hospital recommendations, doctor opinions

                and estimated treatment costs.

              </p>

              <div className="grid grid-cols-2 gap-6 mt-10">

                <div>

                  <h3 className="text-4xl font-bold text-blue-400">

                    50+

                  </h3>

                  <p className="text-slate-400 mt-2">

                    Partner Hospitals

                  </p>

                </div>

                <div>

                  <h3 className="text-4xl font-bold text-green-400">

                    90%

                  </h3>

                  <p className="text-slate-400 mt-2">

                    Cost Savings

                  </p>

                </div>

                <div>

                  <h3 className="text-4xl font-bold text-cyan-400">

                    100+

                  </h3>

                  <p className="text-slate-400 mt-2">

                    Countries Served

                  </p>

                </div>

                <div>

                  <h3 className="text-4xl font-bold text-purple-400">

                    24/7

                  </h3>

                  <p className="text-slate-400 mt-2">

                    Patient Support

                  </p>

                </div>

              </div>

              <a
                href="/#consultation"
                className="inline-block mt-10 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl font-semibold transition"
              >

                Get Free Consultation

              </a>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}