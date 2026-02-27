import type React from "react";
import type { ChatRoom } from "../Types/Chat.type";
import type { SetStateAction } from "react";

interface Props {
  rooms: ChatRoom[];
  selectedRoom: ChatRoom | null;
  onSelect: React.Dispatch<SetStateAction<ChatRoom | null>>;
}

const ChatRoomList = ({ rooms, selectedRoom, onSelect }: Props) => {
  return (
    <div>
      <div className="p-4 font-bold text-xl border-b">Chat Rooms</div>

      <div>
        {rooms.map((room) => (
          <div
            key={room._id}
            onClick={() => onSelect(room)}
            className={`p-4 cursor-pointer hover:bg-gray-100 transition ${
              selectedRoom?._id === room._id
                ? "bg-blue-100 border-r-4 border-blue-500"
                : ""
            }`}
          >
            {room.roomName}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatRoomList;
