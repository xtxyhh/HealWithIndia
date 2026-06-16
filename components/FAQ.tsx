"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      question: "Why choose India for medical treatment?",
      answer:
        "India offers internationally accredited hospitals, highly experienced specialists, advanced medical technology and treatment costs that are often 70% to 90% lower than many Western countries.",
    },
    {
      question: "How much can I save on treatment in India?",
      answer:
        "Depending on the procedure, international patients commonly save between 60% and 90% compared to healthcare costs in the United States, United Kingdom and Europe.",
    },
    {
      question: "Are Indian hospitals safe and accredited?",
      answer:
        "Yes. We partner with reputed hospitals that follow international quality standards and maintain dedicated international patient departments.",
    },
    {
      question: "Do you help with medical visas?",
      answer:
        "Yes. We assist patients with invitation letters, medical visa guidance, travel planning and treatment coordination.",
    },
    {
      question: "Can I send my medical reports for review?",
      answer:
        "Absolutely. You can upload reports through our consultation form and our team will connect you with suitable hospitals and specialists.",
    },
    {
      question: "Do you charge patients for consultations?",
      answer:
        "Initial case evaluations and treatment guidance through HealWithIndia are completely free.",
    },
    {
      question: "Will someone assist me after I arrive in India?",
      answer:
        "Yes. We provide patient coordination support, accommodation guidance, airport assistance and treatment scheduling.",
    },
    {
      question: "How long does it take to receive a treatment plan?",
      answer:
        "Most patients receive preliminary treatment options and hospital recommendations within 24–72 hours after report submission.",
    },
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-28 bg-black">

      <div className="max-w-5xl mx-auto px-4 lg:px-6">

        <div className="text-center mb-20">

          <span className="text-blue-400 uppercase tracking-[4px] text-sm font-semibold">
            Frequently Asked Questions
          </span>

          <h2 className="text-5xl lg:text-6xl font-bold text-white mt-5">
            Questions International Patients Ask
          </h2>

          <p className="text-slate-400 mt-6 text-lg">
            Everything you need to know before planning treatment in India.
          </p>

        </div>

        <div className="space-y-5">

          {faqs.map((faq, index) => (

            <div
              key={index}
              className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden"
            >

              <button
                onClick={() =>
                  setOpen(open === index ? null : index)
                }
                className="w-full flex justify-between items-center text-left p-7"
              >

                <span className="text-white font-semibold text-lg">
                  {faq.question}
                </span>

                <ChevronDown
                  size={22}
                  className={`text-blue-400 transition-transform ${
                    open === index ? "rotate-180" : ""
                  }`}
                />

              </button>

              {open === index && (

                <div className="px-7 pb-7">

                  <p className="text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>

                </div>

              )}

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}