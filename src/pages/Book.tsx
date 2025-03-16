
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BookingForm from "@/components/ui/BookingForm";
import PageTransition from "@/components/animation/PageTransition";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const Book = () => {
  const { currentUser, loading } = useAuth();

  // If user is not logged in and finished loading, redirect to login
  if (!loading && !currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <PageTransition>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="grid gap-6">
          <div>
            <h1 className="text-3xl font-bold">Book a Cab</h1>
            <p className="text-muted-foreground mt-2">
              Fill in the details below to book your ride in India
            </p>
          </div>

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
                  <BookingForm />
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
        </div>
      </div>
    </PageTransition>
  );
};

export default Book;
