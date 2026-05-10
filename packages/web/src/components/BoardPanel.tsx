import { manuscriptStatuses } from "@huanwrite/shared";
import { useState } from "react";
import { type Dashboard, type DashboardManuscript } from "../dashboardSchema.js";

export function BoardPanel({
  dashboard,
  onUpdateWorkbench
}: {
  dashboard: Dashboard | null;
  onUpdateWorkbench: (manuscriptId: string, input: DashboardManuscript["workbench"]) => Promise<void>;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [draggingId, setDraggingId] = useState("");
  const manuscripts = (dashboard?.manuscripts ?? []).filter((item) => {
    const text = `${item.title} ${item.workbench.owner} ${item.workbench.notes}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (status === "all" || item.workbench.laneStatus === status);
  });
  return (
    <section className="panel wide" aria-labelledby="board-heading">
      <h2 id="board-heading">多稿线看板</h2>
      <div className="board-filters">
        <label>
          <span>搜索</span>
          <input aria-label="看板搜索" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label>
          <span>状态筛选</span>
          <select aria-label="看板状态筛选" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">全部</option>
            {manuscriptStatuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="status-board">
        {manuscriptStatuses.map((laneStatus) => (
          <section
            className="status-column"
            key={laneStatus}
            aria-label={`状态列 ${laneStatus}`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const manuscriptId = event.dataTransfer.getData("text/plain") || draggingId;
              const manuscript = manuscripts.find((item) => item.id === manuscriptId);
              if (!manuscript || manuscript.workbench.laneStatus === laneStatus) return;
              onUpdateWorkbench(manuscript.id, {
                ...manuscript.workbench,
                laneStatus
              });
              setDraggingId("");
            }}
          >
            <h3>{laneStatus}</h3>
            {manuscripts
              .filter((item) => item.workbench.laneStatus === laneStatus)
              .map((item) => (
                <article
                  className="lane-item draggable-lane"
                  key={item.id}
                  draggable
                  aria-label={`稿线卡片 ${item.title}`}
                  onDragStart={(event) => {
                    setDraggingId(item.id);
                    event.dataTransfer.setData("text/plain", item.id);
                    event.dataTransfer.effectAllowed = "move";
                  }}
                  onDragEnd={() => setDraggingId("")}
                >
                  <strong>{item.title}</strong>
                  <p>负责人：{item.workbench.owner || "未填写"}</p>
                  <p>{item.workbench.notes || "暂无备注"}</p>
                  <label>
                    <span>改状态</span>
                    <select
                      aria-label={`看板改状态 ${item.title}`}
                      value={item.workbench.laneStatus}
                      onChange={(event) =>
                        onUpdateWorkbench(item.id, {
                          ...item.workbench,
                          laneStatus: event.target.value as DashboardManuscript["workbench"]["laneStatus"]
                        })
                      }
                    >
                      {manuscriptStatuses.map((nextStatus) => (
                        <option key={nextStatus} value={nextStatus}>
                          {nextStatus}
                        </option>
                      ))}
                    </select>
                  </label>
                </article>
              ))}
          </section>
        ))}
      </div>
    </section>
  );
}
