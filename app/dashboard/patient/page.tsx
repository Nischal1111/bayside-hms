"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarLayout } from "@/components/sidebar-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, FileText, MessageSquare, CreditCard, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export default function PatientDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Appointment form
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [appointmentForm, setAppointmentForm] = useState({
    doctorId: "",
    time: "",
    reason: "",
  });

  // Feedback form
  const [feedbackForm, setFeedbackForm] = useState({
    doctorId: "",
    rating: "",
    comment: "",
  });

  useEffect(() => {
    fetchUser();
    fetchDoctors();
    fetchAppointments();
    fetchMedicalRecords();
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

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/doctors");
      const data = await response.json();
      setDoctors(data.doctors || []);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/appointments");
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      const response = await fetch("/api/medical-records");
      const data = await response.json();
      setMedicalRecords(data.records || []);
    } catch (error) {
      console.error("Failed to fetch medical records:", error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/invoices");
      const data = await response.json();
      setInvoices(data.invoices || []);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...appointmentForm,
          date: format(selectedDate, "yyyy-MM-dd"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      toast({
        title: "Success",
        description: "Appointment booked successfully",
      });

      setAppointmentForm({ doctorId: "", time: "", reason: "" });
      setSelectedDate(undefined);
      fetchAppointments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      toast({
        title: "Success",
        description: "Feedback submitted successfully",
      });

      setFeedbackForm({ doctorId: "", rating: "", comment: "" });
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

  const userName = user?.profile ? `${user.profile.first_name} ${user.profile.last_name}` : "Patient";

  return (
    <SidebarLayout userRole="patient" userName={userName} activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome, {user?.profile?.first_name}!</h2>
          <p className="text-muted-foreground">Manage your health records and appointments</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="hidden">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{appointments.length}</div>
                  <p className="text-xs text-muted-foreground">Scheduled appointments</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{medicalRecords.length}</div>
                  <p className="text-xs text-muted-foreground">Records available</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Invoices</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{invoices.length}</div>
                  <p className="text-xs text-muted-foreground">Total invoices</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and actions</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Button onClick={() => setActiveTab("appointments")} className="h-20">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  Book New Appointment
                </Button>
                <Button onClick={() => setActiveTab("records")} variant="outline" className="h-20">
                  <FileText className="mr-2 h-5 w-5" />
                  View Medical Records
                </Button>
                <Button onClick={() => setActiveTab("feedback")} variant="outline" className="h-20">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Give Feedback
                </Button>
                <Button onClick={() => setActiveTab("billing")} variant="outline" className="h-20">
                  <CreditCard className="mr-2 h-5 w-5" />
                  View Invoices
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Book New Appointment</CardTitle>
                  <CardDescription>Schedule an appointment with a doctor</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBookAppointment} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor">Select Doctor</Label>
                      <Select
                        value={appointmentForm.doctorId}
                        onValueChange={(value) => setAppointmentForm({ ...appointmentForm, doctorId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialization_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Select Date</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Select
                        value={appointmentForm.time}
                        onValueChange={(value) => setAppointmentForm({ ...appointmentForm, time: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00">09:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="14:00">02:00 PM</SelectItem>
                          <SelectItem value="15:00">03:00 PM</SelectItem>
                          <SelectItem value="16:00">04:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for Visit</Label>
                      <Textarea
                        id="reason"
                        placeholder="Describe your symptoms or reason for visit"
                        value={appointmentForm.reason}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
                      />
                    </div>

                    <Button type="submit" className="w-full">Book Appointment</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Appointments</CardTitle>
                  <CardDescription>View and manage your appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No appointments scheduled</p>
                    ) : (
                      appointments.map((apt) => (
                        <div key={apt.id} className="flex items-center justify-between border-b pb-4">
                          <div>
                            <p className="font-medium">Dr. {apt.doctor_name}</p>
                            <p className="text-sm text-muted-foreground">
                              <Clock className="inline h-3 w-3 mr-1" />
                              {format(new Date(apt.appointment_date), "MMM dd, yyyy")} at {apt.appointment_time}
                            </p>
                          </div>
                          <Badge variant={apt.status === "confirmed" ? "default" : "secondary"}>
                            {apt.status}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Medical Records Tab */}
          <TabsContent value="records" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Diagnosis and Reports</CardTitle>
                <CardDescription>View your medical history and reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicalRecords.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No medical records available</p>
                  ) : (
                    medicalRecords.map((record) => (
                      <div key={record.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">Dr. {record.doctor_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(record.visit_date), "MMM dd, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                          </div>
                          {record.prescription && (
                            <div>
                              <span className="font-medium">Prescription:</span> {record.prescription}
                            </div>
                          )}
                          {record.notes && (
                            <div>
                              <span className="font-medium">Notes:</span> {record.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Give Feedback</CardTitle>
                <CardDescription>Share your experience with your doctor</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitFeedback} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="feedbackDoctor">Select Doctor</Label>
                    <Select
                      value={feedbackForm.doctorId}
                      onValueChange={(value) => setFeedbackForm({ ...feedbackForm, doctorId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            Dr. {doctor.first_name} {doctor.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating</Label>
                    <Select
                      value={feedbackForm.rating}
                      onValueChange={(value) => setFeedbackForm({ ...feedbackForm, rating: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 - Excellent</SelectItem>
                        <SelectItem value="4">4 - Very Good</SelectItem>
                        <SelectItem value="3">3 - Good</SelectItem>
                        <SelectItem value="2">2 - Fair</SelectItem>
                        <SelectItem value="1">1 - Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedback">Your Feedback</Label>
                    <Textarea
                      id="feedback"
                      placeholder="Share your experience..."
                      value={feedbackForm.comment}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                      rows={5}
                    />
                  </div>

                  <Button type="submit" className="w-full">Submit Feedback</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Billing and Invoices</CardTitle>
                <CardDescription>View and manage your medical bills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No invoices available</p>
                  ) : (
                    invoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="font-medium">Invoice #{invoice.invoice_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(invoice.created_at), "MMM dd, yyyy")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${invoice.total_amount}</p>
                          <Badge variant={invoice.status === "paid" ? "default" : "destructive"}>
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
    </SidebarLayout>
  );
}
