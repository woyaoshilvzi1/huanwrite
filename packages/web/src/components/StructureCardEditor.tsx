import { type DashboardPlan } from "../dashboardSchema.js";

type StructureCard = DashboardPlan["structureCards"][number];

export function StructureCardEditor({
  index,
  card,
  canMoveUp,
  canMoveDown,
  onChange,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove
}: {
  index: number;
  card: StructureCard;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onChange: (card: StructureCard) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
}) {
  const ordinal = index + 1;
  return (
    <fieldset className="structure-card-editor" aria-label={`章节卡 ${ordinal}`}>
      <legend>章节卡 {ordinal}</legend>
      <CardInput label={`第${ordinal}章节标题`} value={card.title} onChange={(title) => onChange({ ...card, title })} />
      <CardInput label={`第${ordinal}章节摘要`} value={card.summary} onChange={(summary) => onChange({ ...card, summary })} />
      <CardInput label={`第${ordinal}目标字数`} value={card.targetWords} onChange={(targetWords) => onChange({ ...card, targetWords })} />
      <CardInput label={`第${ordinal}场景数`} value={card.sceneCount} onChange={(sceneCount) => onChange({ ...card, sceneCount })} />
      <CardInput label={`第${ordinal}出场角色`} value={card.characters} onChange={(characters) => onChange({ ...card, characters })} />
      <CardInput label={`第${ordinal}章节目标`} value={card.goal} onChange={(goal) => onChange({ ...card, goal })} />
      <CardInput
        label={`第${ordinal}主角目标`}
        value={card.protagonistGoal}
        onChange={(protagonistGoal) => onChange({ ...card, protagonistGoal })}
      />
      <CardInput label={`第${ordinal}章节冲突`} value={card.conflict} onChange={(conflict) => onChange({ ...card, conflict })} />
      <CardInput label={`第${ordinal}章节变化`} value={card.change} onChange={(change) => onChange({ ...card, change })} />
      <CardInput
        label={`第${ordinal}信息变化转折`}
        value={card.turningPoint}
        onChange={(turningPoint) => onChange({ ...card, turningPoint })}
      />
      <CardInput label={`第${ordinal}章节钩子`} value={card.hook} onChange={(hook) => onChange({ ...card, hook })} />
      <CardInput
        label={`第${ordinal}结尾钩子伏笔`}
        value={card.payoffHook}
        onChange={(payoffHook) => onChange({ ...card, payoffHook })}
      />
      <CardInput label={`第${ordinal}OOC风险`} value={card.oocRisk} onChange={(oocRisk) => onChange({ ...card, oocRisk })} />
      <CardInput label={`第${ordinal}人工备注`} value={card.humanNote} onChange={(humanNote) => onChange({ ...card, humanNote })} />
      <div className="inline-actions">
        <button type="button" onClick={onMoveUp} disabled={!canMoveUp}>
          上移
        </button>
        <button type="button" onClick={onMoveDown} disabled={!canMoveDown}>
          下移
        </button>
        <button type="button" onClick={onDuplicate}>
          复制
        </button>
        <button type="button" onClick={onRemove}>
          删除
        </button>
      </div>
    </fieldset>
  );
}

function CardInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label>
      <span>{label}</span>
      <input aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
