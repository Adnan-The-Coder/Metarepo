import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import testimonials from "@/data/testimonials.json";

type Testimonial = { name: string; role: string; company: string; quote: string; avatar?: string | null };

export default function TestimonialsSection() {
  return (
    <Section id="testimonials" title="Client Testimonials" subtitle="Real feedback from shipped work">
      <div className="grid gap-6 md:grid-cols-2">
        {(testimonials as Testimonial[]).map((t) => (
          <Card key={t.name}>
            <p className="text-slate-200">“{t.quote}”</p>
            <div className="mt-3 text-sm text-slate-400">
              — {t.name}, {t.role} @ {t.company}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
