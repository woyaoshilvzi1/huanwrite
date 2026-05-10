import { type SubmissionPackage } from "@huanwrite/shared";
import { newId, nowIso } from "../ids.js";
import { FileProjectStore } from "../repositories/projectStore.js";

export class SubmissionService {
  constructor(private readonly store: FileProjectStore) {}

  buildPackage(manuscriptId: string, targetPlatform: string): SubmissionPackage {
    const manuscript = this.store.manuscripts.get(manuscriptId);
    return this.store.submissions.save({
      id: newId("submission-package"),
      sourceId: manuscript.id,
      sourceType: "manuscript",
      targetPlatform,
      titleOptions: [manuscript.title, `${manuscript.title}投稿版`, `${manuscript.title}强钩子版`],
      shortIntro: "主角在压力中主动反击，完成利益和尊严兑现。",
      longIntro: "围绕明确冲突展开的商业短篇投稿包，投前必须重新核验平台规则。",
      tags: ["女频", "反打", "强钩子"],
      platformNote: "投前重新核验平台公开规则。",
      checklist: ["正文已确认", "简介已准备", "平台规则待复核"],
      status: "package-draft",
      createdAt: nowIso()
    });
  }
}
