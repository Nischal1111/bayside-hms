"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Activity } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminPortal() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Check if user is already logged in as admin
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        if (data.user.role === "admin") {
          router.push("/dashboard/admin");
        }
      }
    } catch (error) {
      // Not logged in, show login form
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Check if user is admin
      if (data.user.role !== "admin") {
        toast({
          title: "Access Denied",
          description: "This portal is for administrators only.",
          variant: "destructive",
        });
        await fetch("/api/auth/logout", { method: "POST" });
        return;
      }

      toast({
        title: "Success",
        description: "Welcome to Admin Portal",
      });

      router.push("/dashboard/admin");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center gap-3 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
            <Shield className="h-16 w-16 text-primary relative z-10" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Portal</h1>
            <p className="text-muted-foreground">Bayside Hospital Management System</p>
          </div>
        </div>

        <Card className="shadow-xl border-primary/20">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">Administrator Access</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@bayside-hms.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Access Admin Dashboard
                  </span>
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Secure Admin Portal
                  </span>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Not an administrator?{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-primary font-medium"
                    onClick={() => router.push("/")}
                  >
                    Go to main site
                  </Button>
                </p>
              </div>
            </CardContent>
          </form>
        </Card>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4" />
          <span>Protected by enterprise-grade security</span>
        </div>
      </div>
    </div>
  );
}
