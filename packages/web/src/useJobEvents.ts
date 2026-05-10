import { useEffect } from "react";

export function useJobEvents(onJobUpdate: () => void): void {
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const socket = new WebSocket(`${protocol}//${window.location.host}/ws/jobs`);
    socket.addEventListener("message", (event) => {
      if (isJobUpdatedMessage(event.data)) {
        onJobUpdate();
      }
    });
    return () => socket.close();
  }, [onJobUpdate]);
}

function isJobUpdatedMessage(data: unknown): boolean {
  if (typeof data !== "string") return false;
  try {
    const parsed: unknown = JSON.parse(data);
    return Boolean(parsed && typeof parsed === "object" && "type" in parsed && parsed.type === "job.updated");
  } catch {
    return false;
  }
}
