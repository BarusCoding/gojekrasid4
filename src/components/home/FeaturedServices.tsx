
import React, { useState } from 'react';
import ServiceCard from './ServiceCard';
import OrderModal from '../order/OrderModal';
import { Car, Bike, Package, ShoppingCart, CreditCard, Utensils, Coffee, Store } from 'lucide-react';

const FeaturedServices: React.FC = () => {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  
  const services = [
    { title: 'GoRide', icon: Bike, color: '#00AA5B', description: 'Motorcycle ride', type: 'goride' },
    { title: 'GoCar', icon: Car, color: '#00AA5B', description: 'Car ride', type: 'goride' },
    { title: 'GoFood', icon: Utensils, color: '#ED4055', description: 'Food delivery', type: 'gofood' },
    { title: 'GoMart', icon: ShoppingCart, color: '#D71149', description: 'Grocery shopping', type: 'gomart' },
    { title: 'GoSend', icon: Package, color: '#00AED6', description: 'Package delivery', type: 'gosend' },
    { title: 'GoPay', icon: CreditCard, color: '#00AED6', description: 'Digital payments', type: 'none' },
    { title: 'GoMore', icon: Store, color: '#7D3AC1', description: 'More services', type: 'none' },
    { title: 'GoCoffee', icon: Coffee, color: '#EE8C33', description: 'Coffee delivery', type: 'gofood' },
  ];

  const handleServiceClick = (serviceType: string) => {
    if (serviceType !== 'none') {
      setSelectedService(serviceType);
      setOrderModalOpen(true);
    }
  };

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
            onClick={() => handleServiceClick(service.type)}
          />
        ))}
      </div>
      
      {orderModalOpen && (
        <OrderModal 
          isOpen={orderModalOpen} 
          onClose={() => setOrderModalOpen(false)} 
          service={selectedService} 
        />
      )}
    </section>
  );
};

export default FeaturedServices;
