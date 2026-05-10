import { type BackgroundJobRecord } from "../repositories/backgroundJobRepository.js";

export interface WorkflowEventMap {
  "job.updated": {
    job: BackgroundJobRecord;
  };
}

export type WorkflowEventName = keyof WorkflowEventMap;

export type WorkflowEventListener<T extends WorkflowEventName> = (payload: WorkflowEventMap[T]) => void;

export class WorkflowEvents {
  private readonly listeners = new Map<WorkflowEventName, Set<WorkflowEventListener<WorkflowEventName>>>();

  on<T extends WorkflowEventName>(event: T, listener: WorkflowEventListener<T>): () => void {
    const listeners = this.listeners.get(event) ?? new Set<WorkflowEventListener<WorkflowEventName>>();
    listeners.add(listener as WorkflowEventListener<WorkflowEventName>);
    this.listeners.set(event, listeners);
    return () => listeners.delete(listener as WorkflowEventListener<WorkflowEventName>);
  }

  emit<T extends WorkflowEventName>(event: T, payload: WorkflowEventMap[T]): void {
    for (const listener of this.listeners.get(event) ?? []) {
      listener(payload);
    }
  }
}
