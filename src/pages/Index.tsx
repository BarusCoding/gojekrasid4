
import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import BottomNavigation from '../components/layout/BottomNavigation';
import Hero from '../components/home/Hero';
import FeaturedServices from '../components/home/FeaturedServices';
import RecentActivity from '../components/home/RecentActivity';
import PromoCarousel from '../components/home/PromoCarousel';
import OrderHistory from '../components/order/OrderHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState('home');

  // Update active tab based on location
  useEffect(() => {
    if (location.pathname === '/orders') {
      setActiveTab('orders');
    } else if (location.pathname === '/search') {
      setActiveTab('search');
    } else if (location.pathname === '/nearby') {
      setActiveTab('nearby');
    } else if (location.pathname === '/profile') {
      setActiveTab('profile');
    } else {
      setActiveTab('home');
    }
  }, [location.pathname]);

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <Navbar />
      
      <div className="container max-w-lg mx-auto px-4 pt-16">
        <Hero />
        
        <Tabs 
          value={activeTab === 'orders' ? 'orders' : 'home'} 
          className="mt-4"
          onValueChange={(value) => {
            setActiveTab(value === 'orders' ? 'orders' : 'home');
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="home" className="space-y-6 mt-2">
            <FeaturedServices />
            <PromoCarousel />
            <RecentActivity />
          </TabsContent>
          
          <TabsContent value="orders">
            {isAuthenticated ? (
              <OrderHistory />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Please login to view your orders.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNavigation activeTab={activeTab} />
    </main>
  );
};

export default Index;
