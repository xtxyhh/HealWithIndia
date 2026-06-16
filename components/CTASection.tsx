import { ArrowRight, Phone } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-28 bg-black">

      <div className="max-w-6xl mx-auto px-4 lg:px-6">

        <div
          className="
          relative
          overflow-hidden
          rounded-[40px]
          border
          border-slate-800
          bg-gradient-to-r
          from-blue-950
          via-slate-950
          to-cyan-950
          p-10
          lg:p-16
          "
        >

          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />

          <div className="relative text-center">

            <span className="text-blue-300 uppercase tracking-[4px] text-sm font-semibold">
              Free Medical Opinion
            </span>

            <h2 className="text-4xl lg:text-6xl font-bold text-white mt-6 leading-tight">
              Start Your Treatment
              Journey With Confidence
            </h2>

            <p className="text-slate-300 text-lg max-w-3xl mx-auto mt-6">
              Receive hospital recommendations,
              treatment estimates, doctor matching,
              medical visa assistance and complete
              patient support from our team.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-5 mt-10">

              <a
                href="#consultation"
                className="
                inline-flex
                items-center
                justify-center
                gap-2
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-8
                py-4
                rounded-2xl
                font-semibold
                transition
                "
              >
                Get Free Consultation

                <ArrowRight size={20} />
              </a>

              <a
                href="tel:+919116734675"
                className="
                inline-flex
                items-center
                justify-center
                gap-2
                border
                border-slate-700
                text-white
                px-8
                py-4
                rounded-2xl
                hover:border-blue-500
                transition
                "
              >
                <Phone size={20} />

                Call Now
              </a>

            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-14">

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">

                <h3 className="text-3xl font-bold text-blue-400">
                  24-72h
                </h3>

                <p className="text-slate-400 mt-2">
                  Treatment Review Time
                </p>

              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">

                <h3 className="text-3xl font-bold text-green-400">
                  90%
                </h3>

                <p className="text-slate-400 mt-2">
                  Potential Cost Savings
                </p>

              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">

                <h3 className="text-3xl font-bold text-cyan-400">
                  50+
                </h3>

                <p className="text-slate-400 mt-2">
                  Partner Hospitals
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}