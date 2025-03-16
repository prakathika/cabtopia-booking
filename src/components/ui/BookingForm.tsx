
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import RideOptions, { CabType } from "./RideOptions";
import LocationSearch from "./LocationSearch";
import { useAuth } from "@/context/AuthContext";
import { createBooking } from "@/lib/firebase";

// Fake locations data for the demo
const DEMO_TIMES = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30"];

const formSchema = z.object({
  pickupLocation: z.string().min(3, "Pickup location is required"),
  dropoffLocation: z.string().min(3, "Dropoff location is required"),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, "Please select a time"),
  cabType: z.enum(["economy", "premium", "luxury"] as const),
  specialInstructions: z.string().optional(),
});

type BookingFormValues = z.infer<typeof formSchema>;

interface BookingFormProps {
  onSuccess?: (bookingId: string) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSuccess }) => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: Partial<BookingFormValues> = {
    pickupLocation: "",
    dropoffLocation: "",
    date: new Date(),
    time: "",
    cabType: "economy",
    specialInstructions: "",
  };

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(data: BookingFormValues) {
    if (!currentUser) {
      toast.error("Please log in to book a ride");
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Calculate price (simplified)
      const distance = 5; // mock distance in miles
      const baseFare = 2.5;
      let pricePerMile = 1.5; // default for economy
      
      if (data.cabType === "premium") {
        pricePerMile = 2.5;
      } else if (data.cabType === "luxury") {
        pricePerMile = 4.0;
      }
      
      const price = baseFare + (pricePerMile * distance);
      
      // Create booking object
      const bookingData = {
        userId: currentUser.uid,
        userName: userProfile?.name || "User",
        userPhone: userProfile?.phone || "",
        userEmail: currentUser.email,
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        date: data.date,
        time: data.time,
        cabType: data.cabType,
        specialInstructions: data.specialInstructions || "",
        price: price,
        distance: distance,
        status: "pending",
      };
      
      // Create booking in Firebase
      const bookingId = await createBooking(bookingData);
      
      toast.success("Ride booked successfully!");
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(bookingId);
      }
      
      // Redirect to profile page to see bookings
      navigate("/profile");
      
    } catch (error) {
      console.error("Error booking ride:", error);
      toast.error("Failed to book ride. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* Locations */}
          <FormField
            control={form.control}
            name="pickupLocation"
            render={({ field }) => (
              <FormItem>
                <LocationSearch
                  label="Pickup Location"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter pickup location"
                  required
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dropoffLocation"
            render={({ field }) => (
              <FormItem>
                <LocationSearch
                  label="Dropoff Location"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter destination"
                  required
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date <span className="text-destructive">*</span></FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time <span className="text-destructive">*</span></FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value || <span>Select time</span>}
                          <Clock className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-0" align="start">
                      <div className="grid grid-cols-2 gap-2 p-3">
                        {DEMO_TIMES.map((time) => (
                          <Button
                            key={time}
                            type="button"
                            variant="outline"
                            size="sm"
                            className={cn(
                              "justify-start",
                              field.value === time && "border-primary bg-primary/10"
                            )}
                            onClick={() => {
                              field.onChange(time);
                              form.clearErrors("time");
                            }}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Cab Type */}
          <FormField
            control={form.control}
            name="cabType"
            render={({ field }) => (
              <FormItem>
                <RideOptions
                  selected={field.value}
                  onSelect={(value) => field.onChange(value)}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Special Instructions */}
          <FormField
            control={form.control}
            name="specialInstructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Instructions (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Any special requests or information for the driver"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Booking..." : "Book Ride"}
        </Button>
      </form>
    </Form>
  );
};

export default BookingForm;
