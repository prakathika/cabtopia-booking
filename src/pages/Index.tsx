
import React from "react";
import { Link } from "react-router-dom";
import { CarTaxiFront, ArrowRight, Car, Shield, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/animation/PageTransition";

const Index = () => {
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative pt-20 pb-40 md:pb-44 lg:pb-56 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
            
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 pt-20 relative z-10 animate-entrance">
              <div className="flex flex-col items-center text-center mb-10 md:mb-16">
                <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full mb-6 text-sm font-medium">
                  <CarTaxiFront size={16} />
                  <span>Premium Cab Service</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 max-w-4xl">
                  Your Trusted Ride, <span className="text-primary">Anywhere</span> Anytime
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-2xl mb-8">
                  Experience the perfect blend of comfort, reliability, and style with our premium cab booking service.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/book">
                    <Button size="lg" className="px-8">
                      Book a Ride
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="lg" variant="outline" className="px-8">
                      Create Account
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Decorative illustration */}
              <div className="relative max-w-5xl mx-auto">
                <div className="glass rounded-2xl overflow-hidden shadow-elevated">
                  <img
                    src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Luxury car on a city street"
                    className="w-full h-auto object-cover"
                  />
                </div>
                
                {/* Floating card elements */}
                <div className="absolute -bottom-6 -left-6 md:left-10 glass p-4 rounded-lg shadow-elevated max-w-xs animate-entrance animate-delay-2">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Safe & Secure</h3>
                      <p className="text-sm text-muted-foreground">Verified drivers & GPS tracking</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-6 -right-6 md:right-10 glass p-4 rounded-lg shadow-elevated max-w-xs animate-entrance animate-delay-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Always On Time</h3>
                      <p className="text-sm text-muted-foreground">Punctual pickups & timely arrivals</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Features Section */}
          <section className="py-20 bg-white">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6">
              <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-3xl font-bold mb-6">Why Choose CabTopia</h2>
                <p className="text-lg text-muted-foreground">
                  We've redefined the cab booking experience with features designed around your comfort and convenience.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Car className="h-8 w-8 text-primary" />,
                    title: "Premium Fleet",
                    description: "Choose from our selection of economy, premium, and luxury vehicles for any occasion.",
                  },
                  {
                    icon: <Shield className="h-8 w-8 text-primary" />,
                    title: "Safety First",
                    description: "All our drivers are thoroughly vetted and trained to ensure your safety throughout the journey.",
                  },
                  {
                    icon: <MapPin className="h-8 w-8 text-primary" />,
                    title: "Easy Booking",
                    description: "Book your ride in seconds with our intuitive platform. Schedule in advance or right away.",
                  },
                ].map((feature, index) => (
                  <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="p-3 bg-primary/10 inline-flex rounded-lg mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
          
          {/* How It Works Section */}
          <section className="py-20 bg-gradient-to-b from-white to-secondary/30">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6">
              <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-3xl font-bold mb-6">How It Works</h2>
                <p className="text-lg text-muted-foreground">
                  Booking a ride with CabTopia is easy and straightforward.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    number: "01",
                    title: "Book Your Ride",
                    description: "Enter your pickup and drop-off locations, choose your vehicle type, and schedule your ride.",
                  },
                  {
                    number: "02",
                    title: "Get Ready",
                    description: "Receive confirmation and driver details. Track your driver's arrival in real-time.",
                  },
                  {
                    number: "03",
                    title: "Enjoy the Journey",
                    description: "Sit back and relax in our comfortable vehicles as we take you to your destination.",
                  },
                ].map((step, index) => (
                  <div key={index} className="relative">
                    <div className="bg-white rounded-xl p-6 shadow-sm h-full flex flex-col">
                      <div className="text-4xl font-bold text-primary/20 mb-4">{step.number}</div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                    
                    {index < 2 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                        <ArrowRight className="h-8 w-8 text-primary/30" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-16">
                <Link to="/book">
                  <Button size="lg" className="px-8">
                    Book Your First Ride
                  </Button>
                </Link>
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="py-20 bg-primary/5">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-6">Ready for a Premium Ride Experience?</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                      Join thousands of satisfied customers who rely on CabTopia for their daily commute and special occasions.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to="/register">
                        <Button size="lg" className="px-8">
                          Sign Up Now
                        </Button>
                      </Link>
                      <Link to="/book">
                        <Button size="lg" variant="outline" className="px-8">
                          Book Without Account
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="relative h-60 md:h-auto">
                    <img
                      src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Luxury car interior"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
