import { existsSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

export interface ReferenceContextItem {
  label: string;
  path: string;
  content: string;
}

const referenceFiles = [
  ["候选正文模板", ".huanwrite/assets/templates/candidate-text.md"],
  ["章节模板", ".huanwrite/assets/templates/webnovel-chapter.md"],
  ["大纲模板", ".huanwrite/assets/templates/webnovel-outline.md"],
  ["写作原则", ".huanwrite/assets/writing-rules/webnovel-writing-principles.md"],
  ["质量清单", ".huanwrite/assets/quality-rules/webnovel-quality-checklist.md"],
  ["选题规则", ".huanwrite/assets/topic-rules/webnovel-topic-screening.md"],
  ["语料说明", ".huanwrite/assets/corpus/README.md"],
  ["语料模仿索引", ".huanwrite/assets/corpus/webnovel/analysis/imitation_index.md"],
  ["中文小说技能", ".huanwrite/assets/skills/chinese-novelist/SKILL.md"],
  ["中文网文技能", ".huanwrite/assets/skills/chinese-webnovel/SKILL.md"],
  ["写作阶段流程", ".huanwrite/assets/skills/chinese-novelist/references/flows/phase3-writing.md"],
  ["对话写作指南", ".huanwrite/assets/skills/chinese-novelist/references/guides/dialogue-writing.md"],
  ["钩子技法指南", ".huanwrite/assets/skills/chinese-novelist/references/guides/hook-techniques.md"],
  ["网文章节模板", ".huanwrite/assets/skills/chinese-webnovel/references/webnovel_chapter_template.md"],
  ["网文质量清单", ".huanwrite/assets/skills/chinese-webnovel/references/webnovel_quality_checklist.md"]
] as const;

export class ReferenceContextService {
  constructor(private readonly root: string) {}

  read(): { references: ReferenceContextItem[] } {
    return {
      references: referenceFiles.map(([label, path]) => this.readItem(label, path))
    };
  }

  private readItem(label: string, path: string): ReferenceContextItem {
    const absolute = join(this.root, path);
    return {
      label,
      path: relative(this.root, absolute).replaceAll("\\", "/"),
      content: existsSync(absolute) ? readFileSync(absolute, "utf8") : ""
    };
  }
}
