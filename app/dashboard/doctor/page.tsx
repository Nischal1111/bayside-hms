"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarLayout } from "@/components/sidebar-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, MessageSquare, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function DoctorDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [recordForm, setRecordForm] = useState({
    diagnosis: "",
    prescription: "",
    symptoms: "",
    notes: "",
  });

  useEffect(() => {
    fetchUser();
    fetchAppointments();
    fetchMedicalRecords();
    fetchFeedback();
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

  const fetchFeedback = async () => {
    try {
      const response = await fetch("/api/doctor/feedback");
      const data = await response.json();
      setFeedback(data.feedback || []);
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
    }
  };

  const handleUpdateStatus = async (appointmentId: string, status: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update appointment");

      toast({
        title: "Success",
        description: "Appointment status updated",
      });

      fetchAppointments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddMedicalRecord = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/medical-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...recordForm,
          appointmentId: selectedAppointment?.id,
          patientId: selectedAppointment?.patient_id,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      toast({
        title: "Success",
        description: "Medical record added successfully",
      });

      setRecordForm({ diagnosis: "", prescription: "", symptoms: "", notes: "" });
      setSelectedAppointment(null);
      fetchMedicalRecords();
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

  const userName = user?.profile ? `Dr. ${user.profile.first_name} ${user.profile.last_name}` : "Doctor";

  return (
    <SidebarLayout userRole="doctor" userName={userName} activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome, Dr. {user?.profile?.first_name}!</h2>
          <p className="text-muted-foreground">Manage your patients and appointments</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="hidden">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{appointments.length}</div>
                  <p className="text-xs text-muted-foreground">Patient appointments</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{medicalRecords.length}</div>
                  <p className="text-xs text-muted-foreground">Records created</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Patient Feedback</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{feedback.length}</div>
                  <p className="text-xs text-muted-foreground">Feedback received</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your patients and records</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <Button onClick={() => setActiveTab("appointments")} className="h-20">
                  <Calendar className="mr-2 h-5 w-5" />
                  View Appointments
                </Button>
                <Button onClick={() => setActiveTab("records")} variant="outline" className="h-20">
                  <FileText className="mr-2 h-5 w-5" />
                  Medical Records
                </Button>
                <Button onClick={() => setActiveTab("feedback")} variant="outline" className="h-20">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  View Feedback
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Appointments</CardTitle>
                <CardDescription>Manage and update appointment status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No appointments scheduled</p>
                  ) : (
                    appointments.map((apt) => (
                      <div key={apt.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{apt.patient_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(apt.appointment_date), "MMM dd, yyyy")} at {apt.appointment_time}
                            </p>
                            {apt.reason_for_visit && (
                              <p className="text-sm mt-2"><strong>Reason:</strong> {apt.reason_for_visit}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={apt.status === "confirmed" ? "default" : "secondary"}>
                              {apt.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(apt.id, "confirmed")}
                            disabled={apt.status === "confirmed"}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(apt.id, "completed")}
                            disabled={apt.status === "completed"}
                          >
                            Complete
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                onClick={() => setSelectedAppointment(apt)}
                              >
                                Add Record
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Add Medical Record</DialogTitle>
                                <DialogDescription>
                                  Add diagnosis and prescription for {apt.patient_name}
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={handleAddMedicalRecord} className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Symptoms</Label>
                                  <Textarea
                                    value={recordForm.symptoms}
                                    onChange={(e) => setRecordForm({ ...recordForm, symptoms: e.target.value })}
                                    placeholder="Patient symptoms..."
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Diagnosis</Label>
                                  <Textarea
                                    value={recordForm.diagnosis}
                                    onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })}
                                    placeholder="Diagnosis..."
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Prescription</Label>
                                  <Textarea
                                    value={recordForm.prescription}
                                    onChange={(e) => setRecordForm({ ...recordForm, prescription: e.target.value })}
                                    placeholder="Prescription..."
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Notes</Label>
                                  <Textarea
                                    value={recordForm.notes}
                                    onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
                                    placeholder="Additional notes..."
                                  />
                                </div>
                                <Button type="submit">Save Record</Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Medical Records</CardTitle>
                <CardDescription>View all medical records you've created</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicalRecords.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No medical records</p>
                  ) : (
                    medicalRecords.map((record) => (
                      <div key={record.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{record.patient_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(record.visit_date), "MMM dd, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div><strong>Diagnosis:</strong> {record.diagnosis}</div>
                          {record.prescription && <div><strong>Prescription:</strong> {record.prescription}</div>}
                          {record.notes && <div><strong>Notes:</strong> {record.notes}</div>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Feedback</CardTitle>
                <CardDescription>See what your patients are saying</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedback.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No feedback yet</p>
                  ) : (
                    feedback.map((fb) => (
                      <div key={fb.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">{fb.patient_name}</p>
                          <Badge>{fb.rating} / 5</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{fb.comment}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {format(new Date(fb.created_at), "MMM dd, yyyy")}
                        </p>
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
