
import React from 'react';
import Navbar from '../components/layout/Navbar';
import BottomNavigation from '../components/layout/BottomNavigation';
import Hero from '../components/home/Hero';
import FeaturedServices from '../components/home/FeaturedServices';
import RecentActivity from '../components/home/RecentActivity';
import PromoCarousel from '../components/home/PromoCarousel';
import OrderHistory from '../components/order/OrderHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <Navbar />
      
      <div className="container max-w-lg mx-auto px-4">
        <Hero />
        
        <Tabs defaultValue="home" className="mt-4">
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
      
      <BottomNavigation activeTab="home" />
    </main>
  );
};

export default Index;
