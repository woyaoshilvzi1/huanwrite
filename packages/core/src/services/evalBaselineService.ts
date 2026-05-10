import { readWorkbenchContract } from "@huanwrite/shared";
import { FileProjectStore } from "../repositories/projectStore.js";
import { promptRegistryKey } from "./actionRunObservation.js";

export interface EvalBaselineCase {
  action: string;
  promptRegistryKey: string;
  requiredChecks: string[];
}

export interface EvalBaselineSnapshot {
  cases: EvalBaselineCase[];
  latestRuns: Array<{
    runId: string;
    action: string;
    promptRegistryKey: string;
    harnessGrade: string;
  }>;
}

export class EvalBaselineService {
  constructor(private readonly store: FileProjectStore) {}

  read(): EvalBaselineSnapshot {
    const actions = readWorkbenchContract().actions;
    return {
      cases: actions.map((action) => ({
        action: action.id,
        promptRegistryKey: promptRegistryKey(action.id),
        requiredChecks: ["action-available", "output-written"]
      })),
      latestRuns: this.store.actionRuns.list().map((run) => ({
        runId: run.id,
        action: run.action,
        promptRegistryKey: run.promptRegistryKey,
        harnessGrade: run.harness.grade
      }))
    };
  }
}
