"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarLayout } from "@/components/sidebar-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Calendar, DollarSign, Plus, Receipt, ClipboardList, Trash2, Search } from "lucide-react";
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
  const [billingQueue, setBillingQueue] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [billingDialogOpen, setBillingDialogOpen] = useState(false);
  const [selectedBillingAppointment, setSelectedBillingAppointment] = useState<any>(null);
  const [billingForm, setBillingForm] = useState({
    paidAmount: "",
    discountAmount: "",
    taxAmount: "",
    dueDate: "",
  });
  const [billingItems, setBillingItems] = useState([
    { description: "Consultation Fee", quantity: "1", unitPrice: "" },
  ]);
  const billingSubtotal = billingItems.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    return sum + qty * price;
  }, 0);
  const billingDiscount = parseFloat(billingForm.discountAmount) || 0;
  const billingTax = parseFloat(billingForm.taxAmount) || 0;
  const billingTotal = Math.max(billingSubtotal - billingDiscount + billingTax, 0);

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
    fetchBillingQueue();
  }, []);

  useEffect(() => {
    if (activeTab === "billing") {
      fetchBillingQueue();
      fetchInvoices();
    }
  }, [activeTab]);

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

  const fetchBillingQueue = async () => {
    try {
      const response = await fetch("/api/admin/billing");
      const data = await response.json();
      if (response.ok) {
        setBillingQueue(data.queue || []);
      }
    } catch (error) {
      console.error("Failed to fetch billing queue:", error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/invoices");
      const data = await response.json();
      if (response.ok) {
        setInvoices(data.invoices || []);
      }
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

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to delete doctor");

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

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to delete patient");

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

  const resetBillingState = () => {
    setBillingForm({
      paidAmount: "",
      discountAmount: "",
      taxAmount: "",
      dueDate: "",
    });
    setBillingItems([{ description: "Consultation Fee", quantity: "1", unitPrice: "" }]);
  };

  const openBillingDialog = (appointment: any) => {
    setSelectedBillingAppointment(appointment);
    resetBillingState();
    setBillingDialogOpen(true);
  };

  const closeBillingDialog = () => {
    setBillingDialogOpen(false);
    setSelectedBillingAppointment(null);
  };

  const updateBillingItem = (index: number, field: "description" | "quantity" | "unitPrice", value: string) => {
    setBillingItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addBillingItem = () => {
    setBillingItems((prev) => [...prev, { description: "", quantity: "1", unitPrice: "" }]);
  };

  const removeBillingItem = (index: number) => {
    setBillingItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBillingAppointment) {
      return;
    }

    if (billingTotal <= 0) {
      toast({
        title: "Invalid total",
        description: "Please add at least one billable item with a value",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        appointmentId: selectedBillingAppointment.id,
        totalAmount: billingTotal,
        paidAmount: parseFloat(billingForm.paidAmount) || 0,
        discountAmount: billingDiscount,
        taxAmount: billingTax,
        dueDate: billingForm.dueDate || null,
        items: billingItems
          .filter((item) => item.description && (parseFloat(item.unitPrice) || 0) > 0)
          .map((item) => ({
            description: item.description,
            quantity: Number(item.quantity) || 1,
            unitPrice: parseFloat(item.unitPrice) || 0,
          })),
      };

      const response = await fetch("/api/admin/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create invoice");
      }

      toast({
        title: "Invoice created",
        description: "Billing has been recorded for this appointment",
      });

      closeBillingDialog();
      fetchBillingQueue();
      fetchInvoices();
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
            <TabsTrigger value="billing">Billing Queue</TabsTrigger>
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
              <CardContent className="grid gap-4 md:grid-cols-4">
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
                <Button onClick={() => setActiveTab("billing")} variant="outline" className="h-20">
                  <Receipt className="mr-2 h-5 w-5" />
                  Billing Queue ({billingQueue.length})
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

          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Billing Queue</CardTitle>
                <CardDescription>Generate invoices for completed appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {billingQueue.length === 0 ? (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      All caught up! No completed appointments are waiting for billing.
                    </p>
                  ) : (
                    billingQueue.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-medium">{item.patient_name}</p>
                          <p className="text-sm text-muted-foreground">Doctor: {item.doctor_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.appointment_date).toLocaleDateString()} at {item.appointment_time}
                          </p>
                          {item.reason_for_visit && (
                            <p className="text-sm text-muted-foreground">Reason: {item.reason_for_visit}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 md:items-end">
                          <Badge variant="secondary">Completed</Badge>
                          <Button size="sm" onClick={() => openBillingDialog(item)}>
                            <Receipt className="mr-2 h-4 w-4" />
                            Create Invoice
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Invoices</CardTitle>
                <CardDescription>View and manage all generated invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No invoices generated yet</p>
                  ) : (
                    invoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="font-medium">Invoice #{invoice.invoice_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {invoice.patient_name && `Patient: ${invoice.patient_name}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(invoice.created_at), "MMM dd, yyyy")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${parseFloat(invoice.total_amount).toFixed(2)}</p>
                          <Badge 
                            variant={
                              invoice.status === "paid" 
                                ? "default" 
                                : invoice.status === "pending" 
                                ? "secondary" 
                                : "destructive"
                            }
                          >
                            {invoice.status}
                          </Badge>
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
      <Dialog open={billingDialogOpen} onOpenChange={(open) => (open ? setBillingDialogOpen(true) : closeBillingDialog())}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription>
              {selectedBillingAppointment
                ? `Generate billing for ${selectedBillingAppointment.patient_name} with Dr. ${selectedBillingAppointment.doctor_name}`
                : "Add invoice details"}
            </DialogDescription>
          </DialogHeader>
          {selectedBillingAppointment && (
            <form onSubmit={handleCreateInvoice} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">Patient</p>
                  <p className="font-medium">{selectedBillingAppointment.patient_name}</p>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">Doctor</p>
                  <p className="font-medium">{selectedBillingAppointment.doctor_name}</p>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">Appointment Date</p>
                  <p className="font-medium">
                    {new Date(selectedBillingAppointment.appointment_date).toLocaleDateString()} at {selectedBillingAppointment.appointment_time}
                  </p>
                </div>
                {selectedBillingAppointment.reason_for_visit && (
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">Reason</p>
                    <p className="font-medium">{selectedBillingAppointment.reason_for_visit}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Line Items</h4>
                  <Button type="button" variant="outline" size="sm" onClick={addBillingItem}>
                    Add Item
                  </Button>
                </div>
                <div className="space-y-3">
                  {billingItems.map((item, index) => (
                    <div key={index} className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto] items-end border rounded-lg p-3">
                      <div className="space-y-1">
                        <Label>Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateBillingItem(index, "description", e.target.value)}
                          placeholder="Service provided"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Qty</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateBillingItem(index, "quantity", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Unit Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => updateBillingItem(index, "unitPrice", e.target.value)}
                        />
                      </div>
                      <div className="flex items-center justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBillingItem(index)}
                          disabled={billingItems.length === 1}
                          aria-label="Remove line item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Paid Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={billingForm.paidAmount}
                    onChange={(e) => setBillingForm({ ...billingForm, paidAmount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={billingForm.dueDate}
                    onChange={(e) => setBillingForm({ ...billingForm, dueDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Discount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={billingForm.discountAmount}
                    onChange={(e) => setBillingForm({ ...billingForm, discountAmount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tax</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={billingForm.taxAmount}
                    onChange={(e) => setBillingForm({ ...billingForm, taxAmount: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2 rounded-lg border p-4 bg-muted/40">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${billingSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Discount</span>
                  <span>- ${billingDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax</span>
                  <span>+ ${billingTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${billingTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeBillingDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={billingTotal <= 0}>
                  Generate Invoice
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </SidebarLayout>
  );
}
