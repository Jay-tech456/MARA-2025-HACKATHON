import { useState } from "react";
import { Bot } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  recommendation?: {
    systemName: string;
    reasoning: string;
    systemId: string;
  };
}

interface AssistantPageProps {
  onRentSystem: (systemId: string) => void;
}

const AssistantPage = ({ onRentSystem }: AssistantPageProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your ASIC rental assistant. Tell me about your use case and I'll recommend the perfect system for you!",
      isBot: true,
    },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Based on your requirements, I recommend the AIChip Accelerator V3. It's perfect for machine learning workloads with its 250 TOPS compute power and 64GB HBM2 memory.",
        isBot: true,
        recommendation: {
          systemName: "AIChip Accelerator V3",
          reasoning: "High compute power and memory capacity ideal for AI/ML tasks",
          systemId: "asic-002",
        },
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);

    setInputText("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 pb-20 px-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Bot size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Smart ASIC Assistant
          </h1>
          <p className="text-gray-600">
            Get personalized recommendations for your computing needs
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg h-96 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isBot
                      ? "bg-gray-100 text-gray-900"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  <p>{message.text}</p>
                  
                  {message.recommendation && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-1">
                        Recommended: {message.recommendation.systemName}
                      </h4>
                      <p className="text-sm text-green-700 mb-3">
                        {message.recommendation.reasoning}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onRentSystem(message.recommendation!.systemId)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          Rent Now
                        </button>
                        <button className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200 transition-colors">
                          Compare Alternatives
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Describe your use case (e.g., training a deep learning model)..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;
