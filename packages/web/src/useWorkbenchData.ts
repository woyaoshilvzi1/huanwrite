import { useCallback, useEffect, useState } from "react";
import {
  fetchDashboard,
  fetchJobs,
  fetchPlatformRadar,
  fetchReferenceContext,
  fetchRuns,
  type ActionRunSummary,
  type BackgroundJobSummary,
  type PlatformRadarSnapshot,
  type ReferenceContextResponse
} from "./api.js";
import { type Dashboard } from "./dashboardSchema.js";
import { useJobEvents } from "./useJobEvents.js";

export interface WorkbenchData {
  dashboard: Dashboard | null;
  runs: ActionRunSummary[];
  jobs: BackgroundJobSummary[];
  references: ReferenceContextResponse["references"];
  platformRadar: PlatformRadarSnapshot | null;
  loadError: string;
  refresh: () => Promise<void>;
}

export function useWorkbenchData(): WorkbenchData {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [runs, setRuns] = useState<ActionRunSummary[]>([]);
  const [jobs, setJobs] = useState<BackgroundJobSummary[]>([]);
  const [references, setReferences] = useState<ReferenceContextResponse["references"]>([]);
  const [platformRadar, setPlatformRadar] = useState<PlatformRadarSnapshot | null>(null);
  const [loadError, setLoadError] = useState("");

  const refresh = useCallback(async () => {
    const nextDashboard = await fetchDashboard();
    const nextRuns = await fetchRuns();
    const nextJobs = await fetchJobs();
    const nextReferences = await fetchReferenceContext();
    const nextPlatformRadar = await fetchPlatformRadar();
    setDashboard(nextDashboard);
    setRuns(nextRuns.runs);
    setJobs(nextJobs.jobs);
    setReferences(nextReferences.references);
    setPlatformRadar(nextPlatformRadar);
  }, []);

  useEffect(() => {
    refresh().catch((reason: Error) => setLoadError(reason.message));
  }, []);
  useJobEvents(() => {
    refresh().catch((reason: Error) => setLoadError(reason.message));
  });

  return {
    dashboard,
    runs,
    jobs,
    references,
    platformRadar,
    loadError,
    refresh
  };
}
