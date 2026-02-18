"use client";

import { useState, useEffect } from "react";
import { User, Mail, Save, Loader2, CheckCircle, AlertCircle, Shield, Clock, IdCard, Users } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { API_ENDPOINTS } from "@/config/api";

interface UserProfile {
  id?: number;
  uuid: string;
  email: string;
  full_name: string;
  is_active: boolean;
  last_login?: string;
  acm_member_id?: string;
  member_type: string;
  role_type?: string;
}

const ROLE_OPTIONS = [
  "Tech", "Events", "Marketing", "Media & CC", "Design", 
  "Documentation", "Logistics", "HR", "Chairperson", "Tech Captain"
];

export default function Settings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editableFields, setEditableFields] = useState({
    full_name: "",
    acm_member_id: "",
    role_type: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const res = await fetch(API_ENDPOINTS.getProfileByUUID(session.user.id));
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setProfile(json.data);
          setEditableFields({
            full_name: json.data.full_name || "",
            acm_member_id: json.data.acm_member_id || "",
            role_type: json.data.role_type || "",
          });
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(API_ENDPOINTS.updateProfileByUUID(profile.uuid), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editableFields,
          updated_at: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setProfile({ ...profile, ...editableFields });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6B35]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64 text-[#6b6b6b]">
        <p>Unable to load profile</p>
      </div>
    );
  }

  const memberBadgeColor = {
    GB: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Execom: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    core: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  }[profile.member_type] || "bg-gray-500/20 text-gray-400 border-gray-500/30";

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Account Settings</h1>
        <p className="text-sm sm:text-base text-[#6b6b6b] mt-2">Manage your profile information and preferences</p>
      </div>

      {/* Message Toast */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
          message.type === "success" 
            ? "bg-green-500/10 text-green-400 border border-green-500/20" 
            : "bg-red-500/10 text-red-400 border border-red-500/20"
        }`}>
          {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-[#161616] border border-[#222222] rounded-2xl p-6 sm:p-8 space-y-6">
        
        {/* Status Badges */}
        <div className="flex flex-wrap gap-3">
          <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${memberBadgeColor}`}>
            {profile.member_type.toUpperCase()}
          </span>
          <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
            profile.is_active 
              ? "bg-green-500/20 text-green-400 border-green-500/30" 
              : "bg-red-500/20 text-red-400 border-red-500/30"
          }`}>
            {profile.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Read-only Fields */}
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Email - Read Only */}
          <div>
            <label className="text-sm text-[#6b6b6b] flex items-center gap-2 mb-2">
              <Mail size={14} /> Email
            </label>
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl px-4 py-3 text-sm text-[#8b8b8b]">
              {profile.email}
            </div>
          </div>

          {/* Last Login - Read Only */}
          <div>
            <label className="text-sm text-[#6b6b6b] flex items-center gap-2 mb-2">
              <Clock size={14} /> Last Login
            </label>
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl px-4 py-3 text-sm text-[#8b8b8b]">
              {profile.last_login ? new Date(profile.last_login).toLocaleString() : "Never"}
            </div>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="grid sm:grid-cols-2 gap-5 pt-4 border-t border-[#1f1f1f]">
          {/* Full Name */}
          <div>
            <label className="text-sm text-[#6b6b6b] flex items-center gap-2 mb-2">
              <User size={14} /> Full Name
            </label>
            <input
              type="text"
              value={editableFields.full_name}
              onChange={(e) => setEditableFields({ ...editableFields, full_name: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]/20 transition-all"
              placeholder="Enter your name"
            />
          </div>

          {/* ACM Member ID */}
          <div>
            <label className="text-sm text-[#6b6b6b] flex items-center gap-2 mb-2">
              <IdCard size={14} /> ACM Member ID
            </label>
            <input
              type="text"
              value={editableFields.acm_member_id}
              onChange={(e) => setEditableFields({ ...editableFields, acm_member_id: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]/20 transition-all"
              placeholder="e.g., ACM-2024-001"
            />
          </div>

          {/* Role Type */}
          <div>
            <label className="text-sm text-[#6b6b6b] flex items-center gap-2 mb-2">
              <Users size={14} /> Role Type
            </label>
            <select
              value={editableFields.role_type}
              onChange={(e) => setEditableFields({ ...editableFields, role_type: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]/20 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#161616]">Select role...</option>
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role} className="bg-[#161616]">{role}</option>
              ))}
            </select>
          </div>

          {/* Member Type - Read Only Info */}
          <div>
            <label className="text-sm text-[#6b6b6b] flex items-center gap-2 mb-2">
              <Shield size={14} /> Member Type
            </label>
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl px-4 py-3 text-sm text-[#8b8b8b] flex items-center justify-between">
              <span className="capitalize">{profile.member_type}</span>
              <span className="text-xs text-[#4a4a4a]">Contact admin to change</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-4 bg-[#FF6B35] hover:bg-[#ff8555] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-[#FF6B35]/20 flex items-center justify-center gap-3 text-base"
        >
          {saving ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
