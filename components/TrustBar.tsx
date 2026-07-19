import {
  Hospital,
  UserRound,
  Globe,
  FileText,
  BadgeCheck,
  Star,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  Plane,
  HeartHandshake,
  BadgeDollarSign,
  DollarSign,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
  iconBg: string;
  glow: string;
  borderGlow: string;
  number: string;
};

type Stat = {
  value: string;
  label: string;
  icon: LucideIcon;
};

type TrustItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
  iconBg: string;
  hoverBorder: string;
};

const FEATURES: Feature[] = [
  {
    icon: Hospital,
    title: "JCI & NABH Accredited Hospitals",
    description:
      "Access internationally accredited hospitals trusted by patients from over 100 countries.",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10 border-blue-500/30",
    glow: "bg-blue-500/25",
    borderGlow: "group-hover:shadow-[0_0_50px_-10px_rgba(59,130,246,.5)]",
    number: "01",
  },
  {
    icon: DollarSign,
    title: "70%–90% Cost Savings",
    description:
      "Receive world-class treatment while saving significantly compared to the US, UK and Europe.",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10 border-cyan-500/30",
    glow: "bg-cyan-500/25",
    borderGlow: "group-hover:shadow-[0_0_50px_-10px_rgba(34,211,238,.5)]",
    number: "02",
  },
  {
    icon: Plane,
    title: "Medical Visa Assistance",
    description:
      "Complete support for invitation letters, medical visas, airport pickup and accommodation.",
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/10 border-indigo-500/30",
    glow: "bg-indigo-500/25",
    borderGlow: "group-hover:shadow-[0_0_50px_-10px_rgba(129,140,248,.5)]",
    number: "03",
  },
  {
    icon: UserRound,
    title: "Verified Care Coordinator",
    description:
      "One verified coordinator manages your entire treatment journey with secure identity confirmation.",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/30",
    glow: "bg-emerald-500/25",
    borderGlow: "group-hover:shadow-[0_0_50px_-10px_rgba(52,211,153,.5)]",
    number: "04",
  },
  {
    icon: Globe,
    title: "International Patient Services",
    description:
      "Interpreter support, local assistance and personalized care for overseas patients.",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10 border-cyan-500/30",
    glow: "bg-cyan-500/25",
    borderGlow: "group-hover:shadow-[0_0_50px_-10px_rgba(34,211,238,.5)]",
    number: "05",
  },
  {
    icon: FileText,
    title: "Free Medical Review",
    description:
      "Our specialists review your reports and connect you with suitable hospitals and doctors.",
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10 border-purple-500/30",
    glow: "bg-purple-500/25",
    borderGlow: "group-hover:shadow-[0_0_50px_-10px_rgba(192,132,252,.5)]",
    number: "06",
  },
];

const STATS: Stat[] = [
  { value: "90%", label: "Cost Savings", icon: DollarSign },
  { value: "50+", label: "Partner Hospitals", icon: Hospital },
  { value: "24/7", label: "Patient Support", icon: HeartHandshake },
  { value: "20+", label: "Specialties", icon: Sparkles },
];

const TRUST_ITEMS: TrustItem[] = [
  {
    icon: BadgeCheck,
    title: "Accredited",
    description: "JCI & NABH Hospitals",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/30",
    hoverBorder: "hover:border-emerald-500/40",
  },
  {
    icon: ShieldCheck,
    title: "Secure",
    description: "Patient Data Protection",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10 border-blue-500/30",
    hoverBorder: "hover:border-blue-500/40",
  },
  {
    icon: HeartHandshake,
    title: "Dedicated Care",
    description: "Personal Coordinator",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10 border-cyan-500/30",
    hoverBorder: "hover:border-cyan-500/40",
  },
  {
    icon: Star,
    title: "Transparent",
    description: "Honest Pricing",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/30",
    hoverBorder: "hover:border-amber-500/40",
  },
];

const MINI_BADGES = [
  "Patients From 100+ Countries",
  "JCI & NABH Hospitals",
  "Dedicated Care Team",
];

export default function TrustBar() {
  return (
    <section className="relative overflow-hidden py-28 bg-[#020817]">
      {/* AURORA BACKGROUND */}
      <div className="absolute inset-0 -z-0">
        <div className="absolute top-[-250px] left-[-150px] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[170px] animate-pulse" />
        <div
          className="absolute bottom-[-250px] right-[-150px] w-[650px] h-[650px] rounded-full bg-cyan-500/15 blur-[180px] animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[160px] animate-pulse"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:70px_70px]"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,.1),transparent_70%)]" />

        {/* FLOATING PARTICLES */}
        <div className="absolute top-[15%] left-[8%] h-1.5 w-1.5 rounded-full bg-blue-400/60 animate-ping" style={{ animationDuration: "3s" }} />
        <div className="absolute top-[65%] left-[12%] h-1 w-1 rounded-full bg-cyan-400/60 animate-ping" style={{ animationDuration: "4s", animationDelay: "1s" }} />
        <div className="absolute top-[25%] right-[10%] h-1.5 w-1.5 rounded-full bg-cyan-400/50 animate-ping" style={{ animationDuration: "3.5s", animationDelay: "2s" }} />
        <div className="absolute bottom-[20%] right-[15%] h-1 w-1 rounded-full bg-blue-400/50 animate-ping" style={{ animationDuration: "5s", animationDelay: "0.5s" }} />
      </div>

      <div className="relative z-10 max-w-[1450px] mx-auto px-6 lg:px-10">
        {/* HEADER */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-xl text-blue-300 text-sm font-semibold tracking-wide shadow-[0_0_30px_rgba(37,99,235,.15)]">
            <Sparkles size={16} className="animate-pulse" />
            WHY PATIENTS TRUST HEALWITHINDIA
          </div>

          <h2 className="mt-8 text-[42px] sm:text-[56px] lg:text-[72px] font-bold leading-[0.98] tracking-tight text-white">
            End-To-End
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_6s_ease_infinite]">
              Medical Travel Support
            </span>
          </h2>

          <p className="mt-8 text-lg lg:text-xl leading-relaxed text-slate-400 max-w-3xl mx-auto">
            From diagnosis and hospital selection to travel, treatment and
            recovery support, we simplify every step of your healthcare
            journey with complete transparency and world-class patient care.
          </p>

          {/* MINI BADGES */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {MINI_BADGES.map((badge) => (
              <span
                key={badge}
                className="px-5 py-2.5 rounded-full bg-slate-900/60 border border-slate-800 backdrop-blur-xl text-slate-200 text-sm font-medium hover:border-blue-500/40 transition-colors duration-300"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* FEATURE GRID */}
        <div className="mt-24 grid md:grid-cols-2 xl:grid-cols-3 gap-7">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group relative rounded-[32px] p-[1px] bg-gradient-to-br from-slate-800 via-slate-800 to-slate-800 hover:from-blue-500/60 hover:via-cyan-500/40 hover:to-transparent transition-all duration-500 hover:-translate-y-2 ${feature.borderGlow} ${
                  index === 1 ? "xl:mt-10" : index === 4 ? "xl:-mt-10" : ""
                }`}
              >
                <div className="relative h-full overflow-hidden rounded-[31px] bg-slate-900/80 backdrop-blur-2xl p-8">
                  {/* GLOW ON HOVER */}
                  <div
                    className={`absolute top-[-60px] right-[-60px] w-[220px] h-[220px] rounded-full ${feature.glow} blur-[90px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
                  />

                  {/* GIANT WATERMARK NUMBER */}
                  <span className="absolute top-4 right-6 text-[64px] font-bold text-white/[0.03] leading-none select-none group-hover:text-white/[0.06] transition-colors duration-500">
                    {feature.number}
                  </span>

                  {/* ICON */}
                  <div
                    className={`relative h-16 w-16 rounded-2xl border ${feature.iconBg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-white/[0.04]" />
                    <Icon size={28} className={`relative ${feature.iconColor}`} />
                  </div>

                  <h3 className="relative mt-7 text-[22px] font-bold leading-tight text-white">
                    {feature.title}
                  </h3>

                  <p className="relative mt-4 text-slate-400 leading-relaxed text-[15px]">
                    {feature.description}
                  </p>

                  <div className="relative mt-7 flex items-center gap-2 text-blue-400 font-semibold text-sm group-hover:gap-3.5 transition-all duration-300">
                    Learn More
                    <ArrowUpRight
                      size={16}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* STATS — SINGLE GLOWING PANEL */}
        <div className="relative mt-28 rounded-[40px] border border-slate-800 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/80 backdrop-blur-2xl p-10 md:p-14 overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,.4)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-blue-500/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[130px]" />

          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 divide-y divide-slate-800 lg:divide-y-0 lg:divide-x">
            {STATS.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`text-center px-2 ${i > 0 ? "pt-8 lg:pt-0" : ""} ${
                    i > 1 ? "lg:pl-8" : ""
                  }`}
                >
                  <StatIcon
                    size={22}
                    className="mx-auto text-blue-400/70 mb-3"
                  />
                  <p className="text-[48px] md:text-[56px] font-bold bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent leading-none tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-slate-400 font-medium text-sm tracking-wide uppercase">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* TRUST STRIP */}
        <div className="relative overflow-hidden mt-8 rounded-[36px] border border-slate-800 bg-slate-900/50 backdrop-blur-2xl p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,.3)]">
          <div className="absolute top-[-100px] left-[-50px] w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-[130px]" />
          <div className="absolute bottom-[-100px] right-[-50px] w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[130px]" />

          <div className="relative grid md:grid-cols-4 gap-6">
            {TRUST_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`group flex items-center gap-4 rounded-[24px] border border-white/[0.06] bg-slate-950/60 p-6 ${item.hoverBorder} hover:-translate-y-0.5 transition-all duration-300`}
                >
                  <div
                    className={`h-14 w-14 shrink-0 rounded-2xl border ${item.iconBg} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
                  >
                    <Icon size={26} className={item.iconColor} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-[17px]">
                      {item.title}
                    </p>
                    <p className="text-slate-400 text-sm mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="relative text-center mt-28 rounded-[40px] border border-blue-500/20 bg-gradient-to-b from-blue-950/40 to-slate-900/40 backdrop-blur-2xl px-8 py-16 md:py-20 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-blue-500/15 blur-[140px]" />

          <div className="relative">
            <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Ready To Begin
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mt-1">
                Your Healthcare Journey?
              </span>
            </h3>

            <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed">
              Connect with our care team and receive expert guidance, hospital
              recommendations and a free treatment estimate.
            </p>

            <Link
              href="/#consultation"
              className="group inline-flex items-center gap-3 mt-10 px-9 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg hover:scale-[1.03] transition-transform duration-500 shadow-[0_0_60px_rgba(37,99,235,.4)]"
            >
              Start Free Consultation
              <ChevronRight
                size={20}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
      `}</style>
    </section>
  );
}