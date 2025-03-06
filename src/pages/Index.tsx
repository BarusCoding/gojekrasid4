
import React from 'react';
import Navbar from '../components/layout/Navbar';
import BottomNavigation from '../components/layout/BottomNavigation';
import Hero from '../components/home/Hero';
import FeaturedServices from '../components/home/FeaturedServices';
import RecentActivity from '../components/home/RecentActivity';
import PromoCarousel from '../components/home/PromoCarousel';

const Index: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <Navbar />
      
      <div className="container max-w-lg mx-auto px-4">
        <Hero />
        
        <div className="space-y-6 mt-2">
          <FeaturedServices />
          <PromoCarousel />
          <RecentActivity />
        </div>
      </div>
      
      <BottomNavigation activeTab="home" />
    </main>
  );
};

export default Index;
