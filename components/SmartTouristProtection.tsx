import {
  ShieldCheck,
  ArrowRight,
  ArrowDown,
  UserRoundCheck,
  MapPin,
  AlertTriangle,
  Lock,
  Clock,
} from "lucide-react";

export default function SmartTouristProtection() {
  const protectionLayers = [
    {
      icon: UserRoundCheck,
      title: "Verified Coordination",
      description: "Platform-verified coordinators with official reference IDs",
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400",
    },
    {
      icon: MapPin,
      title: "Journey Check-Ins",
      description: "Smart check-ins at every milestone of your medical journey",
      color: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400",
    },
    {
      icon: ShieldCheck,
      title: "Safety Timeline",
      description: "Transparent protection record of your entire journey",
      color: "from-purple-500/20 to-blue-500/20",
      iconColor: "text-purple-400",
    },
    {
      icon: AlertTriangle,
      title: "Urgent Assistance",
      description: "Secure urgent help workflow when you need support",
      color: "from-red-500/20 to-orange-500/20",
      iconColor: "text-red-400",
    },
  ];

  const journeyStages = [
    { stage: "Before Arrival", description: "Travel readiness and safety preparation" },
    { stage: "Arrival", description: "Journey activation and essential information" },
    { stage: "Treatment Period", description: "Check-ins and connected coordination" },
    { stage: "Recovery", description: "Continued journey awareness and support" },
    { stage: "Departure", description: "Journey completion and safety closure" },
  ];

  return (
    <section className="relative overflow-hidden py-24 lg:py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-black">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 blur-[180px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 blur-[180px] rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,.05),transparent_70%)]" />

      <div className="relative max-w-[1450px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-semibold tracking-wide">
            <ShieldCheck size={16} />
            CORE PRODUCT PILLAR
          </div>

          <h2 className="mt-8 text-[42px] sm:text-[52px] lg:text-[64px] font-bold text-white leading-[0.95] tracking-[-2px]">
            Smart Tourist
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent mt-2">
              Protection System
            </span>
          </h2>

          <p className="mt-8 text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            An integrated digital safety layer designed specifically for international medical travellers navigating an unfamiliar country. From arrival to recovery, stay connected to your care and safety journey.
          </p>
        </div>

        {/* Protection Layers Grid - Connected System Visual */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {protectionLayers.map((layer) => {
            const Icon = layer.icon;
            return (
              <div
                key={layer.title}
                className="group relative overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl p-6 hover:border-blue-500/40 hover:-translate-y-2 transition-all duration-500 shadow-[0_20px_70px_rgba(0,0,0,.25)]"
              >
                {/* Glow */}
                <div className={`absolute top-[-60px] right-[-40px] w-[180px] h-[180px] rounded-full bg-gradient-to-r ${layer.color} blur-[80px] opacity-0 group-hover:opacity-100 transition-all duration-700`} />

                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                {/* Icon */}
                <div className={`relative h-16 w-16 rounded-[24px] bg-gradient-to-br ${layer.color} border border-white/[0.08] backdrop-blur-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <div className="absolute inset-0 rounded-[24px] bg-white/[0.03]" />
                  <Icon size={32} className={`relative ${layer.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="mt-6 text-[20px] font-bold leading-[1.2] text-white">
                  {layer.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-slate-400 leading-[1.7] text-[15px]">
                  {layer.description}
                </p>

                {/* Border Shine */}
                <div className="absolute inset-0 rounded-[28px] border border-transparent group-hover:border-blue-500/20 transition-all duration-500" />
              </div>
            );
          })}
        </div>

        {/* Connected System Flow */}
        <div className="relative overflow-hidden rounded-[40px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl p-10 lg:p-14 mb-20">
          {/* Glow */}
          <div className="absolute top-[-100px] left-[-50px] w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-[130px]" />
          <div className="absolute bottom-[-120px] right-[-60px] w-[320px] h-[320px] rounded-full bg-cyan-500/10 blur-[140px]" />

          <div className="relative">
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-16 w-16 rounded-[22px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <ShieldCheck size={32} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white text-center">
                  Connected Protection Engine
                </h3>
                <p className="text-slate-400 text-center mt-1">
                  One system integrating all protection modules
                </p>
              </div>
            </div>

            {/* System Flow Diagram */}
            <div className="flex flex-col items-center space-y-6">
              {/* Patient Journey */}
              <div className="w-full max-w-md bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl px-8 py-4 text-center">
                <p className="text-lg font-bold text-white">Medical Travel Journey</p>
              </div>

              {/* Arrow */}
              <ArrowDown size={24} className="text-blue-400 animate-bounce" />

              {/* Protection System Core */}
              <div className="w-full max-w-2xl bg-gradient-to-br from-blue-950 via-slate-950 to-cyan-950 border-2 border-blue-500/50 rounded-3xl p-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <ShieldCheck size={24} className="text-green-400" />
                  <h4 className="text-xl font-bold text-white">Smart Tourist Protection System</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {protectionLayers.map((layer) => (
                    <div key={layer.title} className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-center">
                      <p className="text-xs text-slate-300">{layer.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrows to interfaces */}
              <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
                <div className="flex flex-col items-center">
                  <ArrowDown size={20} className="text-cyan-400 mb-2" />
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2 text-center">
                    <p className="text-sm font-semibold text-white">Safety Hub</p>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <ArrowDown size={20} className="text-cyan-400 mb-2" />
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2 text-center">
                    <p className="text-sm font-semibold text-white">Operations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Capabilities */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-8">
            <div className="h-14 w-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
              <Lock size={28} className="text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Secure Data Handling</h3>
            <p className="text-slate-400 leading-relaxed">
              Your protection data is secured with authenticated access, Row Level Security, and restricted safety administration.
            </p>
          </div>

          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-8">
            <div className="h-14 w-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
              <UserRoundCheck size={28} className="text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Verified Coordinators</h3>
            <p className="text-slate-400 leading-relaxed">
              Platform-verified coordinator status with official reference IDs you can trust throughout your journey.
            </p>
          </div>

          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-8">
            <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
              <Clock size={28} className="text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Safety Readiness</h3>
            <p className="text-slate-400 leading-relaxed">
              Proactive journey checklist and safety preparation tools to reduce risks before you travel.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-slate-400 text-lg mb-6">
            Plan your healthcare journey with protection built in.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/protection"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-[24px] bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg hover:scale-[1.02] transition-all duration-300 shadow-[0_0_60px_rgba(37,99,235,.35)]"
            >
              <ShieldCheck size={20} />
              Learn About Protection System
              <ArrowRight size={18} />
            </a>
            <a
              href="#consultation"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-[24px] border border-slate-700 bg-slate-900/50 text-white font-semibold text-lg hover:border-slate-600 hover:bg-slate-900 transition-all duration-300"
            >
              Start Protected Journey
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
