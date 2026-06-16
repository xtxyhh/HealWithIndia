"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Why choose India for medical treatment?",
    answer:
      "India offers world-class healthcare, internationally accredited hospitals, highly experienced doctors and treatment costs that are often 60% to 90% lower than many Western countries.",
  },
  {
    question: "How much can I save on treatment in India?",
    answer:
      "Depending on the procedure, patients can save between 60% and 90% compared to healthcare costs in the United States, United Kingdom and Europe.",
  },
  {
    question: "Are Indian hospitals safe and accredited?",
    answer:
      "Yes. We work with reputed hospitals that follow international standards and have dedicated international patient departments.",
  },
  {
    question: "Do you help with medical visas?",
    answer:
      "Yes. We assist patients with medical visa guidance, invitation letters, travel planning and treatment coordination.",
  },
  {
    question: "Can I send my medical reports for review?",
    answer:
      "Absolutely. You can upload your reports through our consultation form and our team will help connect you with suitable hospitals and specialists.",
  },
  {
    question: "Do you charge patients for consultations?",
    answer:
      "Initial consultations and case evaluations through HealWithIndia are completely free.",
  },
  {
    question: "Will someone assist me after I arrive in India?",
    answer:
      "Yes. We provide patient coordinators, airport pickup guidance, accommodation assistance and treatment coordination support.",
  },
  {
    question: "How long does it take to receive a treatment plan?",
    answer:
      "Most patients receive hospital recommendations and preliminary treatment options within 24 to 72 hours after report submission.",
  },
  {
    question: "Can family members travel with me?",
    answer:
      "Yes. Family members can accompany patients and we can assist with travel and accommodation arrangements.",
  },
  {
    question: "How do I get started?",
    answer:
      "Simply submit the consultation form with your medical details and reports. Our team will contact you with the next steps.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-black to-blue-950 py-28">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full" />

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <span className="uppercase tracking-[4px] text-blue-400 text-sm font-semibold">
            Frequently Asked Questions
          </span>

          <h1 className="text-5xl lg:text-7xl font-bold mt-6">
            Everything You
            <br />
            Need To Know
          </h1>

          <p className="text-slate-300 text-xl mt-8 max-w-3xl mx-auto">
            Answers to common questions from international patients
            considering treatment in India.
          </p>
        </div>
      </section>

      {/* FAQ */}

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-950 border border-slate-800 rounded-[28px] overflow-hidden hover:border-blue-500/50 transition"
              >
                <button
                  onClick={() =>
                    setOpen(open === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-7 text-left"
                >
                  <h3 className="text-xl font-semibold">
                    {faq.question}
                  </h3>

                  <ChevronDown
                    size={24}
                    className={`transition duration-300 ${
                      open === index
                        ? "rotate-180 text-blue-400"
                        : "text-slate-400"
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    open === index
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-7 pb-7 text-slate-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="py-24 bg-gradient-to-r from-blue-950 via-slate-950 to-cyan-950">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-5xl lg:text-6xl font-bold">
            Still Have Questions?
          </h2>

          <p className="text-slate-300 mt-8 text-xl">
            Speak with our healthcare team and receive a free
            medical opinion.
          </p>

          <a
            href="/#consultation"
            className="inline-block mt-10 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl font-semibold transition"
          >
            Get Free Consultation
          </a>
        </div>
      </section>
    </main>
  );
}