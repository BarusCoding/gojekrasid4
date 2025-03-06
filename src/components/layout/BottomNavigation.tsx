
import React from 'react';
import { Home, Search, MapPin, Clock, User, BarChart3, Truck, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface BottomNavigationProps {
  activeTab?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab = 'home' }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Don't show bottom navigation on login page
  if (location.pathname === '/login') {
    return null;
  }
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/login');
  };
  
  // Different navigation items based on user role
  const getNavigationItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { icon: BarChart3, label: 'Dashboard', path: '/admin', value: 'dashboard' },
          { icon: User, label: 'Users', path: '/admin/users', value: 'users' },
          { icon: Truck, label: 'Drivers', path: '/admin/drivers', value: 'drivers' },
          { icon: Clock, label: 'Orders', path: '/admin/orders', value: 'orders' },
          { icon: LogOut, label: 'Logout', path: '#', value: 'logout', onClick: handleLogout },
        ];
      case 'driver':
        return [
          { icon: BarChart3, label: 'Dashboard', path: '/driver', value: 'dashboard' },
          { icon: MapPin, label: 'Map', path: '/driver/map', value: 'map' },
          { icon: Clock, label: 'Orders', path: '/driver/orders', value: 'orders' },
          { icon: User, label: 'Profile', path: '/driver/profile', value: 'profile' },
          { icon: LogOut, label: 'Logout', path: '#', value: 'logout', onClick: handleLogout },
        ];
      case 'consumer':
      default:
        return [
          { icon: Home, label: 'Home', path: '/', value: 'home' },
          { icon: Search, label: 'Search', path: '/search', value: 'search' },
          { icon: Clock, label: 'Orders', path: '/orders', value: 'orders' },
          { icon: MapPin, label: 'Nearby', path: '/nearby', value: 'nearby' },
          { icon: User, label: 'Profile', path: '/profile', value: 'profile' },
        ];
    }
  };
  
  const navItems = getNavigationItems();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          item.onClick ? (
            <button
              key={item.value}
              onClick={item.onClick}
              className={cn(
                "flex flex-col items-center justify-center text-xs w-full h-full px-1",
                "text-gray-500 transition-colors duration-200",
                activeTab === item.value
                  ? "text-gojek-primary"
                  : "hover:text-gray-700"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 mb-1",
                activeTab === item.value
                  ? "text-gojek-primary"
                  : "text-gray-500"
              )} />
              <span>{item.label}</span>
            </button>
          ) : (
            <Link
              key={item.value}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center text-xs w-full h-full px-1",
                "text-gray-500 transition-colors duration-200",
                activeTab === item.value || location.pathname === item.path
                  ? "text-gojek-primary"
                  : "hover:text-gray-700"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 mb-1",
                activeTab === item.value || location.pathname === item.path
                  ? "text-gojek-primary"
                  : "text-gray-500"
              )} />
              <span>{item.label}</span>
            </Link>
          )
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
