
import React, { useState } from "react";
import { format } from "date-fns";
import { DocumentData } from "firebase/firestore";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Car, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MapPin, 
  Calendar,
  IndianRupee,
  User,
  Phone,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { updateBookingStatus } from "@/lib/firebase";
import { toast } from "sonner";
import DriverDetails from "./DriverDetails";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RideDetailsProps {
  booking: DocumentData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RideDetails: React.FC<RideDetailsProps> = ({ booking, open, onOpenChange }) => {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  if (!booking) return null;

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
        return <CheckCircle size={16} className="mr-2" />;
      case "cancelled":
        return <AlertCircle size={16} className="mr-2" />;
      case "in-progress":
        return <Car size={16} className="mr-2" />;
      case "pending":
      default:
        return <Clock size={16} className="mr-2" />;
    }
  };

  const handleCancelBooking = async () => {
    try {
      setCancelling(true);
      await updateBookingStatus(booking.id, "cancelled");
      toast.success("Booking cancelled successfully");
      setCancelDialogOpen(false);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  const bookingDate = booking.date?.toDate ? booking.date.toDate() : new Date(booking.date);
  const canCancel = booking.status === "pending";
  const showDriverDetails = booking.status === "in-progress" && booking.driverId;

  // Sample driver data - in a real app, this would come from the database
  const driver = booking.driverId ? {
    id: booking.driverId || "driver-1",
    name: booking.driverName || "Rajesh Kumar",
    photo: booking.driverPhoto || "https://i.pravatar.cc/150?img=32",
    phone: booking.driverPhone || "+91 9876543210",
    rating: booking.driverRating || 4.7,
    location: booking.driverLocation || "New Delhi, India",
    carModel: booking.carModel || "Maruti Suzuki Swift",
    carNumber: booking.carNumber || "DL 01 AB 1234",
    experience: booking.driverExperience || "5 years",
    status: "on-ride" as const,
    completedRides: booking.driverCompletedRides || 320
  } : null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Ride Details</span>
              <Badge 
                variant="outline" 
                className={cn("flex items-center", getStatusColor(booking.status))}
              >
                {getStatusIcon(booking.status)}
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Booking ID: {booking.bookingId?.slice(-6).toUpperCase() || booking.id?.slice(-6).toUpperCase()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Ride Type */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Car className="h-5 w-5 mr-2 text-primary" />
                <span className="font-medium">{booking.cabType.charAt(0).toUpperCase() + booking.cabType.slice(1)} Cab</span>
              </div>
              <div className="flex items-center font-semibold">
                <IndianRupee className="h-4 w-4 mr-1" />
                {booking.price?.toFixed(2) || "N/A"}
              </div>
            </div>
            
            <Separator />
            
            {/* Date & Time */}
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {format(bookingDate, "EEEE, MMMM d, yyyy")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {booking.time}
                </p>
              </div>
            </div>
            
            {/* Locations */}
            <div className="space-y-4 pt-2">
              <div className="flex">
                <div className="mr-2 flex flex-col items-center">
                  <div className="h-6 w-6 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <div className="w-0.5 h-14 bg-border"></div>
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <MapPin className="h-3 w-3 text-primary-foreground" />
                  </div>
                </div>
                <div className="space-y-6 flex-1">
                  <div>
                    <p className="text-sm text-muted-foreground">PICKUP LOCATION</p>
                    <p className="font-medium">{booking.pickupLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">DROP LOCATION</p>
                    <p className="font-medium">{booking.dropoffLocation}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Customer Information */}
            {booking.userName && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Passenger Details</h4>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{booking.userName}</span>
                </div>
                {booking.userPhone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{booking.userPhone}</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Special Instructions */}
            {booking.specialInstructions && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-1">Special Instructions</h4>
                  <p className="text-sm">{booking.specialInstructions}</p>
                </div>
              </>
            )}

            {/* Driver Details Section */}
            {showDriverDetails && driver && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-2">Driver Information</h4>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                        <img src={driver.photo} alt={driver.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">{driver.name}</p>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-xs">{driver.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-1">Car:</span>
                        <span>{driver.carModel}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-1">Number:</span>
                        <span>{driver.carNumber}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-1">Rating:</span>
                        <span className="flex items-center">
                          {driver.rating}
                          <CheckCircle className="h-3 w-3 text-green-500 ml-1" />
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-1">Experience:</span>
                        <span>{driver.experience}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="flex justify-between mt-4">
            {canCancel && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setCancelDialogOpen(true)}
              >
                <X className="mr-1 h-4 w-4" /> Cancel Booking
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className={canCancel ? "" : "ml-auto"}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>No, keep it</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleCancelBooking();
              }}
              disabled={cancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelling ? "Cancelling..." : "Yes, cancel booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RideDetails;
