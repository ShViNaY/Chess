"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Games = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Games {
    player1;
    player2;
    board = new chess_js_1.Chess();
    startTime = new Date();
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
    }
    hasPlayer(socket) {
        return socket === this.player1 || socket === this.player2;
    }
    removePlayer(socket) {
        return !this.hasPlayer(socket);
    }
    makeMove(socket, move) {
        if (this.board.moves().length % 2 === 0 && socket !== this.player1) {
            return;
        }
        let result;
        try {
            result = this.board.move(move);
            if (!result) {
                return;
            }
        }
        catch (error) {
            console.error("Invalid move:", error);
            return;
        }
        if (this.board.isGameOver()) {
            const winner = this.board.turn() === "w" ? "black" : "white";
            [this.player1, this.player2].forEach((player) => player.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: { winner },
            })));
            return;
        }
        const opponent = socket === this.player1 ? this.player2 : this.player1;
        opponent.send(JSON.stringify({
            type: messages_1.MOVE,
            payload: move,
        }));
    }
}
exports.Games = Games;
//# sourceMappingURL=Games.js.map