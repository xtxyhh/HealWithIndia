import Image from "next/image";

export default function ApolloPage() {
  return (
    <main className="min-h-screen bg-slate-950">

      <section className="bg-slate-950 text-white py-20">

        <div className="max-w-7xl mx-auto px-4">

          <Image
            src="/images/apollo.png"
            alt="Apollo Hospitals"
            width={250}
            height={100}
            className="mb-8"
          />

          <h1 className="text-5xl font-bold">
            Apollo Hospitals
          </h1>

          <p className="text-slate-300 text-xl mt-6">
            One of India's most trusted healthcare institutions
            serving international patients for over three decades.
          </p>

        </div>

      </section>

      <section className="py-20">

        <div className="max-w-7xl mx-auto px-4">

          <div className="grid lg:grid-cols-2 gap-16">

            <div>

              <h2 className="text-4xl font-bold">
                Why Apollo Hospitals
              </h2>

              <ul className="mt-8 space-y-4 text-slate-400">
                <li>✓ International Patient Services</li>
                <li>✓ Organ Transplants</li>
                <li>✓ Cardiology Excellence</li>
                <li>✓ Oncology Specialists</li>
                <li>✓ Advanced Robotic Surgery</li>
                <li>✓ Global Patient Support</li>
              </ul>

            </div>

            <div className="bg-slate-900 p-10 rounded-3xl">

              <h3 className="text-2xl font-bold">
                Popular Treatments
              </h3>

              <div className="space-y-4 mt-6">

                <div>❤️ Heart Surgery</div>
                <div>🩺 Organ Transplants</div>
                <div>🎗️ Cancer Treatment</div>
                <div>🦴 Orthopedics</div>
                <div>🧠 Neurosurgery</div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}