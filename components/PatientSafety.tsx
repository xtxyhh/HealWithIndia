import {
  ShieldCheck,
  UserRoundCheck,
  FileCheck,
  AlertTriangle,
  Phone,
  Lock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function PatientSafety() {
  const safetyFeatures = [
    {
      icon: UserRoundCheck,
      title: "Verified Care Coordination",
      description: "Know your official coordinator responsible for your entire medical journey.",
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400",
    },
    {
      icon: FileCheck,
      title: "Pre-Arrival Guidance",
      description: "Complete documentation support, visa assistance and travel coordination.",
      color: "from-green-500/20 to-cyan-500/20",
      iconColor: "text-green-400",
    },
    {
      icon: ShieldCheck,
      title: "Secure Information Handling",
      description: "Your medical data is protected with secure, confidential handling protocols.",
      color: "from-purple-500/20 to-blue-500/20",
      iconColor: "text-purple-400",
    },
    {
      icon: Phone,
      title: "Journey Check-Ins",
      description: "Regular safety check-ins at every major milestone of your treatment journey.",
      color: "from-cyan-500/20 to-blue-500/20",
      iconColor: "text-cyan-400",
    },
    {
      icon: Lock,
      title: "Coordinator Verification",
      description: "Verify your official coordinator identity through platform channels.",
      color: "from-indigo-500/20 to-purple-500/20",
      iconColor: "text-indigo-400",
    },
    {
      icon: AlertTriangle,
      title: "Fraud Awareness Support",
      description: "Guidance on identifying and reporting suspicious contact or activity.",
      color: "from-yellow-500/20 to-orange-500/20",
      iconColor: "text-yellow-400",
    },
  ];

  const safetyChecklist = [
    "Passport and visa documents verified",
    "Hospital and doctor details confirmed",
    "Official coordinator identity checked",
    "Airport pickup details confirmed",
    "Accommodation arrangements verified",
    "Emergency contacts saved",
    "Treatment documents available",
    "Discharge plan received",
    "Follow-up instructions documented",
  ];

  return (
    <section className="relative overflow-hidden py-24 lg:py-32 bg-black">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/10 blur-[180px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[180px] rounded-full" />

      <div className="relative max-w-[1450px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-green-500/20 bg-green-500/10 text-green-300 text-sm font-semibold tracking-wide">
            <ShieldCheck size={16} />
            Patient Safety & Protection
          </div>

          <h2 className="mt-8 text-[42px] sm:text-[52px] lg:text-[64px] font-bold text-white leading-[0.95] tracking-[-2px]">
            Your Safety Is Our
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent mt-2">
              Top Priority
            </span>
          </h2>

          <p className="mt-8 text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            International medical tourism requires trust, verification and secure coordination.
            We provide comprehensive safety measures throughout your healthcare journey in India.
          </p>
        </div>

        {/* Safety Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {safetyFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-[32px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl p-8 hover:border-blue-500/40 hover:-translate-y-2 transition-all duration-500 shadow-[0_20px_70px_rgba(0,0,0,.25)]"
              >
                {/* Glow */}
                <div className={`absolute top-[-80px] right-[-60px] w-[220px] h-[220px] rounded-full bg-gradient-to-r ${feature.color} blur-[100px] opacity-0 group-hover:opacity-100 transition-all duration-700`} />

                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                {/* Icon */}
                <div className={`relative h-20 w-20 rounded-[28px] bg-gradient-to-br ${feature.color} border border-white/[0.08] backdrop-blur-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <div className="absolute inset-0 rounded-[28px] bg-white/[0.03]" />
                  <Icon size={36} className={`relative ${feature.iconColor}`} />
                </div>

                {/* Badge */}
                <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-950/70 text-slate-300 text-xs tracking-wide">
                  <CheckCircle size={14} className="text-green-400" />
                  Safety Feature
                </div>

                {/* Title */}
                <h3 className="mt-6 text-[22px] font-bold leading-[1.2] text-white">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-4 text-slate-400 leading-[1.8] text-[16px]">
                  {feature.description}
                </p>

                {/* Border Shine */}
                <div className="absolute inset-0 rounded-[32px] border border-transparent group-hover:border-blue-500/20 transition-all duration-500" />
              </div>
            );
          })}
        </div>

        {/* Safety Checklist Section */}
        <div className="relative overflow-hidden rounded-[40px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl p-10 lg:p-14">
          {/* Glow */}
          <div className="absolute top-[-100px] left-[-50px] w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-[130px]" />
          <div className="absolute bottom-[-120px] right-[-60px] w-[320px] h-[320px] rounded-full bg-cyan-500/10 blur-[140px]" />

          <div className="relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-16 w-16 rounded-[22px] bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white">
                  Journey Safety Checklist
                </h3>
                <p className="text-slate-400 mt-1">
                  Verify these items before and during your medical journey
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {safetyChecklist.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-slate-300 bg-slate-950/30 border border-slate-800 rounded-xl px-4 py-3 hover:border-green-500/30 transition-all duration-300"
                >
                  <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 text-lg mb-6">
            Need immediate assistance during your journey?
          </p>
          <a
            href="tel:+919116734675"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-[24px] bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold text-lg hover:scale-[1.02] transition-all duration-300 shadow-[0_0_60px_rgba(34,197,94,.35)]"
          >
            <Phone size={20} />
            Emergency Contact
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-all" />
          </a>
        </div>
      </div>
    </section>
  );
}
