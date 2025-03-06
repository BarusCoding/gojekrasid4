
import React from 'react';
import ServiceCard from './ServiceCard';
import { Car, Bike, Package, ShoppingCart, CreditCard, Utensils, Coffee, Store } from 'lucide-react';

const FeaturedServices: React.FC = () => {
  const services = [
    { title: 'GoRide', icon: Bike, color: '#00AA5B', description: 'Motorcycle ride' },
    { title: 'GoCar', icon: Car, color: '#00AA5B', description: 'Car ride' },
    { title: 'GoFood', icon: Utensils, color: '#ED4055', description: 'Food delivery' },
    { title: 'GoMart', icon: ShoppingCart, color: '#D71149', description: 'Grocery shopping' },
    { title: 'GoSend', icon: Package, color: '#00AED6', description: 'Package delivery' },
    { title: 'GoPay', icon: CreditCard, color: '#00AED6', description: 'Digital payments' },
    { title: 'GoMore', icon: Store, color: '#7D3AC1', description: 'More services' },
    { title: 'GoCoffee', icon: Coffee, color: '#EE8C33', description: 'Coffee delivery' },
  ];

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Services</h2>
        <a href="#" className="text-sm text-gojek-primary hover:underline">View all</a>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            title={service.title}
            icon={service.icon}
            color={service.color}
            description={service.description}
            onClick={() => console.log(`${service.title} clicked`)}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedServices;
