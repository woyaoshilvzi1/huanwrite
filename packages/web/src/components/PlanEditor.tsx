import { type DashboardPlan, type DashboardPlanDetail } from "../dashboardSchema.js";
import { type PlanEditorPayload } from "./planEditorTypes.js";
import { PlanTextListField } from "./PlanTextListField.js";
import { StructureCardEditor } from "./StructureCardEditor.js";
import { usePlanEditorState } from "./usePlanEditorState.js";

export function PlanEditor({
  plan,
  detail,
  onUpdatePlan
}: {
  plan: DashboardPlan;
  detail: DashboardPlanDetail | undefined;
  onUpdatePlan: (planId: string, input: PlanEditorPayload) => Promise<void>;
}) {
  const editor = usePlanEditorState(plan, detail);

  return (
    <section className="plan-editor" aria-label={`结构化规划 ${plan.id}`}>
      <label>
        <span>故事承诺</span>
        <textarea aria-label={`故事承诺 ${plan.id}`} value={editor.storyPromise} onChange={(event) => editor.setStoryPromise(event.target.value)} />
      </label>
      <div className="structure-card-list" aria-label={`章节卡列表 ${plan.id}`}>
        {editor.structureCards.map((card, index) => (
          <StructureCardEditor
            key={`${card.title}-${index}`}
            index={index}
            card={card}
            canMoveUp={index > 0}
            canMoveDown={index < editor.structureCards.length - 1}
            onChange={(nextCard) => editor.updateCard(index, nextCard)}
            onMoveUp={() => editor.moveCard(index, -1)}
            onMoveDown={() => editor.moveCard(index, 1)}
            onDuplicate={() => editor.duplicateCard(index)}
            onRemove={() => editor.removeCard(index)}
          />
        ))}
      </div>
      <button type="button" onClick={editor.addCard}>
        添加章节卡
      </button>
      <PlanTextListField label={`人物关系 ${plan.id}`} value={editor.relationships} onChange={editor.setRelationships} />
      <PlanTextListField label={`风格规则 ${plan.id}`} value={editor.styleRules} onChange={editor.setStyleRules} />
      <PlanTextListField label={`禁用句式 ${plan.id}`} value={editor.bannedPhrases} onChange={editor.setBannedPhrases} />
      <PlanTextListField label={`疲劳词 ${plan.id}`} value={editor.fatigueWords} onChange={editor.setFatigueWords} />
      <PlanTextListField label={`说话指纹 ${plan.id}`} value={editor.voiceFingerprints} onChange={editor.setVoiceFingerprints} />
      <PlanTextListField label={`文风指纹 ${plan.id}`} value={editor.styleFingerprints} onChange={editor.setStyleFingerprints} />
      <PlanTextListField label={`技法卡 ${plan.id}`} value={editor.craftCards} onChange={editor.setCraftCards} />
      <button type="button" onClick={() => onUpdatePlan(plan.id, editor.toPayload())}>
        保存结构化规划
      </button>
    </section>
  );
}
