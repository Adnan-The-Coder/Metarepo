"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiX, FiLoader, FiCheck, FiAlertCircle } from "react-icons/fi";

interface ConsultationData {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  about: string;
  goals: string;
  preferredDateTime: string;
  timezone: string;
  source: string;
  subscribed: boolean;
}

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [formData, setFormData] = useState<ConsultationData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    about: "",
    goals: "",
    preferredDateTime: "",
    timezone: "Asia/Kolkata",
    source: "portfolio",
    subscribed: true,
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState<any>(null);
  const [countdown, setCountdown] = useState(30);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Countdown timer for auto-close
  useEffect(() => {
    if (status === "success") {
      setCountdown(30);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            setStatus("idle");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch(
        "https://metarepo-cf-api.adnanthecoder.com/consult",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data: any = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit consultation request");
      }

      setStatus("success");
      setSuccessData(data.data);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        role: "",
        about: "",
        goals: "",
        preferredDateTime: "",
        timezone: "Asia/Kolkata",
        source: "portfolio",
        subscribed: true,
      });
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes backdrop-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modal-slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes border-flow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes glow-pulse {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes success-scale {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes countdown-ring {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 283;
          }
        }

        .modal-backdrop {
          animation: backdrop-fade 0.3s ease-out;
        }

        .modal-container {
          animation: modal-slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(6, 182, 212, 0.6), rgba(168, 85, 247, 0.6));
          border-radius: 10px;
          transition: background 0.3s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(6, 182, 212, 0.8), rgba(168, 85, 247, 0.8));
        }

        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(6, 182, 212, 0.6) rgba(15, 23, 42, 0.5);
        }

        .modal-inner {
          position: relative;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%);
          border-radius: 1rem;
          overflow: hidden;
        }

        /* Pattern overlay */
        .pattern-overlay {
          position: absolute;
          inset: 0;
          opacity: 0;
          background-image: repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              rgba(255, 255, 255, 0.05) 20px,
              rgba(255, 255, 255, 0.05) 40px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 20px,
              rgba(255, 255, 255, 0.05) 20px,
              rgba(255, 255, 255, 0.05) 40px
            );
          pointer-events: none;
        }

        .input-field {
          transition: all 0.3s ease;
        }

        .input-field:focus {
          background: rgba(30, 41, 59, 0.6);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.15);
        }

        .submit-button {
          position: relative;
          overflow: hidden;
        }

        .submit-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .submit-button:hover::before {
          left: 100%;
        }

        .success-icon {
          animation: success-scale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .countdown-circle {
          transform: rotate(-90deg);
          transform-origin: center;
        }

        .countdown-ring {
          stroke-dasharray: 283;
          stroke-dashoffset: 0;
          animation: countdown-ring 30s linear forwards;
        }

        .close-button {
          transition: all 0.3s ease;
        }

        .close-button:hover {
          transform: rotate(90deg) scale(1.1);
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container - Higher z-index than backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 pointer-events-none overflow-y-auto">
        <div
          ref={modalRef}
          className="modal-container pointer-events-auto w-full max-w-sm sm:max-w-md lg:max-w-2xl my-auto rounded-xl sm:rounded-2xl shadow-2xl"
        >
          <div className="modal-inner shadow-2xl shadow-cyan-500/20">
            <div className="pattern-overlay"></div>

            {/* Header - Sticky and properly positioned */}
            <div className="sticky top-0 z-20 flex items-center justify-between gap-2 sm:gap-3 border-b border-cyan-500/20 bg-slate-950/98 backdrop-blur-xl px-4 sm:px-6 py-4 sm:py-5 min-h-20 sm:min-h-24">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent line-clamp-2">
                  Schedule Consultation
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5 sm:mt-1 line-clamp-2">
                  Tell us about your project and let's discuss how it can shipped successfully.
                </p>
              </div>
              <button
                onClick={onClose}
                className="close-button flex-shrink-0 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                aria-label="Close modal"
              >
                <FiX size={24} className="w-6 h-6" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-6 relative max-h-[calc(100vh-12rem)] sm:max-h-[calc(100vh-14rem)] overflow-y-auto custom-scrollbar">
              {status === "success" ? (
                <div className="space-y-6 py-8">
                  <div className="flex justify-center">
                    <div className="relative">
                      {/* Countdown ring */}
                      <svg className="absolute inset-0 w-20 h-20 countdown-circle" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="rgba(6, 182, 212, 0.2)"
                          strokeWidth="4"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="4"
                          className="countdown-ring"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgba(6, 182, 212, 0.8)" />
                            <stop offset="100%" stopColor="rgba(168, 85, 247, 0.8)" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="success-icon w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-2 border-emerald-400/40 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <FiCheck className="text-emerald-400" size={40} />
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-3">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                      Request Submitted Successfully!
                    </h3>
                    <p className="text-slate-300 text-lg">
                      Thank you for scheduling a consultation. We'll review your request and reach
                      out shortly.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-5 space-y-3 border border-cyan-500/20">
                    <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                      <span className="text-slate-400 font-medium">Request ID:</span>
                      <span className="font-mono text-cyan-400 font-semibold tracking-wider">
                        #{successData?.id}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                      <span className="text-slate-400 font-medium">Email:</span>
                      <span className="text-slate-200">{successData?.email}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                      <span className="text-slate-400 font-medium">Status:</span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 font-semibold text-sm">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                        {successData?.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-400 font-medium">Preferred DateTime:</span>
                      <span className="text-slate-200">
                        {new Date(successData?.preferredDateTime).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-6 pb-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <p className="text-sm text-slate-400">
                      Auto-closing in{" "}
                      <span className="text-cyan-400 font-semibold font-mono">{countdown}s</span>
                    </p>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-600/50 text-slate-200 font-semibold hover:from-slate-600/60 hover:to-slate-500/60 hover:border-slate-500/60 transition-all"
                  >
                    Close Now
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {/* Error Message */}
                  {status === "error" && (
                    <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-red-500/10 border border-red-500/30 backdrop-blur-sm">
                      <FiAlertCircle className="text-red-400 flex-shrink-0 mt-0.5 w-5 h-5 sm:w-6 sm:h-6" />
                      <p className="text-xs sm:text-sm text-red-300">{errorMessage}</p>
                    </div>
                  )}

                  {/* Personal Info Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 sm:mb-2">
                        Full Name <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-field w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 sm:mb-2">
                        Email <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-field w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Contact & Company Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 sm:mb-2">
                        Phone <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="input-field w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                        placeholder="+1-234-567-8900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 sm:mb-2">
                        Company <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="input-field w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                        placeholder="Your Company"
                      />
                    </div>
                  </div>

                  {/* Role & DateTime Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 sm:mb-2">
                        Your Role <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className="input-field w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                        placeholder="CTO / Founder"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 sm:mb-2">
                        Preferred Date & Time <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        name="preferredDateTime"
                        value={formData.preferredDateTime}
                        onChange={handleChange}
                        required
                        className="input-field w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 sm:mb-2">
                      Timezone <span className="text-cyan-400">*</span>
                    </label>
                    <select
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleChange}
                      className="input-field w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz} value={tz} className="bg-slate-900">
                          {tz}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* About & Goals */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 sm:mb-2">
                      About Your Project <span className="text-cyan-400">*</span>
                    </label>
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleChange}
                      required
                      rows={2}
                      className="input-field w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 resize-none"
                      placeholder="Briefly describe your project, product, or service..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 sm:mb-2">
                      Your Goals & Challenges <span className="text-cyan-400">*</span>
                    </label>
                    <textarea
                      name="goals"
                      value={formData.goals}
                      onChange={handleChange}
                      required
                      rows={2}
                      className="input-field w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 resize-none"
                      placeholder="What are your main goals and challenges?"
                    />
                  </div>

                  {/* Subscribe Checkbox */}
                  <label className="flex items-start gap-2 sm:gap-3 cursor-pointer group p-2 sm:p-3 rounded-lg hover:bg-slate-800/20 transition-colors">
                    <input
                      type="checkbox"
                      name="subscribed"
                      checked={formData.subscribed}
                      onChange={handleChange}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded border border-slate-700/50 bg-slate-800/50 mt-1 cursor-pointer accent-cyan-500 flex-shrink-0"
                    />
                    <span className="text-xs sm:text-sm text-slate-300 group-hover:text-slate-200 transition-colors leading-relaxed">
                      Keep me updated with architectural insights, case studies, and optimization tips
                    </span>
                  </label>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 pb-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm rounded-lg border border-slate-700/50 text-slate-300 font-semibold hover:bg-slate-800/50 hover:border-slate-600/50 transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="submit-button flex-1 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold hover:from-emerald-400 hover:to-cyan-400 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      {loading ? (
                        <>
                          <FiLoader size={16} className="animate-spin" />
                          <span className="hidden sm:inline">Submitting...</span>
                        </>
                      ) : (
                        <span>Schedule</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}