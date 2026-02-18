"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { API_ENDPOINTS } from "@/config/api";

/* ================================
   API RESPONSE TYPE
================================ */
interface ApiResponse {
  success: boolean;
  data?: {
    id: number;
    uuid: string;
    email: string;
    full_name: string;
    is_active: boolean;
    last_login?: string | null;
    acm_member_id?: string | null;
    member_type: string;
    role_type?: string | null;
    created_at: string;
    updated_at?: string | null;
  };
}

/* ================================
   USER PROFILE TYPE (Frontend)
================================ */
export interface UserProfile {
  id: number;
  uuid: string;
  email: string;
  full_name: string;
  is_active: boolean;
  last_login?: string | null;
  acm_member_id?: string | null;
  member_type: string;
  role_type?: string | null;
}

/* ================================
   HOOK
================================ */
export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (uuid: string) => {
    try {
      const res = await fetch(API_ENDPOINTS.getProfileByUUID(uuid));

      if (res.ok) {
        const json: ApiResponse = await res.json();

        if (json.success && json.data) {
          const profile = json.data;

          setUser({
            id: profile.id,
            uuid: profile.uuid,
            email: profile.email,
            full_name: profile.full_name,
            is_active: profile.is_active,
            last_login: profile.last_login,
            acm_member_id: profile.acm_member_id,
            member_type: profile.member_type,
            role_type: profile.role_type,
          });
          return;
        }
      }

      /* ================================
         FALLBACK: SUPABASE AUTH ONLY
         (Minimal, no club metadata)
      ================================ */
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) {
        setUser({
          id: -1, // indicates not in local DB yet
          uuid: data.user.id,
          email: data.user.email || "",
          full_name: data.user.user_metadata?.full_name || "",
          is_active: true,
          member_type: "core",
        });
      }
    } catch (err) {
      console.error("❌ Error fetching user profile:", err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (isMounted) {
        if (data.session) {
          await fetchUserProfile(data.session.user.id);
        }
        setLoading(false);
      }
    };

    initSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        if (event === "SIGNED_IN" && session) {
          await fetchUserProfile(session.user.id);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  return { user, loading };
}
