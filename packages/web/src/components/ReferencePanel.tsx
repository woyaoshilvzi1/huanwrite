import { type ReferenceContextResponse } from "../api.js";

export function ReferencePanel({ references }: { references: ReferenceContextResponse["references"] }) {
  return (
    <section className="panel wide" aria-labelledby="reference-heading">
      <h2 id="reference-heading">参考资产</h2>
      <div className="reference-grid">
        {references.map((item) => (
          <article className="lane-item" key={item.path}>
            <strong>{item.label}</strong>
            <p>{item.path}</p>
            <p>{item.content.slice(0, 120)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
