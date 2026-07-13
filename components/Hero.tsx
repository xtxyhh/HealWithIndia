import Image from "next/image";
import {
  ShieldCheck,
  Globe,
  Building2,
  UserRoundCheck,
  ArrowRight,
  HeartPulse,
  Stethoscope,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

type Stat = {
  number: string;
  label: string;
  color: string;
};

type TrustFeature = {
  icon: LucideIcon;
  label: string;
  color: string;
};

type NetworkFeature = {
  icon: LucideIcon;
  color: string;
  title: string;
  description: string;
};

const TREATMENTS: string[] = [
  "Cardiology",
  "Oncology",
  "Orthopedics",
  "Organ Transplant",
  "IVF",
  "Neurology",
];

const COUNTRIES: string[] = [
  "🇺🇸 USA",
  "🇬🇧 UK",
  "🇦🇪 UAE",
  "🇨🇦 Canada",
  "🇳🇬 Nigeria",
  "🇦🇺 Australia",
];

const STATS: Stat[] = [
  { number: "50+", label: "Partner Hospitals", color: "text-blue-400" },
  { number: "90%", label: "Cost Savings", color: "text-green-400" },
  { number: "24/7", label: "Patient Support", color: "text-cyan-400" },
];

const TRUST_FEATURES: TrustFeature[] = [
  { icon: ShieldCheck, label: "HIPAA Compliant", color: "text-green-400" },
  { icon: Building2, label: "JCI Accredited Hospitals", color: "text-blue-400" },
  { icon: UserRoundCheck, label: "Verified Care Coordinator", color: "text-cyan-400" },
  { icon: Globe, label: "Patients Worldwide", color: "text-purple-400" },
];

const HOSPITAL_LOGOS: string[] = [
  "apollo",
  "fortis",
  "medanta",
  "max",
  "manipal",
  "narayana",
];

const NETWORK_FEATURES: NetworkFeature[] = [
  {
    icon: ShieldCheck,
    color: "text-green-400",
    title: "Accredited Hospitals",
    description: "JCI & NABH certified hospitals following international standards.",
  },
  {
    icon: Globe,
    color: "text-blue-400",
    title: "Global Patients",
    description: "Trusted by patients from over 100 countries worldwide.",
  },
  {
    icon: UserRoundCheck,
    color: "text-cyan-400",
    title: "Dedicated Coordinator",
    description: "Personal support throughout your treatment journey.",
  },
  {
    icon: Building2,
    color: "text-purple-400",
    title: "End-to-End Care",
    description: "Consultation, travel, treatment and follow-up.",
  },
];

export default function Hero() {
  return (
    <>
      <section id="home" className="relative overflow-hidden bg-[#020817] text-white">
        {/* BACKGROUND */}
        <div className="absolute inset-0">
          <div className="absolute -top-64 -left-52 w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[160px]" />
          <div className="absolute -bottom-72 -right-40 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[160px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,.06),transparent_70%)]" />
          <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        <div className="relative z-10 max-w-[1450px] mx-auto px-6 sm:px-8 lg:px-10 pt-24 md:pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
            {/* LEFT SIDE */}
            <div className="relative">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-300 text-sm font-medium">
                <Sparkles size={15} />
                Trusted by international patients
              </div>

              <h1 className="mt-8 text-[40px] sm:text-[52px] lg:text-[64px] xl:text-[76px] font-bold leading-[1.05] tracking-[-1.5px]">
                World-class medical care in{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  India
                </span>
                <br />
                Save up to <span className="text-green-400">90%</span>
              </h1>

              <p className="mt-7 max-w-2xl text-base sm:text-lg leading-[1.8] text-slate-300">
                Access internationally accredited hospitals, experienced doctors, and
                dedicated care coordinators for cardiology, oncology, organ transplants,
                IVF, orthopedics and advanced treatments — all at a fraction of the cost.
              </p>

              {/* TREATMENTS */}
              <div className="flex flex-wrap gap-2.5 mt-9">
                {TREATMENTS.map((item) => (
                  <div
                    key={item}
                    className="px-4 py-2.5 rounded-full border border-slate-800 bg-slate-900/60 text-sm text-slate-200 hover:border-blue-500/60 hover:bg-blue-500/10 transition-colors duration-200 cursor-pointer"
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <a
                  href="#consultation"
                  className="group flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-base font-semibold transition-colors duration-200"
                >
                  Get Free Medical Opinion
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </a>

                <a
                  href="/treatments"
                  className="flex items-center justify-center px-7 py-4 rounded-2xl border border-slate-700 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-900 transition-colors duration-200 text-base font-medium"
                >
                  Explore Treatments
                </a>
              </div>

              {/* TRUST FEATURES */}
              <div className="flex flex-wrap gap-x-7 gap-y-4 mt-12">
                {TRUST_FEATURES.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.label} className="flex items-center gap-2.5">
                      <Icon size={18} className={feature.color} />
                      <span className="text-slate-300 text-sm">{feature.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
                {STATS.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-colors duration-200 hover:border-slate-700"
                  >
                    <div className={`text-3xl lg:text-4xl font-bold ${item.color}`}>
                      {item.number}
                    </div>
                    <p className="text-slate-400 text-sm mt-2">{item.label}</p>
                  </div>
                ))}
              </div>

              {/* COUNTRIES */}
              <div className="mt-12">
                <p className="text-slate-400 text-sm mb-4">Patients from</p>
                <div className="flex flex-wrap gap-2.5">
                  {COUNTRIES.map((country) => (
                    <div
                      key={country}
                      className="px-4 py-2.5 rounded-full border border-slate-800 bg-slate-900/50 text-slate-200 text-sm hover:border-slate-700 transition-colors duration-200"
                    >
                      {country}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="relative flex justify-center items-center min-h-[560px] lg:min-h-[720px]">
              {/* BACK GLOW */}
              <div className="absolute w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] rounded-full bg-blue-500/15 blur-[140px]" />
              <div className="absolute top-[20%] right-[12%] w-[200px] h-[200px] rounded-full bg-cyan-500/15 blur-[100px]" />

              {/* GLASS CIRCLE */}
              <div className="absolute w-[300px] h-[300px] sm:w-[410px] sm:h-[410px] rounded-full border border-white/10 bg-white/[0.02]" />

              {/* DOCTOR IMAGE */}
              <Image
                src="/images/hero-doctor.png"
                alt="Doctor"
                width={820}
                height={820}
                priority
                className="relative z-10 object-contain w-full max-w-[520px] lg:max-w-[620px] drop-shadow-[0_40px_100px_rgba(0,0,0,.75)] animate-[float_6s_ease-in-out_infinite]"
              />

              {/* TOP LEFT CARD */}
              <div className="absolute left-0 top-10 sm:left-4 z-20 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl px-5 py-4 shadow-xl shadow-black/40 animate-[float_7s_ease-in-out_infinite]">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
                    <Building2 size={22} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Accredited</p>
                    <h3 className="text-base font-semibold">Hospitals</h3>
                  </div>
                </div>
              </div>

              {/* TOP RIGHT CARD */}
              <div className="absolute top-10 right-0 sm:right-4 z-20 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl px-6 py-5 shadow-xl shadow-black/40 animate-[float_8s_ease-in-out_infinite]">
                <div className="text-4xl font-bold text-green-400">90%</div>
                <p className="text-slate-300 text-sm mt-1.5">Cost Savings</p>
              </div>

              {/* BOTTOM LEFT CARD */}
              <div className="absolute bottom-8 left-0 sm:left-6 z-20 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl px-6 py-5 shadow-xl shadow-black/40 animate-[float_9s_ease-in-out_infinite]">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-xl bg-green-500/15 flex items-center justify-center">
                    <HeartPulse size={22} className="text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">100+</h3>
                    <p className="text-slate-400 text-xs">Countries Served</p>
                  </div>
                </div>
              </div>

              {/* BOTTOM RIGHT CARD */}
              <div className="absolute bottom-10 right-0 sm:right-6 z-20 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl px-6 py-5 shadow-xl shadow-black/40 animate-[float_10s_ease-in-out_infinite]">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-xl bg-cyan-500/15 flex items-center justify-center">
                    <Stethoscope size={22} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">24/7</h3>
                    <p className="text-slate-400 text-xs">Care Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOSPITAL NETWORK */}
      <section className="relative py-24 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,.06),transparent_70%)]" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center">
            <p className="uppercase tracking-[4px] text-blue-400 text-sm font-semibold">
              Trusted Hospital Network
            </p>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-5">
              India&apos;s leading{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                healthcare institutions
              </span>
            </h2>

            <p className="text-slate-400 text-base md:text-lg max-w-3xl mx-auto mt-6 leading-relaxed">
              Collaborating with internationally accredited hospitals and experienced
              specialists to deliver world-class medical care for patients globally.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mt-16">
            {HOSPITAL_LOGOS.map((hospital) => (
              <div
                key={hospital}
                className="group h-28 rounded-2xl border border-slate-800 bg-slate-950/70 flex items-center justify-center hover:border-blue-500/50 transition-colors duration-300"
              >
                <Image
                  src={`/images/${hospital}.png`}
                  alt={hospital}
                  width={140}
                  height={60}
                  className="object-contain w-[110px] h-[46px] opacity-70 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>

          {/* TRUST BAR */}
          <div className="mt-20 rounded-[32px] border border-slate-800 bg-slate-950/50 p-8 md:p-10">
            <div className="grid md:grid-cols-4 gap-10">
              {NETWORK_FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="text-center">
                    <Icon size={34} className={`mx-auto ${feature.color}`} />
                    <h3 className="text-lg font-semibold mt-4">{feature.title}</h3>
                    <p className="text-slate-400 text-sm mt-2.5">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}