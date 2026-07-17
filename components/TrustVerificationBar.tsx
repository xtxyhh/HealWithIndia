"use client";

import {
  ShieldCheck,
  Building,
  UserCheck,
  FileCheck,
  Lock,
  PhoneCall,
  Activity,
} from "lucide-react";

export default function TrustVerificationBar() {
  const trustItems = [
    {
      label: "Smart Tourist Protection",
      status: "ACTIVE",
      icon: ShieldCheck,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      glow: "shadow-[0_0_12px_rgba(16,185,129,0.15)]",
    },
    {
      label: "Accredited Hospital (JCI/NABH)",
      status: "VERIFIED",
      icon: Building,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      label: "Medical Specialist",
      status: "VERIFIED",
      icon: UserCheck,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Care Coordinator",
      status: "VERIFIED",
      icon: UserCheck,
      color: "text-green-400 bg-green-500/10 border-green-500/20",
    },
    {
      label: "Medical Records",
      status: "SECURE",
      icon: Lock,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "Emergency Support",
      status: "24/7 STANDBY",
      icon: PhoneCall,
      color: "text-red-400 bg-red-500/10 border-red-500/20",
    },
    {
      label: "Journey Monitoring",
      status: "LIVE",
      icon: Activity,
      color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    },
  ];

  return (
    <div className="w-full bg-slate-950/60 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between overflow-x-auto gap-4 no-scrollbar">
        <div className="flex items-center gap-2 shrink-0">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span className="text-[10px] uppercase tracking-[2px] font-bold text-slate-400">
            Security Status:
          </span>
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-semibold tracking-wide shrink-0 transition-all duration-300 hover:scale-[1.03] ${item.color} ${item.glow || ""}`}
              >
                <Icon size={13} className="shrink-0 animate-pulse" />
                <span>{item.label}</span>
                <span className="text-[9px] uppercase tracking-wider font-bold opacity-80 border-l border-current pl-1.5 ml-0.5">
                  {item.status}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-slate-500 text-[10px] font-semibold tracking-wider">
          <Lock size={12} className="text-emerald-500/80" />
          <span>SSL SECURED</span>
        </div>
      </div>
    </div>
  );
}
