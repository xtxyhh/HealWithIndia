"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  User,
  Mail,
  Phone,
  Globe,
  Stethoscope,
  CheckCircle,
  Loader2,
} from "lucide-react";

type CreateStep = "idle" | "creating_patient" | "sending_invite" | "done" | "error";

interface CreatePatientModalProps {
  onClose: () => void;
}

const COUNTRY_OPTIONS = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Nigeria",
  "UAE",
  "Bangladesh",
  "Kenya",
  "Tanzania",
  "Uganda",
  "Ethiopia",
  "Ghana",
  "South Africa",
  "Other",
];

const TREATMENT_OPTIONS = [
  "Cardiac Surgery",
  "Orthopedic Surgery",
  "Cancer Treatment",
  "Kidney Transplant",
  "Liver Transplant",
  "Eye Surgery",
  "Cosmetic Surgery",
  "Fertility Treatment",
  "Spine Surgery",
  "Neurological Surgery",
  "Dental Treatment",
  "Bariatric Surgery",
  "Other",
];

export default function CreatePatientModal({ onClose }: CreatePatientModalProps) {
  const router = useRouter();

  const [step, setStep] = useState<CreateStep>("idle");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [treatment, setTreatment] = useState("");
  const [notes, setNotes] = useState("");
  const [sendInvite, setSendInvite] = useState(true);
  const [error, setError] = useState("");
  const [successInfo, setSuccessInfo] = useState<{ name: string; email: string } | null>(null);

  const isLoading = step === "creating_patient" || step === "sending_invite";

  const handleSubmit = async () => {
    setError("");

    if (!fullName.trim() || !email.trim()) {
      setError("Full name and email are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      // Step 1: Create CRM patient record
      setStep("creating_patient");
      const createRes = await fetch("/api/admin/patient/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || undefined,
          country: country || undefined,
          treatment: treatment || undefined,
          notes: notes.trim() || undefined,
        }),
      });

      const createData = await createRes.json();

      if (!createRes.ok) {
        setError(createData.error || "Failed to create patient record.");
        setStep("error");
        return;
      }

      const patientId = createData.patient_id;

      // Step 2: Optionally provision portal access + send invite
      if (sendInvite) {
        setStep("sending_invite");
        const inviteRes = await fetch("/api/admin/patient/portal-access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patient_id: patientId,
            action: "enable",
          }),
        });

        const inviteData = await inviteRes.json();

        if (!inviteRes.ok) {
          // Patient was created but invite failed — non-fatal
          setError(
            `Patient record created (ID: ${patientId}), but portal invite failed: ${inviteData.error}. You can enable portal access from the patient's profile.`
          );
          setStep("error");
          // Still refresh so the patient appears in the list
          router.refresh();
          return;
        }
      }

      setStep("done");
      setSuccessInfo({ name: fullName.trim(), email: email.trim() });
      router.refresh();
    } catch (err) {
      console.error("Patient creation error:", err);
      setError("An unexpected error occurred. Please try again.");
      setStep("error");
    }
  };

  const stepLabel = {
    idle: "Create Patient",
    creating_patient: "Creating patient record...",
    sending_invite: "Sending portal invite...",
    done: "Patient Created!",
    error: "Try Again",
  }[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={step === "done" ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-slate-950 border border-slate-800 rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-slate-800">
          <div>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-1">
              Patient Management
            </p>
            <h2 className="text-2xl font-bold">Add New Patient</h2>
            <p className="text-slate-400 text-sm mt-1">
              Creates a CRM record and optionally sends a Safety Hub portal invite.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-slate-800 transition text-slate-400 hover:text-white disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success State */}
        {step === "done" && successInfo ? (
          <div className="p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={36} className="text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{successInfo.name} Added!</h3>
            <p className="text-slate-400 mb-2">
              Patient record created successfully.
            </p>
            {sendInvite && (
              <p className="text-slate-400 text-sm">
                A Safety Hub portal invitation has been sent to{" "}
                <strong className="text-white">{successInfo.email}</strong>.
              </p>
            )}
            <button
              onClick={onClose}
              className="mt-8 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-semibold transition"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-8 space-y-6">
            {/* Full Name */}
            <div>
              <label className="text-slate-400 text-sm font-medium block mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-black border border-slate-800 rounded-2xl py-4 pl-12 pr-5 focus:border-blue-500 outline-none transition disabled:opacity-50 text-sm"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-slate-400 text-sm font-medium block mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-black border border-slate-800 rounded-2xl py-4 pl-12 pr-5 focus:border-blue-500 outline-none transition disabled:opacity-50 text-sm"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-slate-400 text-sm font-medium block mb-2">
                Phone
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-black border border-slate-800 rounded-2xl py-4 pl-12 pr-5 focus:border-blue-500 outline-none transition disabled:opacity-50 text-sm"
                  placeholder="+1 555 000 0000"
                />
              </div>
            </div>

            {/* Country + Treatment — 2 col grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm font-medium block mb-2">
                  Country
                </label>
                <div className="relative">
                  <Globe
                    size={16}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-black border border-slate-800 rounded-2xl py-4 pl-12 pr-5 focus:border-blue-500 outline-none transition disabled:opacity-50 text-sm appearance-none"
                  >
                    <option value="">Select country</option>
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-sm font-medium block mb-2">
                  Treatment
                </label>
                <div className="relative">
                  <Stethoscope
                    size={16}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <select
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-black border border-slate-800 rounded-2xl py-4 pl-12 pr-5 focus:border-blue-500 outline-none transition disabled:opacity-50 text-sm appearance-none"
                  >
                    <option value="">Select treatment</option>
                    {TREATMENT_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-slate-400 text-sm font-medium block mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isLoading}
                rows={3}
                className="w-full bg-black border border-slate-800 rounded-2xl py-4 px-5 focus:border-blue-500 outline-none transition disabled:opacity-50 text-sm resize-none"
                placeholder="Initial consultation notes, referral source, etc."
              />
            </div>

            {/* Portal Invite Toggle */}
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5">
              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendInvite}
                  onChange={(e) => setSendInvite(e.target.checked)}
                  disabled={isLoading}
                  className="w-5 h-5 accent-blue-500"
                />
                <div>
                  <p className="text-white text-sm font-medium">
                    Enable Patient Safety Hub portal access
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Creates a Supabase Auth account and sends an invitation email so the patient can log into their Safety Hub.
                  </p>
                </div>
              </label>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 py-4 rounded-2xl border border-slate-700 text-slate-300 hover:bg-slate-900 transition disabled:opacity-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                {stepLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
