"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Phone,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  Search,
  HeartPulse,
  Activity,
  Bone,
  Baby,
  ShieldPlus,
  Building2,
  BadgeCheck,
  Globe,
  Clock,
  type LucideIcon,
} from "lucide-react";

type NavLink = {
  name: string;
  href: string;
};

type Treatment = {
  name: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

type Hospital = {
  name: string;
  href: string;
  location: string;
};

const NAV_LINKS: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Protection System", href: "/protection" },
  { name: "Why India", href: "/why-india" },
  { name: "About", href: "/about" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

const TREATMENTS: Treatment[] = [
  {
    name: "Cardiology",
    href: "/treatments/cardiology",
    icon: HeartPulse,
    description: "Bypass surgery, angioplasty & valve care",
  },
  {
    name: "Oncology",
    href: "/treatments/oncology",
    icon: Activity,
    description: "Surgical, medical & radiation cancer care",
  },
  {
    name: "Orthopedics",
    href: "/treatments/orthopedics",
    icon: Bone,
    description: "Joint replacement & spine surgery",
  },
  {
    name: "IVF Treatment",
    href: "/treatments/ivf",
    icon: Baby,
    description: "Fertility evaluation & assisted conception",
  },
  {
    name: "Kidney Transplant",
    href: "/treatments/kidney-transplant",
    icon: ShieldPlus,
    description: "Living & deceased donor transplants",
  },
];

const HOSPITALS: Hospital[] = [
  { name: "Apollo Hospitals", href: "/hospitals/apollo", location: "Chennai · Delhi · Hyderabad" },
  { name: "Fortis Healthcare", href: "/hospitals/fortis", location: "Delhi NCR · Mumbai · Bangalore" },
  { name: "Medanta", href: "/hospitals/medanta", location: "Gurugram" },
  { name: "Max Healthcare", href: "/hospitals/max", location: "Delhi NCR" },
  { name: "Manipal Hospitals", href: "/hospitals/manipal", location: "Bangalore · Multiple cities" },
  { name: "Narayana Health", href: "/hospitals/narayana", location: "Bangalore · Kolkata" },
];

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onOutside: () => void
) {
  useEffect(() => {
    function handle(e: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handle);
    document.addEventListener("touchstart", handle);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("touchstart", handle);
    };
  }, [ref, onOutside]);
}

type NavDropdownProps = {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  width: number;
  children: ReactNode;
};

function NavDropdown({ label, isOpen, onToggle, onClose, width, children }: NavDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-1.5 text-[15px] font-medium text-slate-300 hover:text-white transition-colors duration-200 py-2"
      >
        {label}
        <ChevronDown
          size={16}
          strokeWidth={2.25}
          className={`transition-transform duration-300 ease-out ${isOpen ? "rotate-180 text-blue-400" : "text-slate-500"}`}
        />
      </button>

      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200 ease-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
        style={{ width }}
      >
        <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [treatmentsOpen, setTreatmentsOpen] = useState(false);
  const [hospitalsOpen, setHospitalsOpen] = useState(false);
  const [mobileTreatments, setMobileTreatments] = useState(false);
  const [mobileHospitals, setMobileHospitals] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeAllDropdowns = () => {
    setTreatmentsOpen(false);
    setHospitalsOpen(false);
  };

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setMobileTreatments(false);
    setMobileHospitals(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      {/* ANNOUNCEMENT BAR */}
      <div className="bg-slate-950 border-b border-white/[0.06]">
        <div className="max-w-[1500px] mx-auto px-5">
          <div className="h-9 flex items-center justify-center gap-x-6 gap-y-1 text-[13px] text-slate-300 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="flex items-center gap-1.5 shrink-0">
              <BadgeCheck size={14} className="text-blue-400 shrink-0" />
              JCI-accredited hospitals
            </span>
            <span className="h-3 w-px bg-slate-700 shrink-0" aria-hidden="true" />
            <span className="flex items-center gap-1.5 shrink-0">
              <Globe size={14} className="text-blue-400 shrink-0" />
              Patients from 100+ countries
            </span>
            <span className="h-3 w-px bg-slate-700 shrink-0" aria-hidden="true" />
            <span className="flex items-center gap-1.5 shrink-0">
              <Clock size={14} className="text-blue-400 shrink-0" />
              24/7 support
            </span>
          </div>
        </div>
      </div>

      {/* MAIN NAV */}
      <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-[1500px] mx-auto px-5">
          <div
            className={`flex items-center justify-between transition-[height] duration-300 ${
              scrolled ? "h-[76px]" : "h-[92px]"
            }`}
          >
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3.5 shrink-0" onClick={closeAllDropdowns}>
              <Image
                src="/images/logo.png"
                alt="HealWithIndia"
                width={48}
                height={48}
                priority
                className="rounded-xl border border-white/10"
              />
              <div className="hidden sm:block">
                <p className="text-lg font-semibold tracking-tight text-white leading-tight">
                  HealWithIndia
                </p>
                <p className="text-xs text-slate-400 leading-tight">
                  International Patient Care
                </p>
              </div>
            </Link>

            {/* DESKTOP NAV LINKS */}
            <div className="hidden lg:flex items-center gap-8 mx-8">
              <NavDropdown
                label="Treatments"
                isOpen={treatmentsOpen}
                onToggle={() => {
                  setTreatmentsOpen((v) => !v);
                  setHospitalsOpen(false);
                }}
                onClose={() => setTreatmentsOpen(false)}
                width={380}
              >
                <div className="p-2">
                  {TREATMENTS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={closeAllDropdowns}
                        className="group flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-slate-800/70 transition-colors duration-150"
                      >
                        <div className="h-11 w-11 shrink-0 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors duration-150">
                          <Icon size={20} className="text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-[15px] leading-tight">
                            {item.name}
                          </p>
                          <p className="text-slate-400 text-[13px] mt-0.5 leading-snug">
                            {item.description}
                          </p>
                        </div>
                        <ChevronRight
                          size={16}
                          className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-150 shrink-0"
                        />
                      </Link>
                    );
                  })}
                </div>
              </NavDropdown>

              <NavDropdown
                label="Hospitals"
                isOpen={hospitalsOpen}
                onToggle={() => {
                  setHospitalsOpen((v) => !v);
                  setTreatmentsOpen(false);
                }}
                onClose={() => setHospitalsOpen(false)}
                width={320}
              >
                <div className="p-2">
                  {HOSPITALS.map((hospital) => (
                    <Link
                      key={hospital.name}
                      href={hospital.href}
                      onClick={closeAllDropdowns}
                      className="group flex items-center gap-3.5 px-3 py-2.5 rounded-xl hover:bg-slate-800/70 transition-colors duration-150"
                    >
                      <div className="h-9 w-9 shrink-0 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Building2 size={17} className="text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-[14px] font-medium leading-tight">
                          {hospital.name}
                        </p>
                        <p className="text-slate-500 text-[12px] mt-0.5 truncate">
                          {hospital.location}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </NavDropdown>

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-[15px] font-medium py-2 transition-colors duration-200 ${
                    isActive(link.href) ? "text-white" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {link.name}
                  {isActive(link.href) && (
                    <span className="absolute left-0 -bottom-[1px] w-full h-[2px] rounded-full bg-blue-400" />
                  )}
                </Link>
              ))}
            </div>

            {/* RIGHT SIDE ACTIONS */}
            <div className="flex items-center gap-2.5">
              {/* SEARCH — desktop only */}
              <div className="hidden xl:block relative">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="text"
                  placeholder="Search hospitals"
                  aria-label="Search hospitals"
                  className="w-[190px] bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>

              {/* CALL — desktop only */}
              <a
                href="tel:+919116734675"
                className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 text-slate-200 text-sm font-medium hover:border-slate-700 hover:bg-slate-900 transition-all duration-200"
              >
                <Phone size={16} />
                Call
              </a>

              {/* WHATSAPP — desktop only */}
              <a
                href="https://wa.me/919116734675"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-semibold transition-colors duration-200"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>

              {/* MAIN CTA — desktop only */}
              <a
                href="/#consultation"
                className="hidden lg:flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors duration-200"
              >
                Free consultation
                <ChevronRight size={15} />
              </a>

              {/* MOBILE MENU TOGGLE */}
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="lg:hidden text-white p-2 rounded-lg hover:bg-slate-900 transition-colors duration-200"
              >
                {menuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      <div
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* MOBILE DRAWER */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`fixed top-0 right-0 h-[100dvh] w-[88%] max-w-[400px] z-[100] bg-slate-950 border-l border-slate-800 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-[76px] px-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="HealWithIndia"
              width={38}
              height={38}
              className="rounded-lg border border-white/10"
            />
            <div>
              <p className="text-white font-semibold leading-tight">HealWithIndia</p>
              <p className="text-slate-400 text-xs leading-tight">International Patient Care</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="text-slate-300 p-2 -mr-2 rounded-lg hover:bg-slate-900 hover:text-white transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100dvh-76px)] px-5 py-6">
          <div className="space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-medium transition-colors duration-150 ${
                  isActive(link.href)
                    ? "bg-blue-500/10 text-white border border-blue-500/20"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                {link.name}
                <ChevronRight size={16} className="text-slate-600" />
              </Link>
            ))}
          </div>

          {/* MOBILE TREATMENTS */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setMobileTreatments((v) => !v)}
              aria-expanded={mobileTreatments}
              className="w-full flex items-center justify-between text-white font-semibold text-[15px] mb-1"
            >
              Treatments
              <ChevronDown
                size={18}
                className={`text-slate-500 transition-transform duration-300 ${
                  mobileTreatments ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-out ${
                mobileTreatments ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="space-y-2">
                  {TREATMENTS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-900 hover:bg-slate-800 transition-colors duration-150"
                      >
                        <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                          <Icon size={19} className="text-blue-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium text-sm leading-tight">
                            {item.name}
                          </p>
                          <p className="text-slate-500 text-xs mt-0.5 truncate">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE HOSPITALS */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setMobileHospitals((v) => !v)}
              aria-expanded={mobileHospitals}
              className="w-full flex items-center justify-between text-white font-semibold text-[15px] mb-1"
            >
              Hospitals
              <ChevronDown
                size={18}
                className={`text-slate-500 transition-transform duration-300 ${
                  mobileHospitals ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-out ${
                mobileHospitals ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="space-y-2">
                  {HOSPITALS.map((hospital) => (
                    <Link
                      key={hospital.name}
                      href={hospital.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-900 hover:bg-slate-800 transition-colors duration-150"
                    >
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Building2 size={18} className="text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium text-sm leading-tight">
                          {hospital.name}
                        </p>
                        <p className="text-slate-500 text-xs mt-0.5 truncate">
                          {hospital.location}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE ACTIONS */}
          <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
            <a
              href="tel:+919116734675"
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl border border-slate-700 text-white font-medium hover:border-slate-600 hover:bg-slate-900 transition-colors duration-200"
            >
              <Phone size={18} />
              Call now
            </a>
            <a
              href="https://wa.me/919116734675"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition-colors duration-200"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
            <a
              href="/#consultation"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors duration-200"
            >
              Start free consultation
              <ChevronRight size={17} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}