"use client";
import React, { useState } from "react";
import { Shield, LayoutDashboard, FileText, Layers, XCircle, Terminal } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

interface AuthProps {
  onAuthSuccess?: () => void;
  onAuthError?: (error: string) => void;
  initialError?: string | null;
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const FeatureItem = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
  <div className="flex items-center gap-3 text-white/35">
    <div className="w-7 h-7 rounded-[3px] border border-white/[0.07] bg-white/[0.03] flex items-center justify-center shrink-0">
      <Icon size={13} className="text-cyan-400" />
    </div>
    <span className="text-xs tracking-wide">{text}</span>
  </div>
);

export default function Auth({ onAuthSuccess, onAuthError, initialError }: AuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);

  React.useEffect(() => {
    if (initialError) setError(initialError);
  }, [initialError]);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError(null);
    try {
      localStorage.setItem("authRedirectUrl", window.location.pathname);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { prompt: "select_account", access_type: "offline" },
        },
      });
      if (error) throw error;
      onAuthSuccess?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign in. Please try again.";
      setError(msg);
      onAuthError?.(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] flex items-center justify-center p-4 overflow-hidden">

      {/* Grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, #09090b 100%)",
        }}
      />
      {/* Glows */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-cyan-500/[0.06] blur-[100px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-emerald-500/[0.04] blur-[80px]" />

      <div className="relative w-full max-w-sm flex flex-col gap-4">

        {/* Error */}
        {error && (
          <div className="rounded-[3px] border border-red-500/20 bg-red-500/[0.06] p-3.5 flex items-start gap-3">
            <XCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-red-400 mb-0.5">Authentication Failed</p>
              <p className="text-[11px] text-red-400/60 leading-relaxed">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400/40 hover:text-red-400 transition-colors shrink-0">
              <XCircle size={13} />
            </button>
          </div>
        )}

        {/* Main card */}
        <div
          className="rounded-[4px] border border-white/[0.07] bg-white/[0.025] shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Top accent */}
          <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500 to-emerald-500" />

          <div className="p-7 sm:p-8 flex flex-col gap-7">

            {/* Header */}
            <div className="flex flex-col gap-3">
              {/* Monogram + wordmark */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[3px] bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-slate-900 font-black text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  AD
                </div>
                <div>
                  <p className="text-xs font-bold text-white tracking-wide leading-tight">adnanthecoder</p>
                  <p className="text-[10px] text-white/30 tracking-[0.1em] uppercase">Admin Portal</p>
                </div>
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                  Welcome back,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                    Adnan.
                  </span>
                </h1>
                <p className="mt-1 text-[0.8rem] text-white/35 leading-relaxed">
                  Sign in to manage your portfolio, content, and system settings.
                </p>
              </div>
            </div>

            {/* Access notice */}
            <div className="flex items-start gap-3 rounded-[3px] border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
              <Shield size={14} className="text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-white/35 leading-relaxed">
                Restricted to{" "}
                <span className="text-cyan-400 font-semibold">authorised accounts</span>{" "}
                only. Unauthorised access attempts are logged.
              </p>
            </div>

            {/* Google CTA */}
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-3 bg-white hover:bg-gray-50 disabled:bg-gray-200 text-gray-800 text-sm font-semibold rounded-[3px] shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:shadow-[0_0_28px_rgba(6,182,212,0.22)] transition-all duration-200 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              <span>{isLoading ? "Signing in…" : "Continue with Google"}</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/[0.05]" />
              <span className="text-[10px] uppercase tracking-[0.15em] text-white/20">What you can do</span>
              <div className="flex-1 h-px bg-white/[0.05]" />
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-2.5">
              <FeatureItem icon={LayoutDashboard} text="Dashboard overview" />
              <FeatureItem icon={FileText}        text="Manage blog posts" />
              <FeatureItem icon={Layers}          text="Edit portfolio sections" />
              <FeatureItem icon={Terminal}        text="System & settings" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-white/20 leading-relaxed px-2">
          By signing in you agree to the{" "}
          <a href="/terms"   className="text-white/35 hover:text-white/60 underline transition-colors">Terms</a>
          {" "}and{" "}
          <a href="/privacy" className="text-white/35 hover:text-white/60 underline transition-colors">Privacy Policy</a>.
          {" "}Issues?{" "}
          <a href="mailto:contact@adnanthecoder.com" className="text-cyan-500/70 hover:text-cyan-400 transition-colors font-medium">
            Get in touch
          </a>
        </p>

      </div>
    </div>
  );
}