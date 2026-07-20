"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Users
} from "lucide-react";
import Link from "next/link";

interface Coordinator {
  id: string;
  reference_id: string;
  full_name: string;
  phone: string;
  email: string | null;
  assigned_region: string | null;
  is_active: boolean;
  created_at: string;
}

export default function CoordinatorsSettingsPage() {
  const router = useRouter();
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [refId, setRefId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [isActive, setIsActive] = useState(true);

  const fetchCoordinators = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/coordinator");
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to load coordinators");
      }
      const data = await res.json();
      setCoordinators(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoordinators();
  }, []);

  const showToast = (msg: string, type: "success" | "error") => {
    if (type === "success") {
      setSuccess(msg);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(msg);
      setTimeout(() => setError(null), 4500);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setEditingId(null);
    setFullName("");
    setRefId(`HWI-CO-${Math.floor(1000 + Math.random() * 9000)}`);
    setPhone("");
    setEmail("");
    setRegion("");
    setIsActive(true);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (c: Coordinator) => {
    setModalMode("edit");
    setEditingId(c.id);
    setFullName(c.full_name);
    setRefId(c.reference_id);
    setPhone(c.phone);
    setEmail(c.email || "");
    setRegion(c.assigned_region || "");
    setIsActive(c.is_active);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSaveCoordinator = async () => {
    setModalLoading(true);
    setModalError(null);

    if (!fullName || !refId || !phone) {
      setModalError("Please enter full name, reference ID and telephone number.");
      setModalLoading(false);
      return;
    }

    try {
      const url = "/api/admin/coordinator";
      const method = modalMode === "create" ? "POST" : "PUT";
      const payload = {
        id: editingId,
        full_name: fullName,
        reference_id: refId,
        phone,
        email: email || null,
        assigned_region: region || null,
        is_active: isActive
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save coordinator details");
      }

      setIsModalOpen(false);
      showToast(`Coordinator successfully ${modalMode === "create" ? "registered" : "updated"}!`, "success");
      fetchCoordinators();
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteCoordinator = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this coordinator?")) return;

    try {
      setError(null);
      const res = await fetch(`/api/admin/coordinator?id=${id}`, {
        method: "DELETE"
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete coordinator");
      }

      showToast("Coordinator successfully removed.", "success");
      fetchCoordinators();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // Filter list by search query
  const filteredCoordinators = coordinators.filter(c => {
    const query = searchQuery.toLowerCase();
    return (
      c.full_name.toLowerCase().includes(query) ||
      c.reference_id.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      (c.assigned_region && c.assigned_region.toLowerCase().includes(query))
    );
  });

  return (
    <main className="min-h-screen bg-black text-white p-6 sm:p-10">
      {/* Toast Alert */}
      {success && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl border border-green-500/20 bg-green-950/85 backdrop-blur-md text-green-400 px-6 py-4 shadow-2xl animate-in fade-in slide-in-from-top-6 duration-300 flex items-center gap-3">
          <CheckCircle size={22} className="text-green-400" />
          <span className="font-semibold text-sm">{success}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb / Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-400 uppercase tracking-widest">
              <Link href="/admin/settings" className="hover:text-blue-400 transition">Settings</Link>
              <span>/</span>
              <span className="text-slate-200">Coordinators</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mt-3">Care Coordinators</h1>
            <p className="text-slate-400 mt-2">Manage background-verified patient coordinators and field agents.</p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="self-start sm:self-auto inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 px-6 py-3.5 rounded-2xl font-bold text-sm transition shadow-lg shadow-blue-600/10"
          >
            <Plus size={18} />
            Register Coordinator
          </button>
        </div>

        {/* Search controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search coordinators by name, reference ID, region or phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Display Error Banner */}
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 px-5 py-4 flex items-start gap-3 mb-8">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Coordinators Grid/Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto" />
            <p className="text-slate-400 mt-4 text-sm">Fetching coordinators database...</p>
          </div>
        ) : filteredCoordinators.length === 0 ? (
          <div className="text-center py-20 bg-slate-950 border border-slate-900 rounded-[32px]">
            <Users size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500 text-lg">No coordinators registered match search criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoordinators.map(c => (
              <div
                key={c.id}
                className={`bg-slate-950 border rounded-[32px] p-6.5 flex flex-col justify-between transition hover:-translate-y-1 ${
                  c.is_active ? "border-slate-850 hover:border-slate-750" : "border-red-950 opacity-70"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl font-bold text-blue-400">
                      {c.full_name.charAt(0)}
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-[10px] tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 font-mono font-bold px-2.5 py-1 rounded-lg">
                        {c.reference_id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        c.is_active
                          ? "text-green-400 border-green-950 bg-green-950/15"
                          : "text-red-400 border-red-950 bg-red-950/15"
                      }`}>
                        {c.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mt-5 text-slate-200">{c.full_name}</h3>
                  
                  <div className="mt-5 space-y-3.5 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-500" />
                      <a href={`tel:${c.phone}`} className="hover:text-blue-400 font-semibold">{c.phone}</a>
                    </div>
                    {c.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-slate-500" />
                        <a href={`mailto:${c.email}`} className="hover:text-blue-400 truncate font-semibold" title={c.email}>{c.email}</a>
                      </div>
                    )}
                    {c.assigned_region && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-slate-500" />
                        <span className="font-medium text-slate-300">{c.assigned_region}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-slate-900 flex justify-end gap-3.5">
                  <button
                    onClick={() => handleOpenEditModal(c)}
                    className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-xl transition"
                    title="Edit coordinator"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteCoordinator(c.id)}
                    className="p-2.5 bg-red-950/10 border border-red-950/30 hover:border-red-950/60 text-red-500 hover:text-red-400 rounded-xl transition"
                    title="Delete coordinator"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-slate-800 rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-8 py-5.5 bg-slate-900 border-b border-slate-850 flex justify-between items-center">
              <h3 className="text-xl font-bold">{modalMode === "create" ? "Register Coordinator" : "Edit Coordinator"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition"><X size={20} /></button>
            </div>
            
            <div className="p-8 space-y-4">
              {modalError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 px-4 py-3 text-xs sm:text-sm">
                  {modalError}
                </div>
              )}

              <div>
                <label className="text-slate-400 text-xs font-semibold">Reference ID (Read-only)</label>
                <input
                  type="text"
                  value={refId}
                  disabled
                  className="w-full mt-1.5 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-500 font-mono tracking-wider outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs font-semibold">Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full mt-1.5 bg-black border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs font-semibold">Telephone *</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full mt-1.5 bg-black border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs font-semibold">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. name@healwithindia.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full mt-1.5 bg-black border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs font-semibold">Assigned Region</label>
                <input
                  type="text"
                  placeholder="e.g. New Delhi NCR"
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="w-full mt-1.5 bg-black border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded bg-black border-slate-800 accent-blue-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-slate-300 text-sm font-medium cursor-pointer">Active in dispatch queue</label>
              </div>
            </div>

            <div className="px-8 py-5 bg-slate-900 border-t border-slate-850 flex justify-end gap-3.5">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold text-xs sm:text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCoordinator}
                disabled={modalLoading}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-xs sm:text-sm transition"
              >
                {modalLoading ? "Processing..." : "Save details"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
