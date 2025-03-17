
import React from "react";
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
  Phone
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RideDetailsProps {
  booking: DocumentData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RideDetails: React.FC<RideDetailsProps> = ({ booking, open, onOpenChange }) => {
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

  const bookingDate = booking.date?.toDate ? booking.date.toDate() : new Date(booking.date);

  return (
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
        </div>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RideDetails;
