
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Car, CarTaxiFront, PalmtreeIcon, Users } from "lucide-react";

export type CabType = "economy" | "premium" | "luxury";

interface CabOption {
  id: CabType;
  name: string;
  description: string;
  price: number;
  icon: React.FC<{ className?: string }>;
  capacity: number;
  eta: string;
  features: string[];
}

interface RideOptionsProps {
  selected: CabType;
  onSelect: (type: CabType) => void;
  distance?: number; // in miles
}

const cabOptions: CabOption[] = [
  {
    id: "economy",
    name: "Economy",
    description: "Affordable rides for everyday",
    price: 1.5, // per mile
    icon: ({ className }) => <Car className={className} />,
    capacity: 4,
    eta: "3-5 min",
    features: ["Budget-friendly", "Compact vehicles", "Standard comfort"]
  },
  {
    id: "premium",
    name: "Premium",
    description: "Comfortable rides with extra space",
    price: 2.5, // per mile
    icon: ({ className }) => <CarTaxiFront className={className} />,
    capacity: 4,
    eta: "2-4 min",
    features: ["Higher comfort", "Newer vehicles", "Professional drivers"]
  },
  {
    id: "luxury",
    name: "Luxury",
    description: "Luxury cars for special occasions",
    price: 4.0, // per mile
    icon: ({ className }) => <PalmtreeIcon className={className} />,
    capacity: 4,
    eta: "4-6 min",
    features: ["Premium vehicles", "Top-tier comfort", "Complimentary water", "Extra amenities"]
  }
];

const RideOptions: React.FC<RideOptionsProps> = ({ selected, onSelect, distance = 5 }) => {
  const calculatePrice = (pricePerMile: number) => {
    const baseFare = 2.5;
    const estimatedPrice = baseFare + (pricePerMile * distance);
    return estimatedPrice.toFixed(2);
  };

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-medium">Choose your ride</h3>
      
      <div className="grid grid-cols-1 gap-3">
        {cabOptions.map((option) => {
          const isSelected = selected === option.id;
          const price = calculatePrice(option.price);
          
          return (
            <Button
              key={option.id}
              type="button"
              variant="outline"
              className={cn(
                "relative h-auto p-4 justify-start flex-col items-stretch text-left",
                isSelected ? "border-primary border-2" : ""
              )}
              onClick={() => onSelect(option.id)}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    isSelected ? "bg-primary/10 text-primary" : "bg-secondary text-foreground"
                  )}
                >
                  <option.icon className="h-6 w-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{option.name}</h4>
                    <span className="font-semibold">${price}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center">
                        <Users size={14} className="mr-1" />
                        {option.capacity}
                      </span>
                      <span>•</span>
                      <span>ETA {option.eta}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {isSelected && (
                <div className="mt-3 pl-12 text-xs text-muted-foreground">
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="list-disc ml-4">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default RideOptions;
