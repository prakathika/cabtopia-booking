
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BookingForm from "@/components/ui/BookingForm";
import PageTransition from "@/components/animation/PageTransition";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import DriverDetails from "@/components/ui/DriverDetails";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

const Book = () => {
  const { currentUser, loading } = useAuth();
  const [bookingComplete, setBookingComplete] = useState(false);
  const [assignedDriver, setAssignedDriver] = useState<any>(null);

  // If user is not logged in and finished loading, redirect to login
  if (!loading && !currentUser) {
    return <Navigate to="/login" />;
  }

  // Sample driver data - in a real app, this would come from the database
  const handleBookingSuccess = () => {
    // In a real app, this would fetch the assigned driver from the backend
    setAssignedDriver({
      id: "driver-1",
      name: "Rajesh Kumar",
      photo: "https://i.pravatar.cc/150?img=32",
      phone: "+91 9876543210",
      rating: 4.7,
      location: "New Delhi, India",
      carModel: "Maruti Suzuki Swift",
      carNumber: "DL 01 AB 1234",
      experience: "5 years",
      status: "active" as const,
      completedRides: 320
    });
    setBookingComplete(true);
  };

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <div className="grid gap-6">
            <div>
              <h1 className="text-3xl font-bold">Book a Cab</h1>
              <p className="text-muted-foreground mt-2">
                Fill in the details below to book your ride in India
              </p>
            </div>

            {bookingComplete && assignedDriver ? (
              <div className="grid gap-6">
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Booking Successful!</AlertTitle>
                  <AlertDescription>
                    Your ride has been booked successfully. Your driver is on the way.
                  </AlertDescription>
                </Alert>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Your Driver</CardTitle>
                    <CardDescription>
                      Your assigned driver will pick you up at the scheduled time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DriverDetails driver={assignedDriver} />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ride Details</CardTitle>
                      <CardDescription>
                        Enter your pickup and drop-off locations in India, and schedule your ride
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <BookingForm onBookingSuccess={handleBookingSuccess} />
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>How It Works</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold">
                          1
                        </div>
                        <div>
                          <h3 className="font-medium">Enter locations</h3>
                          <p className="text-sm text-muted-foreground">Select your pickup and dropoff locations in India.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold">
                          2
                        </div>
                        <div>
                          <h3 className="font-medium">Schedule & Select</h3>
                          <p className="text-sm text-muted-foreground">Choose your date, time and preferred cab type.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold">
                          3
                        </div>
                        <div>
                          <h3 className="font-medium">Confirm & Go</h3>
                          <p className="text-sm text-muted-foreground">Review your booking details and confirm.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default Book;
