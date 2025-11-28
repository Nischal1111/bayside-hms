import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, FileText, Users, Shield, HeartPulse, ClipboardList, DollarSign } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="border-b border-primary/10 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-md rounded-full"></div>
              <Activity className="h-8 w-8 text-primary relative z-10" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Bayside HMS</h1>
              <p className="text-xs text-muted-foreground">Healthcare Excellence</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="shadow-md hover:shadow-lg transition-shadow">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="inline-block mb-4">
          <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            Modern Healthcare Management
          </span>
        </div>
        <h2 className="text-6xl font-bold mb-6 text-foreground bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
          Bayside Hospital Management System
        </h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
          A comprehensive, secure, and modern solution for managing outpatient services,
          appointments, electronic medical records, billing, and analytics.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/register">
            <Button size="lg" className="text-lg px-10 py-6 shadow-lg hover:shadow-xl transition-all">
              Get Started Free
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-2">
              Sign In
            </Button>
          </Link>
          <Link href="/admin">
            <Button size="lg" variant="secondary" className="text-lg px-10 py-6 gap-2">
              <Shield className="h-5 w-5" />
              Admin Portal
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-4 text-foreground">
            Comprehensive Features
          </h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to manage a modern healthcare facility efficiently
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Users className="h-12 w-12" />}
            title="Patient Management"
            description="Easy patient registration with comprehensive health records and dual-layer validation"
          />
          <FeatureCard
            icon={<Calendar className="h-12 w-12" />}
            title="Appointment Scheduling"
            description="Interactive calendar with conflict resolution and real-time availability"
          />
          <FeatureCard
            icon={<HeartPulse className="h-12 w-12" />}
            title="Electronic Medical Records"
            description="Complete EMR system with diagnosis, prescriptions, and treatment history"
          />
          <FeatureCard
            icon={<ClipboardList className="h-12 w-12" />}
            title="Analytics & Reporting"
            description="Comprehensive dashboards with charts and performance indicators"
          />
          <FeatureCard
            icon={<DollarSign className="h-12 w-12" />}
            title="Billing & Payments"
            description="Automated invoice generation and payment processing with secure gateway"
          />
          <FeatureCard
            icon={<FileText className="h-12 w-12" />}
            title="Patient Feedback"
            description="Rating and feedback system for continuous quality improvement"
          />
          <FeatureCard
            icon={<Shield className="h-12 w-12" />}
            title="Role-Based Access"
            description="Secure RBAC with JWT authentication and session management"
          />
          <FeatureCard
            icon={<Activity className="h-12 w-12" />}
            title="Real-time Monitoring"
            description="Live system monitoring with performance optimization"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/10 bg-white/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="font-semibold text-foreground">Bayside HMS</span>
            </div>
            <p className="text-muted-foreground text-sm">
              &copy; 2025 Bayside Hospital Management System. All rights reserved.
            </p>
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-2">
                <Shield className="h-4 w-4" />
                Admin Access
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-primary/10 hover:border-primary/30 hover:-translate-y-1">
      <div className="mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h4 className="text-xl font-bold mb-3 text-foreground">{title}</h4>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
