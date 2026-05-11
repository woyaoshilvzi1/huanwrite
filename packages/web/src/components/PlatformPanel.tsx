import { type PlatformRadarSnapshot } from "../api.js";

export function PlatformPanel({ snapshot }: { snapshot: PlatformRadarSnapshot | null }) {
  return (
    <section className="panel wide radar-workbench" aria-labelledby="platform-heading">
      <header className="workspace-heading">
        <div>
          <h2 id="platform-heading">平台雷达</h2>
          <p>用公开证据判断每条稿线下一步该投、该改还是该暂停。</p>
        </div>
        <strong>{snapshot?.evidenceScore ?? 0} / 100</strong>
      </header>
      <div className="radar-layout">
        <aside className="radar-summary" aria-label="雷达摘要">
          <article>
            <strong>今日结论</strong>
            <p>{snapshot?.conclusion ?? "加载中"}</p>
          </article>
          <article>
            <strong>不可推断项</strong>
            <p>{snapshot?.unknowns.join(" / ") ?? "加载中"}</p>
          </article>
          <article>
            <strong>噪音词降权</strong>
            <p>{snapshot?.noiseDownranking.join(" / ") ?? "加载中"}</p>
          </article>
          <article>
            <strong>行动建议</strong>
            <p>{snapshot?.recommendations.join(" / ") ?? "加载中"}</p>
          </article>
        </aside>
        <section className="radar-evidence" aria-label="平台证据">
          <h3>证据</h3>
          {(snapshot?.evidence ?? []).map((item) => (
            <article className="lane-item" key={item.source}>
              <strong>{item.source}</strong>
              <p>{item.summary}</p>
              <p>评分：{item.score} · {item.usable ? "可用" : "证据不足"}</p>
            </article>
          ))}
        </section>
        <section className="radar-match" aria-label="稿线匹配">
          <h3>稿线匹配</h3>
          {(snapshot?.laneMatches ?? []).map((item) => (
            <article className="lane-item" key={item.manuscriptId}>
              <strong>{item.title}</strong>
              <p>稿线：{item.laneTitle}</p>
              <p>方向：{item.track}</p>
              <p>雷达信号：{item.radarSignals.join(" / ") || "未记录"}</p>
              <p>平台：{item.targetPlatform}</p>
              <p>准备度：{item.readiness}% · {item.nextAction}</p>
            </article>
          ))}
        </section>
      </div>
    </section>
  );
}
