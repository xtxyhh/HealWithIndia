"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Lock, Eye, EyeOff, Loader2, ShieldCheck, ArrowRight } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Your reset session has expired or is invalid. Please request a new invite link.");
        setCheckingSession(false);
        return;
      }

      // Check if portal is already active (password setup complete)
      const { data: mapping } = await supabase
        .from("patient_auth_mapping")
        .select("portal_access_status")
        .eq("auth_user_id", session.user.id)
        .maybeSingle();

      if (mapping?.portal_access_status === "ACTIVE") {
        // Sign out and send directly to login
        await supabase.auth.signOut();
        router.replace("/patient-login");
        return;
      }

      setCheckingSession(false);
    };
    checkSession();
  }, [router]);

  const handleResetPassword = async () => {
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      console.log("[PASSWORD RESET] Step 7: Submitting password update request to Supabase Auth.");
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        console.error("[PASSWORD RESET] Step 7: Failed to update password:", updateError.message);
        setError(updateError.message);
        setLoading(false);
        return;
      }

      console.log("[PASSWORD RESET] Step 7: Password successfully updated for user ID:", data.user?.id);
      setSuccess(true);
      
      const user = data.user;
      const isStaff = user?.user_metadata?.is_staff || !!user?.app_metadata?.role;
      
      // For patients, transition mapping status to ACTIVE
      if (!isStaff) {
        console.log("[PASSWORD RESET] Step 8: Triggering ACTIVE portal transition API route.");
        try {
          const res = await fetch('/api/safety/transition-portal-active', { method: 'POST' });
          if (res.ok) {
            console.log("[PASSWORD RESET] Step 8: ACTIVE portal transition API call succeeded.");
          } else {
            console.warn("[PASSWORD RESET] Step 8: ACTIVE portal transition API call returned status:", res.status);
          }
        } catch (e) {
          console.error("[PASSWORD RESET] Step 8: Transition API call failed:", e);
        }
      }

      // Sign out to enforce manual login validation
      await supabase.auth.signOut();

      setTimeout(() => {
        if (isStaff) {
          router.replace("/admin/login");
        } else {
          router.replace("/patient-login");
        }
      }, 2000);

    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <main className="min-h-screen bg-[#020817] flex items-center justify-center text-white">
        <Loader2 size={36} className="animate-spin text-blue-400" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020817] relative overflow-hidden flex items-center justify-center px-5">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full" />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShieldCheck size={40} className="text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">HealWithIndia</h1>
          <p className="text-blue-400 font-semibold tracking-wide text-sm uppercase">Secure Account Activation</p>
        </div>

        {/* Form Card */}
        <div className="rounded-[32px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Set Your Password</h2>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-green-500/20 bg-green-500/10 text-green-400 px-4 py-3 text-sm mb-6">
              Password updated successfully! Redirecting to your dashboard...
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-2">New Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={success}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-12 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">Confirm New Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={success}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-12 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            <button
              onClick={handleResetPassword}
              disabled={loading || success}
              className="w-full mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Updating Account..." : "Save Password & Login"}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
