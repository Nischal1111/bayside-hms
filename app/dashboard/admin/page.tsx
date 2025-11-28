"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarLayout } from "@/components/sidebar-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingApprovals: 0,
  });
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [pendingDoctors, setPendingDoctors] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    fetchUser();
    fetchStats();
    fetchPatients();
    fetchDoctors();
    fetchPendingDoctors();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (!response.ok) {
        router.push("/login");
        return;
      }
      const data = await response.json();
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      router.push("/login");
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      setStats(data.stats || stats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/admin/patients");
      const data = await response.json();
      setPatients(data.patients || []);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/admin/doctors");
      const data = await response.json();
      setDoctors(data.doctors || []);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  };

  const fetchPendingDoctors = async () => {
    try {
      const response = await fetch("/api/admin/doctors?status=pending");
      const data = await response.json();
      setPendingDoctors(data.doctors || []);
    } catch (error) {
      console.error("Failed to fetch pending doctors:", error);
    }
  };

  const handleApproveDoctor = async (userId: string) => {
    try {
      const response = await fetch("/api/admin/approve-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Failed to approve doctor");

      toast({
        title: "Success",
        description: "Doctor approved successfully",
      });

      fetchPendingDoctors();
      fetchDoctors();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const userName = user?.profile ? `${user.profile.first_name} ${user.profile.last_name}` : "Admin";

  return (
    <SidebarLayout userRole="admin" userName={userName} activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage hospital operations and staff</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="hidden">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
            <TabsTrigger value="doctors">Manage Doctors</TabsTrigger>
            <TabsTrigger value="patients">Manage Patients</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDoctors}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            </CardContent>
          </Card>
        </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage hospital operations</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <Button onClick={() => setActiveTab("approvals")} className="h-20" disabled={stats.pendingApprovals === 0}>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Pending Approvals ({stats.pendingApprovals})
                </Button>
                <Button onClick={() => setActiveTab("doctors")} variant="outline" className="h-20">
                  <Users className="mr-2 h-5 w-5" />
                  Manage Doctors
                </Button>
                <Button onClick={() => setActiveTab("patients")} variant="outline" className="h-20">
                  <Users className="mr-2 h-5 w-5" />
                  Manage Patients
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Doctor Approval Requests</CardTitle>
                <CardDescription>Review and approve new doctor registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingDoctors.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No pending approvals</p>
                  ) : (
                    pendingDoctors.map((doctor) => (
                      <div key={doctor.id} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="font-medium">Dr. {doctor.first_name} {doctor.last_name}</p>
                          <p className="text-sm text-muted-foreground">{doctor.specialization_name}</p>
                          <p className="text-sm text-muted-foreground">License: {doctor.license_number}</p>
                        </div>
                        <Button onClick={() => handleApproveDoctor(doctor.user_id)}>
                          Approve
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Doctors</CardTitle>
                <CardDescription>List of all approved doctors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctors.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No doctors</p>
                  ) : (
                    doctors.map((doctor) => (
                      <div key={doctor.id} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="font-medium">Dr. {doctor.first_name} {doctor.last_name}</p>
                          <p className="text-sm text-muted-foreground">{doctor.specialization_name}</p>
                          <p className="text-sm text-muted-foreground">{doctor.phone_number}</p>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Registered Patients</CardTitle>
                <CardDescription>List of all registered patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patients.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No patients</p>
                  ) : (
                    patients.map((patient) => (
                      <div key={patient.id} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="font-medium">{patient.first_name} {patient.last_name}</p>
                          <p className="text-sm text-muted-foreground">{patient.phone_number}</p>
                          <p className="text-sm text-muted-foreground">{patient.email}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
}
