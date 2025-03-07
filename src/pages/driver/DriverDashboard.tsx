import React, { useState, useEffect } from 'react';
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
import { useOrder, Order } from '@/services/orderService';

const DriverDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('active');
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [historyOrders, setHistoryOrders] = useState<Order[]>([]);
  const { getPendingOrdersForDrivers, acceptOrder, completeOrder } = useOrder();
  
  useEffect(() => {
    if (user) {
      const pendingOrders = getPendingOrdersForDrivers();
      setActiveOrders(pendingOrders);
      setHistoryOrders([
        {
          id: 'order-3',
          type: 'gosend',
          status: 'completed',
          consumerId: 'consumer-1',
          driverId: user.id,
          price: 8000,
          timestamp: Date.now() - 86400000,
          pickup: {
            address: 'Post Office',
            latitude: -6.2088,
            longitude: 106.8456
          },
          destination: {
            address: '101 Maple Ave',
            latitude: -6.2297,
            longitude: 106.8251
          }
        },
        {
          id: 'order-4',
          type: 'goride',
          status: 'completed',
          consumerId: 'consumer-2',
          driverId: user.id,
          price: 15000,
          timestamp: Date.now() - 172800000,
          pickup: {
            address: 'Train Station',
            latitude: -6.1934,
            longitude: 106.8241
          },
          destination: {
            address: '202 Cedar Blvd',
            latitude: -6.1957,
            longitude: 106.8231
          }
        }
      ]);
    }
  }, [user, getPendingOrdersForDrivers]);
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your driver account",
    });
    navigate('/login');
  };
  
  const handleCompleteOrder = (orderId: string) => {
    const completedOrder = completeOrder(orderId);
    if (completedOrder) {
      setActiveOrders(prev => prev.filter(order => order.id !== orderId));
      setHistoryOrders(prev => [
        {
          ...completedOrder,
          status: 'completed',
          driverId: user?.id
        } as Order,
        ...prev
      ]);
      toast({
        title: "Order Completed!",
        description: "The order has been marked as completed.",
      });
    }
  };
  
  const handleAcceptOrder = (orderId: string) => {
    if (user) {
      const updatedOrder = acceptOrder(orderId, user.id);
      if (updatedOrder) {
        const updatedActiveOrders = activeOrders.map(order => 
          order.id === orderId ? { ...order, status: 'accepted', driverId: user.id } : order
        );
        setActiveOrders(updatedActiveOrders);
        toast({
          title: "Order Accepted!",
          description: "You have accepted the order. Navigate to the pickup location.",
        });
      }
    }
  };
  
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
                            <h3 className="font-medium">Customer ID: {order.consumerId}</h3>
                            <span className="text-gojek-primary font-bold">{order.price.toLocaleString('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-gray-500">Pickup</p>
                                <p>{order.pickup.address}</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-gray-500">Destination</p>
                                <p>{order.destination.address}</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            {order.status === 'pending' ? (
                              <Button 
                                className="w-full bg-gojek-primary hover:bg-gojek-secondary"
                                onClick={() => handleAcceptOrder(order.id)}
                              >
                                <Bike className="w-4 h-4 mr-2" />
                                Accept Order
                              </Button>
                            ) : (
                              <Button 
                                className="w-full bg-gojek-primary hover:bg-gojek-secondary"
                                onClick={() => handleCompleteOrder(order.id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Complete Order
                              </Button>
                            )}
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
                            <h3 className="font-medium">{order.consumerId}</h3>
                            <span className="text-gray-700 font-bold">{order.price.toLocaleString('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-gray-500">Pickup</p>
                                <p>{order.pickup.address}</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-gray-500">Destination</p>
                                <p>{order.destination.address}</p>
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
