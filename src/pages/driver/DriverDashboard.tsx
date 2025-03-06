
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  MapPin, Clock, TrendingUp, Zap, 
  Navigation, ShieldCheck, Bike, Battery 
} from 'lucide-react';

const DriverDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  
  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };
  
  return (
    <div className="container max-w-lg mx-auto px-4 py-8 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Driver Dashboard</h1>
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
          <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
        </div>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-lg">{user?.name}</h2>
              <p className="text-sm text-gray-500">ID: DR-{user?.id}</p>
            </div>
            <Badge variant={isOnline ? "default" : "outline"} className={isOnline ? "bg-green-500" : ""}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Go Online</span>
            <Switch checked={isOnline} onCheckedChange={toggleOnlineStatus} />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <TrendingUp className="h-8 w-8 text-gojek-primary mb-2" />
              <h3 className="text-xl font-bold">$125.50</h3>
              <p className="text-xs text-gray-500">Today's Earnings</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <Clock className="h-8 w-8 text-gojek-primary mb-2" />
              <h3 className="text-xl font-bold">5:30</h3>
              <p className="text-xs text-gray-500">Hours Online</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <Zap className="h-8 w-8 text-gojek-primary mb-2" />
              <h3 className="text-xl font-bold">12</h3>
              <p className="text-xs text-gray-500">Orders Completed</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 text-gojek-primary mb-2" />
              <h3 className="text-xl font-bold">36.2</h3>
              <p className="text-xs text-gray-500">Kilometers Driven</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Order</CardTitle>
        </CardHeader>
        {isOnline ? (
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Navigation className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Pickup from John Doe</h4>
                <p className="text-sm text-gray-500">123 Main St, 1.2km away</p>
                <div className="mt-2 flex gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Food Delivery</Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">$8.50</Badge>
                </div>
              </div>
              <Button className="bg-gojek-primary hover:bg-gojek-secondary">Accept</Button>
            </div>
          </CardContent>
        ) : (
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Go online to receive orders</p>
          </CardContent>
        )}
      </Card>
      
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bike className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium">Vehicle Health</span>
                </div>
                <Badge className="bg-green-500">Good</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Battery className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium">Fuel Level</span>
                </div>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium">Insurance Status</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverDashboard;
