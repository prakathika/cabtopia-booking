
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { 
  MenuIcon, 
  X, 
  User, 
  LogOut, 
  CarTaxiFront, 
  LayoutDashboard,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled 
          ? "bg-white/80 backdrop-blur-lg shadow-sm py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-primary font-bold text-2xl"
          >
            <CarTaxiFront strokeWidth={2} size={28} />
            <span className="hidden sm:inline">CabTopia</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/" 
                  ? "text-primary" 
                  : "text-foreground/70 hover:text-foreground hover:bg-secondary/50"
              )}
            >
              Home
            </Link>
            <Link 
              to="/book" 
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/book" 
                  ? "text-primary" 
                  : "text-foreground/70 hover:text-foreground hover:bg-secondary/50"
              )}
            >
              Book a Ride
            </Link>
            {currentUser && (
              <Link 
                to="/profile" 
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === "/profile" 
                    ? "text-primary" 
                    : "text-foreground/70 hover:text-foreground hover:bg-secondary/50"
                )}
              >
                My Rides
              </Link>
            )}
            {isAdmin && (
              <Link 
                to="/admin" 
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === "/admin" 
                    ? "text-primary" 
                    : "text-foreground/70 hover:text-foreground hover:bg-secondary/50"
                )}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* User Menu or Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative group">
                    <User size={20} className="mr-2" />
                    <span className="font-medium">
                      {userProfile?.name?.split(" ")[0] || "Account"}
                    </span>
                    <ChevronDown size={16} className="ml-1 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-light animate-in">
                  <div className="px-4 py-2 flex flex-col">
                    <span className="text-sm font-medium">{userProfile?.name}</span>
                    <span className="text-xs text-muted-foreground">{userProfile?.email}</span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <User size={18} className="mr-2" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center cursor-pointer">
                        <LayoutDashboard size={18} className="mr-2" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => logout()} 
                    className="cursor-pointer text-destructive"
                  >
                    <LogOut size={18} className="mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background animate-fade-in border-t mt-2">
          <div className="container px-4 py-4 space-y-2 flex flex-col">
            <Link 
              to="/" 
              className={cn(
                "px-4 py-3 rounded-md text-base font-medium transition-colors",
                location.pathname === "/" 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-secondary"
              )}
            >
              Home
            </Link>
            <Link 
              to="/book" 
              className={cn(
                "px-4 py-3 rounded-md text-base font-medium transition-colors",
                location.pathname === "/book" 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-secondary"
              )}
            >
              Book a Ride
            </Link>
            {currentUser && (
              <Link 
                to="/profile" 
                className={cn(
                  "px-4 py-3 rounded-md text-base font-medium transition-colors",
                  location.pathname === "/profile" 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-secondary"
                )}
              >
                My Rides
              </Link>
            )}
            {isAdmin && (
              <Link 
                to="/admin" 
                className={cn(
                  "px-4 py-3 rounded-md text-base font-medium transition-colors",
                  location.pathname === "/admin" 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-secondary"
                )}
              >
                Admin
              </Link>
            )}
            <div className="pt-4 mt-2 border-t">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="px-4 py-2">
                    <div className="font-medium">{userProfile?.name}</div>
                    <div className="text-sm text-muted-foreground">{userProfile?.email}</div>
                  </div>
                  <Button 
                    onClick={() => logout()} 
                    variant="ghost" 
                    className="w-full justify-start text-destructive"
                  >
                    <LogOut size={18} className="mr-2" />
                    Log Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login">
                    <Button variant="outline" className="w-full">Log In</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
