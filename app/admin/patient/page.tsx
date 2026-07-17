import { createClient, createServiceRoleClient } from "@/lib/supabaseServer";
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

  const serviceSupabase = createServiceRoleClient();

  // Fetch Supabase Auth users to get last login times
  const { data: authUsersData } = await serviceSupabase.auth.admin.listUsers();
  const authUsersMap = new Map(authUsersData?.users.map(u => [u.id, u]) || []);

  const {
    data: patients,
    error,
  } = await serviceSupabase
    .from("patients")
    .select(`
      *,
      patient_auth_mapping(portal_access_status, invite_sent_at, portal_access_enabled_at, auth_user_id),
      patient_safety_profiles(protection_status, journey_stage, protection_activated_at, protection_completed_at),
      coordinator_assignments(is_active, official_coordinators(full_name, reference_id)),
      risk_assessments(is_current, risk_level)
    `)
    .order("created_at", {
      ascending: false,
    });

  const processedPatients = patients?.map(patient => {
    const mapping = Array.isArray(patient.patient_auth_mapping)
      ? patient.patient_auth_mapping[0]
      : patient.patient_auth_mapping;

    const authUser = mapping?.auth_user_id ? authUsersMap.get(mapping.auth_user_id) : null;

    return {
      ...patient,
      patient_auth_mapping: mapping,
      auth_user: authUser ? {
        last_sign_in_at: authUser.last_sign_in_at,
        created_at: authUser.created_at
      } : null
    };
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
        patients={processedPatients || []}
      />
    </main>
  );
}