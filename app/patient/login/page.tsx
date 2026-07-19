"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// /patient/login is a canonical alias that redirects to /patient-login.
// All login logic, role checks, and portal access checks are in /patient-login.
export default function PatientLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/patient-login");
  }, [router]);

  return (
    <main className="min-h-screen bg-[#020817] flex items-center justify-center">
      <p className="text-slate-400">Redirecting...</p>
    </main>
  );
}
