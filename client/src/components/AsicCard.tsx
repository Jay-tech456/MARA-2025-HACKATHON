
import { useState } from "react";
import { MapPin, User, Zap, Gauge, Package } from "lucide-react";
import RentAmountForm from "./RentAmountForm";

interface AsicSystem {
  id: string;
  name: string;
  username?: string;
  userId?: string;
  location?: string;
  computePower: string;
  memory: string;
  uptime: string;
  hashrate?: number;
  power?: number;
  efficiency?: number;
  dailyRentalPrice?: number;
  estimatedTotalDailyPrice?: number;
  hourlyRate: number;
  available: boolean;
  amountAvailable?: number;
  tags: string[];
}

interface AsicCardProps {
  system: AsicSystem;
  onRent?: (id: string, amount: number) => void;
  showRentButton?: boolean;
}

const AsicCard = ({ system, onRent, showRentButton = true }: AsicCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleRent = (systemId: string, amount: number) => {
    onRent?.(systemId, amount);
  };

  return (
    <div
      className={`bg-white rounded-xl p-6 border border-gray-200 transition-all duration-300 hover:shadow-lg ${
        isHovered ? "transform scale-105" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{system.name}</h3>
          {system.username && (
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <User size={14} className="mr-1" />
              {system.username} ({system.userId})
            </div>
          )}
          {system.location && (
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <MapPin size={14} className="mr-1" />
              {system.location}
            </div>
          )}
          <div className="flex items-center mt-1 gap-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                system.available
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {system.available ? "✅ Available" : "🔴 Busy"}
            </span>
            {system.amountAvailable && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Package size={12} className="mr-1" />
                {system.amountAvailable} units
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            ${system.hourlyRate.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">per hour</div>
          {system.estimatedTotalDailyPrice && (
            <div className="text-sm text-gray-600 mt-1">
              ${system.estimatedTotalDailyPrice.toFixed(2)}/day
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Compute Power:</span>
          <span className="font-medium">{system.computePower}</span>
        </div>
        {system.hashrate && (
          <div className="flex justify-between">
            <span className="text-gray-600">Hashrate:</span>
            <span className="font-medium">{system.hashrate} TH/s</span>
          </div>
        )}
        {system.power && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Power:</span>
            <span className="font-medium flex items-center">
              <Zap size={14} className="mr-1" />
              {system.power} W
            </span>
          </div>
        )}
        {system.efficiency && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Efficiency:</span>
            <span className="font-medium flex items-center">
              <Gauge size={14} className="mr-1" />
              {system.efficiency} J/TH
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Memory:</span>
          <span className="font-medium">{system.memory}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Uptime:</span>
          <span className="font-medium">{system.uptime}</span>
        </div>
        {system.dailyRentalPrice && (
          <div className="flex justify-between">
            <span className="text-gray-600">Daily Rate:</span>
            <span className="font-medium">${system.dailyRentalPrice.toFixed(3)}/TH/s/day</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {system.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {showRentButton && (
        <RentAmountForm
          system={system}
          onRent={handleRent}
          maxAmount={system.amountAvailable || 0}
        />
      )}
    </div>
  );
};

export default AsicCard;
