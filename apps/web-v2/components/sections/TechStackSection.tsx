import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import stackData from "@/data/tech-stack.json";
import { FaCode } from "react-icons/fa";
import { SiNextdotjs, SiReact, SiTailwindcss, SiNodedotjs, SiCloudflare, SiSupabase, SiTypescript, SiPython } from "react-icons/si";

type Item = { name: string; level: number; usedFor: string[]; iconKey?: string };

const iconMap: Record<string, React.ReactNode> = {
  next: <SiNextdotjs className="text-slate-200" />,
  react: <SiReact className="text-cyan-300" />,
  tailwind: <SiTailwindcss className="text-cyan-300" />,
  node: <SiNodedotjs className="text-green-400" />,
  cloudflare: <SiCloudflare className="text-orange-400" />,
  supabase: <SiSupabase className="text-emerald-400" />,
  typescript: <SiTypescript className="text-blue-400" />,
  python: <SiPython className="text-yellow-300" />,
};

function SkillCard({ item }: { item: Item }) {
  const pct = Math.max(10, Math.min(100, item.level));
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="text-xl">
            {item.iconKey && iconMap[item.iconKey] ? iconMap[item.iconKey] : <FaCode className="text-slate-300" />}
          </div>
          <div>
            <div className="font-semibold text-slate-200">{item.name}</div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {item.usedFor.map((u) => (
                <Tag key={u} label={u} variant="muted" />
              ))}
            </div>
          </div>
        </div>
        <div className="text-sm text-cyan-300 font-mono">{pct}%</div>
      </div>
      <div className="mt-3 h-1.5 w-full rounded bg-slate-800">
        <div className="h-1.5 rounded bg-gradient-to-r from-cyan-500 to-purple-500" style={{ width: `${pct}%` }} />
      </div>
    </Card>
  );
}

export default function TechStackSection() {
  return (
    <Section id="skills" title="Tech Stack" subtitle="Core tools and languages with practical expertise">
      <div className="grid gap-6 md:grid-cols-3">
        {stackData.categories.map((cat) => (
          <div key={cat.name}>
            <h3 className="mb-3 text-sm font-semibold text-slate-300 uppercase tracking-wide">{cat.name}</h3>
            <div className="space-y-3">
              {cat.items.map((item) => (
                <SkillCard key={item.name} item={item as Item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
