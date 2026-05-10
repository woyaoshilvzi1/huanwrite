import { type PlatformRadarSnapshot } from "../api.js";

export function PlatformPanel({ snapshot }: { snapshot: PlatformRadarSnapshot | null }) {
  return (
    <section className="panel wide" aria-labelledby="platform-heading">
      <h2 id="platform-heading">平台雷达</h2>
      <div className="radar-grid">
        <article className="lane-item">
          <strong>今日结论</strong>
          <p>{snapshot?.conclusion ?? "加载中"}</p>
          <p>证据评分：{snapshot?.evidenceScore ?? 0}</p>
        </article>
        <article className="lane-item">
          <strong>不可推断项</strong>
          <p>{snapshot?.unknowns.join(" / ") ?? "加载中"}</p>
        </article>
        <article className="lane-item">
          <strong>噪音词降权</strong>
          <p>{snapshot?.noiseDownranking.join(" / ") ?? "加载中"}</p>
        </article>
        <article className="lane-item">
          <strong>行动建议</strong>
          <p>{snapshot?.recommendations.join(" / ") ?? "加载中"}</p>
        </article>
      </div>
      <div className="radar-grid">
        <section className="lane" aria-label="平台证据">
          <h3>证据</h3>
          {(snapshot?.evidence ?? []).map((item) => (
            <article className="lane-item" key={item.source}>
              <strong>{item.source}</strong>
              <p>{item.summary}</p>
              <p>评分：{item.score} · {item.usable ? "可用" : "证据不足"}</p>
            </article>
          ))}
        </section>
        <section className="lane" aria-label="稿线匹配">
          <h3>稿线匹配</h3>
          {(snapshot?.laneMatches ?? []).map((item) => (
            <article className="lane-item" key={item.manuscriptId}>
              <strong>{item.title}</strong>
              <p>平台：{item.targetPlatform}</p>
              <p>准备度：{item.readiness}% · {item.nextAction}</p>
            </article>
          ))}
        </section>
      </div>
    </section>
  );
}
