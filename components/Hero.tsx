import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="home"
      className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <div>

            <span className="bg-blue-600/20 border border-blue-500 text-blue-300 px-4 py-2 rounded-full text-sm">
              Trusted International Medical Tourism Platform
            </span>

            <h1 className="text-5xl lg:text-7xl font-bold mt-8 leading-tight">
              World-Class
              <span className="text-blue-400">
                {" "}Medical Care{" "}
              </span>
              in India
            </h1>

            <p className="text-xl text-slate-300 mt-8 leading-relaxed">
              Connect with leading hospitals, experienced
              specialists and affordable treatment options
              across India while receiving end-to-end support
              for your medical journey.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <a
                href="#consultation"
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold transition"
              >
                Get Free Consultation
              </a>

              <a
                href="#treatments"
                className="border border-slate-500 hover:border-blue-500 px-8 py-4 rounded-xl transition"
              >
                Explore Treatments
              </a>

            </div>

            <div className="flex flex-wrap gap-6 mt-10 text-sm text-slate-300">

              <div>✓ Free Case Evaluation</div>
              <div>✓ Dedicated Coordinator</div>
              <div>✓ Travel Assistance</div>
              <div>✓ Hospital Matching</div>

            </div>

          </div>

          <div>

            <div className="relative">

              <Image
                src="/images/hero-doctor.png"
                alt="Doctor"
                width={700}
                height={700}
                className="rounded-3xl shadow-2xl"
                priority
              />

              <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 rounded-2xl p-5 shadow-xl">
                <div className="text-3xl font-bold text-blue-600">
                  50+
                </div>
                <div className="text-sm">
                  Partner Hospitals
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white text-slate-900 rounded-2xl p-5 shadow-xl">
                <div className="text-3xl font-bold text-green-600">
                  70%
                </div>
                <div className="text-sm">
                  Cost Savings
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
