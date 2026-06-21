"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Games_1 = require("./Games");
const messages_1 = require("./messages");
class GameManager {
    games = [];
    pendingUser = null;
    users = [];
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter((user) => user !== socket);
        this.games = this.games.filter((game) => game.removePlayer(socket));
        if (this.pendingUser === socket) {
            this.pendingUser = null;
        }
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            try {
                const message = JSON.parse(data.toString());
                console.log("received message", message.type);
                const messageType = typeof message.type === "string" ? message.type.toUpperCase() : "";
                if (messageType === messages_1.INIT_GAME) {
                    if (this.pendingUser) {
                        const whitePlayer = this.pendingUser;
                        const blackPlayer = socket;
                        const game = new Games_1.Games(whitePlayer, blackPlayer);
                        this.games.push(game);
                        this.pendingUser = null;
                        whitePlayer.send(JSON.stringify({
                            type: messages_1.INIT_GAME,
                            payload: { color: "white" },
                        }));
                        blackPlayer.send(JSON.stringify({
                            type: messages_1.INIT_GAME,
                            payload: { color: "black" },
                        }));
                    }
                    else {
                        this.pendingUser = socket;
                    }
                    return;
                }
                if (messageType === messages_1.MOVE.toUpperCase()) {
                    const game = this.games.find((game) => game.hasPlayer(socket));
                    if (game) {
                        game.makeMove(socket, message.move);
                    }
                }
            }
            catch (error) {
                console.error("Failed to parse message:", error);
            }
        });
    }
}
exports.GameManager = GameManager;
//# sourceMappingURL=GameManager.js.map