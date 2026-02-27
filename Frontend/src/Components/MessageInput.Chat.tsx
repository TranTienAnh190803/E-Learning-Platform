import React, { useState } from "react";

interface Props {
  onSend: (content: string) => void;
}

const MessageInput = ({ onSend }: Props) => {
  const [content, setContent] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;
    onSend(content);
    setContent("");
  };

  return (
    <form className="p-4 border-t bg-white flex gap-2" onSubmit={handleSend}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter message..."
        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
        Send
      </button>
    </form>
  );
};

export default MessageInput;
