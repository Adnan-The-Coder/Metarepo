import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import projects from "@/data/projects.json";
import Link from "next/link";

type Project = {
  id: string;
  name: string;
  year: number;
  description: string;
  tech: string[];
  links: { site: string | null; repo: string | null };
};

export default function ProjectsSection() {
  return (
    <Section id="projects" title="Projects" subtitle="Selected work and experiments">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(projects as Project[]).map((p) => (
          <Card key={p.id}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-200">{p.name}</h3>
              <span className="text-xs text-slate-400">{p.year}</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">{p.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.tech.map((t) => (
                <Tag key={t} label={t} />
              ))}
            </div>
            <div className="mt-4 flex gap-3 text-sm">
              {p.links.site && (
                <Link className="text-cyan-300 hover:text-cyan-200" href={p.links.site} target="_blank">Visit</Link>
              )}
              {p.links.repo && (
                <Link className="text-slate-300 hover:text-slate-200" href={p.links.repo} target="_blank">Repo</Link>
              )}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
