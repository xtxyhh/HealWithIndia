"use client";

import { useState } from "react";
import {
  Plus,
  Minus,
  HelpCircle,
} from "lucide-react";

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

    <section className="relative overflow-hidden py-24 lg:py-32 bg-black">

      {/* Background Glow */}

      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[160px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[160px] rounded-full" />



      <div className="relative max-w-5xl mx-auto px-5 lg:px-6">

        {/* Heading */}

        <div className="text-center mb-16 lg:mb-24">

          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400">

            <HelpCircle size={18} />

            Frequently Asked Questions

          </div>

          <h2 className="mt-8 text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight">

            Questions

            <br />

            International Patients Ask

          </h2>

          <p className="text-slate-400 mt-8 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">

            Everything you need to know before planning your treatment in India.

          </p>

        </div>



        {/* FAQ */}

        <div className="space-y-6">

          {

            faqs.map((faq,index)=>(

              <div

                key={index}

                className="

                group

                relative

                overflow-hidden

                rounded-[28px]

                border

                border-slate-800

                bg-gradient-to-b

                from-slate-950

                to-slate-900

                hover:border-blue-500/50

                transition-all

                duration-500

                "

              >

                {/* Glow */}

                <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-blue-500/10 blur-[120px] opacity-0 group-hover:opacity-100 transition duration-700" />



                <button

                  onClick={()=>

                    setOpen(

                      open===index

                      ? null

                      : index

                    )

                  }

                  className="

                  relative

                  z-10

                  w-full

                  px-6

                  lg:px-8

                  py-7

                  flex

                  items-center

                  justify-between

                  gap-6

                  text-left

                  "

                >

                  <div className="flex items-start gap-5">

                    <div

                      className="

                      min-w-[48px]

                      h-12

                      rounded-2xl

                      bg-blue-500/10

                      border

                      border-blue-500/20

                      flex

                      items-center

                      justify-center

                      "

                    >

                      <span className="font-bold text-blue-400">

                        {(index+1)

                        .toString()

                        .padStart(2,"0")}

                      </span>

                    </div>



                    <div>

                      <h3

                        className="

                        text-white

                        text-lg

                        lg:text-2xl

                        font-semibold

                        "

                      >

                        {faq.question}

                      </h3>

                    </div>

                  </div>



                  <div

                    className="

                    min-w-[48px]

                    h-12

                    rounded-full

                    bg-slate-900

                    border

                    border-slate-700

                    flex

                    items-center

                    justify-center

                    "

                  >

                    {

                      open===index ?

                      <Minus

                        className="text-blue-400"

                        size={20}

                      />

                      :

                      <Plus

                        className="text-slate-300"

                        size={20}

                      />

                    }

                  </div>

                </button>



                <div

                  className={`

                  transition-all

                  duration-500

                  overflow-hidden

                  ${

                    open===index

                    ?

                    "max-h-96 opacity-100"

                    :

                    "max-h-0 opacity-0"

                  }

                  `}

                >

                  <div

                    className="

                    px-6

                    lg:px-8

                    pb-8

                    pl-[92px]

                    "

                  >

                    <p

                      className="

                      text-slate-400

                      text-base

                      lg:text-lg

                      leading-relaxed

                      "

                    >

                      {faq.answer}

                    </p>

                  </div>

                </div>

              </div>

            ))

          }

        </div>



        {/* Bottom CTA */}

        <div className="text-center mt-20">

          <p className="text-slate-400">

            Still have questions?

          </p>

          <a

            href="/#consultation"

            className="

            inline-flex

            mt-6

            px-8

            py-4

            rounded-2xl

            bg-blue-600

            hover:bg-blue-700

            shadow-[0_0_40px_rgba(37,99,235,0.35)]

            transition

            font-semibold

            "

          >

            Get Free Medical Opinion

          </a>

        </div>

      </div>

    </section>

  );

}