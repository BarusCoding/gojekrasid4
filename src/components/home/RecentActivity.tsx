
import React from 'react';
import { Car, ShoppingBag, Utensils, Calendar } from 'lucide-react';

interface ActivityItem {
  id: number;
  title: string;
  date: string;
  type: 'ride' | 'food' | 'shopping' | 'other';
  price: string;
  status: 'completed' | 'in-progress' | 'cancelled';
}

const RecentActivity: React.FC = () => {
  const activities: ActivityItem[] = [
    {
      id: 1,
      title: 'GoRide to Office',
      date: 'Today, 8:30 AM',
      type: 'ride',
      price: 'Rp25.000',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Lunch from Padang Restaurant',
      date: 'Yesterday, 12:15 PM',
      type: 'food',
      price: 'Rp45.000',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Grocery Shopping',
      date: '24 Jun, 4:30 PM',
      type: 'shopping',
      price: 'Rp125.000',
      status: 'completed'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'ride':
        return <Car className="w-5 h-5 text-gojek-primary" />;
      case 'food':
        return <Utensils className="w-5 h-5 text-[#ED4055]" />;
      case 'shopping':
        return <ShoppingBag className="w-5 h-5 text-[#00AED6]" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <a href="#" className="text-sm text-gojek-primary hover:underline">View all</a>
      </div>
      
      <div className="space-y-3">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 mr-3">
              {getIcon(activity.type)}
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{activity.title}</h3>
              <p className="text-xs text-gray-500">{activity.date}</p>
            </div>
            
            <div className="text-right">
              <p className="font-medium">{activity.price}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusClass(activity.status)}`}>
                {activity.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentActivity;
