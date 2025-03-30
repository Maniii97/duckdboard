import React, { useState, useRef, useEffect } from "react";
import { APIUsage, AWSServiceData, ChatMessage } from "../types";
import { CostData } from "../types";
import handleChat from "../api/chat/chat";
import ChatLoader from "./ChatLoader";

interface Props {
  costData: CostData[];
  awsServiceData: AWSServiceData[];
  apiUsage: APIUsage[];
}

export const Chatbot: React.FC<Props> = ({
  costData,
  awsServiceData,
  apiUsage,
}) => {
  let data = { costData, awsServiceData, apiUsage };
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I can help you analyze cloud costs and provide optimization recommendations. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    setIsLoading(true);
    const question = input + " data : " + JSON.stringify(data);
    const response = await handleChat(question);

    const assistantMessage: ChatMessage = {
      role: "assistant",
      content: response,
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);

  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-[400px] flex flex-col">
      <h2 className="text-xl font-semibold mb-4">AI Cost Analysis Assistant</h2>
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-4 border rounded-lg p-4"
      >
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
        {isLoading && (<ChatLoader />)}
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
