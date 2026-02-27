import { useEffect, useState } from "react";
import type { ChatRoom, Message } from "../Types/Chat.type";
import {
  getMessage,
  getParticipatedChatRoom,
  sendMessage,
} from "../Services/RealTimeService/Chat.Api";
import ChatRoomList from "../Components/ChatRoomList.Chat";
import MessageList from "../Components/MessageList.Chat";
import MessageInput from "../Components/MessageInput.Chat";
import { getSocket } from "../Configurations/Socket";

export default function ChatPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchChatRoom = async () => {
    const io = getSocket();
    if (!io) {
      alert("Something wrong with socket.io");
      return;
    }

    const response = await getParticipatedChatRoom();
    if (response.success) {
      const data = response.data!;
      setRooms(data);

      data.forEach((value) => {
        io.emit("join-room", `chat:${value._id}`);
      });
    } else {
      alert(response.message);
    }
  };

  const fetchMessage = async (chatRoomId: string) => {
    const response = await getMessage(chatRoomId);
    if (response.success) {
      setMessages(response.data!);
    } else {
      alert(response.message);
    }
  };

  useEffect(() => {
    fetchChatRoom();
  }, []);

  useEffect(() => {
    if (!selectedRoom) return;

    fetchMessage(selectedRoom._id);
  }, [selectedRoom]);

  const handleSendMessage = async (content: string) => {
    if (!selectedRoom) return;

    const response = await sendMessage(selectedRoom._id, content);
    if (!response.success) {
      alert(response.message);
    }
  };

  // Socket
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("send-message", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("send-message");
    };
  }, []);

  return (
    <div className="h-screen flex bg-gray-100">
      {/* LEFT SIDEBAR */}
      <div className="w-1/4 border-r bg-white">
        <ChatRoomList
          rooms={rooms}
          selectedRoom={selectedRoom}
          onSelect={setSelectedRoom}
        />
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-3/4 flex flex-col">
        {selectedRoom ? (
          <>
            <div className="p-4 border-b bg-white font-semibold text-lg">
              {selectedRoom.roomName}
            </div>

            <MessageList messages={messages} />

            <MessageInput onSend={handleSendMessage} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a chat room to start
          </div>
        )}
      </div>
    </div>
  );
}
