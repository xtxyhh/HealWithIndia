import {
  Mail,
  Phone,
  Globe,
  ArrowRight,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Hospitals", href: "/hospitals" },
  { label: "Treatments", href: "/treatments" },
  { label: "Contact", href: "/contact" },
];

const treatmentLinks = [
  { label: "Cardiology", href: "/treatments/cardiology" },
  { label: "Oncology", href: "/treatments/oncology" },
  { label: "Orthopedics", href: "/treatments/orthopedics" },
  { label: "IVF Treatment", href: "/treatments/ivf" },
  {
    label: "Kidney Transplant",
    href: "/treatments/kidney-transplant",
  },
];

const legalLinks = [
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
  },

  {
    label: "Terms & Conditions",
    href: "/terms",
  },

  {
    label: "FAQ",
    href: "/faq",
  },
];

const certifications = [
  "HIPAA Compliant",

  "Secure Data Handling",

  "International Patient Services",
];

export default function Footer() {
  return (
    <footer className="bg-[#020712] border-t border-slate-800 text-slate-300">

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-20">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Company */}

          <div className="space-y-6">

            <h2 className="text-4xl font-bold text-white">

              HealWithIndia

            </h2>

            <div className="flex flex-wrap gap-2">

              {certifications.map((item) => (

                <span
                  key={item}
                  className="bg-slate-900 border border-slate-800 text-slate-300 px-3 py-2 rounded-full text-xs"
                >

                  {item}

                </span>

              ))}

            </div>

            <p className="leading-relaxed text-slate-400">

              Connecting international patients with India's
              leading hospitals, experienced specialists and
              affordable world-class healthcare.

            </p>

            <div className="space-y-4">

              <div className="flex items-center gap-3">

                <Mail
                  size={18}
                  className="text-blue-400"
                />

                <span>

                  care@healwithindia.com

                </span>

              </div>

              <div className="flex items-center gap-3">

                <Phone
                  size={18}
                  className="text-green-400"
                />

                <span>

                  +91 91167 34675

                </span>

              </div>

              <div className="flex items-center gap-3">

                <Globe
                  size={18}
                  className="text-cyan-400"
                />

                <span>

                  Global Patient Services

                </span>

              </div>

            </div>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="text-xl font-semibold text-white mb-6">

              Quick Links

            </h3>

            <div className="space-y-4">

              {quickLinks.map((link) => (

                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition"
                >

                  <ArrowRight size={16} />

                  {link.label}

                </a>

              ))}

            </div>

          </div>

          {/* Treatments */}

          <div>

            <h3 className="text-xl font-semibold text-white mb-6">

              Treatments

            </h3>

            <div className="space-y-4">

              {treatmentLinks.map((link) => (

                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition"
                >

                  <ArrowRight size={16} />

                  {link.label}

                </a>

              ))}

            </div>

          </div>

          {/* CTA */}

          <div className="space-y-6">

            <h3 className="text-xl font-semibold text-white">

              Need Medical Assistance?

            </h3>

            <p className="leading-relaxed text-slate-400">

              Get a free treatment estimate and connect
              with India's leading hospitals today.

            </p>

            <a
              href="#consultation"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-700 hover:scale-105 shadow-[0_0_30px_rgba(59,130,246,0.35)]"
            >

              Free Consultation

              <ArrowRight size={18} />

            </a>

          </div>

        </div>

        {/* Bottom */}

        <div className="border-t border-slate-800 mt-16 pt-8">

          <div className="flex flex-col lg:flex-row items-center justify-between gap-5">

            <p className="text-slate-500 text-center lg:text-left">

              © 2026 HealWithIndia.

              All Rights Reserved.

            </p>

            <div className="flex flex-wrap gap-6 text-sm">

              {legalLinks.map((item) => (

                <a
                  key={item.label}
                  href={item.href}
                  className="text-slate-500 hover:text-white transition"
                >

                  {item.label}

                </a>

              ))}

            </div>

          </div>

        </div>

      </div>

    </footer>
  );
}