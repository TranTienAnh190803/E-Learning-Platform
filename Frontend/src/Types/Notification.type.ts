export type NotificationType = "NEW_STUDENT" | "DELETE_COURSE" | "NEW_LESSON"

export interface NotificationData {
    _id: string,
    type: NotificationType,
    title: string,
    content: string,
    contentUrl: string,
    isRead: boolean,
    readAt: Date
}