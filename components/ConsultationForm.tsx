"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function ConsultationForm() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    country: "",
    treatment: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    setLoading(true);

    let reportUrl = "";

    if (file) {
      const fileName = Date.now() + "-" + file.name;

      const { error: uploadError } =
        await supabase.storage
          .from("medical-reports")
          .upload(fileName, file);

      if (uploadError) {
        alert(uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("medical-reports")
        .getPublicUrl(fileName);

      reportUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from("patients")
      .insert([
        {
          ...form,
          report_url: reportUrl,
          status: "New",
        },
      ]);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("Consultation request submitted successfully!");

    setForm({
      full_name: "",
      email: "",
      phone: "",
      country: "",
      treatment: "",
      description: "",
    });

    setFile(null);
    setLoading(false);
  };

  return (
    <section
        id="consultation"
        className="py-24 bg-white"
      >
      <div className="max-w-4xl mx-auto px-6">

        <h2 className="text-5xl font-bold text-center mb-4">
          Free Medical Consultation
        </h2>

        <p className="text-center text-gray-600 mb-12">
          Tell us about your treatment needs and our team will connect you with suitable hospitals in India.
        </p>

        <div className="space-y-6">

          <input
            type="text"
            placeholder="Full Name"
            value={form.full_name}
            className="w-full border rounded-xl p-4"
            onChange={(e) =>
              setForm({
                ...form,
                full_name: e.target.value,
              })
            }
          />

          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            className="w-full border rounded-xl p-4"
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="WhatsApp Number"
            value={form.phone}
            className="w-full border rounded-xl p-4"
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Country"
            value={form.country}
            className="w-full border rounded-xl p-4"
            onChange={(e) =>
              setForm({
                ...form,
                country: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Treatment Needed"
            value={form.treatment}
            className="w-full border rounded-xl p-4"
            onChange={(e) =>
              setForm({
                ...form,
                treatment: e.target.value,
              })
            }
          />

          <textarea
            placeholder="Describe your medical condition"
            value={form.description}
            className="w-full border rounded-xl p-4 h-40"
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <input
            type="file"
            className="w-full border rounded-xl p-4"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-xl"
          >
            {loading
              ? "Submitting..."
              : "Submit Consultation Request"}
          </button>

        </div>

      </div>
    </section>
  );
}