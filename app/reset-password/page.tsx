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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sessionBefore, setSessionBefore] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sessionAfter, setSessionAfter] = useState<any>(null);
  const [authEvent, setAuthEvent] = useState<string>("NONE");

  useEffect(() => {
    // 1. Listen to Supabase Auth state change events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[FORENSIC EVENT] onAuthStateChange event: ${event}, user: ${session?.user?.email} (${session?.user?.id})`);
      setAuthEvent(event);
      setSessionAfter(session);
    });

    const checkSession = async () => {
      // Step 2a: Capture the initial session state (e.g. pre-existing admin session)
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSessionBefore(initialSession);
      console.log("[FORENSIC BEFORE] Initial session user email:", initialSession?.user?.email, "id:", initialSession?.user?.id);

      // Step 2b: Handle URL hash parsing if a recovery/invite flow is active
      if (typeof window !== "undefined" && window.location.hash) {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const type = params.get("type");

        if (accessToken && (type === "recovery" || type === "invite" || hash.includes("type=recovery") || hash.includes("type=invite"))) {
          console.log("[FORENSIC HASH] Recovery/Invite hash detected in URL.");

          // If there is a pre-existing active session for a DIFFERENT user, sign out first
          if (initialSession) {
            console.log("[FORENSIC CLEAR] Sign out existing user session to enforce session isolation");
            await supabase.auth.signOut();
          }

          console.log("[FORENSIC HASH] Setting recovery session using token from URL hash...");
          const { data: setSessionData, error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || "",
          });

          if (setSessionError) {
            console.error("[FORENSIC HASH] setSession error:", setSessionError.message);
          } else {
            console.log("[FORENSIC HASH] setSession succeeded. Recovery session user:", setSessionData.session?.user?.email, "id:", setSessionData.session?.user?.id);
            setSessionAfter(setSessionData.session);
          }
        }
      }

      // Step 2c: Retrieve the final active session to proceed with reset password
      const { data: { session: activeSession } } = await supabase.auth.getSession();
      if (!activeSession) {
        setError("Your reset session has expired or is invalid. Please request a new invite link.");
        setCheckingSession(false);
        return;
      }

      // Check if portal is already active (password setup complete)
      const { data: mapping } = await supabase
        .from("patient_auth_mapping")
        .select("portal_access_status")
        .eq("auth_user_id", activeSession.user.id)
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

    return () => {
      subscription.unsubscribe();
    };
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

      const userFromGetUser = await supabase.auth.getUser();
      const sessionFromGetSession = await supabase.auth.getSession();

      // Log all forensic data before updating password to verify isolation
      console.log("====================================================");
      console.log("[FORENSIC RUNTIME REPORT - reset-password]");
      console.log("Current authenticated user id:", userFromGetUser.data.user?.id);
      console.log("Current authenticated email:", userFromGetUser.data.user?.email);
      console.log("Recovery email recipient:", userFromGetUser.data.user?.email);
      console.log("Recovery session user id:", sessionFromGetSession.data.session?.user?.id);
      console.log("Recovery session email:", sessionFromGetSession.data.session?.user?.email);
      console.log("Supabase auth event:", authEvent);
      console.log("Session before recovery:", JSON.stringify(sessionBefore));
      console.log("Session after recovery:", JSON.stringify(sessionAfter));
      console.log("User returned by getUser():", JSON.stringify(userFromGetUser.data.user));
      console.log("User returned by getSession():", JSON.stringify(sessionFromGetSession.data.session));
      console.log("====================================================");

      // Security Isolation Guard: block if updating password for an admin using an administrative session
      const callerRole = userFromGetUser.data.user?.app_metadata?.role;
      const isStaff = userFromGetUser.data.user?.user_metadata?.is_staff === true || (callerRole && callerRole !== "patient");
      if (isStaff && sessionBefore && sessionBefore.user.id === userFromGetUser.data.user?.id) {
        if (typeof window !== "undefined" && window.location.hash) {
          setError("Session isolation guard: Admin session detected. Patient recovery token failed to load a patient session. Operation blocked for security.");
          setLoading(false);
          return;
        }
      }

      const { data, error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      
      const user = data.user;
      const userIsStaff = user?.user_metadata?.is_staff || !!user?.app_metadata?.role;
      
      // For patients, transition mapping status to ACTIVE
      if (!userIsStaff) {
        try {
          await fetch('/api/safety/transition-portal-active', { method: 'POST' });
        } catch {
          // Non-critical: portal status will be updated on next login
        }
      }

      // Redirect to dashboard immediately after success to enforce automatic login
      setTimeout(() => {
        if (userIsStaff) {
          router.replace("/admin");
        } else {
          router.replace("/safety");
        }
      }, 2000);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
