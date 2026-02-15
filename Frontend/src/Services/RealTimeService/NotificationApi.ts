import axios from "../../Configurations/AxiosRealtimeService.ts";
import type { ApiResponse } from "../../Types/Common.type";
import type { NotificationData } from "../../Types/Notification.type.ts";

export const getAllNotification = async (): Promise<ApiResponse<NotificationData[]>> => {
    const response = await axios.get<ApiResponse<NotificationData[]>>("/notification-api/get-notification");
    return response.data;
}

export const readNotification = async (notificationId: string): Promise<ApiResponse<void>> => {
    const response = await axios.patch(`/notification-api/read-notification/${notificationId}`);
    return response.data;
}

export const readAllNotification = async (): Promise<ApiResponse<void>> => {
    const response = await axios.patch("/notification-api/read-all");
    return response.data;
}