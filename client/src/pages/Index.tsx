
import { useState } from "react";
import Navigation from "../components/Navigation";
import AvailablePage from "../components/AvailablePage";
import AssistantPage from "../components/AssistantPage";
import RentedPage from "../components/RentedPage";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("available");

  const handleRentSystem = (systemId: string, amount: number = 1) => {
    console.log(`Renting system: ${systemId}, amount: ${amount}`);
    // In a real app, this would add the system to the user's rented systems
    setCurrentPage("rented");
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "available":
        return <AvailablePage onRentSystem={handleRentSystem} />;
      case "assistant":
        return <AssistantPage onRentSystem={handleRentSystem} />;
      case "rented":
        return <RentedPage />;
      default:
        return <AvailablePage onRentSystem={handleRentSystem} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentPage()}
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
};

export default Index;
