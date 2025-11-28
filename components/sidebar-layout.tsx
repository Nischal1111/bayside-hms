"use client";

import { useRouter } from "next/navigation";
import { Activity, LogOut, Home, Calendar, FileText, MessageSquare, CreditCard, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface SidebarLayoutProps {
  children: React.ReactNode;
  userRole: string;
  userName: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function SidebarLayout({ children, userRole, userName, activeTab = "dashboard", onTabChange }: SidebarLayoutProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      router.push("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Navigation items based on role
  const getNavigationItems = () => {
    if (userRole === "patient") {
      return [
        { id: "dashboard", label: "Dashboard", icon: Home },
        { id: "appointments", label: "Book Appointment", icon: Calendar },
        { id: "records", label: "Medical Records", icon: FileText },
        { id: "feedback", label: "Give Feedback", icon: MessageSquare },
        { id: "billing", label: "Billing & Invoices", icon: CreditCard },
      ];
    } else if (userRole === "doctor") {
      return [
        { id: "dashboard", label: "Dashboard", icon: Home },
        { id: "appointments", label: "Appointments", icon: Calendar },
        { id: "records", label: "Medical Records", icon: FileText },
        { id: "feedback", label: "Patient Feedback", icon: MessageSquare },
      ];
    } else if (userRole === "admin") {
      return [
        { id: "dashboard", label: "Dashboard", icon: Home },
        { id: "approvals", label: "Pending Approvals", icon: User },
        { id: "doctors", label: "Manage Doctors", icon: User },
        { id: "patients", label: "Manage Patients", icon: User },
      ];
    }
    return [];
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Top Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-primary/10 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-md rounded-full"></div>
              <Activity className="h-8 w-8 text-primary relative z-10" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Bayside HMS</h1>
              <p className="text-xs text-muted-foreground capitalize">{userRole} Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-primary/10 min-h-[calc(100vh-73px)] sticky top-[73px] shadow-sm">
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange && onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-primary/10 text-foreground hover:translate-x-1"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <Separator className="my-4" />

          <div className="p-4">
            <Link href="/">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
