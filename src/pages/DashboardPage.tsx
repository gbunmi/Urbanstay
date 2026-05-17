import { useState } from "react";
import { Link, useLocation, Routes, Route } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  BarChart3, 
  ChevronRight, 
  Heart, 
  Home, 
  LayoutDashboard, 
  LogOut, 
  MessageSquare, 
  PlusCircle, 
  Settings, 
  User,
  Users
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import ChatPage from "./ChatPage";

export default function DashboardPage() {
  const { profile } = useAuth();
  const location = useLocation();

  const getMenuItems = () => {
    const base = [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
      { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/dashboard/messages' },
      { id: 'profile', label: 'My Profile', icon: User, path: '/dashboard/profile' },
    ];

    if (profile?.role === 'TENANT') {
      return [
        ...base,
        { id: 'wishlist', label: 'Wishlist', icon: Heart, path: '/dashboard/wishlist' },
        { id: 'rentals', label: 'My Rentals', icon: Home, path: '/dashboard/rentals' },
      ];
    }

    if (profile?.role === 'LANDLORD' || profile?.role === 'AGENT') {
      return [
        ...base,
        { id: 'listings', label: 'My Listings', icon: Home, path: '/dashboard/listings' },
        { id: 'stats', label: 'Analytics', icon: BarChart3, path: '/dashboard/stats' },
        { id: 'create', label: 'Add Property', icon: PlusCircle, path: '/dashboard/create-listing' },
      ];
    }

    return base;
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-[#FDFDFD]">
      {/* Sidebar */}
      <aside className="w-72 border-r border-slate-100 bg-slate-50/50 hidden lg:flex flex-col sticky top-20 h-[calc(100vh-80px)]">
        <div className="p-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 px-4">Dashboard</h3>
            <div className="space-y-1">
                {getMenuItems().map((item) => (
                    <Link
                        key={item.id}
                        to={item.path}
                        className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "w-full justify-start gap-4 h-12 px-4 font-bold transition-all border-none shadow-none",
                            location.pathname === item.path ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-100/50"
                        )}
                    >
                        <item.icon className={cn("h-4 w-4", location.pathname === item.path ? "text-primary" : "text-slate-400")} />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>

        <div className="mt-auto p-8 space-y-6">
            <div className="p-4 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200">
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Available Liquidity</p>
                <h4 className="text-xl font-bold font-serif">₦14,250,000</h4>
                <Button className="mt-4 w-full py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-primary/90 transition-all border-none">
                    View Wallet
                </Button>
            </div>
            <Separator className="bg-slate-100" />
            <Button 
                variant="ghost" 
                className="w-full justify-start gap-4 h-12 text-slate-400 font-bold hover:bg-red-50 hover:text-red-600 border-none shadow-none"
                onClick={() => auth.signOut()}
            >
                <LogOut className="h-4 w-4" />
                <span>End Session</span>
            </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/messages" element={<ChatPage />} />
          <Route path="*" element={<div className="flex flex-col items-center justify-center py-20 text-slate-400 font-bold uppercase tracking-widest">Component coming soon</div>} />
        </Routes>
      </main>
    </div>
  );
}

function DashboardOverview() {
    const { profile } = useAuth();
    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-12">
                <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">Account Overview</h4>
                    <h1 className="text-5xl font-serif font-medium text-slate-900 tracking-tight leading-none">
                        Welcome, {profile?.fullName?.split(' ')[0] || 'User'}
                    </h1>
                </div>
                <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                    <Button variant="ghost" className="bg-white shadow-sm font-black text-[10px] uppercase tracking-widest px-6 h-9 rounded-md">Grid View</Button>
                    <Button variant="ghost" className="text-slate-500 font-black text-[10px] uppercase tracking-widest px-6 h-9 rounded-md">Activity</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <DashboardMetric 
                    label="Active Bookings" 
                    value="4" 
                    change="+12%" 
                    icon={Home} 
                />
                <DashboardMetric 
                    label="Saved Lists" 
                    value="12" 
                    icon={Heart} 
                />
                <DashboardMetric 
                    label="Messages" 
                    value="24" 
                    change="6 new" 
                    icon={MessageSquare} 
                    alert
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-slate-900 uppercase tracking-tight">Recent Activity</h3>
                            <Button variant="link" size="sm" className="text-blue-500 font-bold p-0 h-auto">View all</Button>
                        </div>
                        <div className="space-y-6">
                            {[1,2,3].map(i => (
                                <div key={i} className="flex gap-4 group cursor-pointer">
                                    <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                        <Home className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-800">Inspection requested for Lekki Penthouse</p>
                                        <p className="text-xs text-slate-500 mt-0.5 font-medium">May 15, 2026 • 2:30 PM</p>
                                    </div>
                                    <Badge variant="secondary" className="h-fit">Pending</Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-8">
                   <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black tracking-tighter leading-none mb-4">VERIFY YOUR IDENTITY</h3>
                            <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed italic">
                                Increase your trust score and get prioritized by top landlords.
                            </p>
                            <Button className="w-full bg-white text-slate-900 font-black hover:bg-slate-100 rounded-xl">
                                Start KYC Process
                            </Button>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                   </div>
                </div>
            </div>
        </div>
    );
}

function DashboardMetric({ label, value, change, icon: Icon, alert }: any) {
    return (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all cursor-default">
            <div className="flex justify-between items-start mb-6">
                <div className={cn(
                    "p-4 rounded-xl",
                    alert ? "bg-red-50 text-red-600" : "bg-primary/10 text-primary"
                )}>
                    <Icon className="h-6 w-6" />
                </div>
                {change && (
                    <div className="flex flex-col items-end">
                        <span className={cn(
                            "text-[10px] font-black uppercase px-2 py-1 rounded-full tracking-widest",
                            change.startsWith('+') ? "bg-green-50 text-green-600" : "bg-primary/5 text-primary"
                        )}>
                            {change}
                        </span>
                    </div>
                )}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-serif font-bold text-slate-900 tracking-tight">{value}</span>
                </div>
            </div>
        </div>
    );
}
