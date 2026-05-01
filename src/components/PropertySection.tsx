import MetricCounter from "@/components/MetricCounter";
import { mallFacts } from "@/data/mall";

export default function PropertySection() {
  return (
    <section id="property" className="section-shell">
      <div className="section-inner">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
          <div data-reveal>
            <p className="eyebrow">Why this property</p>
            <h2 className="section-title mt-5">A destination with its own gravity.</h2>
          </div>
          <p data-reveal className="body-large">
            Mall of America is not a mall pitch. It is an audience platform,
            an entertainment property, a tourism engine, and a retail marketplace
            designed to create reasons to visit all year.
          </p>
        </div>

        <div className="metric-grid mt-12">
          {mallFacts.map((fact, index) => (
            <MetricCounter key={fact.label} {...fact} delay={index * 0.08} />
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            "Retailers get traffic they could not manufacture alone.",
            "Sponsors get a live audience in an environment built for activation.",
            "Event producers get a stage with daily footfall already moving around it."
          ].map((line) => (
            <div key={line} data-reveal className="reveal-card p-5">
              <p className="text-xl font-bold leading-7 text-white">{line}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
