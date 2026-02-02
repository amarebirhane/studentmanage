import LandingNavbar from '@/components/layout/landing-navbar';
import { Button } from '@/components/ui/button';
import {
  Users,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Star,
  LayoutDashboard,
  Clock,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background nebula-gradient selection:bg-primary/30">
      <LandingNavbar />

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
              <Star className="h-4 w-4 fill-primary" />
              <span>The #1 Rated School Management System</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Empowering <span className="text-primary">Education</span> with Innovation
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              A complete, all-in-one solution for modern educational institutions.
              Streamline administration, enhance learning, and build a stronger school community.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="h-14 px-8 text-lg font-bold w-full rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold w-full rounded-2xl border-white/20 glass hover:bg-white/10">
                  Live Demo
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" /> No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" /> Setup in minutes
              </div>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right duration-1000">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-[2.5rem] blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-background border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="bg-white/5 p-2 flex items-center gap-2 border-b border-white/10">
                <div className="flex gap-1.5 px-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">dashboard.edusmart.com</div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=2070"
                alt="Dashboard Preview"
                className="w-full h-auto object-cover opacity-90"
              />
            </div>

            {/* Floating Cards */}
            <div className="absolute -bottom-6 -left-6 glass-card p-4 rounded-2xl shadow-2xl animate-bounce-slow">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-2 rounded-xl">
                  <Users className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Students</div>
                  <div className="font-bold">1,200+</div>
                </div>
              </div>
            </div>
            <div className="absolute top-10 -right-6 glass-card p-4 rounded-2xl shadow-2xl animate-float">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-xl">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Attendance</div>
                  <div className="font-bold">98.5%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm">Modules</h2>
            <h3 className="text-4xl lg:text-5xl font-bold tracking-tight">Everything You Need To Grow</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Powerful tools designed to simplify complex school operations and drive academic success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: LayoutDashboard,
                title: "Smart Admin Panel",
                desc: "Full control over staff, students, and curriculum with advanced analytics.",
                color: "blue"
              },
              {
                icon: GraduationCap,
                title: "Student Management",
                desc: "Track academic progress, attendance, and student performance with ease.",
                color: "indigo"
              },
              {
                icon: Users,
                title: "Parent Portal",
                desc: "Keep parents informed with real-time updates on their child's activities.",
                color: "purple"
              },
              {
                icon: BookOpen,
                title: "Curriculum Builder",
                desc: "Design and manage course content, exams, and results digitally.",
                color: "pink"
              },
              {
                icon: Clock,
                title: "Attendance Tracking",
                desc: "Automated attendance marking with instant alerts for parents.",
                color: "orange"
              },
              {
                icon: ShieldCheck,
                title: "Secure Financials",
                desc: "Manage fees, payroll, and school expenses in one secure location.",
                color: "green"
              }
            ].map((feature, idx) => (
              <div key={idx} className="glass-card p-8 rounded-[2rem] border-none group hover:bg-white/5 transition-all duration-300">
                <div className={`h-14 w-14 rounded-2xl bg-${feature.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-7 w-7 text-${feature.color}-500`} />
                </div>
                <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto relative">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full"></div>
          <div className="relative glass-card bg-primary/5 border-primary/20 p-12 lg:p-20 rounded-[3rem] text-center space-y-8 overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight">Ready to modernise your school?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join over 500+ schools worldwide and experience the future of education management.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/30">
                  Get Started Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="ghost" className="h-14 px-10 text-lg font-bold rounded-2xl hover:bg-white/10">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-black/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">EduSmart</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 EduSmart SMS. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

