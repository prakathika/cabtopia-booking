
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Shield, ThumbsUp, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BookingForm from "@/components/ui/BookingForm";
import PageTransition from "@/components/animation/PageTransition";

const Index = () => {
  return (
    <PageTransition>
      <section className="relative">
        {/* Hero section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/5 dark:to-background">
          <div className="container px-4 py-16 md:py-24 max-w-7xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Book Your Ride with Ease and Comfort
                </h1>
                <p className="text-lg text-muted-foreground max-w-md">
                  Experience the best cab service in town. Quick bookings, reliable drivers, and 
                  competitive prices to take you anywhere you need to go.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg">
                    <Link to="/book">
                      Book Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="bg-background rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Booking</h2>
                <BookingForm />
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="container px-4 py-16 md:py-24 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Cab Service?</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              We provide the best experience for all your transportation needs with top features and benefits.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Clock className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Quick Booking</CardTitle>
                <CardDescription>
                  Book your ride in seconds with our easy-to-use platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our streamlined booking process ensures you can get a cab quickly
                  without any hassle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Anywhere, Anytime</CardTitle>
                <CardDescription>
                  Get a ride whenever you need, wherever you are.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  With our extensive network of drivers, we can pick you up from any location
                  at any time of day.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Safe & Secure</CardTitle>
                <CardDescription>
                  Your safety is our top priority.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  All our drivers are thoroughly vetted and trained to ensure a safe
                  and comfortable journey.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <ThumbsUp className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Customer Satisfaction</CardTitle>
                <CardDescription>
                  We pride ourselves on exceptional service.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our high ratings speak for themselves. We're committed to making every 
                  ride a pleasant experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-primary text-primary-foreground">
          <div className="container px-4 py-16 max-w-7xl mx-auto">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">Ready to Book Your Ride?</h2>
              <p className="max-w-md mx-auto">
                Join thousands of satisfied customers who use our service daily.
              </p>
              <Button asChild size="lg" variant="secondary">
                <Link to="/register">
                  Create an Account
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Index;
