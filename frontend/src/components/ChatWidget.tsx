import React, { useState } from "react";

const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState([
    { sender: "system", text: "Welcome to the LiTreeLabStudio™ chat!" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
  };

  return (
    <div className="bg-[#181825] rounded-xl shadow-lg p-4 w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-2">Chat</h2>
      <div className="h-40 overflow-y-auto bg-black/30 rounded p-2 mb-2 text-sm">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.sender === "user" ? "text-right text-blue-300" : "text-left text-green-300"}>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          className="flex-1 rounded p-2 bg-[#22223b] text-white border border-gray-700"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit" className="bg-blue-600 px-4 py-2 rounded text-white font-bold">Send</button>
      </form>
    </div>
  );
};

export default ChatWidget;
