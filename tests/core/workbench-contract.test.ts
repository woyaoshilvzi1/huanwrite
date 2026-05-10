import { describe, expect, it } from "vitest";
import { readWorkbenchContract, workbenchActionIds, workbenchViewIds } from "@huanwrite/shared";

describe("workbench contract", () => {
  it("keeps the full production action surface explicit", () => {
    const contract = readWorkbenchContract();
    expect(contract.actions.map((item) => item.id)).toEqual([...workbenchActionIds]);
    expect(contract.actions.map((item) => item.label)).toEqual([
      "写前规划",
      "重新规划",
      "润色规划",
      "头脑风暴",
      "状态审计",
      "续写",
      "去 AI 返修",
      "按审稿返修",
      "候选审稿",
      "合入简报",
      "投稿包",
      "短剧改编",
      "平台雷达",
      "每日平台雷达"
    ]);
  });

  it("keeps user-facing workbench views explicit", () => {
    const contract = readWorkbenchContract();
    expect(contract.views.map((item) => item.id)).toEqual([...workbenchViewIds]);
    expect(contract.views.map((item) => item.label)).toEqual(["看板", "规划", "写稿", "输出", "参考", "平台雷达"]);
  });
});
