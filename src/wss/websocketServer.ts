import socketIo, { Server } from 'socket.io';
import http from "http";

let wss: Server;

export function initialize(server: http.Server) {
    wss = socketIo(server);
}

export function io(): Server {
    return wss;
}