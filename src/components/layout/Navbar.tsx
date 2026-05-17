import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, Heart, MessageSquare, Plus, Search, User } from "lucide-react";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-black shadow-lg">
            U
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            URBAN<span className="font-light text-slate-400">STAY</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
           <Link to="/properties" className="hover:text-primary transition-colors">Discover</Link>
           <Link to="/properties" className="hover:text-primary transition-colors">Featured</Link>
           <Link to="/dashboard" className="hover:text-primary transition-colors">My Listings</Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 p-1 border border-slate-200 rounded-full hover:shadow-md transition-shadow">
             <div className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
                List your property
             </div>
          </div>

          {user ? (
            <>
              <Link 
                to="/dashboard/wishlist"
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "hidden sm:flex")}
              >
                <Heart className="h-5 w-5 text-slate-600" />
              </Link>
              
              <Link 
                to="/dashboard/messages"
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "hidden sm:flex")}
              >
                <MessageSquare className="h-5 w-5 text-slate-600" />
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="relative h-10 w-10 rounded-full cursor-pointer overflow-hidden border border-slate-200">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile?.avatarUrl} alt={profile?.fullName} />
                      <AvatarFallback className="bg-slate-100 text-slate-600">
                        {profile?.fullName?.charAt(0) || user.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex flex-col p-2">
                    <p className="text-sm font-semibold">{profile?.fullName || 'User'}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/dashboard" className="flex items-center gap-2 w-full">
                      <User className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  {profile?.role === 'LANDLORD' && (
                    <DropdownMenuItem>
                      <Link to="/dashboard/create-listing" className="flex items-center gap-2 w-full text-blue-600">
                        <Plus className="h-4 w-4" />
                        <span>Add Listing</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                    onClick={() => auth.signOut().then(() => navigate('/'))}
                  >
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth?mode=login" className={buttonVariants({ variant: "ghost" })}>
                Login
              </Link>
              <Link to="/auth?mode=signup" className={cn(buttonVariants(), "bg-slate-900")}>
                Join Us
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
