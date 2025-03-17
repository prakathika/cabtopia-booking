
import React, { useState } from "react";
import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DriverDetails, { Driver } from "./DriverDetails";

// Tamil Nadu drivers sample data
const driversData: Driver[] = [
  {
    id: "1",
    name: "Rajkumar Subramaniam",
    photo: "https://source.unsplash.com/photo-1581092795360-fd1ca04f0952",
    phone: "+91 94865 12345",
    rating: 4.8,
    location: "Chennai, Tamil Nadu",
    carModel: "Maruti Swift Dzire",
    carNumber: "TN 01 AX 2345",
    experience: "5 years",
    status: "active",
    completedRides: 583
  },
  {
    id: "2",
    name: "Anitha Krishnan",
    photo: "https://source.unsplash.com/photo-1649972904349-6e44c42644a7",
    phone: "+91 73339 28754",
    rating: 4.7,
    location: "Coimbatore, Tamil Nadu",
    carModel: "Honda City",
    carNumber: "TN 37 BF 9807",
    experience: "3 years",
    status: "on-ride",
    completedRides: 412
  },
  {
    id: "3",
    name: "Venkatesh Murugan",
    photo: "https://source.unsplash.com/photo-1581091226825-a6a2a5aee158",
    phone: "+91 98432 67123",
    rating: 4.5,
    location: "Madurai, Tamil Nadu",
    carModel: "Hyundai Xcent",
    carNumber: "TN 59 HG 6543",
    experience: "4 years",
    status: "active",
    completedRides: 497
  },
  {
    id: "4",
    name: "Priya Chandrasekhar",
    photo: "https://source.unsplash.com/photo-1581092795360-fd1ca04f0952",
    phone: "+91 85671 45678",
    rating: 4.9,
    location: "Salem, Tamil Nadu",
    carModel: "Toyota Etios",
    carNumber: "TN 27 CT 4362",
    experience: "6 years",
    status: "inactive",
    completedRides: 721
  },
  {
    id: "5",
    name: "Senthil Kumar",
    photo: "https://source.unsplash.com/photo-1581091226825-a6a2a5aee158",
    phone: "+91 94432 87654",
    rating: 4.6,
    location: "Tiruchirappalli, Tamil Nadu",
    carModel: "Maruti Ertiga",
    carNumber: "TN 45 KL 7890",
    experience: "2 years",
    status: "active",
    completedRides: 289
  }
];

const AdminDrivers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  
  // Filter drivers based on search term and tab
  const filteredDrivers = driversData.filter(driver => {
    // Apply tab filter
    if (currentTab !== "all" && driver.status !== currentTab) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        driver.name.toLowerCase().includes(searchLower) ||
        driver.carModel.toLowerCase().includes(searchLower) ||
        driver.carNumber.toLowerCase().includes(searchLower) ||
        driver.location.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Search drivers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
          {searchTerm && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Button variant="outline" size="icon" className="h-10 w-10">
          <Filter size={18} />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" onValueChange={setCurrentTab}>
        <TabsList className="grid grid-cols-4 w-full sm:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="on-ride">On Ride</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        <TabsContent value={currentTab} className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredDrivers.map(driver => (
              <DriverDetails key={driver.id} driver={driver} />
            ))}

            {filteredDrivers.length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">
                  No drivers found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDrivers;
