
import React from "react";
import { Navigate, Link } from "react-router-dom";
import { User, Clock, Calendar, MapPin, PhoneCall, Mail, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RideHistory from "@/components/ui/RideHistory";
import PageTransition from "@/components/animation/PageTransition";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";

const Profile = () => {
  const { currentUser, userProfile, logout, loading } = useAuth();

  // If user is not logged in and finished loading, redirect to login
  if (!loading && !currentUser) {
    return <Navigate to="/login" />;
  }

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation is handled in AuthContext
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container max-w-5xl mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </>
    );
  }

  // Get initials for avatar
  const getInitials = () => {
    if (!userProfile?.name) return "U";
    return userProfile.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="container max-w-5xl mx-auto py-8 px-4">
          <div className="grid gap-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Card */}
              <Card className="md:w-1/3">
                <CardHeader className="pb-3">
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h3 className="text-xl font-medium">{userProfile?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {userProfile?.role === "admin" ? "Administrator" : "User"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{userProfile?.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{currentUser?.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <PhoneCall className="h-4 w-4 text-muted-foreground" />
                      <span>{userProfile?.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Member since {userProfile?.createdAt?.toDate
                        ? new Date(userProfile.createdAt.toDate()).toLocaleDateString()
                        : "N/A"}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/book">
                        <MapPin className="mr-2 h-4 w-4" />
                        Book a Ride
                      </Link>
                    </Button>
                    
                    {userProfile?.role === "admin" && (
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/admin">
                          <Clock className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </Button>
                    )}
                    
                    <Button variant="destructive" className="w-full" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Ride History */}
              <Card className="flex-1">
                <CardHeader className="pb-3">
                  <CardTitle>Your Rides</CardTitle>
                  <CardDescription>View your booking history</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                      <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                    </TabsList>
                    <div className="mt-4">
                      <TabsContent value="all">
                        <RideHistory />
                      </TabsContent>
                      <TabsContent value="upcoming">
                        <RideHistory />
                      </TabsContent>
                      <TabsContent value="completed">
                        <RideHistory />
                      </TabsContent>
                      <TabsContent value="cancelled">
                        <RideHistory />
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default Profile;
