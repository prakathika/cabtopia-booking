
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CarFront, Users, MapPin, CheckCircle } from "lucide-react";
import PageTransition from "@/components/animation/PageTransition";
import AdminLoginRedirect from "@/components/ui/AdminLoginRedirect";

const Index = () => {
  return (
    <PageTransition>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Book Your Cab in Minutes
                </h1>
                <p className="text-xl text-muted-foreground">
                  Fast, reliable cab service across India. Book now and enjoy a comfortable ride to your destination.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link to="/book">Book a Ride</Link>
                </Button>
                <AdminLoginRedirect />
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg"
                  alt="Taxi cab illustration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 border-t">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Service</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <CarFront className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium">Quality Vehicles</h3>
              <p className="text-muted-foreground">
                Clean, well-maintained cars with professional drivers to ensure your comfort and safety.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium">Pan-India Service</h3>
              <p className="text-muted-foreground">
                Available in all major cities and towns across India, making travel convenient anywhere.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium">Easy Booking</h3>
              <p className="text-muted-foreground">
                Simple booking process with real-time tracking and transparent pricing.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 md:py-20 border-t">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to ride with us?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers who rely on our service for their daily commute and travel needs.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/book">Book Now</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Index;
