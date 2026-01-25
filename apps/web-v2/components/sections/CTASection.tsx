import Section from "@/components/ui/Section";
import Link from "next/link";

export default function CTASection() {
  return (
    <Section id="contact" title="Turn Your Idea Into an MVP" subtitle="Ship a working MVP in a week—get in touch">
      <div className="rounded-xl border brand-border bg-gray-900/60 p-6 md:p-8 text-center">
        <p className="text-slate-300 max-w-2xl mx-auto">
          I help founders validate ideas quickly with production‑ready
          serverless stacks and tasteful dark UI. Let’s scope it and ship.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="mailto:contact@adnanthecoder.com" className="px-5 py-3 rounded-lg bg-white/90 text-black font-semibold hover:bg-white transition">
            Email Me
          </Link>
          <Link href="https://www.linkedin.com/in/syedadnanali99" target="_blank" className="px-5 py-3 rounded-lg border border-cyan-500/30 text-cyan-300 hover:border-cyan-400/50 hover:text-cyan-200 transition">
            Connect on LinkedIn
          </Link>
        </div>
      </div>
    </Section>
  );
}
