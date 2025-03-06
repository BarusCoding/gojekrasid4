
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  icon: LucideIcon;
  color: string;
  description?: string;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  icon: Icon, 
  color, 
  description,
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className="service-card cursor-pointer animate-scale-in"
    >
      <div 
        className="service-icon" 
        style={{ backgroundColor: color }}
      >
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-sm mt-2">{title}</h3>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
};

export default ServiceCard;
