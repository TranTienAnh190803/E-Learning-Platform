import { io } from "socket.io-client";

const realtimeServiceUrl = import.meta.env.VITE_REALTIME_SERVICE;

export const socket = io(realtimeServiceUrl, {
    withCredentials: true,
    autoConnect: false
})