import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <a
          href="#home"
          className="flex items-center gap-3"
        >
          <Image
            src="/images/logo.png"
            alt="HealWithIndia"
            width={55}
            height={55}
            className="rounded-lg"
          />

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              HealWithIndia
            </h1>

            <p className="text-xs text-slate-500">
              International Healthcare Concierge
            </p>
          </div>
        </a>

        <div className="hidden lg:flex gap-8 text-slate-700 font-medium">

          <a
            href="#home"
            className="hover:text-blue-600 transition"
          >
            Home
          </a>

          <a
            href="#treatments"
            className="hover:text-blue-600 transition"
          >
            Treatments
          </a>

          <a
            href="#hospitals"
            className="hover:text-blue-600 transition"
          >
            Hospitals
          </a>

          <a
            href="#journey"
            className="hover:text-blue-600 transition"
          >
            Patient Journey
          </a>

          <a
            href="#consultation"
            className="hover:text-blue-600 transition"
          >
            Contact
          </a>

        </div>

        <div className="flex gap-3">

          <a
            href="https://wa.me/919116734675"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold"
          >
            WhatsApp
          </a>

          <a
            href="#consultation"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
          >
            Free Consultation
          </a>

        </div>

      </div>

    </nav>
  );
}
