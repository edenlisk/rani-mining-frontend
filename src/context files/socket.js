import React from "react";
import socketio from "socket.io-client";

const SOCKET_URL = "http://localhost:5001";
// const SOCKET_URL = "http://localhost:5001";

export const socket = socketio.connect(SOCKET_URL, {reconnection: true});
export const SocketContext = React.createContext(socket);