export interface ChatRoom {
    _id: string;
    courseId: number;
    roomName: string;
    isRead: Boolean
}

export interface Message {
    _id?: string;
    sender: string;
    fullname: string;
    chatRoom: string;
    content: string;
    sendAt: Date;
}