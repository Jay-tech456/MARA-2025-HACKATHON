// @ts-nocheck
import { useState, useEffect } from 'react';
import AsicCard from './AsicCard';
import AddAsicForm from './AddAsicForm';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Search, Loader2 } from 'lucide-react';

interface AvailablePageProps {
  onRentSystem: (systemId: string, amount: number) => void;
}

const AvailablePage = ({ onRentSystem }: AvailablePageProps) => {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Fetch data from API
  useEffect(() => {
    const fetchAsicData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:5000/asic-data');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Transform API data to match expected format
        const transformedData = data.map((item: any, index: number) => ({
          id: `asic-${String(index + 1).padStart(3, '0')}`,
          name: item.Model || 'Unknown Model',
          username: item.Username || 'Unknown User',
          userId: item['User ID'] || 'Unknown ID',
          location: item.Location || 'Unknown Location',
          computePower: `${item['Hashrate (TH/s)'] || 0} TH/s`,
          memory: '32 GB DDR4', // Default value since not in API
          uptime: '99.9%', // Default value since not in API
          hashrate: item['Hashrate (TH/s)'] || 0,
          power: item['Power (W)'] || 0,
          efficiency:
            item['Power (W)'] && item['Hashrate (TH/s)']
              ? (item['Hashrate (TH/s)'] / (item['Power (W)'] / 1000)).toFixed(
                  1
                )
              : 0,
          dailyRentalPrice: item['Estimated Total Daily Rental Price ($)'] || 0,
          estimatedTotalDailyPrice:
            item['Estimated Total Daily Rental Price ($)'] || 0,
          hourlyRate: item['Estimated Hourly Rental Price ($)'] || 0,
          available: (item['Quantity Available'] || 0) > 0,
          amountAvailable: item['Quantity Available'] || 0,
          tags: ['High Efficiency', 'Mining Optimized'], // Default tags
          // Additional fields from API
          hostname: item.Hostname,
          ipAddress: item['IP Address'],
          password: item.Password,
          port: item.Port,
        }));

        setSystems(transformedData);
      } catch (err) {
        console.error('Error fetching ASIC data:', err);
        setError(err.message || 'Failed to fetch ASIC data');
      } finally {
        setLoading(false);
      }
    };

    fetchAsicData();
  }, []);

  const handleAddSystem = (newSystem: any) => {
    setSystems((prev) => [...prev, newSystem]);
  };

  const handleRentSystem = (systemId: string, amount: number) => {
    setSystems((prev) =>
      prev.map((system) =>
        system.id === systemId
          ? {
              ...system,
              amountAvailable: Math.max(
                0,
                (system.amountAvailable || 0) - amount
              ),
              available: (system.amountAvailable || 0) - amount > 0,
            }
          : system
      )
    );
    onRentSystem(systemId, amount);
  };

  // Filter systems based on search term
  const filteredSystems = systems.filter(
    (system) =>
      system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (system.username &&
        system.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (system.userId &&
        system.userId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (system.location &&
        system.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort systems based on selected criteria
  const sortedSystems = [...filteredSystems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.dailyRentalPrice || 0) - (b.dailyRentalPrice || 0);
      case 'price-high':
        return (b.dailyRentalPrice || 0) - (a.dailyRentalPrice || 0);
      case 'compute-low':
        return parseFloat(a.computePower) - parseFloat(b.computePower);
      case 'compute-high':
        return parseFloat(b.computePower) - parseFloat(a.computePower);
      case 'hashrate-low':
        return (a.hashrate || 0) - (b.hashrate || 0);
      case 'hashrate-high':
        return (b.hashrate || 0) - (a.hashrate || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading ASIC systems...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
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
              <SelectItem value="compute-low">
                Compute Power (Low to High)
              </SelectItem>
              <SelectItem value="compute-high">
                Compute Power (High to Low)
              </SelectItem>
              <SelectItem value="hashrate-low">
                Hashrate (Low to High)
              </SelectItem>
              <SelectItem value="hashrate-high">
                Hashrate (High to Low)
              </SelectItem>
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
              Try adjusting your search criteria or clear the search to see all
              systems.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailablePage;
