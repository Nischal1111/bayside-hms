"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarLayout } from "@/components/sidebar-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Calendar, DollarSign, Plus, Trash2, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [invoices, setInvoices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [patientSearch, setPatientSearch] = useState("");

  // Patient form
  const [patientForm, setPatientForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    address: "",
    emergencyContact: "",
  });

  // Doctor form
  const [doctorForm, setDoctorForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    licenseNumber: "",
    specializationId: "",
  });

  useEffect(() => {
    fetchUser();
    fetchStats();
    fetchPatients();
    fetchDoctors();
    fetchPendingDoctors();
    fetchSpecializations();
    fetchInvoices();
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

  const fetchSpecializations = async () => {
    try {
      const response = await fetch("/api/specializations");
      const data = await response.json();
      setSpecializations(data.specializations || []);
    } catch (error) {
      console.error("Failed to fetch specializations:", error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/admin/invoices");
      const data = await response.json();
      setInvoices(data.invoices || []);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
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

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/admin/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "patient",
          ...patientForm,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to add patient");

      toast({
        title: "Success",
        description: "Patient added successfully",
      });

      setShowAddPatient(false);
      setPatientForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
        dateOfBirth: "",
        gender: "",
        bloodGroup: "",
        address: "",
        emergencyContact: "",
      });
      fetchPatients();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/admin/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "doctor",
          ...doctorForm,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to add doctor");

      toast({
        title: "Success",
        description: "Doctor added successfully and activated",
      });

      setShowAddDoctor(false);
      setDoctorForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
        licenseNumber: "",
        specializationId: "",
      });
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

  const handleDeleteDoctor = async (userId: string, doctorName: string) => {
    try {
      const response = await fetch("/api/admin/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: "doctor" }),
      });

      if (!response.ok) throw new Error("Failed to delete doctor");

      toast({
        title: "Success",
        description: `Dr. ${doctorName} has been deleted successfully`,
      });

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

  const handleDeletePatient = async (userId: string, patientName: string) => {
    try {
      const response = await fetch("/api/admin/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: "patient" }),
      });

      if (!response.ok) throw new Error("Failed to delete patient");

      toast({
        title: "Success",
        description: `${patientName} has been deleted successfully`,
      });

      fetchPatients();
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

  // Filter doctors and patients based on search
  const filteredDoctors = doctors.filter((doctor) =>
    `${doctor.first_name} ${doctor.last_name} ${doctor.specialization_name} ${doctor.license_number}`
      .toLowerCase()
      .includes(doctorSearch.toLowerCase())
  );

  const filteredPatients = patients.filter((patient) =>
    `${patient.first_name} ${patient.last_name} ${patient.email} ${patient.phone_number}`
      .toLowerCase()
      .includes(patientSearch.toLowerCase())
  );

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
            <TabsTrigger value="billing">Billing</TabsTrigger>
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
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Active Doctors</CardTitle>
                  <CardDescription>List of all approved doctors</CardDescription>
                </div>
                <Dialog open={showAddDoctor} onOpenChange={setShowAddDoctor}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Doctor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Doctor</DialogTitle>
                      <DialogDescription>
                        Create a new doctor account. The doctor will be activated immediately.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddDoctor} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="doctorFirstName">First Name *</Label>
                          <Input
                            id="doctorFirstName"
                            value={doctorForm.firstName}
                            onChange={(e) => setDoctorForm({ ...doctorForm, firstName: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="doctorLastName">Last Name *</Label>
                          <Input
                            id="doctorLastName"
                            value={doctorForm.lastName}
                            onChange={(e) => setDoctorForm({ ...doctorForm, lastName: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctorEmail">Email *</Label>
                        <Input
                          id="doctorEmail"
                          type="email"
                          value={doctorForm.email}
                          onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctorPassword">Password *</Label>
                        <Input
                          id="doctorPassword"
                          type="password"
                          value={doctorForm.password}
                          onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                          minLength={8}
                          required
                        />
                        <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctorPhone">Phone Number *</Label>
                        <Input
                          id="doctorPhone"
                          type="tel"
                          value={doctorForm.phoneNumber}
                          onChange={(e) => setDoctorForm({ ...doctorForm, phoneNumber: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctorLicense">License Number *</Label>
                        <Input
                          id="doctorLicense"
                          value={doctorForm.licenseNumber}
                          onChange={(e) => setDoctorForm({ ...doctorForm, licenseNumber: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctorSpecialization">Specialization *</Label>
                        <Select
                          value={doctorForm.specializationId}
                          onValueChange={(value) => setDoctorForm({ ...doctorForm, specializationId: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose specialization" />
                          </SelectTrigger>
                          <SelectContent>
                            {specializations.map((spec) => (
                              <SelectItem key={spec.id} value={spec.id}>
                                {spec.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setShowAddDoctor(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Add Doctor</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search doctors by name, specialization, or license..."
                      value={doctorSearch}
                      onChange={(e) => setDoctorSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  {filteredDoctors.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {doctorSearch ? "No doctors found matching your search" : "No doctors"}
                    </p>
                  ) : (
                    filteredDoctors.map((doctor) => (
                      <div key={doctor.id} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="font-medium">Dr. {doctor.first_name} {doctor.last_name}</p>
                          <p className="text-sm text-muted-foreground">{doctor.specialization_name}</p>
                          <p className="text-sm text-muted-foreground">{doctor.phone_number}</p>
                          <p className="text-xs text-muted-foreground">License: {doctor.license_number}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>Active</Badge>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Doctor</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete Dr. {doctor.first_name} {doctor.last_name}?
                                  This will permanently remove their account and all associated data. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteDoctor(doctor.user_id, `${doctor.first_name} ${doctor.last_name}`)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Registered Patients</CardTitle>
                  <CardDescription>List of all registered patients</CardDescription>
                </div>
                <Dialog open={showAddPatient} onOpenChange={setShowAddPatient}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Patient
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Patient</DialogTitle>
                      <DialogDescription>
                        Create a new patient account. The patient will be activated immediately.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddPatient} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="patientFirstName">First Name *</Label>
                          <Input
                            id="patientFirstName"
                            value={patientForm.firstName}
                            onChange={(e) => setPatientForm({ ...patientForm, firstName: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patientLastName">Last Name *</Label>
                          <Input
                            id="patientLastName"
                            value={patientForm.lastName}
                            onChange={(e) => setPatientForm({ ...patientForm, lastName: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patientEmail">Email *</Label>
                        <Input
                          id="patientEmail"
                          type="email"
                          value={patientForm.email}
                          onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patientPassword">Password *</Label>
                        <Input
                          id="patientPassword"
                          type="password"
                          value={patientForm.password}
                          onChange={(e) => setPatientForm({ ...patientForm, password: e.target.value })}
                          minLength={8}
                          required
                        />
                        <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="patientPhone">Phone Number *</Label>
                          <Input
                            id="patientPhone"
                            type="tel"
                            value={patientForm.phoneNumber}
                            onChange={(e) => setPatientForm({ ...patientForm, phoneNumber: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patientDOB">Date of Birth *</Label>
                          <Input
                            id="patientDOB"
                            type="date"
                            value={patientForm.dateOfBirth}
                            onChange={(e) => setPatientForm({ ...patientForm, dateOfBirth: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="patientGender">Gender *</Label>
                          <Select
                            value={patientForm.gender}
                            onValueChange={(value) => setPatientForm({ ...patientForm, gender: value })}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patientBloodGroup">Blood Group *</Label>
                          <Select
                            value={patientForm.bloodGroup}
                            onValueChange={(value) => setPatientForm({ ...patientForm, bloodGroup: value })}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select blood group" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patientAddress">Address *</Label>
                        <Input
                          id="patientAddress"
                          value={patientForm.address}
                          onChange={(e) => setPatientForm({ ...patientForm, address: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patientEmergency">Emergency Contact *</Label>
                        <Input
                          id="patientEmergency"
                          type="tel"
                          value={patientForm.emergencyContact}
                          onChange={(e) => setPatientForm({ ...patientForm, emergencyContact: e.target.value })}
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setShowAddPatient(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Add Patient</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients by name, email, or phone..."
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  {filteredPatients.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {patientSearch ? "No patients found matching your search" : "No patients"}
                    </p>
                  ) : (
                    filteredPatients.map((patient) => (
                      <div key={patient.id} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="font-medium">{patient.first_name} {patient.last_name}</p>
                          <p className="text-sm text-muted-foreground">{patient.phone_number}</p>
                          <p className="text-sm text-muted-foreground">{patient.email}</p>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Patient</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {patient.first_name} {patient.last_name}?
                                This will permanently remove their account and all associated data including medical records, appointments, and invoices. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePatient(patient.user_id, `${patient.first_name} ${patient.last_name}`)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Invoices</CardTitle>
                <CardDescription>View all patient invoices and payment statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No invoices</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Invoice #</th>
                            <th className="text-left p-2">Patient</th>
                            <th className="text-left p-2">Date</th>
                            <th className="text-left p-2">Amount</th>
                            <th className="text-left p-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoices.map((invoice) => (
                            <tr key={invoice.id} className="border-b">
                              <td className="p-2 font-mono text-sm">{invoice.invoice_number}</td>
                              <td className="p-2">{invoice.patient_name}</td>
                              <td className="p-2">{format(new Date(invoice.created_at), "MMM dd, yyyy")}</td>
                              <td className="p-2 font-semibold">${invoice.total_amount}</td>
                              <td className="p-2">
                                <Badge variant={invoice.status === "paid" ? "default" : "destructive"}>
                                  {invoice.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
