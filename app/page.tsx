import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, FileText, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Bayside HMS</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6 text-gray-900">
          Welcome to Bayside Hospital Management System
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A comprehensive solution for managing outpatient services, appointments,
          medical records, billing, and more.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Key Features
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Users className="h-12 w-12 text-primary" />}
            title="Patient Management"
            description="Easy patient registration and comprehensive health records management"
          />
          <FeatureCard
            icon={<Calendar className="h-12 w-12 text-primary" />}
            title="Appointment Scheduling"
            description="Interactive calendar for scheduling and managing appointments"
          />
          <FeatureCard
            icon={<FileText className="h-12 w-12 text-primary" />}
            title="Medical Records"
            description="Complete electronic medical records with diagnosis and prescriptions"
          />
          <FeatureCard
            icon={<Activity className="h-12 w-12 text-primary" />}
            title="Analytics & Reports"
            description="Comprehensive reporting and analytics dashboard"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2025 Bayside Hospital Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h4 className="text-xl font-semibold mb-2 text-gray-900">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
