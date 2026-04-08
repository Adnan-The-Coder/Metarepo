import type { Metadata } from "next";

const packageOneOptions = [
	{
		title: "Option A. Essential Digital Footprint",
		price: "₹3,500 INR",
		delivery: "6 Hours",
		details: [
			"Professional responsive landing page",
			"Local SEO setup with Google Business Profile integration",
			"Localized meta tags and discovery-ready structure",
			"1-year domain registration included",
		],
	},
	{
		title: "Option B. High-Conversion Sales Engine",
		price: "₹6,000 INR",
		delivery: "Rapid deployment",
		details: [
			"High-fidelity single-page application",
			"Lead capture and analytics integrations",
			"Conversion-focused UI built for paid traffic",
			"Domain fees excluded",
		],
	},
] as const;

const packages = [
	{
		badge: "Package 1",
		title: "The Catalyst Launchpad",
		subtitle: "Rapid starter for local businesses, campaigns, and first-time digital presence.",
		perfectFor: "Local businesses, dynamic campaigns, and immediate digital presence.",
		timeline: "Live in 6 hours",
		investment: "₹3,500 INR - ₹6,000 INR",
		accent: "from-cyan-400/25 to-sky-500/10",
		highlights: [
			"A simple, sharp page that gets the business online fast",
			"Local SEO and lead-ready structure for immediate visibility",
			"Two tracks: presence-first or conversion-first",
		],
		options: packageOneOptions,
	},
	{
		badge: "Package 2",
		title: "The Omni-Channel Positioner",
		subtitle: "A complete digital ecosystem for retail, D2C, and service brands.",
		perfectFor: "Retailers, D2C brands, and service providers ready for digital commerce.",
		timeline: "Delivered in 7 days",
		investment: "₹40,000 INR",
		accent: "from-emerald-400/25 to-cyan-500/10",
		highlights: [
			"Dynamic business website with strong commerce foundations",
			"Native-feel mobile application for Android and iOS",
			"Secure payment gateway integration",
			"Quick commerce architecture with catalog, cart, and fast checkout flows",
			"2 months of free premium maintenance post-launch",
		],
	},
	{
		badge: "Package 3",
		title: "Enterprise Workflow Optimizer",
		subtitle: "Custom CRM or LMS built to match your operations, not the other way around.",
		perfectFor: "Scaling agencies, educational institutes, and mid-sized enterprises.",
		timeline: "Live in 8 to 10 days",
		investment: "₹50,000 - ₹70,000 INR",
		accent: "from-slate-300/20 to-zinc-500/10",
		highlights: [
			"Fully custom backend architecture designed for scale and security",
			"Intuitive admin dashboard for web and desktop workflows",
			"Tailored CRM, LMS, or niche operational modules",
			"Role-based access control with custom reporting and analytics",
			"Up to 3 major revisions and 2 months of free maintenance",
		],
	},
	{
		badge: "Package 4",
		title: "The Founder's MVP Launchkit",
		subtitle: "A market-ready MVP that feels complete from day one.",
		perfectFor: "Tech startups, SaaS founders, and product innovators.",
		timeline: "Delivered in 8 to 14 days",
		investment: "₹80,000 - ₹120,000 INR",
		accent: "from-violet-400/25 to-fuchsia-500/10",
		highlights: [
			"Frontend, backend, database, and cloud infrastructure included",
			"Seamless deployment and DevOps setup",
			"Rigorous QA for security, load, and user acceptance testing",
			"Built for future scale without the usual MVP shortcuts",
		],
	},
	{
		badge: "Package 5",
		title: "The Unicorn Trajectory",
		subtitle: "MVP delivery plus a focused content engine to drive early demand.",
		perfectFor: "Startups that need product-market fit and immediate user acquisition.",
		timeline: "MVP in 8 to 14 days, marketing runs for 2 months",
		investment: "₹80,000 - ₹120,000 INR + ₹60,000/month",
		accent: "from-amber-300/25 to-orange-500/10",
		highlights: [
			"Everything in Package 4, plus growth marketing for 2 months",
			"20 high-quality videos per month across short-form channels",
			"Script, edit, and production support built around launch traction",
			"Marketing retainer priced at ₹60,000/month for 20 videos",
		],
	},
] as const;

const pillars = [
	{
		title: "Speed to market",
		desc: "Packages are designed to launch quickly without sacrificing polish or buying into bloated agency theatre.",
	},
	{
		title: "Transparent pricing",
		desc: "Each package is clearly scoped so you know what you are paying for before the work starts.",
	},
	{
		title: "Conversion first",
		desc: "Every layout, line of copy, and call to action is tuned to move a buyer toward a decision.",
	},
	{
		title: "Post-launch support",
		desc: "Maintenance is built into the offer where it matters, so the handoff does not become a dead end.",
	},
] as const;

const deliverySteps = [
	{
		step: "01",
		title: "Define the outcome",
		desc: "We pick the package that matches your growth stage, budget, and desired timeline.",
	},
	{
		step: "02",
		title: "Lock the scope",
		desc: "Features, revisions, integrations, and handoff expectations are aligned before build starts.",
	},
	{
		step: "03",
		title: "Build and refine",
		desc: "You get a clean, responsive delivery with focused iterations instead of endless drift.",
	},
	{
		step: "04",
		title: "Launch and support",
		desc: "The page, product, or system goes live with practical support for the first post-launch stretch.",
	},
] as const;

export const metadata: Metadata = {
	title: "Premium Software Packages by Adnan",
	description: "High-conversion, dark-themed package page covering launch pages, commerce builds, CRMs, MVPs, and growth systems.",
};

export default function PackagesPage() {
	return (
		<main className="relative min-h-screen overflow-hidden bg-[#050709] text-zinc-100">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_22%),radial-gradient(circle_at_80%_20%,_rgba(59,130,246,0.14),_transparent_20%)]" />
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />

			<div className="relative mx-auto flex w-full max-w-7xl flex-col gap-20 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
				<header className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-cyan-950/10 backdrop-blur md:p-10">
					<div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-cyan-200/75">
						<span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-100">By Adnan</span>
						<span>Premium software packages</span>
					</div>

					<div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
						<div className="max-w-3xl">
							<p className="text-sm font-medium uppercase tracking-[0.35em] text-slate-400">High-conversion digital offers</p>
							<h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl">
								Build the page, product, or system that makes buying feel obvious.
							</h1>
							<p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
								Most businesses lose to competitors who simply showed up online faster. We make sure that's never you. From a live landing page in 6 hours to a market-ready MVP in 2 weeks. 
                                We deliver enterprise-grade digital products at startup speed, with zero hidden costs. We handle the tech. You own the advantage.
							</p>

							<div className="mt-8 flex flex-wrap gap-3">
								<a href="#packages" className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
									View packages
								</a>
								<a href="#contact" className="rounded-full border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/40 hover:bg-cyan-400/10">
									Book a strategy call
								</a>
							</div>
						</div>

						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
							{[
								["5 packages", "From landing pages to custom enterprise systems"],
								["6 hours", "Fastest delivery for the catalyst launchpad"],
								["₹3,500 - ₹120,000", "Clear investment bands without vague scoping"],
								["2 months support", "Included in the bigger builds where it matters"],
							].map(([value, label]) => (
								<div key={value} className="rounded-2xl border border-white/10 bg-black/25 p-4">
									<p className="text-2xl font-semibold text-white">{value}</p>
									<p className="mt-1 text-sm leading-6 text-slate-400">{label}</p>
								</div>
							))}
						</div>
					</div>
				</header>

				<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					{pillars.map((pillar) => (
						<div key={pillar.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
							<h2 className="text-lg font-medium text-white">{pillar.title}</h2>
							<p className="mt-3 text-sm leading-7 text-slate-400">{pillar.desc}</p>
						</div>
					))}
				</section>

				<section id="packages" className="space-y-6">
					<div className="max-w-3xl">
						<p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-200/75">Packages</p>
						<h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Everything in the brief, presented as a clear buying decision.</h2>
						<p className="mt-4 text-base leading-8 text-slate-300">
							Each package is written to make the next step easy. The structure is simple on purpose: fast scan, clear value, concrete timeline, and an investment range that matches the scope.
						</p>
					</div>

					<div className="grid gap-6">
						{packages.map((item) => (
							<article key={item.title} className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur">
								<div className={`h-1 bg-gradient-to-r ${item.accent}`} />
								<div className="grid gap-8 p-6 md:p-8 xl:grid-cols-[0.95fr_1.05fr]">
									<div>
										<div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-slate-300">
											{item.badge}
										</div>
										<h3 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">{item.title}</h3>
										<p className="mt-3 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">{item.subtitle}</p>

										<div className="mt-6 grid gap-3 sm:grid-cols-2">
											<div className="rounded-2xl border border-white/10 bg-black/20 p-4">
												<p className="text-xs uppercase tracking-[0.3em] text-slate-500">Perfect for</p>
												<p className="mt-2 text-sm leading-7 text-slate-200">{item.perfectFor}</p>
											</div>
											<div className="rounded-2xl border border-white/10 bg-black/20 p-4">
												<p className="text-xs uppercase tracking-[0.3em] text-slate-500">Timeline</p>
												<p className="mt-2 text-sm leading-7 text-slate-200">{item.timeline}</p>
											</div>
										</div>

										<div className="mt-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4">
											<p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Investment</p>
											<p className="mt-2 text-xl font-semibold text-white">{item.investment}</p>
										</div>
									</div>

									<div className="grid gap-4">
										<div className="grid gap-3 sm:grid-cols-2">
											{item.highlights.map((point) => (
												<div key={point} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-slate-300">
													{point}
												</div>
											))}
										</div>

										{item.options ? (
											<div className="grid gap-4 lg:grid-cols-2">
												{item.options.map((option) => (
													<div key={option.title} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
														<p className="text-sm font-semibold text-white">{option.title}</p>
														<div className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-[0.24em] text-slate-400">
															<span>{option.price}</span>
															<span>•</span>
															<span>{option.delivery}</span>
														</div>
														<ul className="mt-4 space-y-2 text-sm leading-7 text-slate-300">
															{option.details.map((detail) => (
																<li key={detail} className="flex gap-3">
																	<span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
																	<span>{detail}</span>
																</li>
															))}
														</ul>
													</div>
												))}
											</div>
										) : null}
									</div>
								</div>
							</article>
						))}
					</div>
				</section>


				<section id="contact" className="rounded-[2rem] border border-cyan-400/15 bg-gradient-to-br from-cyan-400/10 via-white/[0.03] to-transparent p-6 md:p-8 lg:p-10">
					<div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
						<div>
							<p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-200/75">Ready to move</p>
							<h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Your next build starts today and it'll be live before your competitors even get a quote.</h2>
							<p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
								Choose the package that fits the current stage of the business, or use this page as the starting point for a tighter custom proposal. The outcome stays the same: a complete build with a premium finish and a clear reason to buy.
							</p>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
							<a
                            href="https://wa.me/918290393487?text=Hi%2C%20I%27d%20like%20a%20quote"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                            >
                            Chat on WhatsApp
                            </a>
							<a href="#packages" className="rounded-full border border-white/15 bg-black/20 px-5 py-3 text-center text-sm font-semibold text-white transition hover:border-cyan-400/40 hover:bg-cyan-400/10">
								Review packages again
							</a>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}