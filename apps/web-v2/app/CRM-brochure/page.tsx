// "use client";

// import { useState } from "react";

// // ─── TYPE DEFINITIONS ───────────────────────────────────────────────────────

// type PainCard = {
//   icon: string;
//   title: string;
//   desc: string;
// };

// type ModuleRow = {
//   name: string;
//   desc: string;
//   tags: { label: string; type: "core" | "ai" | "auto" | "mobile" | "security" }[];
// };

// type ModuleGroup = {
//   group: string;
//   modules: ModuleRow[];
// };

// type TierFeature = string;

// type Tier = {
//   badge: string;
//   name: string;
//   price: string;
//   delivery: string;
//   features: TierFeature[];
//   variant: "starter" | "growth" | "enterprise";
// };

// type ProcessStep = {
//   phase: string;
//   title: string;
//   desc: string;
//   days: string;
// };

// type Vertical = {
//   emoji: string;
//   title: string;
//   desc: string;
// };

// type CompareRow = {
//   feature: string;
//   zoho: string;
//   custom: string;
//   salesforce: string;
//   customPositive?: boolean;
// };

// type FaqItem = {
//   q: string;
//   a: string;
// };

// // ─── DATA ────────────────────────────────────────────────────────────────────

// const STATS = [
//   { num: "₹8.5B", lbl: "India CRM market by 2035" },
//   { num: "65%", lbl: "More quota hits with mobile CRM" },
//   { num: "23%", lbl: "Higher retention — OECD research" },
//   { num: "4.1mo", lbl: "Average ROI breakeven point" },
// ];

// const PAIN_CARDS: PainCard[] = [
//   {
//     icon: "🔧",
//     title: "Rigid, Unfit-to-Purpose Tools",
//     desc: "Off-the-shelf CRMs force your team to adapt to the tool, not the other way. Result: low adoption, shadow spreadsheets, and missed follow-ups.",
//   },
//   {
//     icon: "💸",
//     title: "Endless Monthly SaaS Burn",
//     desc: "₹3,000–₹25,000/month per seat, every month, forever. No ownership. No exit. And integrations cost extra on top.",
//   },
//   {
//     icon: "🔒",
//     title: "Data Hostage Situation",
//     desc: "Customer data lives on foreign servers, subject to GDPR/DPDP risks. Data export is painful, migrations are nightmares.",
//   },
//   {
//     icon: "🧩",
//     title: "Integration Hell",
//     desc: "WhatsApp, Razorpay, Tally, GST, email, SMS — stitching these into a third-party CRM means Zapier costs, API limits, and fragile pipelines.",
//   },
//   {
//     icon: "📊",
//     title: "Zero Business-Specific Reporting",
//     desc: "Pre-built dashboards show generic metrics. Your business needs revenue by territory, follow-up aging, and custom KPIs — not vanity templates.",
//   },
//   {
//     icon: "⚙️",
//     title: "No Automation Where It Matters",
//     desc: "Your team is still manually sending follow-ups, creating invoices, and updating deal stages. That's 2–3 hours/day per rep — gone.",
//   },
// ];

// const MODULE_GROUPS: ModuleGroup[] = [
//   {
//     group: "Core CRM Engine",
//     modules: [
//       {
//         name: "Lead & Contact Management",
//         desc: "Centralised lead capture from web forms, WhatsApp, email & manual entry. Deduplication, tagging, segmentation & custom fields.",
//         tags: [{ label: "Core", type: "core" }, { label: "Mobile", type: "mobile" }],
//       },
//       {
//         name: "Pipeline & Deal Tracker",
//         desc: "Kanban + list view. Drag-drop stage management. Deal value forecasting. Lost-deal reason capture for pattern analysis.",
//         tags: [{ label: "Core", type: "core" }],
//       },
//       {
//         name: "Activity Log & Follow-up Engine",
//         desc: "All calls, emails, meetings logged per contact. Smart follow-up reminders. Overdue alerts for managers. Aging tracker.",
//         tags: [{ label: "Core", type: "core" }, { label: "Auto", type: "auto" }],
//       },
//       {
//         name: "Contact 360° View",
//         desc: "Full history: conversations, documents, invoices, support tickets — one unified timeline per contact.",
//         tags: [{ label: "Core", type: "core" }],
//       },
//     ],
//   },
//   {
//     group: "Automation Layer",
//     modules: [
//       {
//         name: "Workflow Automation Builder",
//         desc: "Trigger-based automations: "Lead assigned → send WhatsApp → create follow-up task in 24h." No-code config for non-tech admins.",
//         tags: [{ label: "Auto", type: "auto" }],
//       },
//       {
//         name: "WhatsApp & Email Drip Sequences",
//         desc: "Automated nurture sequences post-lead capture. Stage-triggered templates. Open rate and reply tracking baked in.",
//         tags: [{ label: "Auto", type: "auto" }, { label: "Mobile", type: "mobile" }],
//       },
//       {
//         name: "Auto Invoice & Quote Generator",
//         desc: "Deal closed → auto-generate PDF quote/invoice via Razorpay or custom template. Tally-ready export formats included.",
//         tags: [{ label: "Auto", type: "auto" }],
//       },
//       {
//         name: "SMS / WhatsApp Broadcast",
//         desc: "Segment-targeted bulk campaigns. Scheduled sends. Delivery & read receipt tracking. Opt-out handling per TRAI rules.",
//         tags: [{ label: "Auto", type: "auto" }, { label: "Mobile", type: "mobile" }],
//       },
//     ],
//   },
//   {
//     group: "Intelligence & Reporting",
//     modules: [
//       {
//         name: "Sales Analytics Dashboard",
//         desc: "Revenue by rep / territory / source. Conversion funnel heatmap. Monthly trend lines. Exportable to Excel/PDF.",
//         tags: [{ label: "Core", type: "core" }],
//       },
//       {
//         name: "AI Lead Scoring",
//         desc: "Rank leads by engagement signals. Surfaces hot leads to the top of queue automatically. Built on your own historical data.",
//         tags: [{ label: "AI", type: "ai" }],
//       },
//       {
//         name: "Custom KPI Widgets",
//         desc: "Define your own metrics — CAC, LTV, deal velocity, field agent visits — and build a board your management actually uses.",
//         tags: [{ label: "Core", type: "core" }],
//       },
//     ],
//   },
//   {
//     group: "Indian Business Integrations",
//     modules: [
//       {
//         name: "WhatsApp Business API",
//         desc: "Two-way messaging inside CRM. Template messages, media sends, chatbot hand-off. Works with BSP and direct Meta API.",
//         tags: [{ label: "Mobile", type: "mobile" }, { label: "Auto", type: "auto" }],
//       },
//       {
//         name: "Razorpay / PayU Integration",
//         desc: "Payment links inside CRM. Auto-update deal to 'Paid' on webhook. Reconciliation report per period.",
//         tags: [{ label: "Core", type: "core" }],
//       },
//       {
//         name: "GST-Ready Invoicing",
//         desc: "GSTIN capture, HSN/SAC codes, IGST/CGST/SGST split. PDF output formatted per Indian tax requirements.",
//         tags: [{ label: "Core", type: "core" }],
//       },
//       {
//         name: "Role-Based Access + Audit Trail",
//         desc: "Admin / Manager / Sales Rep / Support roles. DPDP-compliant data handling. Full audit log of who changed what and when.",
//         tags: [{ label: "Core", type: "core" }, { label: "Security", type: "security" }],
//       },
//     ],
//   },
//   {
//     group: "Delivery & Ownership",
//     modules: [
//       {
//         name: "Cloud Deployment",
//         desc: "Deployed on AWS / DigitalOcean / your own VPS. CI/CD pipeline set up. SSL, domain, environment configuration included.",
//         tags: [{ label: "Core", type: "core" }],
//       },
//       {
//         name: "Full Source Code Handoff",
//         desc: "100% yours. GitHub repo access from day one. No licence lock-in. No vendor dependency. Your team extends it freely.",
//         tags: [{ label: "Core", type: "core" }],
//       },
//       {
//         name: "Training & Onboarding Docs",
//         desc: "Video walkthrough + written SOP for each module. Admin handbook. First 30-day post-launch support included.",
//         tags: [{ label: "Core", type: "core" }],
//       },
//     ],
//   },
// ];

// const TIERS: Tier[] = [
//   {
//     badge: "Starter",
//     name: "Foundation CRM",
//     price: "₹70,000",
//     delivery: "Delivered in 7 days · Up to 5 users",
//     variant: "starter",
//     features: [
//       "Lead & Contact management (custom fields)",
//       "Pipeline / Deal tracker (Kanban + list)",
//       "Activity log + follow-up reminders",
//       "WhatsApp Business API (2-way messaging)",
//       "Email automation — 3 drip sequences",
//       "Sales dashboard — 8 KPI widgets",
//       "Role-based access (Admin + 2 roles)",
//       "GST-ready invoicing module",
//       "Cloud deployment on your domain",
//       "Source code handoff + documentation",
//       "30 days post-launch support",
//     ],
//   },
//   {
//     badge: "★ Most Popular",
//     name: "Growth CRM",
//     price: "₹95,000",
//     delivery: "Delivered in 10 days · Up to 15 users",
//     variant: "growth",
//     features: [
//       "Everything in Foundation, plus:",
//       "AI Lead Scoring (engagement signals)",
//       "Workflow Automation Builder (no-code)",
//       "WhatsApp Broadcast campaigns (TRAI-compliant)",
//       "Razorpay / PayU payment integration",
//       "Auto invoice + quote PDF generator",
//       "Custom KPI widgets (unlimited)",
//       "Territory / team performance reports",
//       "Data import from existing tools (CSV/API)",
//       "Mobile-responsive Progressive Web App",
//       "60 days post-launch support",
//     ],
//   },
//   {
//     badge: "Scale",
//     name: "Enterprise CRM",
//     price: "₹1,20,000",
//     delivery: "Delivered in 12 days · Unlimited users",
//     variant: "enterprise",
//     features: [
//       "Everything in Growth, plus:",
//       "AI chatbot lead qualifier (WhatsApp)",
//       "Advanced reporting (custom SQL views)",
//       "ERP / Tally / Zoho Books sync",
//       "Multi-branch / franchise management",
//       "Field agent GPS check-in module",
//       "Customer support ticketing system",
//       "Public REST API + webhook documentation",
//       "SSO / Google Workspace login",
//       "Dedicated staging environment",
//       "90 days priority support + 2 iterations",
//     ],
//   },
// ];

// const ROI_LINES = [
//   { label: "Zoho CRM (10 users @ ₹1,300/mo)", value: "−₹13,000/mo", type: "negative" },
//   { label: "+ WhatsApp BSP (API costs)", value: "−₹4,000/mo", type: "negative" },
//   { label: "+ Automation tool (Zapier Pro)", value: "−₹7,000/mo", type: "negative" },
//   { label: "+ Invoice / billing tool", value: "−₹2,500/mo", type: "negative" },
//   { label: "Total Generic SaaS Stack / month", value: "−₹26,500/mo", type: "total-neg" },
// ];

// const ROI_CUSTOM = [
//   { label: "Custom CRM (one-time, Growth tier)", value: "−₹95,000", type: "negative" },
//   { label: "Monthly running cost (VPS hosting)", value: "−₹1,800/mo", type: "negative" },
//   { label: "Breakeven in", value: "4.1 months", type: "highlight" },
//   { label: "Net savings — Year 1", value: "+₹1,83,200", type: "positive" },
//   { label: "Net savings — Year 2", value: "+₹2,97,600", type: "positive" },
// ];

// const ROI_EVIDENCE = [
//   { num: "+23%", label: "Higher customer retention reported by SMBs using integrated CRM — OECD Research. For a business doing ₹50L/year, that's ₹11.5L in preserved revenue annually." },
//   { num: "65%", label: "Of sales teams using mobile CRM meet their quotas vs. only 22% without it. Your reps close from the field — not just from desks." },
//   { num: "2–3 hrs", label: "Saved per rep per day by automating CRM data entry, follow-up reminders, and invoice creation — 50–75 hours/month redirected to selling." },
//   { num: "∞", label: "Scale. You own the code. Add users, modules, and integrations without paying per-seat forever. Your CRM grows as fast as your business." },
// ];

// const PROCESS_STEPS: ProcessStep[] = [
//   {
//     phase: "Day 1–2",
//     title: "Discovery & Blueprint",
//     desc: "In-depth intake call. We map your existing workflow, integrations needed, custom fields, and pipeline stages. Figma wireframes delivered for sign-off before any code is written.",
//     days: "2 days",
//   },
//   {
//     phase: "Day 2–7",
//     title: "Core Build Sprint",
//     desc: "Full-stack build. Backend APIs, database schema, frontend dashboard, mobile PWA. Daily async Loom video updates so you're never in the dark.",
//     days: "5 days",
//   },
//   {
//     phase: "Day 7–10",
//     title: "Integration & QA",
//     desc: "WhatsApp API, payment gateway, email service all wired in. Comprehensive testing — unit, integration, and UAT with your team on staging server.",
//     days: "3 days",
//   },
//   {
//     phase: "Day 10–12",
//     title: "Deploy & Handoff",
//     desc: "Production deployment. Data migration if needed. Live walkthrough call. GitHub access + full documentation. 30-day support window starts from this day.",
//     days: "2 days",
//   },
// ];

// const VERTICALS: Vertical[] = [
//   { emoji: "🏠", title: "Real Estate Agencies", desc: "Property inventory, site visit scheduling, broker network management, follow-up aging alerts, buyer lifecycle tracking." },
//   { emoji: "📚", title: "EdTech & Coaching Institutes", desc: "Enquiry-to-enrolment pipeline, batch management, fee reminders, student progress CRM, WhatsApp parent communication." },
//   { emoji: "🏥", title: "Clinics & Wellness Centres", desc: "Appointment CRM, follow-up protocols, treatment plan tracking, DPDP-aware data handling, repeat visit automation." },
//   { emoji: "🏗️", title: "B2B Services & Agencies", desc: "Client onboarding pipeline, retainer tracking, SOW management, proposal automation, account health dashboard." },
//   { emoji: "🛒", title: "D2C / E-commerce Brands", desc: "Order CRM, post-purchase sequences, return/refund pipeline, loyalty tier management, repeat purchase nudges." },
//   { emoji: "💰", title: "Financial Services & Insurance", desc: "Lead qualification workflows, policy renewal alerts, document collection automation, compliance-friendly audit trail." },
//   { emoji: "🔧", title: "Field Service Businesses", desc: "Job ticket management, field agent GPS check-in, SLA tracking, customer satisfaction loops, service history per client." },
//   { emoji: "🎯", title: "Marketing & Sales Agencies", desc: "Multi-client pipeline management, lead source attribution, campaign ROI tracker, client reporting automation." },
//   { emoji: "🚚", title: "Logistics & Distribution", desc: "Vendor and customer CRM, order status automation, delivery team communication, complaint & SLA management." },
// ];

// const COMPARE_ROWS: CompareRow[] = [
//   { feature: "Source Code Ownership", zoho: "✕ Never", custom: "✓ 100% Yours", salesforce: "✕ Never" },
//   { feature: "WhatsApp 2-Way Messaging", zoho: "⚡ Paid Add-on", custom: "✓ Built-in", salesforce: "⚡ Paid Add-on" },
//   { feature: "GST-Ready Invoicing", zoho: "⚡ Zoho Books only", custom: "✓ Native module", salesforce: "✕ External tool" },
//   { feature: "Indian Payment Gateway", zoho: "⚡ Manual Zapier", custom: "✓ Razorpay native", salesforce: "⚡ Custom dev needed" },
//   { feature: "DPDP / Data Residency", zoho: "✕ Foreign servers", custom: "✓ Your own VPS", salesforce: "✕ US data centers" },
//   { feature: "No-Code Workflow Builder", zoho: "⚡ Limited", custom: "✓ Unlimited", salesforce: "⚡ Complex + costly" },
//   { feature: "Field Agent GPS Module", zoho: "✕ None", custom: "✓ Enterprise tier", salesforce: "⚡ Paid Maps addon" },
//   { feature: "Monthly Cost (10 users)", zoho: "₹13K–₹40K/mo forever", custom: "₹1,800/mo after year 1", salesforce: "₹60K–₹2L/mo" },
//   { feature: "Custom Field / Module Build", zoho: "⚡ Config only", custom: "✓ Anything you need", salesforce: "⚡ Expensive dev hours" },
//   { feature: "Time to Deploy", zoho: "Same day", custom: "7–12 days", salesforce: "3–12 months" },
// ];

// const FAQ_ITEMS: FaqItem[] = [
//   {
//     q: "What tech stack will my CRM be built on?",
//     a: "Typically React + Node.js/Next.js with PostgreSQL (or MongoDB for document-heavy use cases), hosted on AWS/DigitalOcean. If you have preferences or an existing stack, we adapt to it. The full stack is documented in the handoff README.",
//   },
//   {
//     q: "Can my existing team maintain it after handoff?",
//     a: "Yes. The code is clean, commented, and follows standard conventions. Any competent Node/React developer can work on it. We provide architecture docs and a dev README specifically written for post-handoff continuity.",
//   },
//   {
//     q: "Will you migrate data from our current CRM or spreadsheets?",
//     a: "Data migration from CSV, Excel, or via API from tools like Zoho/HubSpot is included in the Growth and Enterprise tiers. For Foundation, it's available as a paid add-on priced per dataset complexity.",
//   },
//   {
//     q: "What if we need new modules 6 months later?",
//     a: "You can hire any developer, or return to us. Module add-ons are typically ₹15,000–₹40,000 depending on complexity. Because you own the source code, there's zero vendor dependency on us.",
//   },
//   {
//     q: "Is WhatsApp Business API setup included?",
//     a: "Yes — full setup and configuration included. You'll need a Facebook Business Manager account (free) and a WhatsApp-approved phone number. We handle the verification and BSP onboarding process with you end-to-end.",
//   },
//   {
//     q: "How do payments and milestones work?",
//     a: "Standard structure: 50% on project kickoff, 50% on production deployment. UPI, bank transfer, or Razorpay accepted. For Enterprise tier, a 3-milestone payment can be structured on request.",
//   },
//   {
//     q: "What does the 30/60/90 day support cover?",
//     a: "Bug fixes, deployment issues, minor UI tweaks, and guidance calls. It does not include new feature development (that's a separate engagement). Think of it as a warranty period — if something breaks, we fix it fast.",
//   },
//   {
//     q: "Is there a discovery call before we sign?",
//     a: "Absolutely — mandatory. A 45-minute scoping call confirms scope, timelines, and fit before any money changes hands. Available within 48 hours. No-cost, no-obligation.",
//   },
// ];

// const GUARANTEE_PILLS = [
//   "50% upfront · 50% on delivery",
//   "NDA signed on Day 1",
//   "Source code escrow",
//   "30-day bug fix guarantee",
//   "No lock-in contracts",
//   "Prototype by Day 4",
// ];

// // ─── HELPER COMPONENTS ───────────────────────────────────────────────────────

// function TagChip({ label, type }: { label: string; type: ModuleRow["tags"][0]["type"] }) {
//   const styles: Record<string, string> = {
//     core: "bg-blue-50 text-blue-700 border border-blue-200",
//     ai: "bg-amber-50 text-amber-700 border border-amber-200",
//     auto: "bg-emerald-50 text-emerald-700 border border-emerald-200",
//     mobile: "bg-red-50 text-red-700 border border-red-200",
//     security: "bg-violet-50 text-violet-700 border border-violet-200",
//   };
//   return (
//     <span className={`inline-block text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-sm mr-1 mb-1 ${styles[type]}`}>
//       {label}
//     </span>
//   );
// }

// function SectionLabel({ text, dark = false }: { text: string; dark?: boolean }) {
//   return (
//     <div className={`flex items-center gap-3 mb-12 ${dark ? "text-white/30" : "text-neutral-400"}`}>
//       <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">{text}</span>
//       <div className={`flex-1 h-px ${dark ? "bg-white/10" : "bg-neutral-200"}`} />
//     </div>
//   );
// }

// function CheckIcon({ dark = false }: { dark?: boolean }) {
//   return (
//     <span className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold
//       ${dark ? "bg-amber-400/20 text-amber-300" : "bg-emerald-100 text-emerald-700"}`}>
//       ✓
//     </span>
//   );
// }

// // ─── MAIN PAGE COMPONENT ─────────────────────────────────────────────────────

// export default function CRMBrochurePage() {
//   const [openFaq, setOpenFaq] = useState<number | null>(null);
//   const [activeGroup, setActiveGroup] = useState(0);

//   return (
//     <main className="font-sans antialiased" style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "#F5F2EB", color: "#0A0A0F" }}>

//       {/* ─── GOOGLE FONTS ─── */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
//         .font-syne { font-family: 'Syne', sans-serif; }
//         .font-dm { font-family: 'DM Sans', sans-serif; }
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .anim-1 { animation: fadeUp 0.6s ease 0.1s both; }
//         .anim-2 { animation: fadeUp 0.6s ease 0.25s both; }
//         .anim-3 { animation: fadeUp 0.6s ease 0.4s both; }
//         .anim-4 { animation: fadeUp 0.6s ease 0.55s both; }
//         .anim-5 { animation: fadeUp 0.6s ease 0.7s both; }
//         .grid-bg {
//           background-image:
//             linear-gradient(rgba(245,242,235,0.04) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(245,242,235,0.04) 1px, transparent 1px);
//           background-size: 60px 60px;
//         }
//         .noise::before {
//           content: '';
//           position: absolute; inset: 0;
//           background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
//           pointer-events: none;
//           mix-blend-mode: multiply;
//           z-index: 1;
//         }
//         .compare-custom { background-color: rgba(232,57,14,0.04); }
//         .tier-glow:hover { box-shadow: 0 20px 60px rgba(232,57,14,0.18); }
//       `}</style>

//       {/* ════════════════════════════════════════════
//           HERO / MASTHEAD
//       ════════════════════════════════════════════ */}
//       <section
//         className="relative min-h-screen flex flex-col overflow-hidden noise"
//         style={{ backgroundColor: "#0A0A0F" }}
//       >
//         {/* Grid background */}
//         <div className="absolute inset-0 grid-bg pointer-events-none" />

//         {/* Top accent line */}
//         <div
//           className="absolute top-0 left-0 right-0 h-[3px]"
//           style={{ background: "linear-gradient(90deg, #E8390E, #C9A84C, #1A3CFF)" }}
//         />

//         {/* Navbar */}
//         <nav className="relative z-10 flex items-center justify-between px-8 md:px-16 py-8 border-b border-white/[0.07]">
//           <span className="font-syne font-extrabold text-xs tracking-[0.2em] uppercase text-[#C9A84C]">
//             Build → Ship → Scale
//           </span>
//           <span className="text-white/30 text-[10px] tracking-[0.15em] uppercase hidden md:block">
//             Custom CRM & Automation — 2025 Package
//           </span>
//           <a
//             href="#tiers"
//             className="font-syne font-bold text-[10px] uppercase tracking-widest px-4 py-2 border border-white/20 text-white/70 rounded-sm hover:bg-white/10 transition-all duration-200"
//           >
//             View Pricing
//           </a>
//         </nav>

//         {/* Hero body */}
//         <div className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-16 py-16 md:py-24">
//           {/* Eyebrow */}
//           <div className="anim-1 flex items-center gap-3 mb-8">
//             <div className="w-8 h-px bg-[#E8390E]" />
//             <span className="text-[#E8390E] text-[10px] font-semibold uppercase tracking-[0.25em]">
//               Full-Stack · India-Built · ROI-First
//             </span>
//           </div>

//           {/* Title */}
//           <h1 className="anim-2 font-syne font-extrabold leading-[0.92] text-white mb-10"
//             style={{ fontSize: "clamp(52px, 8vw, 104px)" }}>
//             Your business<br />
//             runs on{" "}
//             <span className="text-[#E8390E]">data.</span>
//             <br />
//             Own your CRM.
//           </h1>

//           {/* Subtitle */}
//           <p className="anim-3 text-white/55 font-light text-lg leading-relaxed max-w-xl mb-14">
//             A production-grade Custom CRM + Automation system built specifically
//             for your workflow — not retrofitted from a generic SaaS template.
//             Deployed in 7–12 days. Source code is yours forever.
//           </p>

//           {/* Price badge */}
//           <div className="anim-4 inline-flex flex-col gap-1 border border-[#E8390E]/30 bg-[#E8390E]/10 rounded-sm px-8 py-5 max-w-xs">
//             <span className="text-white/35 text-[10px] uppercase tracking-[0.18em]">Investment Range</span>
//             <span className="font-syne font-bold text-3xl text-white">₹70,000 – ₹1,20,000</span>
//             <span className="text-[#C9A84C] text-xs mt-1">
//               Delivered in 7–12 working days · Source code included
//             </span>
//           </div>
//         </div>

//         {/* Stats footer */}
//         <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 border-t border-white/[0.07]">
//           {STATS.map((s, i) => (
//             <div key={i} className="px-8 md:px-12 py-6 border-r border-white/[0.07] last:border-r-0">
//               <div className="font-syne font-bold text-2xl text-[#C9A84C] mb-1">{s.num}</div>
//               <div className="text-[10px] text-white/30 uppercase tracking-widest">{s.lbl}</div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           THE PROBLEM
//       ════════════════════════════════════════════ */}
//       <section className="py-24 px-8 md:px-16" style={{ backgroundColor: "#0E0E15" }}>
//         <SectionLabel text="The Problem" dark />
//         <h2 className="font-syne font-bold text-white mb-5 max-w-2xl"
//           style={{ fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.1 }}>
//           Why generic CRMs are quietly bleeding your business
//         </h2>
//         <p className="text-white/40 font-light text-base leading-relaxed max-w-xl mb-14">
//           54% of SMBs cite high integration costs. 47% face complexity overload. And every rupee paid to
//           Salesforce or HubSpot is a subscription you don't own — forever.
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
//           {PAIN_CARDS.map((card, i) => (
//             <div
//               key={i}
//               className="p-10 transition-colors duration-300 hover:bg-white/[0.03]"
//               style={{ backgroundColor: "#0E0E15" }}
//             >
//               <div className="w-10 h-10 rounded-full bg-[#E8390E]/10 border border-[#E8390E]/25 flex items-center justify-center text-lg mb-5">
//                 {card.icon}
//               </div>
//               <h4 className="font-syne font-semibold text-white text-sm mb-3">{card.title}</h4>
//               <p className="text-white/40 text-xs leading-relaxed">{card.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           PACKAGE MODULES
//       ════════════════════════════════════════════ */}
//       <section className="py-24 px-8 md:px-16" style={{ backgroundColor: "#F5F2EB" }}>
//         <SectionLabel text="The Package" />
//         <h2 className="font-syne font-bold mb-4 max-w-2xl" style={{ fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.1 }}>
//           Every module. Built for production.
//         </h2>
//         <p className="text-neutral-500 font-light text-base leading-relaxed max-w-xl mb-12">
//           Not a prototype. Not a UI demo. A fully functional, cloud-deployed system with source code handoff and documentation.
//         </p>

//         {/* Group tab selector */}
//         <div className="flex flex-wrap gap-2 mb-8">
//           {MODULE_GROUPS.map((g, i) => (
//             <button
//               key={i}
//               onClick={() => setActiveGroup(i)}
//               className={`font-syne font-semibold text-[10px] uppercase tracking-widest px-4 py-2 rounded-sm transition-all duration-200 ${
//                 activeGroup === i
//                   ? "bg-[#0A0A0F] text-white"
//                   : "bg-neutral-200 text-neutral-500 hover:bg-neutral-300"
//               }`}
//             >
//               {g.group}
//             </button>
//           ))}
//         </div>

//         {/* Module table */}
//         <div className="border border-neutral-200 rounded-sm overflow-hidden">
//           {/* Header */}
//           <div className="grid grid-cols-12 bg-[#0A0A0F] text-white/50 text-[9px] uppercase tracking-[0.2em] font-semibold">
//             <div className="col-span-4 px-6 py-3 border-r border-white/10">Module</div>
//             <div className="col-span-5 px-6 py-3 border-r border-white/10">What it does</div>
//             <div className="col-span-3 px-6 py-3">Type</div>
//           </div>

//           {MODULE_GROUPS[activeGroup].modules.map((mod, i) => (
//             <div
//               key={i}
//               className="grid grid-cols-12 border-t border-neutral-200 hover:bg-blue-50/30 transition-colors duration-150"
//             >
//               <div className="col-span-4 px-6 py-5 border-r border-neutral-200">
//                 <span className="font-syne font-semibold text-sm text-[#0A0A0F]">{mod.name}</span>
//               </div>
//               <div className="col-span-5 px-6 py-5 border-r border-neutral-200">
//                 <p className="text-neutral-500 text-xs leading-relaxed">{mod.desc}</p>
//               </div>
//               <div className="col-span-3 px-6 py-5">
//                 {mod.tags.map((t, j) => (
//                   <TagChip key={j} label={t.label} type={t.type} />
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Tag legend */}
//         <div className="flex flex-wrap gap-3 mt-5">
//           {[
//             { label: "Core", type: "core" as const },
//             { label: "AI", type: "ai" as const },
//             { label: "Auto", type: "auto" as const },
//             { label: "Mobile", type: "mobile" as const },
//             { label: "Security", type: "security" as const },
//           ].map((t) => (
//             <div key={t.type} className="flex items-center gap-1.5">
//               <TagChip label={t.label} type={t.type} />
//               <span className="text-[10px] text-neutral-400">
//                 {t.type === "core" && "Included in all tiers"}
//                 {t.type === "ai" && "Growth+"}
//                 {t.type === "auto" && "Automation module"}
//                 {t.type === "mobile" && "Mobile-first"}
//                 {t.type === "security" && "Compliance"}
//               </span>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           PRICING TIERS
//       ════════════════════════════════════════════ */}
//       <section id="tiers" className="py-24 px-8 md:px-16" style={{ backgroundColor: "#EDEAE0" }}>
//         <SectionLabel text="Pricing Tiers" />
//         <h2 className="font-syne font-bold mb-4 max-w-2xl" style={{ fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.1 }}>
//           Pick the scope that fits.
//         </h2>
//         <p className="text-neutral-500 font-light text-base leading-relaxed max-w-xl mb-14">
//           All tiers include source code, cloud deployment, and post-launch support. No hidden extras. No per-seat billing ever.
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ backgroundColor: "rgba(10,10,15,0.1)" }}>
//           {TIERS.map((tier) => {
//             const isGrowth = tier.variant === "growth";
//             const isEnterprise = tier.variant === "enterprise";
//             return (
//               <div
//                 key={tier.variant}
//                 className={`flex flex-col p-10 transition-all duration-300 tier-glow ${
//                   isGrowth ? "bg-[#0A0A0F]" : "bg-[#F5F2EB] hover:bg-white"
//                 }`}
//                 style={{
//                   borderTop: `3px solid ${
//                     isGrowth ? "#E8390E" : isEnterprise ? "#C9A84C" : "#1A3CFF"
//                   }`,
//                 }}
//               >
//                 {/* Badge */}
//                 <span
//                   className="font-syne font-bold text-[10px] uppercase tracking-[0.2em] mb-4"
//                   style={{ color: isGrowth ? "#E8390E" : isEnterprise ? "#C9A84C" : "#1A3CFF" }}
//                 >
//                   {tier.badge}
//                 </span>

//                 {/* Name + Price */}
//                 <div className={`font-syne font-bold text-xl mb-2 ${isGrowth ? "text-white" : "text-[#0A0A0F]"}`}>
//                   {tier.name}
//                 </div>
//                 <div
//                   className="font-syne font-extrabold text-4xl mb-2"
//                   style={{ color: isGrowth ? "#C9A84C" : "#0A0A0F" }}
//                 >
//                   {tier.price}
//                 </div>
//                 <div
//                   className={`text-xs mb-8 pb-8 border-b ${
//                     isGrowth ? "text-white/35 border-white/10" : "text-neutral-400 border-neutral-200"
//                   }`}
//                 >
//                   {tier.delivery}
//                 </div>

//                 {/* Features */}
//                 <ul className="flex flex-col gap-3 flex-1 mb-10">
//                   {tier.features.map((f, i) => (
//                     <li key={i} className="flex items-start gap-2.5">
//                       <CheckIcon dark={isGrowth} />
//                       <span
//                         className={`text-xs leading-relaxed ${
//                           isGrowth
//                             ? i === 0 ? "text-white/50 italic" : "text-white/75"
//                             : i === 0 && tier.variant === "enterprise" ? "text-neutral-400 italic" : "text-neutral-600"
//                         }`}
//                       >
//                         {f}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>

//                 {/* CTA */}
//                 <a
//                   href="#contact"
//                   className={`block text-center font-syne font-bold text-[11px] uppercase tracking-widest py-3.5 px-6 rounded-sm transition-all duration-200 ${
//                     isGrowth
//                       ? "bg-[#E8390E] text-white hover:bg-[#c42e08]"
//                       : isEnterprise
//                       ? "bg-[#C9A84C]/15 text-[#8A6F1F] border border-[#C9A84C]/40 hover:bg-[#C9A84C] hover:text-white"
//                       : "bg-[#1A3CFF]/10 text-[#1A3CFF] border border-[#1A3CFF]/25 hover:bg-[#1A3CFF] hover:text-white"
//                   }`}
//                 >
//                   {isGrowth ? "Get Growth CRM →" : isEnterprise ? "Get Enterprise CRM →" : "Get Started →"}
//                 </a>
//               </div>
//             );
//           })}
//         </div>

//         {/* Trust bar */}
//         <div className="mt-8 flex flex-wrap gap-4 items-center justify-center">
//           {GUARANTEE_PILLS.slice(0, 4).map((p, i) => (
//             <span key={i} className="text-[10px] text-neutral-500 flex items-center gap-1.5">
//               <span className="text-emerald-600">✓</span> {p}
//             </span>
//           ))}
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           ROI CALCULATOR
//       ════════════════════════════════════════════ */}
//       <section className="py-24 px-8 md:px-16" style={{ backgroundColor: "#0A0A0F" }}>
//         <SectionLabel text="Return on Investment" dark />
//         <h2
//           className="font-syne font-bold text-white mb-4 max-w-2xl"
//           style={{ fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.1 }}
//         >
//           The numbers that justify the decision.
//         </h2>
//         <p className="text-white/40 font-light text-base leading-relaxed max-w-xl mb-16">
//           Calculated conservatively for a 10-person sales team in the Indian SMB context. Your actual returns will vary — typically higher.
//         </p>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

//           {/* Left: Calculator */}
//           <div className="border border-white/10 bg-white/[0.03] p-10 rounded-sm">

//             {/* Generic SaaS cost */}
//             <div className="mb-6">
//               <div className="flex items-center gap-3 mb-5">
//                 <div className="w-5 h-px bg-[#C9A84C]" />
//                 <span className="font-syne font-bold text-[11px] uppercase tracking-[0.2em] text-[#C9A84C]">
//                   Generic SaaS Stack Monthly Cost
//                 </span>
//               </div>
//               {ROI_LINES.map((line, i) => (
//                 <div
//                   key={i}
//                   className={`flex justify-between items-center py-3.5 border-b border-white/[0.06] ${
//                     line.type === "total-neg" ? "border-t border-white/[0.12] mt-2 pt-4" : ""
//                   }`}
//                 >
//                   <span className={`text-xs ${line.type === "total-neg" ? "text-white/70 font-medium" : "text-white/40"}`}>
//                     {line.label}
//                   </span>
//                   <span
//                     className={`font-syne font-bold ${
//                       line.type === "total-neg" ? "text-[#E8390E] text-lg" : "text-[#E8390E] text-sm"
//                     }`}
//                   >
//                     {line.value}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             {/* Divider */}
//             <div className="h-px bg-white/[0.08] my-6" />

//             {/* Custom CRM cost */}
//             <div>
//               <div className="flex items-center gap-3 mb-5">
//                 <div className="w-5 h-px bg-emerald-400" />
//                 <span className="font-syne font-bold text-[11px] uppercase tracking-[0.2em] text-emerald-400">
//                   Custom CRM Economics
//                 </span>
//               </div>
//               {ROI_CUSTOM.map((line, i) => (
//                 <div
//                   key={i}
//                   className={`flex justify-between items-center py-3.5 border-b border-white/[0.06] ${
//                     line.type === "highlight" || line.type === "positive" ? "border-b-0" : ""
//                   }`}
//                 >
//                   <span className={`text-xs ${line.type === "negative" ? "text-white/40" : "text-white/70 font-medium"}`}>
//                     {line.label}
//                   </span>
//                   <span
//                     className={`font-syne font-bold ${
//                       line.type === "highlight"
//                         ? "text-[#C9A84C] text-xl"
//                         : line.type === "positive"
//                         ? "text-emerald-400 text-base"
//                         : "text-[#E8390E] text-sm"
//                     }`}
//                   >
//                     {line.value}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right: Evidence cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
//             {ROI_EVIDENCE.map((e, i) => (
//               <div
//                 key={i}
//                 className="border-l-2 border-[#C9A84C] bg-[#C9A84C]/[0.05] px-6 py-6"
//               >
//                 <div className="font-syne font-extrabold text-[#C9A84C] mb-2 leading-none"
//                   style={{ fontSize: "clamp(32px, 4vw, 48px)" }}>
//                   {e.num}
//                 </div>
//                 <p className="text-white/55 text-xs leading-relaxed">{e.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           COMPARISON TABLE
//       ════════════════════════════════════════════ */}
//       <section className="py-24 px-8 md:px-16" style={{ backgroundColor: "#F5F2EB" }}>
//         <SectionLabel text="Comparison" />
//         <h2 className="font-syne font-bold mb-4 max-w-2xl" style={{ fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.1 }}>
//           Custom vs. Generic — Feature for Feature
//         </h2>
//         <p className="text-neutral-500 font-light text-base leading-relaxed max-w-xl mb-12">
//           This is what ₹95K gets you that ₹13,000/month never will.
//         </p>

//         <div className="overflow-x-auto rounded-sm border border-neutral-200">
//           <table className="w-full text-sm border-collapse">
//             <thead>
//               <tr>
//                 <th className="font-syne text-[10px] uppercase tracking-[0.18em] text-white bg-[#0A0A0F] text-left px-6 py-4 w-1/4 border-r border-white/10">
//                   Feature / Factor
//                 </th>
//                 <th className="font-syne text-[10px] uppercase tracking-[0.18em] text-white bg-[#0A0A0F] text-left px-6 py-4 border-r border-white/10">
//                   Zoho / HubSpot
//                 </th>
//                 <th className="font-syne text-[10px] uppercase tracking-[0.18em] text-white bg-[#E8390E] text-left px-6 py-4 border-r border-white/20">
//                   Your Custom CRM
//                 </th>
//                 <th className="font-syne text-[10px] uppercase tracking-[0.18em] text-white bg-[#0A0A0F] text-left px-6 py-4">
//                   Salesforce
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {COMPARE_ROWS.map((row, i) => (
//                 <tr key={i} className="border-t border-neutral-200 hover:bg-blue-50/20 transition-colors duration-100">
//                   <td className="px-6 py-4 font-syne font-semibold text-xs text-[#0A0A0F] border-r border-neutral-200">
//                     {row.feature}
//                   </td>
//                   <td className="px-6 py-4 text-xs text-neutral-500 border-r border-neutral-200">
//                     <span className={row.zoho.startsWith("✕") ? "text-neutral-300" : row.zoho.startsWith("⚡") ? "text-amber-600" : "text-emerald-600"}>
//                       {row.zoho}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-xs font-medium compare-custom border-r border-red-100">
//                     <span className={row.custom.startsWith("✓") ? "text-emerald-700" : "text-[#E8390E]"}>
//                       {row.custom}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-xs text-neutral-500">
//                     <span className={row.salesforce.startsWith("✕") ? "text-neutral-300" : row.salesforce.startsWith("⚡") ? "text-amber-600" : "text-emerald-600"}>
//                       {row.salesforce}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           DELIVERY PROCESS
//       ════════════════════════════════════════════ */}
//       <section className="py-24 px-8 md:px-16" style={{ backgroundColor: "#EDEAE0" }}>
//         <SectionLabel text="Delivery Process" />
//         <h2 className="font-syne font-bold mb-4 max-w-2xl" style={{ fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.1 }}>
//           7–12 days. Zero ambiguity.
//         </h2>
//         <p className="text-neutral-500 font-light text-base leading-relaxed max-w-xl mb-14">
//           A tight, battle-tested delivery sprint. You get daily updates. No disappearing acts.
//         </p>

//         {/* Timeline connector */}
//         <div className="relative">
//           {/* Connector line */}
//           <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-neutral-300 z-0" />

//           <div className="grid grid-cols-1 md:grid-cols-4 gap-px relative z-10"
//             style={{ backgroundColor: "rgba(10,10,15,0.08)" }}>
//             {PROCESS_STEPS.map((step, i) => (
//               <div
//                 key={i}
//                 className="bg-[#F5F2EB] p-8 relative overflow-hidden hover:bg-white transition-colors duration-200"
//               >
//                 {/* Large step number */}
//                 <span
//                   className="font-syne font-extrabold text-[80px] leading-none absolute -top-2 right-4 select-none pointer-events-none"
//                   style={{ color: "rgba(10,10,15,0.05)" }}
//                 >
//                   {i + 1}
//                 </span>

//                 {/* Step number dot */}
//                 <div className="w-7 h-7 rounded-full bg-[#0A0A0F] text-white flex items-center justify-center font-syne font-bold text-xs mb-5">
//                   {i + 1}
//                 </div>

//                 <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-400 block mb-2">
//                   {step.phase}
//                 </span>
//                 <h3 className="font-syne font-bold text-base mb-3 text-[#0A0A0F]">{step.title}</h3>
//                 <p className="text-neutral-500 text-xs leading-relaxed mb-5">{step.desc}</p>
//                 <span className="inline-block bg-[#0A0A0F] text-white text-[9px] font-syne font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
//                   {step.days}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Milestone payment info */}
//         <div className="mt-8 border border-neutral-300 bg-white/60 rounded-sm p-6 flex flex-col md:flex-row gap-4 md:gap-12 md:items-center">
//           <div className="flex items-center gap-3">
//             <span className="text-2xl">🔐</span>
//             <div>
//               <div className="font-syne font-bold text-sm">Prototype by Day 4</div>
//               <div className="text-xs text-neutral-500">Review and approve before remaining payment</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <span className="text-2xl">💳</span>
//             <div>
//               <div className="font-syne font-bold text-sm">50% · 50% Milestone</div>
//               <div className="text-xs text-neutral-500">UPI / Bank Transfer / Razorpay accepted</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <span className="text-2xl">📋</span>
//             <div>
//               <div className="font-syne font-bold text-sm">NDA on Day 1</div>
//               <div className="text-xs text-neutral-500">Your business data is fully protected</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <span className="text-2xl">🛡️</span>
//             <div>
//               <div className="font-syne font-bold text-sm">30-Day Bug Fix</div>
//               <div className="text-xs text-neutral-500">Warranty period from production deploy</div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           TARGET VERTICALS
//       ════════════════════════════════════════════ */}
//       <section className="py-24 px-8 md:px-16" style={{ backgroundColor: "#F5F2EB" }}>
//         <SectionLabel text="Who It's For" />
//         <h2 className="font-syne font-bold mb-4 max-w-2xl" style={{ fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.1 }}>
//           Built for these high-velocity niches.
//         </h2>
//         <p className="text-neutral-500 font-light text-base leading-relaxed max-w-xl mb-14">
//           Not a one-size-fits-all play. Pre-scoped for SMBs where speed-to-close and follow-up discipline determine revenue.
//         </p>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {VERTICALS.map((v, i) => (
//             <div
//               key={i}
//               className="bg-white border border-neutral-200 rounded-sm p-6 flex gap-4 items-start hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
//             >
//               <span className="text-3xl flex-shrink-0 mt-0.5">{v.emoji}</span>
//               <div>
//                 <h4 className="font-syne font-bold text-sm mb-2 text-[#0A0A0F]">{v.title}</h4>
//                 <p className="text-neutral-500 text-xs leading-relaxed">{v.desc}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           GUARANTEE BANNER
//       ════════════════════════════════════════════ */}
//       <section
//         className="py-20 px-8 md:px-16 text-center"
//         style={{ backgroundColor: "#E8390E" }}
//       >
//         <div className="flex items-center justify-center gap-3 mb-5">
//           <div className="w-8 h-px bg-white/40" />
//           <span className="text-white/60 text-[10px] uppercase tracking-[0.25em] font-semibold">Risk Reversal</span>
//           <div className="w-8 h-px bg-white/40" />
//         </div>

//         <h2 className="font-syne font-extrabold text-white mb-4"
//           style={{ fontSize: "clamp(24px, 4vw, 44px)", lineHeight: 1.1 }}>
//           You don't pay the balance until you're<br className="hidden md:block" /> satisfied with the prototype.
//         </h2>
//         <p className="text-white/70 font-light text-base max-w-lg mx-auto mb-10 leading-relaxed">
//           A working prototype is delivered by Day 4. If it doesn't meet the agreed blueprint,
//           we course-correct before you pay the remaining 50%. That's our commitment.
//         </p>

//         <div className="flex flex-wrap gap-3 justify-center mb-10">
//           {GUARANTEE_PILLS.map((p, i) => (
//             <span
//               key={i}
//               className="text-xs text-white font-medium px-4 py-2 rounded-full border border-white/30 bg-white/10"
//             >
//               {p}
//             </span>
//           ))}
//         </div>

//         <a
//           href="#contact"
//           className="inline-block font-syne font-bold text-[11px] uppercase tracking-widest bg-white text-[#E8390E] px-8 py-4 rounded-sm hover:bg-[#0A0A0F] hover:text-white transition-all duration-300"
//         >
//           Book Free Discovery Call →
//         </a>
//       </section>

//       {/* ════════════════════════════════════════════
//           TECH STACK
//       ════════════════════════════════════════════ */}
//       <section className="py-20 px-8 md:px-16" style={{ backgroundColor: "#0A0A0F" }}>
//         <SectionLabel text="Tech Stack" dark />
//         <h2 className="font-syne font-bold text-white mb-12" style={{ fontSize: "clamp(24px, 3vw, 40px)" }}>
//           Production-grade. Standard. Maintainable.
//         </h2>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
//           {[
//             { layer: "Frontend", stack: "Next.js 14 / React 18", sub: "TypeScript · Tailwind CSS · PWA" },
//             { layer: "Backend", stack: "Node.js / Express", sub: "REST API · JWT Auth · Webhooks" },
//             { layer: "Database", stack: "PostgreSQL / MongoDB", sub: "Prisma ORM · Redis cache" },
//             { layer: "Infra & DevOps", stack: "AWS / DigitalOcean", sub: "Docker · CI/CD · SSL · CDN" },
//             { layer: "Messaging", stack: "WhatsApp Business API", sub: "Twilio SMS · Nodemailer" },
//             { layer: "Payments", stack: "Razorpay / PayU", sub: "Webhook sync · Reconciliation" },
//             { layer: "AI Layer", stack: "OpenAI / Claude API", sub: "Lead scoring · Chatbot · Summaries" },
//             { layer: "Auth & Security", stack: "NextAuth / Passport.js", sub: "RBAC · Audit trail · DPDP-ready" },
//           ].map((t, i) => (
//             <div key={i} className="p-8" style={{ backgroundColor: "#0A0A0F" }}>
//               <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#E8390E] block mb-2">{t.layer}</span>
//               <div className="font-syne font-bold text-white text-sm mb-1">{t.stack}</div>
//               <div className="text-white/30 text-xs">{t.sub}</div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           FAQ
//       ════════════════════════════════════════════ */}
//       <section className="py-24 px-8 md:px-16" style={{ backgroundColor: "#EDEAE0" }}>
//         <SectionLabel text="FAQ" />
//         <h2 className="font-syne font-bold mb-4 max-w-2xl" style={{ fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.1 }}>
//           Questions serious buyers ask.
//         </h2>
//         <p className="text-neutral-500 font-light text-base leading-relaxed max-w-xl mb-12">
//           Transparent answers — no marketing fluff.
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ backgroundColor: "rgba(10,10,15,0.08)" }}>
//           {FAQ_ITEMS.map((item, i) => (
//             <button
//               key={i}
//               onClick={() => setOpenFaq(openFaq === i ? null : i)}
//               className={`text-left p-8 transition-all duration-200 border-l-2 ${
//                 openFaq === i
//                   ? "bg-white border-l-[#1A3CFF]"
//                   : "bg-[#F5F2EB] border-l-transparent hover:bg-white/70 hover:border-l-[#E8390E]"
//               }`}
//             >
//               <div className="flex items-start justify-between gap-4">
//                 <h4 className="font-syne font-bold text-sm text-[#0A0A0F] leading-snug">{item.q}</h4>
//                 <span
//                   className={`flex-shrink-0 font-syne font-bold text-lg leading-none mt-0.5 transition-transform duration-200 ${
//                     openFaq === i ? "rotate-45 text-[#1A3CFF]" : "text-neutral-300"
//                   }`}
//                 >
//                   +
//                 </span>
//               </div>
//               {openFaq === i && (
//                 <p className="text-neutral-500 text-xs leading-relaxed mt-4 font-light">{item.a}</p>
//               )}
//             </button>
//           ))}
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           FINAL CTA
//       ════════════════════════════════════════════ */}
//       <section id="contact" className="py-24 px-8 md:px-16" style={{ backgroundColor: "#0A0A0F" }}>
//         <div className="max-w-3xl">
//           <SectionLabel text="Get Started" dark />
//           <h2 className="font-syne font-extrabold text-white mb-6"
//             style={{ fontSize: "clamp(32px, 5vw, 64px)", lineHeight: 0.95 }}>
//             Ready to own your<br />
//             <span style={{ color: "#C9A84C" }}>customer data?</span>
//           </h2>
//           <p className="text-white/45 font-light text-base leading-relaxed mb-10 max-w-lg">
//             Start with a 45-minute no-cost discovery call. We scope the project, agree on the blueprint,
//             and send a fixed-price proposal within 24 hours. No obligation.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 mb-16">
//             <a
//               href="mailto:hello@example.com"
//               className="font-syne font-bold text-[11px] uppercase tracking-widest bg-[#E8390E] text-white px-8 py-4 rounded-sm hover:bg-[#c42e08] transition-colors duration-200 text-center"
//             >
//               Book Discovery Call →
//             </a>
//             <a
//               href="https://wa.me/91XXXXXXXXXX"
//               className="font-syne font-bold text-[11px] uppercase tracking-widest border border-white/20 text-white/70 px-8 py-4 rounded-sm hover:bg-white/10 transition-colors duration-200 text-center flex items-center justify-center gap-2"
//             >
//               <span>💬</span> WhatsApp Us
//             </a>
//           </div>

//           {/* Final stat bar */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/[0.08]">
//             {[
//               { n: "48 hrs", l: "Proposal turnaround" },
//               { n: "₹0", l: "Discovery call cost" },
//               { n: "100%", l: "Source code yours" },
//               { n: "12 days", l: "Max delivery time" },
//             ].map((s, i) => (
//               <div key={i}>
//                 <div className="font-syne font-bold text-[#C9A84C] text-xl mb-1">{s.n}</div>
//                 <div className="text-white/30 text-[10px] uppercase tracking-widest">{s.l}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           FOOTER
//       ════════════════════════════════════════════ */}
//       <footer className="px-8 md:px-16 py-8 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4"
//         style={{ backgroundColor: "#0A0A0F" }}>
//         <span className="font-syne font-extrabold text-[#C9A84C] text-sm tracking-[0.15em] uppercase">
//           Custom CRM & Automation
//         </span>
//         <span className="text-white/25 text-[10px] text-center">
//           Full-stack build · ₹70K–₹1.2L · Delivered 7–12 days · Source code included · India-built
//         </span>
//         <span className="text-white/25 text-[10px]">© 2025 All rights reserved</span>
//       </footer>

//     </main>
//   );
// }
