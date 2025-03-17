
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Star, MapPin, Calendar, Car } from "lucide-react";

export interface Driver {
  id: string;
  name: string;
  photo: string;
  phone: string;
  rating: number;
  location: string;
  carModel: string;
  carNumber: string;
  experience: string;
  status: "active" | "inactive" | "on-ride";
  completedRides: number;
}

interface DriverDetailsProps {
  driver: Driver;
}

const DriverDetails: React.FC<DriverDetailsProps> = ({ driver }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "inactive":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "on-ride":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary">
              <AvatarImage src={driver.photo} alt={driver.name} />
              <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{driver.name}</CardTitle>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="text-sm">{driver.rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground ml-2">({driver.completedRides} rides)</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(driver.status)}>
            {driver.status === "on-ride" ? "On Ride" : driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">{driver.phone}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">{driver.location}</span>
          </div>
          <div className="flex items-center">
            <Car className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">{driver.carModel} ({driver.carNumber})</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">{driver.experience} experience</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full">
          View Full Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DriverDetails;
