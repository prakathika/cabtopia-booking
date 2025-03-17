
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const AdminLoginRedirect = () => {
  const navigate = useNavigate();

  const handleAdminLoginRedirect = () => {
    navigate('/admin-login');
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleAdminLoginRedirect}
      className="flex items-center gap-2"
    >
      <ShieldCheck className="h-4 w-4" />
      Admin Login
    </Button>
  );
};

export default AdminLoginRedirect;
