import React, { useState } from "react";
import { MessageCircle, Send, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatInterfaceProps {
  onMessageSubmit: (message: string) => void;
  userRequest: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onMessageSubmit,
  userRequest,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi! I'm here to help you create the perfect video greeting. Tell me what you'd like to create!",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const examplePrompts = [
    "Create a happy birthday video for my mom",
    "Make a Diwali greeting for my best friend Priya",
    "Generate a wedding congratulations video",
    "Create an anniversary message for my partner",
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    onMessageSubmit(inputValue);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Great! I'll help you create that. Once you upload a photo or video on the left, click 'Generate Video' to start creating your greeting!",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 800);
  };

  const handleExampleClick = (prompt: string) => {
    setInputValue(prompt);
    // Auto-submit the example prompt
    const userMessage: Message = {
      id: Date.now().toString(),
      text: prompt,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    onMessageSubmit(prompt);
    setInputValue("");

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Perfect! I understand what you want to create. Upload a photo or video on the left, then click 'Generate Video' to bring your greeting to life!",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-orange-500 rounded-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">AI Assistant</h3>
          <p className="text-sm text-gray-500">
            Describe what you want to create
          </p>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-purple-500 to-orange-500 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}

        {/* Example Prompts (only show if no user messages yet) */}
        {messages.length === 1 && (
          <div className="space-y-2 mt-4">
            <p className="text-xs text-gray-500 font-medium">
              Try these examples:
            </p>
            {examplePrompts.map((prompt, index) => (
              <Card
                key={index}
                className="p-3 cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 border border-gray-200"
                onClick={() => handleExampleClick(prompt)}
              >
                <div className="flex items-start gap-2">
                  <MessageCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{prompt}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          className="flex-1"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
          size="icon"
          className="bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
