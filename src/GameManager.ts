import { WebSocket } from "ws";
import { Games } from "./Games";
import { MOVE, INIT_GAME } from "./messages";

export class GameManager {
  private games: Games[] = [];
  private pendingUser: WebSocket | null = null;
  private users: WebSocket[] = [];

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);
    this.games = this.games.filter((game) => game.removePlayer(socket));
    if (this.pendingUser === socket) {
      this.pendingUser = null;
    }
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log("received message", message.type);

        const messageType = typeof message.type === "string" ? message.type.toUpperCase() : "";

        if (messageType === INIT_GAME) {
          if (this.pendingUser) {
            const whitePlayer = this.pendingUser;
            const blackPlayer = socket;
            const game = new Games(whitePlayer, blackPlayer);
            this.games.push(game);
            this.pendingUser = null;

            whitePlayer.send(
              JSON.stringify({
                type: INIT_GAME,
                payload: { color: "white" },
              })
            );
            blackPlayer.send(
              JSON.stringify({
                type: INIT_GAME,
                payload: { color: "black" },
              })
            );
          } else {
            this.pendingUser = socket;
          }
          return;
        }

        if (messageType === MOVE.toUpperCase()) {
          const game = this.games.find((game) => game.hasPlayer(socket));
          if (game) {
            game.makeMove(socket, message.move);
          }
        }
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    });
  }
}
