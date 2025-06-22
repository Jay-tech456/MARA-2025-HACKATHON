import { useState } from 'react';
import { Bot, Hash, Zap, DollarSign, Clock, TrendingUp } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  recommendation?: {
    top_3_asic_models: string[];
    key_metrics: {
      [modelName: string]: {
        cost_per_TH: number;
        joules_per_TH: number;
        estimated_daily_profit: number;
        tags: string[];
        recommended_pool?: string;
        pool_fee?: number;
        pool_features?: string[];
      };
    };
    recommended_rental_duration: string;
    budget_envelope: string;
    summary_of_trade_offs: {
      [modelName: string]: string;
    };
  };
}

interface AssistantPageProps {
  onRentSystem: (systemId: string) => void;
}

const AssistantPage = ({ onRentSystem }: AssistantPageProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your ASIC rental assistant. Tell me about your use case and I'll recommend the perfect system for you!",
      isBot: true,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: `session_${Date.now()}`, // Generate a unique session ID
          message: inputText,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Try to parse the response as JSON if it's a string
      let recommendation = null;
      let responseText =
        data.response ||
        "I'm sorry, I couldn't process your request at the moment.";

      // Check if the response contains JSON
      if (typeof responseText === 'string' && responseText.includes('{')) {
        try {
          // Extract JSON from the response
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsedJson = JSON.parse(jsonMatch[0]);
            recommendation = parsedJson;
            // Update response text to be more user-friendly
            responseText =
              'Here are your personalized ASIC recommendations based on your requirements:';
          }
        } catch (parseError) {
          console.log('Could not parse JSON from response:', parseError);
        }
      }

      // If recommendation is still null, check if it's in the data structure
      if (!recommendation && data.recommendation) {
        recommendation = data.recommendation;
      }

      // Create bot message based on the API response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isBot: true,
        recommendation: recommendation,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling API:', error);

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting to my systems right now. Please try again later.",
        isBot: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInputText('');
    }
  };

  const renderRecommendation = (recommendation: Message['recommendation']) => {
    if (!recommendation) return null;

    return (
      <div className="mt-6 space-y-4">
        {/* Header Card */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                ASIC Recommendations
              </h3>
              <p className="text-gray-600 text-sm">
                Optimized for your mining requirements
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {recommendation.recommended_rental_duration}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {recommendation.budget_envelope}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Models */}
        <div className="space-y-4">
          {recommendation.top_3_asic_models.map((modelName, index) => {
            const metrics = recommendation.key_metrics[modelName];
            const tradeOff = recommendation.summary_of_trade_offs[modelName];

            return (
              <div
                key={modelName}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Header with ranking */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        index === 0
                          ? 'bg-yellow-500'
                          : index === 1
                          ? 'bg-gray-400'
                          : 'bg-orange-500'
                      }`}
                    >
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {modelName}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Ranked by efficiency & ROI
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      onRentSystem(modelName.toLowerCase().replace(/\s+/g, '-'))
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Rent Now
                  </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {metrics.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                      <DollarSign size={16} />
                      <span className="text-xs font-medium">Cost/TH</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      ${metrics.cost_per_TH}
                    </div>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                      <Zap size={16} />
                      <span className="text-xs font-medium">Efficiency</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {metrics.joules_per_TH}
                    </div>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                      <TrendingUp size={16} />
                      <span className="text-xs font-medium">Daily Profit</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {metrics.estimated_daily_profit.toFixed(6)}
                    </div>
                  </div>
                </div>

                {/* Trade-off */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">i</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">
                        Key Consideration
                      </h5>
                      <p className="text-gray-600 text-sm">{tradeOff}</p>
                    </div>
                  </div>
                </div>

                {/* Mining Pool Recommendation */}
                {metrics.recommended_pool && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">⛏️</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-blue-800 mb-1">
                          Recommended Mining Pool
                        </h5>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-blue-900">
                            {metrics.recommended_pool}
                          </span>
                          {metrics.pool_fee && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                              {metrics.pool_fee}% fee
                            </span>
                          )}
                        </div>
                        {metrics.pool_features &&
                          metrics.pool_features.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {metrics.pool_features.map(
                                (feature, featureIndex) => (
                                  <span
                                    key={featureIndex}
                                    className="px-2 py-1 bg-white text-blue-700 text-xs rounded-full border border-blue-200"
                                  >
                                    {feature}
                                  </span>
                                )
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary Footer */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Ready to Start Mining?
            </h4>
            <p className="text-gray-600 text-sm mb-4">
              Choose your preferred ASIC model above to begin your mining
              journey. All models are optimized for maximum efficiency and
              profitability.
            </p>
            <div className="flex justify-center gap-4">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Instant Setup</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Flexible Duration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
                className={`flex ${
                  message.isBot ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-2xl px-4 py-2 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <p>{message.text}</p>
                  {message.recommendation &&
                    renderRecommendation(message.recommendation)}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-100 text-gray-900">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                    <span className="text-sm">
                      Analyzing your requirements...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Describe your use case (e.g., I need to mine Bitcoin with a budget of $200/day)..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputText.trim()}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;
