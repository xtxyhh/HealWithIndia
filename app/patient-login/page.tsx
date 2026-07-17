"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  ArrowRight,
  UserRound,
} from "lucide-react";

function PatientLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Show error from middleware redirect
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'no_access') {
      setError("Patient portal access has not been enabled for this account. Please contact your HealWithIndia coordinator.");
    }
  }, [searchParams]);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      console.log("[PATIENT LOGIN] Step 10: Submitting login credentials to Supabase Auth for email:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("[PATIENT LOGIN] Step 10: Authentication failed:", error.message);
        setError(error.message);
        setLoading(false);
        return;
      }

      const user = data.user;
      console.log("[PATIENT LOGIN] Step 10: Authentication succeeded. User ID:", user.id);

      // Block staff from patient portal
      const role = user?.app_metadata?.role;
      const isStaff = user?.user_metadata?.is_staff === true || (role && role !== "patient");
      if (isStaff) {
        await supabase.auth.signOut();
        setError("This portal is for patients only. Please log in at the Admin Portal.");
        setLoading(false);
        return;
      }

      // Fetch portal access status from database (single source of truth)
      const { data: mapping, error: mapError } = await supabase
        .from("patient_auth_mapping")
        .select("portal_access_status")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (mapError || !mapping) {
        await supabase.auth.signOut();
        setError("Patient portal access is not enabled for this account.");
        setLoading(false);
        return;
      }

      const status = mapping.portal_access_status;

      if (status === "NOT_ENABLED") {
        await supabase.auth.signOut();
        setError("Patient portal access has not been enabled for this account. Please contact your coordinator.");
        setLoading(false);
        return;
      }

      if (status === "INVITE_PENDING") {
        await supabase.auth.signOut();
        setError("Your invitation is pending. Please click the link in your email to set up your password first.");
        setLoading(false);
        return;
      }

      if (status === "SUSPENDED") {
        await supabase.auth.signOut();
        setError("Your patient portal access has been suspended. Please contact your coordinator.");
        setLoading(false);
        return;
      }

      // Transition state if active
      if (status === "ACTIVE") {
        try {
          await fetch('/api/safety/transition-portal-active', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (e) {}
      }

      router.replace("/safety");
    } catch {
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#020817] relative overflow-hidden flex items-center justify-center px-5">
      {/* Aurora */}
      <div className="absolute inset-0">
        <div className="absolute top-[-250px] left-[-200px] w-[700px] h-[700px] bg-green-600/20 rounded-full blur-[180px]" />
        <div className="absolute bottom-[-250px] right-[-150px] w-[650px] h-[650px] bg-cyan-500/15 rounded-full blur-[180px]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <div className="relative z-10 w-full max-w-[520px]">
        <div className="rounded-[42px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,.45)] overflow-hidden">
          {/* Header */}
          <div className="px-10 pt-12 text-center">
            <div className="h-24 w-24 mx-auto rounded-[32px] bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <UserRound size={46} className="text-green-400" />
            </div>

            <p className="uppercase tracking-[5px] text-green-400 text-sm mt-8">
              Patient Portal
            </p>

            <h1 className="text-[50px] font-bold text-white mt-4">
              Safety Hub
            </h1>

            <p className="text-slate-400 mt-5 text-lg">
              Secure access to your patient safety dashboard
            </p>
          </div>

          {/* Form */}
          <div className="px-10 pb-12 pt-10">
            <div className="space-y-6">
              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-5 top-5 text-slate-500"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLogin();
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-[24px] py-5 pl-14 pr-5 text-white outline-none focus:border-green-500 transition-all"
                />
              </div>

              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-5 top-5 text-slate-500"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLogin();
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-[24px] py-5 pl-14 pr-16 text-white outline-none focus:border-green-500 transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-5 text-slate-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {error && (
                <div className="rounded-[20px] border border-red-500/20 bg-red-500/10 text-red-400 px-5 py-4">
                  {error}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full group rounded-[24px] bg-gradient-to-r from-green-600 to-emerald-500 py-5 font-semibold text-lg hover:scale-[1.02] disabled:opacity-50 transition-all duration-300 shadow-[0_0_50px_rgba(34,197,94,.35)]"
              >
                {loading ? (
                  <div className="flex justify-center">
                    <Loader2 size={24} className="animate-spin" />
                  </div>
                ) : (
                  <div className="flex justify-center items-center gap-3">
                    Access Safety Hub
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition"
                    />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 mt-8">
          Protected by Supabase Auth
        </p>
      </div>
    </main>
  );
}

export default function PatientLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020817] flex items-center justify-center text-white">Loading...</div>}>
      <PatientLoginContent />
    </Suspense>
  );
}
