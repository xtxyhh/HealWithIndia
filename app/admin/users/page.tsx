"use client";

import { useEffect, useState } from "react";
import { 
  Users, Plus, Search, Shield, ShieldCheck, Mail, Phone, Lock, 
  Trash2, AlertCircle, CheckCircle, Settings, X, Edit, RefreshCw 
} from "lucide-react";

interface UserItem {
  id: number;
  type: "employee" | "patient";
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  created_at: string;
}

const ALL_ROLES = [
  "super_admin", "admin", "finance", "safety_operator", "hospital_manager",
  "coordinator", "doctor", "receptionist", "support", "marketing", "sales", "patient"
];

const ALL_PERMISSIONS = [
  "Create", "Read", "Update", "Delete", "Export", "Approve", 
  "Suspend", "Restore", "Manage Users", "Manage Hospitals", 
  "Manage Finance", "Manage Safety", "Manage Settings"
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Search & Filter
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState("admin");
  const [formDept, setFormDept] = useState("");
  const [formCountry, setFormCountry] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const [activeTab, setActiveTab] = useState<"users" | "permissions">("users");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
        setPermissions(data.permissions || {});
      } else {
        setError(data.error || "Failed to load users data");
      }
    } catch (err) {
      setError("Network error occurred fetching users");
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMsg = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 4000);
  };

  const handleCreateUser = async () => {
    setError("");
    if (!formName || !formEmail) {
      setError("Name and Email are required");
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_user",
          userData: {
            name: formName,
            email: formEmail,
            phone: formPhone,
            password: formPassword,
            role: formRole,
            department: formDept,
            country: formCountry,
            notes: formNotes
          }
        })
      });

      const data = await res.json();
      if (res.ok) {
        showSuccessMsg("User created successfully");
        setShowCreateModal(false);
        resetForm();
        fetchData();
      } else {
        setError(data.error || "Failed to create user");
      }
    } catch (err) {
      setError("Network error creating user");
    }
  };

  const handleEditUser = async () => {
    setError("");
    if (!selectedUser) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "edit_user",
          userData: {
            id: selectedUser.id,
            type: selectedUser.type,
            name: formName,
            email: formEmail,
            phone: formPhone,
            role: formRole,
            department: formDept
          }
        })
      });

      const data = await res.json();
      if (res.ok) {
        showSuccessMsg("User updated successfully");
        setShowEditModal(false);
        fetchData();
      } else {
        setError(data.error || "Failed to update user");
      }
    } catch (err) {
      setError("Network error updating user");
    }
  };

  const handleResetPassword = async () => {
    setError("");
    if (!selectedUser || !formPassword) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset_password",
          userData: {
            email: selectedUser.email,
            password: formPassword
          }
        })
      });

      const data = await res.json();
      if (res.ok) {
        showSuccessMsg("Password reset successfully");
        setShowPasswordModal(false);
        setFormPassword("");
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (err) {
      setError("Network error resetting password");
    }
  };

  const handleSuspendUser = async (user: UserItem) => {
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "suspend_user",
          userData: { email: user.email }
        })
      });
      if (res.ok) {
        showSuccessMsg(`Suspended ${user.name}`);
        fetchData();
      } else {
        setError("Failed to suspend user");
      }
    } catch (err) {
      setError("Network error suspending user");
    }
  };

  const handleRestoreUser = async (user: UserItem) => {
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "restore_user",
          userData: { email: user.email }
        })
      });
      if (res.ok) {
        showSuccessMsg(`Restored ${user.name}`);
        fetchData();
      } else {
        setError("Failed to restore user");
      }
    } catch (err) {
      setError("Network error restoring user");
    }
  };

  const handleDeleteUser = async (user: UserItem) => {
    if (!confirm(`Are you sure you want to delete ${user.name}? This action is destructive.`)) return;

    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_user",
          userData: { id: user.id, type: user.type, email: user.email }
        })
      });
      if (res.ok) {
        showSuccessMsg("User deleted successfully");
        fetchData();
      } else {
        setError("Failed to delete user");
      }
    } catch (err) {
      setError("Network error deleting user");
    }
  };

  const handleTogglePermission = async (role: string, perm: string) => {
    const rolePerms = permissions[role] || [];
    const updatedPerms = rolePerms.includes(perm)
      ? rolePerms.filter(p => p !== perm)
      : [...rolePerms, perm];

    const updatedPermissions = {
      ...permissions,
      [role]: updatedPerms
    };

    setPermissions(updatedPermissions);

    // Save automatically to DB
    try {
      await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_permissions",
          permissions: updatedPermissions
        })
      });
    } catch (err) {
      setError("Failed to persist permission changes");
    }
  };

  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormPassword("");
    setFormRole("admin");
    setFormDept("");
    setFormCountry("");
    setFormNotes("");
    setError("");
  };

  const openEditModal = (user: UserItem) => {
    setSelectedUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPhone(user.phone);
    setFormRole(user.role);
    setFormDept("");
    setError("");
    setShowEditModal(true);
  };

  const openPasswordModal = (user: UserItem) => {
    setSelectedUser(user);
    setFormPassword("");
    setError("");
    setShowPasswordModal(true);
  };

  // Filter computation
  const filtered = users.filter(u => {
    const matchesSearch = !search || 
      u.name.toLowerCase().includes(search.toLowerCase()) || 
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    const matchesStatus = statusFilter === "All" || u.status === statusFilter;
    const matchesType = typeFilter === "All" || u.type === typeFilter;
    return matchesSearch && matchesRole && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="uppercase tracking-[4px] text-blue-400 text-sm font-semibold">IAM Center</p>
            <h1 className="text-5xl font-bold mt-3">User & Access Control</h1>
            <p className="text-slate-400 mt-3">Central dashboard to provision users, manually reset passwords, and audit role permissions.</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => { resetForm(); setShowCreateModal(true); }}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-2xl flex items-center gap-3 transition font-semibold"
            >
              <Plus size={20} />
              Create User
            </button>
          </div>
        </div>

        {/* Global Toast */}
        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-400 px-5 py-4 rounded-2xl flex items-center gap-3">
            <CheckCircle size={18} />
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-2xl flex items-center gap-3">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-slate-900 pb-4">
          <button
            onClick={() => setActiveTab("users")}
            className={`text-lg font-bold pb-2 border-b-2 transition ${activeTab === "users" ? "text-blue-400 border-blue-400" : "text-slate-500 border-transparent hover:text-slate-300"}`}
          >
            Users List
          </button>
          <button
            onClick={() => setActiveTab("permissions")}
            className={`text-lg font-bold pb-2 border-b-2 transition ${activeTab === "permissions" ? "text-blue-400 border-blue-400" : "text-slate-500 border-transparent hover:text-slate-300"}`}
          >
            Role Permissions Config
          </button>
        </div>

        {activeTab === "users" ? (
          <>
            {/* Filters */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                  placeholder="Search by name or email..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <select
                value={typeFilter}
                onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                className="bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 outline-none text-sm text-slate-300"
              >
                <option value="All">All Types</option>
                <option value="employee">Staff / Employees</option>
                <option value="patient">Patients</option>
              </select>
              <select
                value={roleFilter}
                onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                className="bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 outline-none text-sm text-slate-300"
              >
                <option value="All">All Roles</option>
                {ALL_ROLES.map(r => (
                  <option key={r} value={r}>{r.toUpperCase().replace("_", " ")}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 outline-none text-sm text-slate-300"
              >
                <option value="All">All Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
                <option value="NOT_ENABLED">NOT ENABLED</option>
              </select>
            </div>

            {/* List Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden">
              {loading ? (
                <div className="text-center py-20">
                  <RefreshCw className="animate-spin text-blue-500 mx-auto mb-4" size={32} />
                  <p className="text-slate-400">Loading user registry...</p>
                </div>
              ) : paginated.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                  No accounts match selected filters.
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-slate-900 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-8 py-5">User</th>
                      <th className="px-6 py-5">Role</th>
                      <th className="px-6 py-5">Status</th>
                      <th className="px-6 py-5">Type</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {paginated.map(user => (
                      <tr key={`${user.type}-${user.id}`} className="hover:bg-slate-900/50 transition">
                        <td className="px-8 py-5">
                          <div>
                            <h3 className="font-semibold text-white">{user.name}</h3>
                            <p className="text-slate-500 text-sm mt-1">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-slate-300 font-medium text-sm">
                          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-blue-400">
                            {user.role.toUpperCase().replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            user.status === "ACTIVE" ? "bg-green-500/10 text-green-400" :
                            user.status === "SUSPENDED" ? "bg-red-500/10 text-red-400" : "bg-slate-900 text-slate-400"
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-slate-400 text-xs uppercase tracking-wide">
                          {user.type}
                        </td>
                        <td className="px-8 py-5 text-right flex justify-end gap-3 items-center">
                          <button
                            onClick={() => openEditModal(user)}
                            className="bg-slate-900 border border-slate-800 hover:border-blue-500 p-2.5 rounded-xl transition text-slate-400 hover:text-white"
                            title="Edit Profile"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => openPasswordModal(user)}
                            className="bg-slate-900 border border-slate-800 hover:border-yellow-500 p-2.5 rounded-xl transition text-slate-400 hover:text-white"
                            title="Reset Password"
                          >
                            <Lock size={16} />
                          </button>
                          {user.status === "SUSPENDED" ? (
                            <button
                              onClick={() => handleRestoreUser(user)}
                              className="bg-green-500/10 hover:bg-green-500/20 text-green-400 px-4 py-2.5 rounded-xl text-xs font-bold transition"
                            >
                              Restore
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSuspendUser(user)}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-xs font-bold transition"
                            >
                              Suspend
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2.5 rounded-xl transition"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl disabled:opacity-50 text-sm font-semibold transition"
                >
                  Previous
                </button>
                <span className="text-slate-500 text-sm font-medium">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl disabled:opacity-50 text-sm font-semibold transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          /* Role Permissions Config */
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-2">Role Permissions Matrix</h2>
            <p className="text-slate-400 mb-8">Directly customize access rights for all roles. Changes are stored in the database and applied dynamically.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="px-6 py-4 text-slate-400 text-sm font-semibold uppercase">Role</th>
                    {ALL_PERMISSIONS.map(perm => (
                      <th key={perm} className="px-4 py-4 text-slate-400 text-xs font-semibold uppercase whitespace-nowrap">{perm}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {ALL_ROLES.map(role => {
                    const rolePerms = permissions[role] || [];
                    return (
                      <tr key={role} className="hover:bg-slate-900/50 transition">
                        <td className="px-6 py-4 font-bold text-slate-200 uppercase text-xs tracking-wider">{role.replace("_", " ")}</td>
                        {ALL_PERMISSIONS.map(perm => {
                          const hasPerm = rolePerms.includes(perm);
                          return (
                            <td key={perm} className="px-4 py-4">
                              <input
                                type="checkbox"
                                checked={hasPerm}
                                onChange={() => handleTogglePermission(role, perm)}
                                className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 bg-slate-900 flex justify-between items-center border-b border-slate-800">
              <h3 className="text-2xl font-bold">Create User Account</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white transition"><X size={24} /></button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-slate-400 text-sm font-semibold">Full Name *</label>
                  <input
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full mt-2 bg-black border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm font-semibold">Email Address *</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    placeholder="Enter email"
                    className="w-full mt-2 bg-black border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm font-semibold">Phone Number</label>
                  <input
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    placeholder="Phone"
                    className="w-full mt-2 bg-black border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm font-semibold">Password *</label>
                  <input
                    type="password"
                    value={formPassword}
                    onChange={e => setFormPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full mt-2 bg-black border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm font-semibold">Role *</label>
                  <select
                    value={formRole}
                    onChange={e => setFormRole(e.target.value)}
                    className="w-full mt-2 bg-black border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-sm text-slate-300"
                  >
                    {ALL_ROLES.map(r => (
                      <option key={r} value={r}>{r.toUpperCase().replace("_", " ")}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-sm font-semibold">Department / Specialty</label>
                  <input
                    value={formDept}
                    onChange={e => setFormDept(e.target.value)}
                    placeholder="e.g. Finance, Cardiology"
                    className="w-full mt-2 bg-black border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="px-8 py-5 bg-slate-900 border-t border-slate-800 flex justify-end gap-4">
              <button onClick={() => setShowCreateModal(false)} className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold transition text-sm">Cancel</button>
              <button onClick={handleCreateUser} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold transition text-sm">Create User</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 bg-slate-900 flex justify-between items-center border-b border-slate-800">
              <h3 className="text-2xl font-bold">Edit User Account</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white transition"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-slate-400 text-sm font-semibold">Full Name</label>
                <input
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full mt-2 bg-black border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm font-semibold">Email Address</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  disabled
                  className="w-full mt-2 bg-slate-900 border border-slate-800 text-slate-500 rounded-xl px-4 py-3 outline-none text-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm font-semibold">Phone Number</label>
                <input
                  value={formPhone}
                  onChange={e => setFormPhone(e.target.value)}
                  className="w-full mt-2 bg-black border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition text-sm"
                />
              </div>
              {selectedUser.type === "employee" && (
                <div>
                  <label className="text-slate-400 text-sm font-semibold">Role</label>
                  <select
                    value={formRole}
                    onChange={e => setFormRole(e.target.value)}
                    className="w-full mt-2 bg-black border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-sm text-slate-300"
                  >
                    {ALL_ROLES.filter(r => r !== "patient").map(r => (
                      <option key={r} value={r}>{r.toUpperCase().replace("_", " ")}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="px-8 py-5 bg-slate-900 border-t border-slate-800 flex justify-end gap-4">
              <button onClick={() => setShowEditModal(false)} className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold transition text-sm">Cancel</button>
              <button onClick={handleEditUser} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold transition text-sm">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* PASSWORD RESET MODAL */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 bg-slate-900 flex justify-between items-center border-b border-slate-800">
              <h3 className="text-2xl font-bold">Reset Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-white transition"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-slate-400 text-sm">Specify a new secure password for <strong className="text-white">{selectedUser.name}</strong>.</p>
              <div>
                <label className="text-slate-400 text-sm font-semibold">New Password</label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={e => setFormPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full mt-2 bg-black border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition text-sm"
                />
              </div>
            </div>
            <div className="px-8 py-5 bg-slate-900 border-t border-slate-800 flex justify-end gap-4">
              <button onClick={() => setShowPasswordModal(false)} className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold transition text-sm">Cancel</button>
              <button onClick={handleResetPassword} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold transition text-sm">Save Password</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
