import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, MOVE } from "./messages";

export class Games {
  private readonly board = new Chess();
  private readonly startTime = new Date();

  constructor(public readonly player1: WebSocket, public readonly player2: WebSocket) {}

  hasPlayer(socket: WebSocket): boolean {
    return socket === this.player1 || socket === this.player2;
  }

  removePlayer(socket: WebSocket): boolean {
    return !this.hasPlayer(socket);
  }

  makeMove(socket: WebSocket, move: unknown) {
    if (this.board.moves().length % 2 === 0 && socket !== this.player1) {
      return;
    }

    let result;
    try {
      result = this.board.move(move as any);
      if (!result) {
        return;
      }
    } catch (error) {
      console.error("Invalid move:", error);
      return;
    }

    if (this.board.isGameOver()) {
      const winner = this.board.turn() === "w" ? "black" : "white";
      [this.player1, this.player2].forEach((player) =>
        player.send(
          JSON.stringify({
            type: GAME_OVER,
            payload: { winner },
          })
        )
      );
      return;
    }

    const opponent = socket === this.player1 ? this.player2 : this.player1;
    opponent.send(
      JSON.stringify({
        type: MOVE,
        payload: move,
      })
    );
  }
}
