
import React from "react";
import { Link } from "react-router-dom";
import { CarTaxiFront, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
              <CarTaxiFront strokeWidth={2} />
              <span>CabTopia</span>
            </Link>
            <p className="mt-4 text-muted-foreground text-sm">
              Premium cab booking service for safe and comfortable rides anywhere in the city.
            </p>
            <div className="flex space-x-4 mt-6">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-md mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/book" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Book a Ride
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  My Rides
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="font-semibold text-md mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Safety Guidelines
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-semibold text-md mb-4">Contact</h3>
            <address className="not-italic text-sm text-muted-foreground">
              <p>123 Ride Avenue</p>
              <p>New York, NY 10001</p>
              <p className="mt-2">Email: contact@cabtopia.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </address>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} CabTopia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
