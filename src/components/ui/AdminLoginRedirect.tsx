
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '@/lib/firebase';

const AdminLoginRedirect = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAdminLogin = async () => {
    try {
      await login(ADMIN_EMAIL, ADMIN_PASSWORD);
      navigate('/admin');
    } catch (error) {
      console.error("Admin login failed:", error);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleAdminLogin}
      className="flex items-center gap-2"
    >
      Admin Login
    </Button>
  );
};

export default AdminLoginRedirect;
