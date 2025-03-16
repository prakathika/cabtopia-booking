
import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getUserProfile, onAuthStateChange, signIn, signOut, signUp } from "@/lib/firebase";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  createdAt: any;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setUserProfile(profile as UserProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signIn(email, password);
      toast.success("Successfully logged in");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, phone: string) => {
    try {
      setLoading(true);
      await signUp(email, password, name, phone);
      toast.success("Account created successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to logout");
      throw error;
    }
  };

  const isAdmin = userProfile?.role === "admin";

  const value = {
    currentUser,
    userProfile,
    isAdmin,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
