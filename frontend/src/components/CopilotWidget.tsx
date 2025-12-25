import React, { useState } from "react";

export default function CopilotWidget() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I’m your AI Copilot. Ask me anything!" }
  ]);

  const send = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    // TODO: Call backend copilot API and append response
  };

  return (
    <div className="rounded-xl shadow-lg p-4 bg-black/80 widget-header flex flex-col h-full">
      <h2 className="text-xl font-bold mb-2 font-mono">Copilot</h2>
      <div className="flex-1 overflow-y-auto mb-2 space-y-1">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left text-blue-300"}>
            <span className="inline-block px-2 py-1 rounded bg-gray-800 mb-1">{m.content}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 p-1 rounded text-black"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask Copilot..."
          onKeyDown={e => e.key === "Enter" && send()}
        />
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={send}>Send</button>
      </div>
    </div>
  );
}
