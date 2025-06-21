
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface RentAmountFormProps {
  system: any;
  onRent: (systemId: string, amount: number) => void;
  maxAmount: number;
}

const RentAmountForm = ({ system, onRent, maxAmount }: RentAmountFormProps) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRent(system.id, amount);
    setOpen(false);
    setAmount(1);
  };

  const totalCost = (system.hourlyRate * amount).toFixed(2);
  const dailyTotalCost = (system.estimatedTotalDailyPrice * amount).toFixed(2);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          disabled={!system.available || maxAmount === 0}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            system.available && maxAmount > 0
              ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {system.available && maxAmount > 0 ? "Rent Now" : "Not Available"}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rent {system.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Number of Units to Rent</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              max={maxAmount}
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Available: {maxAmount} units
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Cost Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Hourly rate per unit:</span>
                <span className="font-medium">${system.hourlyRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Units:</span>
                <span className="font-medium">{amount}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total hourly cost:</span>
                <span className="text-blue-600">${totalCost}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Estimated daily cost:</span>
                <span>${dailyTotalCost}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Confirm Rental
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

export default RentAmountForm;
