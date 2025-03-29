import React, { useState } from "react";
import { ChatMessage } from "../types";

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I can help you analyze cloud costs and provide optimization recommendations. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
    };

    const assistantMessage: ChatMessage = {
      role: "assistant",
      content:
        "I apologize, but I am currently in demo mode. In a production environment, I would analyze your cloud costs and provide detailed recommendations.",
    };

    setMessages([...messages, userMessage, assistantMessage]);
    setInput("");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">AI Cost Analysis Assistant</h2>
      <div className="h-[300px] overflow-y-auto mb-4 border rounded-lg p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about cloud costs..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </form>
    </div>
  );
};
