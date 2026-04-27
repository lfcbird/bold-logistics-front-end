import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Loader2, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("dispatcher@bold.com");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between bg-gradient-hero p-12 text-white overflow-hidden">
        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-brand-blue/30 blur-3xl" />
        <div className="absolute bottom-0 -left-20 h-96 w-96 rounded-full bg-brand-purple/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <Truck className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-display text-lg font-bold">Bold Logistics</p>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Automation Platform</p>
          </div>
        </div>

        <div className="relative space-y-6">
          <h1 className="font-display text-4xl xl:text-5xl font-bold leading-tight">
            Move freight, <br />
            <span className="bg-gradient-to-r from-brand-gold to-white bg-clip-text text-transparent">not paperwork.</span>
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            One platform for customers, orders, dispatches, drivers, vehicles, and documents — built for small and mid-sized carriers.
          </p>
          <div className="space-y-3 pt-4">
            {[
              { icon: Zap, text: "Real-time dispatch & status updates" },
              { icon: ShieldCheck, text: "Secure document vault for BOLs & PODs" },
              { icon: CheckCircle2, text: "KPI dashboards your team will actually use" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <f.icon className="h-4 w-4 text-brand-gold" />
                </div>
                <span className="text-sm text-white/90">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/50">© {new Date().getFullYear()} Bold Technology Solutions</p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-blue shadow-glow">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-lg font-bold">Bold Logistics</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold">Sign in to your account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials to access the dispatcher console.
          </p>

          <Card className="mt-8 p-6 shadow-elevated">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button type="button" className="text-xs text-brand-blue hover:underline">Forgot password?</button>
                </div>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-gradient-blue hover:opacity-95 text-white shadow-md h-11 font-semibold">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…</> : "Sign in"}
              </Button>
            </form>

            <div className="mt-5 rounded-lg border border-dashed bg-muted/40 p-3 text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Demo mode</p>
              Any email + password will sign you in. The UI runs against in-memory data so you can explore every screen.
            </div>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Need an account? <a href="https://www.boldtechnologysolutions.us/" target="_blank" rel="noreferrer" className="text-brand-blue font-medium hover:underline">Contact Bold Technology Solutions</a>
          </p>
        </div>
      </div>
    </div>
  );
}
