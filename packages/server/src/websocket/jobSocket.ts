import { type Server } from "node:http";
import { WebSocketServer } from "ws";
import { type WorkflowService } from "@huanwrite/core";

export function attachJobWebSocket(server: Server, workflow: WorkflowService): WebSocketServer {
  const socketServer = new WebSocketServer({ server, path: "/ws/jobs" });

  workflow.on("job.updated", ({ job }) => {
    const message = JSON.stringify({
      type: "job.updated",
      job
    });
    for (const client of socketServer.clients) {
      if (client.readyState === client.OPEN) {
        client.send(message);
      }
    }
  });

  return socketServer;
}
