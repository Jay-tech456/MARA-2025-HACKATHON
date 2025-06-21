import { useState } from "react";
import { MapPin, User, Zap, Gauge, Package, Search } from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface RentedSystem {
  id: string;
  name: string;
  username?: string;
  userId?: string;
  location?: string;
  computePower: string;
  memory: string;
  hashrate?: number;
  power?: number;
  efficiency?: number;
  dailyRentalPrice?: number;
  estimatedTotalDailyPrice?: number;
  hoursUsed: number;
  hourlyRate: number;
  amountRented: number;
  status: "Running" | "Idle";
  startTime: string;
}

const mockRentedSystems: RentedSystem[] = [
  {
    id: "asic-002",
    name: "AIChip Accelerator V3",
    username: "TechGuru",
    userId: "TG456",
    location: "California, USA",
    computePower: "250 TOPS",
    memory: "64 GB HBM2",
    hashrate: 250,
    power: 4500,
    efficiency: 18.0,
    dailyRentalPrice: 0.072,
    estimatedTotalDailyPrice: 18.00,
    hoursUsed: 12.5,
    hourlyRate: 0.75,
    amountRented: 2,
    status: "Running",
    startTime: "2024-06-20 14:30",
  },
  {
    id: "asic-001",
    name: "PowerMiner Pro X1",
    username: "CryptoMiner123",
    userId: "CM123",
    location: "Texas, USA",
    computePower: "100 TH/s",
    memory: "32 GB DDR4",
    hashrate: 100,
    power: 3250,
    efficiency: 32.5,
    dailyRentalPrice: 0.125,
    estimatedTotalDailyPrice: 12.50,
    hoursUsed: 6.2,
    hourlyRate: 0.52,
    amountRented: 1,
    status: "Idle",
    startTime: "2024-06-21 09:15",
  },
];

const RentedPage = () => {
  const [rentedSystems, setRentedSystems] = useState(mockRentedSystems);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");

  const handleRemoveSystem = (systemId: string) => {
    setRentedSystems((prev) => prev.filter((system) => system.id !== systemId));
    console.log(`Redirecting to checkout for system ${systemId}`);
  };

  // Filter systems based on search term
  const filteredSystems = rentedSystems.filter(system => 
    system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    system.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (system.username && system.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (system.userId && system.userId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (system.location && system.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort systems based on selected criteria
  const sortedSystems = [...filteredSystems].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.hoursUsed * a.hourlyRate * a.amountRented) - (b.hoursUsed * b.hourlyRate * b.amountRented);
      case "price-high":
        return (b.hoursUsed * b.hourlyRate * b.amountRented) - (a.hoursUsed * a.hourlyRate * a.amountRented);
      case "compute-low":
        return parseFloat(a.computePower) - parseFloat(b.computePower);
      case "compute-high":
        return parseFloat(b.computePower) - parseFloat(a.computePower);
      case "hashrate-low":
        return (a.hashrate || 0) - (b.hashrate || 0);
      case "hashrate-high":
        return (b.hashrate || 0) - (a.hashrate || 0);
      default:
        return 0;
    }
  });

  const totalCost = sortedSystems.reduce(
    (total, system) => total + (system.hoursUsed * system.hourlyRate * system.amountRented),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 pb-20 px-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Rented Systems
          </h1>
          <p className="text-gray-600">
            Manage your active ASIC rentals and view usage statistics
          </p>
          <div className="mt-4 inline-block bg-white rounded-lg px-6 py-3 shadow-md">
            <span className="text-sm text-gray-600">Total Cost: </span>
            <span className="text-xl font-bold text-purple-600">
              ${totalCost.toFixed(2)}
            </span>
          </div>
        </div>

        {rentedSystems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Active Rentals
            </h3>
            <p className="text-gray-600 mb-6">
              You don't have any ASIC systems rented yet.
            </p>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
              Browse Available Systems
            </button>
          </div>
        ) : (
          <>
            {/* Search and Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Search by username, user ID, system name, system ID, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">Total Cost (Low to High)</SelectItem>
                  <SelectItem value="price-high">Total Cost (High to Low)</SelectItem>
                  <SelectItem value="compute-low">Compute Power (Low to High)</SelectItem>
                  <SelectItem value="compute-high">Compute Power (High to Low)</SelectItem>
                  <SelectItem value="hashrate-low">Hashrate (Low to High)</SelectItem>
                  <SelectItem value="hashrate-high">Hashrate (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
              {sortedSystems.map((system) => (
                <div
                  key={system.id}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {system.name}
                      </h3>
                      {system.username && (
                        <div className="flex items-center mb-1 text-sm text-gray-600">
                          <User size={14} className="mr-1" />
                          {system.username} ({system.userId})
                        </div>
                      )}
                      {system.location && (
                        <div className="flex items-center mb-2 text-sm text-gray-600">
                          <MapPin size={14} className="mr-1" />
                          {system.location}
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            system.status === "Running"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {system.status === "Running" ? "🟢 Running" : "⏸️ Idle"}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          <Package size={12} className="mr-1" />
                          {system.amountRented} units rented
                        </span>
                        <span className="text-sm text-gray-500">
                          Started: {system.startTime}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        ${(system.hoursUsed * system.hourlyRate * system.amountRented).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">total cost</div>
                      <div className="text-sm text-gray-400">
                        (${system.hourlyRate.toFixed(2)}/hr × {system.amountRented} units)
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Compute Power</div>
                      <div className="font-semibold">{system.computePower}</div>
                    </div>
                    {system.hashrate && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">Hashrate</div>
                        <div className="font-semibold">{system.hashrate} TH/s</div>
                      </div>
                    )}
                    {system.power && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600 flex items-center">
                          <Zap size={12} className="mr-1" />
                          Power
                        </div>
                        <div className="font-semibold">{system.power} W</div>
                      </div>
                    )}
                    {system.efficiency && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600 flex items-center">
                          <Gauge size={12} className="mr-1" />
                          Efficiency
                        </div>
                        <div className="font-semibold">{system.efficiency} J/TH</div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Memory</div>
                      <div className="font-semibold">{system.memory}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Hours Used</div>
                      <div className="font-semibold">{system.hoursUsed}h</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Hourly Rate</div>
                      <div className="font-semibold">${system.hourlyRate.toFixed(2)}</div>
                    </div>
                    {system.dailyRentalPrice && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">Daily Rate</div>
                        <div className="font-semibold">${system.dailyRentalPrice.toFixed(3)}/TH/s</div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleRemoveSystem(system.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      End Rental & Checkout
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                      Download Report
                    </button>
                  </div>
                </div>
              ))}

              {sortedSystems.length === 0 && filteredSystems.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Systems Found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or clear the search to see all systems.
                  </p>
                </div>
              )}

              <div className="text-center mt-8">
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg">
                  Add More Systems
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RentedPage;
