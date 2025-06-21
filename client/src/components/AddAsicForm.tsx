
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AddAsicFormProps {
  onAddSystem: (system: any) => void;
}

const AddAsicForm = ({ onAddSystem }: AddAsicFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    userId: "",
    location: "",
    model: "",
    hashrate: "",
    power: "",
    efficiency: "",
    dailyRentalPrice: "",
    amountAvailable: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateEstimatedPrices = () => {
    const hashrate = parseFloat(formData.hashrate) || 0;
    const dailyPrice = parseFloat(formData.dailyRentalPrice) || 0;
    
    const totalDailyPrice = hashrate * dailyPrice;
    const hourlyPrice = totalDailyPrice / 24;
    
    return {
      totalDailyPrice: totalDailyPrice.toFixed(2),
      hourlyPrice: hourlyPrice.toFixed(2)
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const estimates = calculateEstimatedPrices();
    
    const newSystem = {
      id: `asic-${Date.now()}`,
      name: formData.model,
      username: formData.username,
      userId: formData.userId,
      location: formData.location,
      computePower: `${formData.hashrate} TH/s`,
      memory: "N/A",
      uptime: "99.9%",
      hashrate: parseFloat(formData.hashrate),
      power: parseFloat(formData.power),
      efficiency: parseFloat(formData.efficiency),
      dailyRentalPrice: parseFloat(formData.dailyRentalPrice),
      estimatedTotalDailyPrice: parseFloat(estimates.totalDailyPrice),
      hourlyRate: parseFloat(estimates.hourlyPrice),
      available: true,
      amountAvailable: parseInt(formData.amountAvailable),
      tags: ["User Added", "Custom"],
    };

    onAddSystem(newSystem);
    setOpen(false);
    setFormData({
      username: "",
      userId: "",
      location: "",
      model: "",
      hashrate: "",
      power: "",
      efficiency: "",
      dailyRentalPrice: "",
      amountAvailable: "",
    });
  };

  const estimates = calculateEstimatedPrices();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg">
          + Add Your ASIC System
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Your ASIC System for Rent</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={formData.userId}
                onChange={(e) => handleInputChange("userId", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="hashrate">Hashrate (TH/s)</Label>
              <Input
                id="hashrate"
                type="number"
                step="0.1"
                value={formData.hashrate}
                onChange={(e) => handleInputChange("hashrate", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="power">Power (W)</Label>
              <Input
                id="power"
                type="number"
                value={formData.power}
                onChange={(e) => handleInputChange("power", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="efficiency">Efficiency (J/TH)</Label>
              <Input
                id="efficiency"
                type="number"
                step="0.1"
                value={formData.efficiency}
                onChange={(e) => handleInputChange("efficiency", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="dailyRentalPrice">Daily Rental Price ($/TH/s/day)</Label>
              <Input
                id="dailyRentalPrice"
                type="number"
                step="0.01"
                value={formData.dailyRentalPrice}
                onChange={(e) => handleInputChange("dailyRentalPrice", e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="amountAvailable">Amount Available</Label>
              <Input
                id="amountAvailable"
                type="number"
                min="1"
                value={formData.amountAvailable}
                onChange={(e) => handleInputChange("amountAvailable", e.target.value)}
                required
                placeholder="How many units are available for rent?"
              />
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Estimated Prices</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Estimated Total Daily Rental Price ($)</Label>
                <div className="text-xl font-bold text-blue-600">${estimates.totalDailyPrice}</div>
              </div>
              <div>
                <Label>Estimated Hourly Rental Price ($)</Label>
                <div className="text-xl font-bold text-green-600">${estimates.hourlyPrice}</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add System
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAsicForm;
