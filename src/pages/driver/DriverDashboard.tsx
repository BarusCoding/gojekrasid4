
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bike, Package, MapPin, Clock, CheckCircle, 
  LogOut, User, AlertTriangle
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import BottomNavigation from '@/components/layout/BottomNavigation';

const DriverDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('active');
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your driver account",
    });
    navigate('/login');
  };
  
  // Mock data
  const activeOrders = [
    { id: 1, type: 'GoRide', customer: 'John Doe', pickup: '123 Main St', destination: '456 Oak St', amount: '$12', status: 'active' },
    { id: 2, type: 'GoFood', customer: 'Jane Smith', pickup: 'Burger Place', destination: '789 Pine St', amount: '$25', status: 'active' },
  ];
  
  const historyOrders = [
    { id: 3, type: 'GoSend', customer: 'Mike Johnson', pickup: 'Post Office', destination: '101 Maple Ave', amount: '$8', status: 'completed' },
    { id: 4, type: 'GoRide', customer: 'Sarah Williams', pickup: 'Train Station', destination: '202 Cedar Blvd', amount: '$15', status: 'completed' },
    { id: 5, type: 'GoFood', customer: 'Robert Brown', pickup: 'Pizza Palace', destination: '303 Elm St', amount: '$18', status: 'completed' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Navbar />
      
      <div className="container max-w-lg mx-auto px-4 py-8 pt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Driver Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gojek-primary text-white flex items-center justify-center text-xl font-bold">
                {user?.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold">{user?.name}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <div className="flex items-center mt-1">
                  <Bike className="w-4 h-4 text-gojek-primary mr-1" />
                  <span className="text-sm font-medium">Driver ID: DR-{user?.id}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gojek-primary">$265</div>
                <p className="text-sm text-gray-500">Today's Earnings</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gojek-primary">12</div>
                <p className="text-sm text-gray-500">Completed Trips</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="active" 
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="active">Active Orders</TabsTrigger>
                <TabsTrigger value="history">Order History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active">
                {activeOrders.length > 0 ? (
                  <div className="space-y-4">
                    {activeOrders.map((order) => (
                      <Card key={order.id} className="overflow-hidden">
                        <div className="bg-gojek-primary text-white text-xs font-medium px-4 py-1">
                          {order.type}
                        </div>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{order.customer}</h3>
                            <span className="text-gojek-primary font-bold">{order.amount}</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-gray-500">Pickup</p>
                                <p>{order.pickup}</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-gray-500">Destination</p>
                                <p>{order.destination}</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Button className="w-full bg-gojek-primary hover:bg-gojek-secondary">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Complete
                            </Button>
                            <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Issue
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No active orders</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="history">
                {historyOrders.length > 0 ? (
                  <div className="space-y-4">
                    {historyOrders.map((order) => (
                      <Card key={order.id} className="overflow-hidden">
                        <div className="bg-gray-200 text-gray-700 text-xs font-medium px-4 py-1">
                          {order.type}
                        </div>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{order.customer}</h3>
                            <span className="text-gray-700 font-bold">{order.amount}</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-gray-500">Pickup</p>
                                <p>{order.pickup}</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-gray-500">Destination</p>
                                <p>{order.destination}</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No order history</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <BottomNavigation activeTab="dashboard" />
    </div>
  );
};

export default DriverDashboard;
