import { useState } from "react";
import { type DashboardManuscript } from "../dashboardSchema.js";

export function ManuscriptEditor({
  manuscript,
  onSaveDraft
}: {
  manuscript: DashboardManuscript;
  onSaveDraft: (manuscriptId: string, text: string) => Promise<void>;
}) {
  const [text, setText] = useState("");
  return (
    <label className="draft-editor">
      <span>正文内容</span>
      <textarea
        aria-label={`正文内容 ${manuscript.title}`}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <button type="button" onClick={() => onSaveDraft(manuscript.id, text)}>
        保存正文
      </button>
    </label>
  );
}
