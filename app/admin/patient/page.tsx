import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";
import Topbar from "@/components/Topbar";
import PatientPageClient from "./PatientPageClient";

import {
  Users,
  Phone,
  Globe,
  HeartPulse,
} from "lucide-react";

export default async function PatientsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const {
    data: patients,
    error,
  } = await supabase
    .from("patients")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold text-white">
          Failed to load patients
        </h1>
        <p className="text-red-400 mt-4">{error.message}</p>
      </main>
    );
  }

  const totalPatients = patients?.length || 0;
  const uniqueTreatments = new Set(patients?.map((p) => p.treatment)).size;
  const uniqueCountries = new Set(patients?.map((p) => p.country)).size;
  const contacted = patients?.filter((p) => p.status === "Contacted").length || 0;

  return (
    <main className="p-10 text-white">
      <Topbar />

      {/* Stats + Add Button — client island handles modal state */}
      <PatientPageClient
        stats={{ totalPatients, uniqueTreatments, uniqueCountries, contacted }}
        patients={patients || []}
      />
    </main>
  );
}