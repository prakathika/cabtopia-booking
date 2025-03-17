
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminBookings from "@/components/ui/AdminBookings";
import PageTransition from "@/components/animation/PageTransition";
import { useAuth } from "@/context/AuthContext";
import { getAllBookings } from "@/lib/firebase";
import { DocumentData } from "firebase/firestore";

const Admin = () => {
  const { currentUser, userProfile, loading } = useAuth();
  const [bookings, setBookings] = useState<DocumentData[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    users: 0,
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const allBookings = await getAllBookings();
        setBookings(allBookings);
        
        // Calculate stats
        const pendingCount = allBookings.filter(booking => booking.status === "pending").length;
        const activeCount = allBookings.filter(booking => booking.status === "in-progress").length;
        
        // Get unique users count
        const uniqueUsers = new Set(allBookings.map(booking => booking.userId));
        
        setStats({
          total: allBookings.length,
          pending: pendingCount,
          active: activeCount,
          users: uniqueUsers.size,
        });
      } catch (error) {
        console.error("Error fetching bookings for stats:", error);
      }
    };

    if (userProfile?.role === "admin") {
      fetchBookings();
    }
  }, [userProfile]);

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
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">All time bookings</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Rides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting confirmation</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Rides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.active}</div>
                <p className="text-xs text-muted-foreground mt-1">Currently in progress</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.users}</div>
                <p className="text-xs text-muted-foreground mt-1">Unique customers</p>
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
