import axios from "../../Configurations/AxiosRealtimeService.ts";
import type { ChatRoom, Message } from "../../Types/Chat.type.ts";
import type { ApiResponse } from "../../Types/Common.type";

export const getParticipatedChatRoom = async (): Promise<ApiResponse<ChatRoom[]>> => {
    const response = await axios.get<ApiResponse<ChatRoom[]>>("/chat-room-api/get-participated-chat-room");
    return response.data;
}

export const getMessage = async (chatRoomId: string): Promise<ApiResponse<Message[]>> => {
    const response = await axios.get<ApiResponse<Message[]>>(`/chat-room-api/get-chat/${chatRoomId}`);
    return response.data;
}

export const sendMessage = async (chatRoomId: string, content: string): Promise<ApiResponse<void>> => {
    const response = await axios.post(`/chat-room-api/send-message/${chatRoomId}/${content}`);
    return response.data;
}