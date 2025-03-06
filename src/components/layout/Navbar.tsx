
import React, { useState, useEffect } from 'react';
import { Bell, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3",
        scrolled 
          ? "bg-white bg-opacity-90 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-xl font-bold text-gojek-primary tracking-tight">
                Gojek
              </span>
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="menu-link">
              Home
            </a>
            <a href="#" className="menu-link">
              Services
            </a>
            <a href="#" className="menu-link">
              Promos
            </a>
            <a href="#" className="menu-link">
              Orders
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-1 rounded-full border-2 border-gojek-primary text-gojek-primary hover:bg-gojek-light transition-colors duration-200">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
