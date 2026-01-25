import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import saas from "@/data/saas.json";
import Link from "next/link";

type SaaS = { name: string; description: string; url: string | null; status: string };

export default function SaaSSection() {
  return (
    <Section id="saas" title="Shipped SaaS Platforms" subtitle="Products and toolkits available or in beta">
      <div className="grid gap-6 sm:grid-cols-2">
        {(saas as SaaS[]).map((s) => (
          <Card key={s.name}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-200">{s.name}</h3>
              <Tag label={s.status} variant={s.status === "Live" ? "accent" : "purple"} />
            </div>
            <p className="mt-2 text-sm text-slate-400">{s.description}</p>
            {s.url && (
              <div className="mt-3 text-sm">
                <Link className="text-cyan-300 hover:text-cyan-200" href={s.url} target="_blank">Visit</Link>
              </div>
            )}
          </Card>
        ))}
      </div>
    </Section>
  );
}
