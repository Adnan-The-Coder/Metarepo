/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CloudflareBindings {
  // Environment config
  ENVIRONMENT?: string;
  API_VERSION?: string;
  API_BASE_URL?: string;
  LOG_LEVEL?: string;
  ENABLE_DETAILED_LOGGING?: string;
  ENABLE_PERFORMANCE_MONITORING?: string;

  // Supabase
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_ANON_KEY?: string;
  IP_INFO_TOKEN?: string;

  // Database
  JWT_SECRET?: string;
  DATABASE_URL?: string;

  // Payment (Razorpay)
  RAZORPAY_LIVE_KEY_ID?: string;
  RAZORPAY_LIVE_KEY_SECRET?: string;

  RESEND_API_KEY?: string;

  // Database binding
  DB?: any;
}