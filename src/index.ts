import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const wss = new WebSocketServer({ port: 8080 });
const gameManager = new GameManager();

wss.on("connection", (ws) => {
  console.log("Client connected");
  gameManager.addUser(ws);
  ws.on("close", () => {
    console.log("Client disconnected");
    gameManager.removeUser(ws);
  });
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

console.log("WebSocket server listening on ws://localhost:8080");