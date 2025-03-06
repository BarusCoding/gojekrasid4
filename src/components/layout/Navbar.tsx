
import React, { useState, useEffect } from 'react';
import { Bell, Search, User, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/login');
  };

  const navigateToDashboard = () => {
    if (!user) return;
    
    switch (user.role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'driver':
        navigate('/driver');
        break;
      case 'consumer':
      default:
        navigate('/');
        break;
    }
  };

  const getMenuItems = () => {
    if (!user) {
      return [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Promos', path: '/promos' },
      ];
    }
    
    switch (user.role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin' },
          { name: 'Users', path: '/admin/users' },
          { name: 'Drivers', path: '/admin/drivers' },
          { name: 'Orders', path: '/admin/orders' },
          { name: 'Settings', path: '/admin/settings' },
        ];
      case 'driver':
        return [
          { name: 'Dashboard', path: '/driver' },
          { name: 'Map', path: '/driver/map' },
          { name: 'Orders', path: '/driver/orders' },
          { name: 'Profile', path: '/driver/profile' },
        ];
      case 'consumer':
      default:
        return [
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'Orders', path: '/orders' },
          { name: 'Nearby', path: '/nearby' },
        ];
    }
  };

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
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gojek-primary tracking-tight">
                Gojek
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {getMenuItems().map((item, index) => (
              <Link 
                key={index} 
                to={item.path} 
                className="menu-link text-gray-600 hover:text-gojek-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            
            {isAuthenticated ? (
              <>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border-2 border-gojek-primary">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-gojek-primary text-white">
                          {user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground mt-1">
                          Role: <span className="capitalize">{user?.role}</span>
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={navigateToDashboard}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                onClick={() => navigate('/login')}
                className="bg-gojek-primary hover:bg-gojek-secondary text-white"
              >
                Login
              </Button>
            )}
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2">
            <div className="flex flex-col space-y-2">
              {getMenuItems().map((item, index) => (
                <Link 
                  key={index} 
                  to={item.path} 
                  className="py-2 px-4 hover:bg-gray-100 rounded-md text-gray-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated && (
                <button 
                  className="flex items-center py-2 px-4 hover:bg-gray-100 rounded-md text-red-500"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
