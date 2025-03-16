
import React, { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import { format } from "date-fns";
import { 
  Car, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  MoreVertical, 
  Search, 
  X,
  CalendarClock,
  User
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllBookings, onAllBookingsChange, updateBookingStatus } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<DocumentData[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const allBookings = await getAllBookings();
        setBookings(allBookings);
        setFilteredBookings(allBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchBookings();

    // Set up real-time listener
    const unsubscribe = onAllBookingsChange((updatedBookings) => {
      setBookings(updatedBookings);
      filterBookings(updatedBookings, searchTerm, currentTab);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter bookings when search term or tab changes
  useEffect(() => {
    filterBookings(bookings, searchTerm, currentTab);
  }, [searchTerm, currentTab]);

  const filterBookings = (allBookings: DocumentData[], search: string, tab: string) => {
    let filtered = allBookings;
    
    // Apply tab filter
    if (tab !== "all") {
      filtered = filtered.filter(booking => booking.status === tab);
    }
    
    // Apply search filter
    if (search.trim() !== "") {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.userName?.toLowerCase().includes(searchLower) ||
        booking.pickupLocation?.toLowerCase().includes(searchLower) ||
        booking.dropoffLocation?.toLowerCase().includes(searchLower) ||
        booking.bookingId?.toLowerCase().includes(searchLower) ||
        booking.userPhone?.includes(search)
      );
    }
    
    setFilteredBookings(filtered);
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  const handleChangeStatus = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update booking status.");
    }
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
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Search bookings..."
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
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-4 w-full sm:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-10">
                <AlertCircle className="mx-auto mb-4 text-muted-foreground" size={40} />
                <h3 className="text-xl font-medium mb-1">No bookings found</h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? "No results match your search criteria." 
                    : "There are no bookings in the system."}
                </p>
              </CardContent>
            </Card>
          ) : (
            renderBookingsList(filteredBookings)
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-10">
                <AlertCircle className="mx-auto mb-4 text-muted-foreground" size={40} />
                <h3 className="text-xl font-medium mb-1">No pending bookings</h3>
                <p className="text-muted-foreground">
                  There are no pending bookings at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            renderBookingsList(filteredBookings)
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="mt-4">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-10">
                <AlertCircle className="mx-auto mb-4 text-muted-foreground" size={40} />
                <h3 className="text-xl font-medium mb-1">No in-progress bookings</h3>
                <p className="text-muted-foreground">
                  There are no rides in progress at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            renderBookingsList(filteredBookings)
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-10">
                <AlertCircle className="mx-auto mb-4 text-muted-foreground" size={40} />
                <h3 className="text-xl font-medium mb-1">No completed bookings</h3>
                <p className="text-muted-foreground">
                  There are no completed rides yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            renderBookingsList(filteredBookings)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  function renderBookingsList(bookings: DocumentData[]) {
    return (
      <div className="space-y-4">
        {bookings.map((booking) => {
          const bookingDate = booking.date?.toDate ? booking.date.toDate() : new Date(booking.date);
          
          return (
            <Card key={booking.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {booking.cabType.charAt(0).toUpperCase() + booking.cabType.slice(1)} Ride
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline" 
                      className={cn("flex items-center", getStatusColor(booking.status))}
                    >
                      {getStatusIcon(booking.status)}
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {booking.status !== "pending" && (
                          <DropdownMenuItem onClick={() => handleChangeStatus(booking.id, "pending")}>
                            <Clock size={16} className="mr-2" />
                            Set as Pending
                          </DropdownMenuItem>
                        )}
                        {booking.status !== "in-progress" && (
                          <DropdownMenuItem onClick={() => handleChangeStatus(booking.id, "in-progress")}>
                            <Car size={16} className="mr-2" />
                            Set as In Progress
                          </DropdownMenuItem>
                        )}
                        {booking.status !== "completed" && (
                          <DropdownMenuItem onClick={() => handleChangeStatus(booking.id, "completed")}>
                            <CheckCircle size={16} className="mr-2" />
                            Set as Completed
                          </DropdownMenuItem>
                        )}
                        {booking.status !== "cancelled" && (
                          <DropdownMenuItem 
                            onClick={() => handleChangeStatus(booking.id, "cancelled")}
                            className="text-destructive"
                          >
                            <AlertCircle size={16} className="mr-2" />
                            Cancel Ride
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardDescription>
                  Booking ID: {booking.bookingId?.slice(-6).toUpperCase() || booking.id?.slice(-6).toUpperCase()}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Customer Information */}
                  <div className="flex items-center">
                    <User size={16} className="mr-2 text-muted-foreground" />
                    <div className="space-x-1">
                      <span className="font-medium">{booking.userName}</span>
                      <span className="text-muted-foreground">|</span>
                      <span className="text-sm">{booking.userPhone}</span>
                      <span className="text-muted-foreground">|</span>
                      <span className="text-sm">{booking.userEmail}</span>
                    </div>
                  </div>
                  
                  {/* Ride Information */}
                  <div className="flex">
                    <div className="mr-2 flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                      <div className="w-0.5 h-10 bg-border"></div>
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Clock className="h-3 w-3 text-primary-foreground" />
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
                  
                  <div className="flex items-center justify-between">
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
                  
                  {booking.specialInstructions && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Notes:</span> {booking.specialInstructions}
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full">
                  View Full Details
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    );
  }
};

export default AdminBookings;
