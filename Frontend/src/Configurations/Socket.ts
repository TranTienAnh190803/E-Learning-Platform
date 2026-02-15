import { io, Socket } from "socket.io-client";

const realtimeServiceUrl = import.meta.env.VITE_REALTIME_SERVICE;
let socket: Socket | null = null;

// export const socket = io(realtimeServiceUrl, {
//     withCredentials: true,
//     autoConnect: false
// })

export const socketConnect = (token: string) => {
    // Khi đã connect rồi thì trả về "socket" luôn, tránh chồng sự kiện socket.on bên dưới
    if (socket)
        return socket;

    socket = io(realtimeServiceUrl, {
        auth: {token},
        autoConnect: true
    });

    socket.on("connect", () => {
        console.log("✅ Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
    });

    return socket;
}

export const getSocket = () => socket

export const socketDisconnect = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}