import { WebSocket } from "ws";
export declare class Games {
    readonly player1: WebSocket;
    readonly player2: WebSocket;
    private readonly board;
    private readonly startTime;
    constructor(player1: WebSocket, player2: WebSocket);
    hasPlayer(socket: WebSocket): boolean;
    removePlayer(socket: WebSocket): boolean;
    makeMove(socket: WebSocket, move: unknown): void;
}
//# sourceMappingURL=Games.d.ts.map