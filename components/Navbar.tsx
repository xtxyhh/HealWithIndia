"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone, MessageCircle } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Treatments", href: "/treatments" },
    { name: "Hospitals", href: "/hospitals" },
    { name: "Why India", href: "/why-india" },
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Top Bar */}

      <div className="bg-blue-600 text-white text-center text-xs font-medium py-2">
        Trusted Medical Tourism Partner • 24/7 Patient Support • Free Medical Review
      </div>

      {/* Navbar */}

      <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-2xl border-b border-slate-800">

        <div className="max-w-7xl mx-auto px-4 lg:px-6">

          <div className="h-24 flex items-center justify-between">

            {/* Logo */}

            <Link
              href="/"
              className="flex items-center gap-3 shrink-0"
            >

              <Image
                src="/images/logo.png"
                alt="HealWithIndia"
                width={48}
                height={48}
                priority
                className="rounded-xl"
              />

              <div>

                <h1 className="text-2xl font-bold text-white leading-none">
                  HealWithIndia
                </h1>

                <p className="text-xs text-slate-400 mt-1">
                  International Patient Care
                </p>

              </div>

            </Link>

            {/* Desktop Links */}

            <div className="hidden lg:flex items-center gap-8">

              {navLinks.map((link) => (

                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[15px] font-medium text-slate-300 hover:text-white transition"
                >
                  {link.name}
                </Link>

              ))}

            </div>

            {/* Desktop CTA */}

            <div className="hidden lg:flex items-center gap-3">

              <a
                href="tel:+919116734675"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 text-white hover:border-blue-500 hover:bg-slate-900 transition"
              >

                <Phone size={17} />

                Call

              </a>

              <a
                href="https://wa.me/919116734675"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition"
              >

                <MessageCircle size={17} />

                WhatsApp

              </a>

              <a
                href="/#consultation"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow-lg shadow-blue-600/20"
              >

                Free Consultation

              </a>

            </div>

            {/* Mobile Button */}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-white"
            >

              {menuOpen ? (

                <X size={30} />

              ) : (

                <Menu size={30} />

              )}

            </button>

          </div>

        </div>

        {/* Mobile Menu */}

        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            menuOpen
              ? "max-h-[500px] border-t border-slate-800"
              : "max-h-0"
          }`}
        >

          <div className="px-6 py-6 bg-slate-950">

            <div className="flex flex-col gap-5">

              {navLinks.map((link) => (

                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-slate-300 hover:text-white transition"
                >

                  {link.name}

                </Link>

              ))}

            </div>

            <div className="flex flex-col gap-3 mt-8">

              <a
                href="/#consultation"
                className="bg-blue-600 hover:bg-blue-700 text-center text-white py-3 rounded-xl font-semibold transition"
              >

                Free Consultation

              </a>

              <a
                href="https://wa.me/919116734675"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-center text-white py-3 rounded-xl font-semibold transition"
              >

                WhatsApp

              </a>

            </div>

          </div>

        </div>

      </nav>
    </>
  );
}