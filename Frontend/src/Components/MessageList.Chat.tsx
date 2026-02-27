import type { Message } from "../Types/Chat.type";

interface Props {
  messages: Message[];
}

const MessageList = ({ messages }: Props) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.map((msg) => (
        <div key={msg._id} className="bg-blue-200 p-3 rounded-lg shadow-sm">
          <div className="text-sm font-semibold">{msg.fullname}</div>
          <div className="text-gray-700">{msg.content}</div>
          <div className="text-xs text-gray-400 mt-1">
            {new Date(msg.sendAt).toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
