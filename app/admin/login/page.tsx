"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ShieldCheck, Lock, Mail, ArrowRight } from "lucide-react";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Show error from middleware redirect
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'unauthorized') {
      setError("You do not have permission to access the Admin Portal. This login is for HealWithIndia administrators only.");
    } else if (errorParam === 'forbidden') {
      setError("Access Denied: Your staff account does not have permission to access this section of the Admin Portal.");
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

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const user = data.user;
      const role = user?.app_metadata?.role;
      const isStaff = user?.user_metadata?.is_staff === true || (role && role !== "patient");

      if (!isStaff) {
        await supabase.auth.signOut();
        setError("You do not have permission to access the Admin Portal. This login is for HealWithIndia administrators only.");
        setLoading(false);
        return;
      }

      router.replace("/admin");
    } catch {
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#020817] relative overflow-hidden flex items-center justify-center px-5">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full" />

      <div className="relative w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShieldCheck size={40} className="text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            HealWithIndia
          </h1>
          <p className="text-green-400 font-semibold tracking-wide text-sm">
            ADMIN / OPERATIONS ACCESS
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-[32px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={24} className="text-blue-400" />
            <h2 className="text-xl font-bold text-white">
              Administrator Login
            </h2>
          </div>

          {error && (
            <div className="rounded-[20px] border border-red-500/20 bg-red-500/10 text-red-400 px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="admin@healwithindia.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Authenticating..." : "Access Admin Portal"}
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-sm">
              Patient portal access is available at{" "}
              <a href="/patient-login" className="text-blue-400 hover:text-blue-300">
                /patient-login
              </a>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-slate-600 text-xs">
            This login is restricted to authorized HealWithIndia administrators and safety operators only.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020817] flex items-center justify-center text-white">Loading...</div>}>
      <AdminLoginContent />
    </Suspense>
  );
}
