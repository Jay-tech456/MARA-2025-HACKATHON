import { useState } from "react";
import AsicCard from "./AsicCard";
import AddAsicForm from "./AddAsicForm";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search } from "lucide-react";

const mockAsicSystems = [
  {
    id: "asic-001",
    name: "PowerMiner Pro X1",
    username: "CryptoMiner123",
    userId: "CM123",
    location: "Texas, USA",
    computePower: "100 TH/s",
    memory: "32 GB DDR4",
    uptime: "99.9%",
    hashrate: 100,
    power: 3250,
    efficiency: 32.5,
    dailyRentalPrice: 0.125,
    estimatedTotalDailyPrice: 12.50,
    hourlyRate: 0.52,
    available: true,
    amountAvailable: 5,
    tags: ["High Efficiency", "Mining Optimized"],
  },
  {
    id: "asic-002",
    name: "AIChip Accelerator V3",
    username: "TechGuru",
    userId: "TG456",
    location: "California, USA",
    computePower: "250 TOPS",
    memory: "64 GB HBM2",
    uptime: "99.7%",
    hashrate: 250,
    power: 4500,
    efficiency: 18.0,
    dailyRentalPrice: 0.072,
    estimatedTotalDailyPrice: 18.00,
    hourlyRate: 0.75,
    available: true,
    amountAvailable: 3,
    tags: ["AI/ML Ready", "High Performance"],
  },
  {
    id: "asic-003",
    name: "CryptoForge Elite",
    username: "MiningPro",
    userId: "MP789",
    location: "Nevada, USA",
    computePower: "150 TH/s",
    memory: "16 GB DDR4",
    uptime: "99.5%",
    hashrate: 150,
    power: 2800,
    efficiency: 18.7,
    dailyRentalPrice: 0.058,
    estimatedTotalDailyPrice: 8.75,
    hourlyRate: 0.36,
    available: false,
    amountAvailable: 0,
    tags: ["Budget-Friendly", "Energy Efficient"],
  },
  {
    id: "asic-004",
    name: "QuantumHash X2",
    username: "HashMaster",
    userId: "HM101",
    location: "Washington, USA",
    computePower: "300 TH/s",
    memory: "128 GB DDR5",
    uptime: "99.8%",
    hashrate: 300,
    power: 7200,
    efficiency: 24.0,
    dailyRentalPrice: 0.083,
    estimatedTotalDailyPrice: 25.00,
    hourlyRate: 1.04,
    available: true,
    amountAvailable: 2,
    tags: ["Premium", "Ultra High Speed"],
  },
];

interface AvailablePageProps {
  onRentSystem: (systemId: string, amount: number) => void;
}

const AvailablePage = ({ onRentSystem }: AvailablePageProps) => {
  const [systems, setSystems] = useState(mockAsicSystems);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");

  const handleAddSystem = (newSystem: any) => {
    setSystems(prev => [...prev, newSystem]);
  };

  const handleRentSystem = (systemId: string, amount: number) => {
    setSystems(prev => 
      prev.map(system => 
        system.id === systemId 
          ? { 
              ...system, 
              amountAvailable: Math.max(0, (system.amountAvailable || 0) - amount),
              available: (system.amountAvailable || 0) - amount > 0
            }
          : system
      )
    );
    onRentSystem(systemId, amount);
  };

  // Filter systems based on search term
  const filteredSystems = systems.filter(system => 
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
        return (a.dailyRentalPrice || 0) - (b.dailyRentalPrice || 0);
      case "price-high":
        return (b.dailyRentalPrice || 0) - (a.dailyRentalPrice || 0);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20 px-4">
      <div className="max-w-6xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Available ASIC Systems
            </h1>
            <p className="text-gray-600">
              Choose from our fleet of high-performance computing systems
            </p>
          </div>
          <AddAsicForm onAddSystem={handleAddSystem} />
        </div>

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
              <SelectItem value="price-low">Price (Low to High)</SelectItem>
              <SelectItem value="price-high">Price (High to Low)</SelectItem>
              <SelectItem value="compute-low">Compute Power (Low to High)</SelectItem>
              <SelectItem value="compute-high">Compute Power (High to Low)</SelectItem>
              <SelectItem value="hashrate-low">Hashrate (Low to High)</SelectItem>
              <SelectItem value="hashrate-high">Hashrate (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSystems.map((system) => (
            <AsicCard
              key={system.id}
              system={system}
              onRent={handleRentSystem}
            />
          ))}
        </div>

        {sortedSystems.length === 0 && (
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
      </div>
    </div>
  );
};

export default AvailablePage;
