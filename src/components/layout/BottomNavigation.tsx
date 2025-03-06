
import React from 'react';
import { Home, Search, MapPin, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  activeTab?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab = 'home' }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        <a 
          href="#" 
          className={cn(
            "bottom-nav-item w-full",
            activeTab === 'home' && "active"
          )}
        >
          <Home className="w-6 h-6" />
          <span>Home</span>
        </a>
        
        <a 
          href="#" 
          className={cn(
            "bottom-nav-item w-full",
            activeTab === 'search' && "active"
          )}
        >
          <Search className="w-6 h-6" />
          <span>Search</span>
        </a>
        
        <a 
          href="#" 
          className={cn(
            "bottom-nav-item w-full",
            activeTab === 'orders' && "active"
          )}
        >
          <Clock className="w-6 h-6" />
          <span>Orders</span>
        </a>
        
        <a 
          href="#" 
          className={cn(
            "bottom-nav-item w-full",
            activeTab === 'nearby' && "active"
          )}
        >
          <MapPin className="w-6 h-6" />
          <span>Nearby</span>
        </a>
        
        <a 
          href="#" 
          className={cn(
            "bottom-nav-item w-full",
            activeTab === 'profile' && "active"
          )}
        >
          <User className="w-6 h-6" />
          <span>Profile</span>
        </a>
      </div>
    </div>
  );
};

export default BottomNavigation;
