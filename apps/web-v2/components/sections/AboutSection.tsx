import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";

export default function AboutSection() {
  return (
    <Section id="about" title="About Me" subtitle="Builder, founder, and full‑stack developer">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <p className="text-slate-300 leading-relaxed">
            I design and ship modern, edge‑first web applications. My focus is
            practical engineering: fast delivery, clean architecture, and
            measurable outcomes. I enjoy crafting dark, visually refined UIs
            and pairing them with serverless backends for reliability and scale.
          </p>
          <p className="mt-4 text-slate-400 text-sm">
            Current focus: Enterprise Grade Scalability  with JAVA Spring Boot Backend Systems over a distributed services architecture and K8s orchestration.
          </p>
        </Card>
        <Card>
          <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
              <span className="text-slate-400">Location</span>
              <span className="text-slate-200">Remote‑first</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Availability</span>
              <span className="text-cyan-300">Open for MVPs</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Company</span>
              <span className="text-slate-200">Electroplix</span>
            </div>
          </div>
        </Card>
      </div>
    </Section>
  );
}
