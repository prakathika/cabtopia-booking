
import React, { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import { format } from "date-fns";
import { Car, CheckCircle, Clock, MapPin, CalendarClock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { getUserBookings, onUserBookingsChange } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import RideDetails from "./RideDetails";

interface RideHistoryProps {
  limit?: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "in-progress":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "pending":
    default:
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle size={14} className="mr-1" />;
    case "cancelled":
      return <AlertCircle size={14} className="mr-1" />;
    case "in-progress":
      return <Car size={14} className="mr-1" />;
    case "pending":
    default:
      return <Clock size={14} className="mr-1" />;
  }
};

const RideHistory: React.FC<RideHistoryProps> = ({ limit }) => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<DocumentData | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!currentUser) return;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const userBookings = await getUserBookings(currentUser.uid);
        setBookings(userBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load your bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchBookings();

    // Set up real-time listener
    const unsubscribe = onUserBookingsChange(currentUser.uid, (updatedBookings) => {
      setBookings(updatedBookings);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Handle opening ride details
  const handleViewDetails = (booking: DocumentData) => {
    // If the booking doesn't have driver info and status is in-progress,
    // add sample driver info (in a real app, this would be fetched from database)
    if (booking.status === "in-progress" && !booking.driverId) {
      const bookingWithDriver = {
        ...booking,
        driverId: "driver-1",
        driverName: "Rajesh Kumar",
        driverPhoto: "https://i.pravatar.cc/150?img=32",
        driverPhone: "+91 9876543210",
        driverRating: 4.7,
        driverLocation: "New Delhi, India",
        carModel: "Maruti Suzuki Swift",
        carNumber: "DL 01 AB 1234",
        driverExperience: "5 years",
        driverCompletedRides: 320
      };
      setSelectedBooking(bookingWithDriver);
    } else {
      setSelectedBooking(booking);
    }
    setDetailsOpen(true);
  };

  // Filter bookings based on tab
  const getFilteredBookings = () => {
    if (activeTab === "all") {
      return limit ? bookings.slice(0, limit) : bookings;
    }
    
    const filtered = bookings.filter(booking => {
      switch (activeTab) {
        case "upcoming":
          return booking.status === "pending";
        case "active":
          return booking.status === "in-progress";
        case "completed":
          return booking.status === "completed";
        case "cancelled":
          return booking.status === "cancelled";
        default:
          return true;
      }
    });
    
    return limit ? filtered.slice(0, limit) : filtered;
  };

  // Handle booking update after cancellation
  const handleBookingUpdate = (updatedBooking: DocumentData) => {
    setSelectedBooking(updatedBooking);
    // The real-time listener will update the list automatically
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 bg-muted rounded-md w-2/3 mb-2"></div>
              <div className="h-4 bg-muted rounded-md w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded-md w-full"></div>
                <div className="h-4 bg-muted rounded-md w-full"></div>
                <div className="h-4 bg-muted rounded-md w-3/4"></div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="h-6 bg-muted rounded-md w-1/4"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-10">
          <Car className="mx-auto mb-4 text-muted-foreground" size={40} />
          <h3 className="text-xl font-medium mb-1">No rides yet</h3>
          <p className="text-muted-foreground">
            You haven't booked any rides yet. Start your journey now!
          </p>
          <Link to="/book">
            <Button className="mt-4">Book a Ride</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Add tabs if not limited
  if (!limit) {
    return (
      <>
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-4">
              {renderBookings(getFilteredBookings())}
            </div>
          </TabsContent>
        </Tabs>
        
        {selectedBooking && (
          <RideDetails 
            booking={selectedBooking} 
            open={detailsOpen} 
            onOpenChange={setDetailsOpen} 
          />
        )}
      </>
    );
  }

  // Limited view for profile page
  return (
    <>
      <div className="space-y-4">
        {renderBookings(getFilteredBookings())}
      </div>
      
      {selectedBooking && (
        <RideDetails 
          booking={selectedBooking} 
          open={detailsOpen} 
          onOpenChange={setDetailsOpen} 
        />
      )}
    </>
  );

  function renderBookings(bookings: DocumentData[]) {
    if (bookings.length === 0) {
      return (
        <Card>
          <CardContent className="text-center py-10">
            <AlertCircle className="mx-auto mb-4 text-muted-foreground" size={40} />
            <h3 className="text-xl font-medium mb-1">No rides found</h3>
            <p className="text-muted-foreground">
              {activeTab === "all" 
                ? "You haven't booked any rides yet." 
                : `You don't have any ${activeTab} rides.`}
            </p>
          </CardContent>
        </Card>
      );
    }
    
    return bookings.map((booking) => {
      const bookingDate = booking.date?.toDate ? booking.date.toDate() : new Date(booking.date);
      
      return (
        <Card key={booking.id} className="overflow-hidden animate-slide-in-up">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {booking.cabType.charAt(0).toUpperCase() + booking.cabType.slice(1)} Ride
              </CardTitle>
              <Badge 
                variant="outline" 
                className={cn("flex items-center", getStatusColor(booking.status))}
              >
                {getStatusIcon(booking.status)}
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>
            <CardDescription>
              Booking ID: {booking.bookingId?.slice(-6).toUpperCase() || booking.id?.slice(-6).toUpperCase()}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              <div className="flex">
                <div className="mr-2 flex flex-col items-center">
                  <div className="h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <div className="w-0.5 h-10 bg-border"></div>
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <MapPin className="h-3 w-3 text-primary-foreground" />
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <p className="text-sm font-medium line-clamp-1">From: {booking.pickupLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium line-clamp-1">To: {booking.dropoffLocation}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  <CalendarClock size={16} className="mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    {format(bookingDate, "MMM d, yyyy")} at {booking.time}
                  </span>
                </div>
                
                <div className="text-sm font-medium">
                  ₹{booking.price?.toFixed(2) || "N/A"}
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="pt-0">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => handleViewDetails(booking)}
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      );
    });
  }
};

export default RideHistory;
