import Image from "next/image";

export const metadata = {
  title: "Patient Success Stories | HealWithIndia",
  description:
    "Read inspiring stories from international patients who received world-class treatment in India.",
};

export default function SuccessStoriesPage() {
  const stories = [
    {
      name: "Michael R.",
      country: "United States",
      treatment: "Heart Bypass Surgery",
      hospital: "Apollo Hospitals, Chennai",
      usCost: "$180,000",
      indiaCost: "$18,000",
      saved: "$162,000",
      image: "/images/testimonials/patient1.jpg",
      quote:
        "HealWithIndia handled everything perfectly. The doctors were exceptional and the treatment quality exceeded my expectations.",
    },

    {
      name: "Sarah J.",
      country: "United Kingdom",
      treatment: "Knee Replacement",
      hospital: "Fortis Healthcare, New Delhi",
      usCost: "$55,000",
      indiaCost: "$7,000",
      saved: "$48,000",
      image: "/images/testimonials/patient2.jpg",
      quote:
        "From airport pickup to hospital admission, the whole process was seamless and stress free.",
    },

    {
      name: "Grace A.",
      country: "Nigeria",
      treatment: "IVF Treatment",
      hospital: "Medanta, Gurugram",
      usCost: "$18,000",
      indiaCost: "$4,000",
      saved: "$14,000",
      image: "/images/testimonials/patient3.jpg",
      quote:
        "We finally fulfilled our dream of becoming parents. The support team was incredibly helpful.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-black to-blue-950 py-28">

        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[140px] rounded-full" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[140px] rounded-full" />

        <div className="relative max-w-6xl mx-auto px-4 text-center">

          <span className="uppercase tracking-[4px] text-blue-400 text-sm font-semibold">

            Patient Success Stories

          </span>

          <h1 className="text-5xl lg:text-7xl font-bold mt-6">

            Trusted By Patients

            <br />

            Worldwide

          </h1>

          <p className="max-w-3xl mx-auto mt-8 text-xl text-slate-300">

            Patients from around the world choose India
            for affordable, advanced and trusted healthcare.

          </p>

        </div>

      </section>



      {/* STORIES */}

      <section className="py-24">

        <div className="max-w-7xl mx-auto px-4">

          <div className="grid lg:grid-cols-3 gap-8">

            {stories.map((story) => (

              <div
                key={story.name}
                className="bg-slate-950 border border-slate-800 rounded-[32px] overflow-hidden hover:border-blue-500 transition-all duration-300 hover:-translate-y-2"
              >

                <Image
                  src={story.image}
                  alt={story.name}
                  width={600}
                  height={400}
                  className="w-full h-72 object-cover"
                />

                <div className="p-8">

                  <div className="flex items-center gap-2">

                    <div className="text-yellow-400">

                      ★★★★★

                    </div>

                  </div>

                  <h2 className="text-2xl font-bold mt-5">

                    {story.name}

                  </h2>

                  <p className="text-blue-400 mt-2">

                    {story.country}

                  </p>

                  <div className="mt-6 space-y-3">

                    <div>

                      <span className="text-slate-500">

                        Treatment

                      </span>

                      <p className="font-semibold">

                        {story.treatment}

                      </p>

                    </div>

                    <div>

                      <span className="text-slate-500">

                        Hospital

                      </span>

                      <p className="font-semibold">

                        {story.hospital}

                      </p>

                    </div>

                  </div>


                  <div className="grid grid-cols-2 gap-4 mt-8">

                    <div className="bg-slate-900 rounded-2xl p-4">

                      <p className="text-slate-500 text-sm">

                        Home Country Cost

                      </p>

                      <h3 className="text-2xl font-bold mt-2">

                        {story.usCost}

                      </h3>

                    </div>

                    <div className="bg-slate-900 rounded-2xl p-4">

                      <p className="text-slate-500 text-sm">

                        India Cost

                      </p>

                      <h3 className="text-2xl font-bold mt-2 text-blue-400">

                        {story.indiaCost}

                      </h3>

                    </div>

                  </div>

                  <div className="mt-6">

                    <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full">

                      Saved {story.saved}

                    </span>

                  </div>

                  <p className="text-slate-400 mt-8 leading-relaxed">

                    "{story.quote}"

                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>



      {/* STATS */}

      <section className="py-20 border-t border-slate-800">

        <div className="max-w-7xl mx-auto px-4">

          <div className="grid md:grid-cols-4 gap-8 text-center">

            <div>

              <h3 className="text-5xl font-bold text-blue-400">

                50+

              </h3>

              <p className="text-slate-400 mt-3">

                Partner Hospitals

              </p>

            </div>

            <div>

              <h3 className="text-5xl font-bold text-green-400">

                100+

              </h3>

              <p className="text-slate-400 mt-3">

                Countries Served

              </p>

            </div>

            <div>

              <h3 className="text-5xl font-bold text-cyan-400">

                90%

              </h3>

              <p className="text-slate-400 mt-3">

                Cost Savings

              </p>

            </div>

            <div>

              <h3 className="text-5xl font-bold text-purple-400">

                24/7

              </h3>

              <p className="text-slate-400 mt-3">

                Patient Support

              </p>

            </div>

          </div>

        </div>

      </section>



      {/* CTA */}

      <section className="py-24 bg-gradient-to-r from-blue-950 via-slate-950 to-cyan-950">

        <div className="max-w-5xl mx-auto px-4 text-center">

          <h2 className="text-5xl lg:text-6xl font-bold">

            Need Similar Treatment?

          </h2>

          <p className="text-slate-300 mt-8 text-xl">

            Get a free medical opinion and connect
            with India's leading hospitals.

          </p>

          <a
            href="/#consultation"
            className="inline-block mt-10 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl font-semibold transition"
          >

            Get Free Medical Opinion

          </a>

        </div>

      </section>

    </main>
  );
}