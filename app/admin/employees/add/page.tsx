"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, Shield, CheckCircle } from "lucide-react";

// Map of display labels to auth system role values
const ROLE_OPTIONS: { label: string; value: string; description: string }[] = [
  {
    label: "Admin",
    value: "admin",
    description: "Full CRM access, can manage employees and patients",
  },
  {
    label: "Coordinator",
    value: "coordinator",
    description: "Patient journey coordination and followups",
  },
  {
    label: "Doctor",
    value: "doctor",
    description: "Medical review and treatment documentation",
  },
  {
    label: "Reception",
    value: "reception",
    description: "Lead management and initial patient contact",
  },
  {
    label: "Finance",
    value: "finance",
    description: "Revenue, payments and billing management",
  },
  {
    label: "Safety Operator",
    value: "safety_operator",
    description: "Smart Tourist Protection case management",
  },
  {
    label: "Support",
    value: "support",
    description: "Patient assistance and query resolution",
  },
  {
    label: "Hospital Partner",
    value: "hospital_partner",
    description: "Hospital liaison and referral coordination",
  },
];

type CreateStatus = "idle" | "creating_crm" | "sending_invite" | "done" | "error";

export default function AddEmployeePage() {
  const router = useRouter();

  const [status, setStatus] = useState<CreateStatus>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState(ROLE_OPTIONS[0].value);
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const selectedRole = ROLE_OPTIONS.find((r) => r.value === role);

  const handleSubmit = async () => {
    setError("");
    setSuccessMsg("");

    if (!name || !email) {
      setError("Full name and email are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      // Step 1: Create CRM employee record
      setStatus("creating_crm");
      const createRes = await fetch("/api/admin/employee/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, role, department }),
      });

      const createData = await createRes.json();

      if (!createRes.ok) {
        setError(createData.error || "Failed to create employee record.");
        setStatus("error");
        return;
      }

      const staffId = createData.staff_id;

      // Step 2: Provision Supabase Auth account + send invite
      setStatus("sending_invite");
      const inviteRes = await fetch("/api/admin/staff/portal-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "invite",
          email,
          full_name: name,
          role,
          staff_id: staffId,
        }),
      });

      const inviteData = await inviteRes.json();

      if (!inviteRes.ok) {
        // CRM record was created but invite failed — surface the partial error
        setError(
          `Employee record created (ID: ${staffId}), but invite failed: ${inviteData.error}. You can resend the invite from the employees list.`
        );
        setStatus("error");
        return;
      }

      setStatus("done");
      setSuccessMsg(
        `${name} has been added successfully. An invitation email has been sent to ${email}.`
      );

      // Navigate back after a short delay
      setTimeout(() => {
        router.push("/admin/employees");
        router.refresh();
      }, 2500);
    } catch (err) {
      console.error("Employee creation error:", err);
      setError("An unexpected error occurred. Please try again.");
      setStatus("error");
    }
  };

  const isLoading = status === "creating_crm" || status === "sending_invite";

  const statusLabel = {
    idle: "Create Employee",
    creating_crm: "Creating employee record...",
    sending_invite: "Sending invite email...",
    done: "Employee Created!",
    error: "Try Again",
  }[status];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-3 text-slate-400 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="mt-10">
          <p className="uppercase tracking-[4px] text-blue-400 text-sm">
            Team Management
          </p>
          <h1 className="text-5xl font-bold mt-4">Add Employee</h1>
          <p className="text-slate-400 mt-4">
            Creates a CRM record, provisions a Supabase Auth account, and sends
            an invitation email automatically.
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-10 mt-12">
          <div className="space-y-7">
            {/* Full Name */}
            <div>
              <label className="text-slate-400 text-sm font-medium">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative mt-2">
                <User
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading || status === "done"}
                  className="w-full bg-black border border-slate-800 rounded-2xl py-4 pl-14 pr-5 focus:border-blue-500 outline-none transition disabled:opacity-50"
                  placeholder="John Smith"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-slate-400 text-sm font-medium">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative mt-2">
                <Mail
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || status === "done"}
                  className="w-full bg-black border border-slate-800 rounded-2xl py-4 pl-14 pr-5 focus:border-blue-500 outline-none transition disabled:opacity-50"
                  placeholder="john@healwithindia.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-slate-400 text-sm font-medium">
                Phone
              </label>
              <div className="relative mt-2">
                <Phone
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading || status === "done"}
                  className="w-full bg-black border border-slate-800 rounded-2xl py-4 pl-14 pr-5 focus:border-blue-500 outline-none transition disabled:opacity-50"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="text-slate-400 text-sm font-medium">
                Department
              </label>
              <div className="relative mt-2">
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  disabled={isLoading || status === "done"}
                  className="w-full bg-black border border-slate-800 rounded-2xl py-4 px-5 focus:border-blue-500 outline-none transition disabled:opacity-50"
                  placeholder="e.g. Operations, Medical, Finance"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="text-slate-400 text-sm font-medium">
                Role <span className="text-red-400">*</span>
              </label>
              <div className="relative mt-2">
                <Shield
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isLoading || status === "done"}
                  className="w-full bg-black border border-slate-800 rounded-2xl py-4 pl-14 pr-5 focus:border-blue-500 outline-none transition disabled:opacity-50 appearance-none"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              {selectedRole && (
                <p className="text-slate-500 text-xs mt-2 ml-1">
                  {selectedRole.description}
                </p>
              )}
            </div>

            {/* What happens next */}
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5">
              <p className="text-blue-400 text-sm font-medium mb-2">
                What happens when you submit:
              </p>
              <ol className="text-slate-400 text-sm space-y-1 list-decimal list-inside">
                <li>A CRM employee record is created</li>
                <li>
                  A Supabase Auth account is provisioned with the{" "}
                  <strong className="text-white">
                    {selectedRole?.label ?? role}
                  </strong>{" "}
                  role
                </li>
                <li>An invitation email is sent to {email || "the employee"}</li>
                <li>
                  They set their password via the invite link and gain CRM
                  access
                </li>
              </ol>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Success */}
            {successMsg && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 text-green-400 text-sm flex items-start gap-3">
                <CheckCircle size={18} className="shrink-0 mt-0.5" />
                {successMsg}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || status === "done"}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl py-5 font-semibold transition flex items-center justify-center gap-3"
            >
              {status === "done" && <CheckCircle size={18} />}
              {statusLabel}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}