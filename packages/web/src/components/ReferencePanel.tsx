import { type ReferenceContextResponse } from "../api.js";

export function ReferencePanel({ references }: { references: ReferenceContextResponse["references"] }) {
  return (
    <section className="panel wide reference-workbench" aria-labelledby="reference-heading">
      <header className="workspace-heading">
        <div>
          <h2 id="reference-heading">参考资产</h2>
          <p>模板、规范、平台规则和投稿上下文集中查看。</p>
        </div>
        <strong>{references.length} 项</strong>
      </header>
      <div className="reference-layout">
        <aside className="reference-index" aria-label="参考资产目录">
          {references.map((item) => (
            <a key={item.path} href={`#reference-${normalizeReferenceId(item.path)}`}>
              <strong>{item.label}</strong>
              <small>{item.path}</small>
            </a>
          ))}
        </aside>
        <section className="reference-reader" aria-label="参考资产正文">
          {references.map((item) => (
            <article className="lane-item" id={`reference-${normalizeReferenceId(item.path)}`} key={item.path}>
              <strong>{item.label}</strong>
              <p>{item.path}</p>
              <pre>{item.content}</pre>
            </article>
          ))}
        </section>
      </div>
    </section>
  );
}

function normalizeReferenceId(path: string): string {
  return path.replace(/[^a-zA-Z0-9]+/g, "-");
}
