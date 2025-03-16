
import React from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminBookings from "@/components/ui/AdminBookings";
import PageTransition from "@/components/animation/PageTransition";
import { useAuth } from "@/context/AuthContext";

const Admin = () => {
  const { currentUser, userProfile, loading } = useAuth();

  // If user is not logged in and finished loading, redirect to login
  if (!loading && !currentUser) {
    return <Navigate to="/login" />;
  }

  // If user is not an admin, redirect to profile
  if (!loading && userProfile && userProfile.role !== "admin") {
    return <Navigate to="/profile" />;
  }

  return (
    <PageTransition>
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="grid gap-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage bookings and monitor system activity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Stats Cards */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">256</div>
                <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Rides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground mt-1">-3% from last week</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Rides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground mt-1">+2 since yesterday</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">124</div>
                <p className="text-xs text-muted-foreground mt-1">+5 new users this week</p>
              </CardContent>
            </Card>
          </div>

          {/* Bookings Management */}
          <Card>
            <CardHeader>
              <CardTitle>Bookings Management</CardTitle>
              <CardDescription>
                View and manage all cab bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="bookings">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="bookings">All Bookings</TabsTrigger>
                  <TabsTrigger value="drivers">Drivers</TabsTrigger>
                </TabsList>
                <div className="mt-4">
                  <TabsContent value="bookings">
                    <AdminBookings />
                  </TabsContent>
                  <TabsContent value="drivers">
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">Driver management coming soon</p>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default Admin;
