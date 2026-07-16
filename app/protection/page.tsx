import {
  ShieldCheck,
  ArrowRight,
  ArrowDown,
  UserRoundCheck,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Phone,
  Lock,
  Globe,
  FileText,
  Activity,
} from "lucide-react";

export default function ProtectionPage() {
  const protectionJourney = [
    {
      stage: "Before Arrival",
      icon: FileText,
      description: "Travel and safety readiness with documentation support and visa assistance",
      items: ["Passport and visa verification", "Hospital confirmation", "Coordinator identity check"],
    },
    {
      stage: "Arrival",
      icon: Globe,
      description: "Journey activation with essential information and pickup coordination",
      items: ["Airport pickup confirmation", "Accommodation verification", "Emergency contacts saved"],
    },
    {
      stage: "Treatment Period",
      icon: Activity,
      description: "Active check-ins and connected coordination throughout treatment",
      items: ["Hospital arrival check-in", "Treatment milestone updates", "Regular safety status"],
    },
    {
      stage: "Recovery",
      icon: Clock,
      description: "Continued journey awareness and support during recovery phase",
      items: ["Discharge planning", "Follow-up instructions", "Recovery monitoring"],
    },
    {
      stage: "Departure",
      icon: MapPin,
      description: "Journey completion with safety status closure and departure support",
      items: ["Return travel confirmation", "Journey summary", "Safety closure"],
    },
  ];

  const checkInWorkflow = [
    { status: "I'm Safe", color: "bg-green-500/20 text-green-400 border-green-500/30", description: "Confirm you are safe at your current location" },
    { status: "Need Assistance", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", description: "Request non-urgent help or coordination support" },
    { status: "Urgent Help", color: "bg-red-500/20 text-red-400 border-red-500/30", description: "Initiate urgent assistance workflow for immediate support" },
  ];

  const urgentAssistanceSteps = [
    { step: 1, title: "Patient Initiates Request", description: "Submit urgent assistance through Safety Hub" },
    { step: 2, title: "Case Securely Recorded", description: "Safety case created with timestamp and details" },
    { step: 3, title: "Safety Workflow Activated", description: "Authorized safety operations team notified" },
    { step: 4, title: "Case Review & Response", description: "Safety operators review and coordinate response" },
    { step: 5, title: "Progress Tracking", description: "All actions reflected in safety timeline" },
  ];

  const securityFeatures = [
    {
      icon: Lock,
      title: "Authenticated Access",
      description: "Only authenticated users can access their protection data through secure login",
    },
    {
      icon: ShieldCheck,
      title: "Row Level Security",
      description: "Database-level security ensures patients can only view their own records",
    },
    {
      icon: UserRoundCheck,
      title: "Restricted Administration",
      description: "Safety operations limited to authorized roles with server-trusted verification",
    },
    {
      icon: Activity,
      title: "Server-Trusted Roles",
      description: "Role checks performed server-side using trusted app metadata, not user-editable fields",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-slate-950 to-cyan-950 py-24 lg:py-32">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[180px] rounded-full" />
        
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck size={32} className="text-green-400" />
            <span className="text-green-400 font-semibold tracking-wide">CORE PRODUCT PILLAR</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            Smart Tourist
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent mt-2">
              Protection System
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-slate-300 max-w-3xl leading-relaxed mb-8">
            An integrated digital safety layer designed specifically for international medical travellers navigating an unfamiliar country.
          </p>
          
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 max-w-3xl">
            <p className="text-slate-400 leading-relaxed">
              Travelling abroad for healthcare creates challenges beyond treatment itself. Patients may face unfamiliar cities, communication difficulties, complex treatment schedules, travel uncertainty, coordination challenges, and difficulty understanding who to contact. HealWithIndia's protection system serves as your digital safety and coordination layer throughout your medical travel journey.
            </p>
          </div>
        </div>
      </section>

      {/* System Architecture Visual */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Connected Protection Infrastructure</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              One intelligent system connecting your medical travel journey with integrated protection modules
            </p>
          </div>

          <div className="relative bg-slate-950 border border-slate-800 rounded-[40px] p-8 lg:p-12">
            {/* Patient Journey */}
            <div className="flex justify-center mb-12">
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl px-8 py-4">
                <p className="text-xl font-bold text-white">International Medical Traveller</p>
              </div>
            </div>

            {/* Connection Arrow */}
            <div className="flex justify-center mb-12">
              <div className="flex flex-col items-center">
                <ArrowDown size={32} className="text-blue-400 animate-bounce" />
              </div>
            </div>

            {/* Protection System Core */}
            <div className="bg-gradient-to-br from-blue-950 via-slate-950 to-cyan-950 border-2 border-blue-500/50 rounded-3xl p-8 lg:p-12 mb-12">
              <div className="flex items-center justify-center gap-3 mb-8">
                <ShieldCheck size={32} className="text-green-400" />
                <h3 className="text-3xl font-bold text-white">Smart Tourist Protection System</h3>
              </div>

              {/* Protection Modules Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-blue-500/30 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <UserRoundCheck size={20} className="text-blue-400" />
                    <p className="font-semibold text-white">Verified Coordination</p>
                  </div>
                  <p className="text-slate-400 text-sm">Platform-verified coordinators with official reference IDs</p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-green-500/30 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={20} className="text-green-400" />
                    <p className="font-semibold text-white">Smart Check-Ins</p>
                  </div>
                  <p className="text-slate-400 text-sm">Structured protection signals at journey milestones</p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-red-500/30 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={20} className="text-red-400" />
                    <p className="font-semibold text-white">Assistance Workflows</p>
                  </div>
                  <p className="text-slate-400 text-sm">Urgent help workflow for immediate support</p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-purple-500/30 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity size={20} className="text-purple-400" />
                    <p className="font-semibold text-white">Protection Timeline</p>
                  </div>
                  <p className="text-slate-400 text-sm">Transparent record of your protection journey</p>
                </div>
              </div>
            </div>

            {/* Connection Arrows */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="flex flex-col items-center">
                <ArrowDown size={24} className="text-cyan-400 mb-4" />
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-6 py-3 text-center">
                  <p className="font-semibold text-white">Patient Safety Hub</p>
                  <p className="text-slate-400 text-sm">Your protection control centre</p>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <ArrowDown size={24} className="text-cyan-400 mb-4" />
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-6 py-3 text-center">
                  <p className="font-semibold text-white">Protection Operations</p>
                  <p className="text-slate-400 text-sm">Authorized safety response team</p>
                </div>
              </div>
            </div>

            {/* System Flow Indicator */}
            <div className="flex items-center justify-center gap-4 text-slate-500 text-sm">
              <div className="h-px w-16 bg-slate-700" />
              <p>Real-time protection data flows through connected modules</p>
              <div className="h-px w-16 bg-slate-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Protection Journey Section */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Your Protection Journey</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Continuous safety monitoring from before you arrive to after you depart
            </p>
          </div>

          <div className="space-y-8">
            {protectionJourney.map((journey, index) => {
              const Icon = journey.icon;
              return (
                <div
                  key={journey.stage}
                  className="relative bg-slate-950 border border-slate-800 rounded-3xl p-8 lg:p-10 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-shrink-0">
                      <div className="h-20 w-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Icon size={40} className="text-blue-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                          {index + 1}
                        </div>
                        <h3 className="text-2xl font-bold">{journey.stage}</h3>
                      </div>
                      <p className="text-slate-400 text-lg mb-6 leading-relaxed">{journey.description}</p>
                      <div className="grid sm:grid-cols-3 gap-4">
                        {journey.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-slate-300">
                            <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Connector */}
                  {index < protectionJourney.length - 1 && (
                    <div className="hidden lg:block absolute left-20 bottom-[-32px] transform translate-y-1/2 text-slate-700">
                      <ArrowRight size={24} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Smart Check-Ins Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-slate-950 to-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Smart Check-Ins</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Structured protection signals at every milestone of your journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {checkInWorkflow.map((workflow) => (
              <div
                key={workflow.status}
                className={`bg-slate-950 border rounded-3xl p-8 hover:scale-105 transition-all duration-300 ${workflow.color}`}
              >
                <h3 className="text-2xl font-bold mb-4">{workflow.status}</h3>
                <p className="text-slate-300 leading-relaxed">{workflow.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-4">How Check-Ins Work</h3>
            <p className="text-slate-400 leading-relaxed">
              When you submit a check-in, it's securely recorded in your safety timeline with a timestamp. 
              "I'm Safe" confirms your well-being at a specific location. "Need Assistance" triggers coordination support. 
              "Urgent Help" activates the urgent assistance workflow for immediate attention from authorized safety operators.
              All check-ins create a transparent protection record of your journey.
            </p>
          </div>
        </div>
      </section>

      {/* Urgent Assistance Journey Section */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Urgent Assistance Journey</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              When you need immediate support, our workflow ensures rapid response
            </p>
          </div>

          <div className="space-y-6">
            {urgentAssistanceSteps.map((step) => (
              <div
                key={step.step}
                className="flex items-start gap-6 bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xl">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-slate-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-red-950/20 border border-red-800/50 rounded-3xl p-8">
            <div className="flex items-start gap-4">
              <AlertTriangle size={32} className="text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-3 text-red-400">Important Note</h3>
                <p className="text-slate-300 leading-relaxed">
                  The urgent assistance workflow securely records your case and notifies authorized safety operators. 
                  Case progress is reflected in your safety timeline. This system provides structured coordination and support. 
                  For life-threatening emergencies, always contact local emergency services (dial 112 in India) first.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Coordination Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-slate-950 to-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Verified Coordination</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Platform-verified coordinator status you can trust
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 lg:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6">Official Coordinator Verification</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Every HealWithIndia coordinator is verified through our platform and assigned an official reference ID. 
                  You can verify your coordinator's identity through your Safety Hub, ensuring you're communicating with authorized personnel.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-slate-300">Official reference ID for verification</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-slate-300">Platform-controlled verification status</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-slate-300">Direct contact information in Safety Hub</span>
                  </li>
                </ul>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <UserRoundCheck size={24} className="text-green-400" />
                  <span className="text-green-400 font-semibold">VERIFIED COORDINATOR</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Reference ID</p>
                    <p className="text-xl font-bold text-blue-400">HWI-2024-XXXX</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Full Name</p>
                    <p className="text-xl font-bold">Verified Coordinator</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Contact</p>
                    <p className="text-xl font-bold flex items-center gap-2">
                      <Phone size={18} className="text-green-400" />
                      +91 XXXXX XXXXX
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Timeline Section */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Safety Timeline</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A transparent protection record of your entire journey
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 lg:p-12">
            <p className="text-slate-400 leading-relaxed mb-8">
              All protection-related events are organized in your safety timeline, creating a comprehensive record of your medical travel journey. 
              This includes check-ins, urgent assistance requests, coordinator communications, and safety status updates. 
              The timeline provides transparency and accountability throughout your experience with HealWithIndia.
            </p>
            
            <div className="space-y-4">
              {[
                { event: "Check-in: Airport Arrival", time: "2 hours ago", status: "safe" },
                { event: "Coordinator Assignment Confirmed", time: "1 day ago", status: "verified" },
                { event: "Journey Safety Checklist Updated", time: "2 days ago", status: "completed" },
                { event: "Hospital Booking Confirmed", time: "5 days ago", status: "confirmed" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-xl"
                >
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    item.status === "safe" ? "bg-green-500/20" :
                    item.status === "verified" ? "bg-blue-500/20" :
                    item.status === "completed" ? "bg-purple-500/20" :
                    "bg-cyan-500/20"
                  }`}>
                    <CheckCircle size={20} className={
                      item.status === "safe" ? "text-green-400" :
                      item.status === "verified" ? "text-blue-400" :
                      item.status === "completed" ? "text-purple-400" :
                      "text-cyan-400"
                    } />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.event}</p>
                    <p className="text-slate-500 text-sm">{item.time}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === "safe" ? "bg-green-500/20 text-green-400" :
                    item.status === "verified" ? "bg-blue-500/20 text-blue-400" :
                    item.status === "completed" ? "bg-purple-500/20 text-purple-400" :
                    "bg-cyan-500/20 text-cyan-400"
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Safety Checklist Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-slate-950 to-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Safety Checklist</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Proactive risk reduction through journey readiness preparation
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 lg:p-12">
            <p className="text-slate-400 leading-relaxed mb-8">
              The journey safety checklist helps you prepare for your medical travel by ensuring all essential items are verified before you depart. 
              This proactive approach reduces risks and ensures you have everything needed for a safe journey.
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Passport and visa documents verified",
                "Hospital and doctor details confirmed",
                "Official coordinator identity checked",
                "Airport pickup details confirmed",
                "Accommodation arrangements verified",
                "Emergency contacts saved",
                "Treatment documents available",
                "Discharge plan received",
                "Follow-up instructions documented",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-slate-950/50 border border-slate-800 rounded-xl"
                >
                  <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Privacy and Security Section */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Privacy and Security</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Your protection data is secured with enterprise-grade security architecture
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {securityFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                    <Icon size={28} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
            <div className="flex items-start gap-4">
              <Lock size={32} className="text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-3">Security Architecture</h3>
                <p className="text-slate-400 leading-relaxed">
                  Our safety system uses Supabase PostgreSQL with Row Level Security (RLS) to ensure patients can only access their own data. 
                  Safety administration is restricted to authorized roles with server-trusted verification using app metadata, 
                  not user-editable fields. All sensitive operations are validated server-side to prevent unauthorized access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-blue-950 via-slate-950 to-cyan-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Plan Your Healthcare Journey With Protection Built In
          </h2>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed">
            Access world-class healthcare in India while staying protected through our integrated Smart Tourist Protection System.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/#consultation"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-[24px] bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg hover:scale-[1.02] transition-all duration-300 shadow-[0_0_60px_rgba(37,99,235,.35)]"
            >
              <ShieldCheck size={20} />
              Start Protected Journey
              <ArrowRight size={18} />
            </a>
            <a
              href="/safety"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-[24px] border border-slate-700 bg-slate-900/50 text-white font-semibold text-lg hover:border-slate-600 hover:bg-slate-900 transition-all duration-300"
            >
              Access Safety Hub
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
