
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  MapPin, Clock, TrendingUp, Zap, 
  Navigation, ShieldCheck, Bike, Battery,
  Package, ShoppingCart, CheckCircle2, XCircle
} from 'lucide-react';
import { useOrder, Order } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';

const DriverDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const { acceptOrder, completeOrder, getPendingOrdersForDrivers, getDriverOrders } = useOrder();
  
  useEffect(() => {
    if (isOnline && user) {
      // Check if driver already has an active order
      const driverOrders = getDriverOrders(user.id);
      const activeOrder = driverOrders.find(order => order.status === 'accepted');
      
      if (activeOrder) {
        setCurrentOrder(activeOrder);
      } else {
        // Get available orders
        const pendingOrders = getPendingOrdersForDrivers();
        setAvailableOrders(pendingOrders);
      }
      
      // Set up polling to refresh available orders
      const interval = setInterval(() => {
        if (!currentOrder) {
          const freshPendingOrders = getPendingOrdersForDrivers();
          setAvailableOrders(freshPendingOrders);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    } else {
      setAvailableOrders([]);
    }
  }, [isOnline, currentOrder, user]);
  
  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    
    if (!isOnline) {
      toast({
        title: "You're now online!",
        description: "You can now receive order requests.",
      });
    } else {
      toast({
        title: "You're now offline",
        description: "You won't receive any new orders.",
      });
    }
  };
  
  const handleAcceptOrder = (orderId: string) => {
    if (!user) return;
    
    const result = acceptOrder(orderId, user.id);
    if (result) {
      setCurrentOrder(result);
      setAvailableOrders([]);
    }
  };
  
  const handleCompleteOrder = () => {
    if (!currentOrder) return;
    
    const result = completeOrder(currentOrder.id);
    if (result) {
      toast({
        title: "Order Completed!",
        description: "Great job! The order has been marked as completed.",
      });
      setCurrentOrder(null);
    }
  };
  
  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case 'goride':
        return <Bike className="h-6 w-6 text-green-500" />;
      case 'gofood':
        return <ShoppingCart className="h-6 w-6 text-red-500" />;
      case 'gomart':
        return <ShoppingCart className="h-6 w-6 text-purple-500" />;
      case 'gosend':
        return <Package className="h-6 w-6 text-blue-500" />;
      default:
        return <Bike className="h-6 w-6 text-green-500" />;
    }
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
            {currentOrder ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    {getServiceTypeIcon(currentOrder.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">
                        {currentOrder.type.toUpperCase()} Order
                      </h4>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        In Progress
                      </Badge>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium">Pickup</p>
                          <p className="text-sm">{currentOrder.pickup.address}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium">Destination</p>
                          <p className="text-sm">{currentOrder.destination.address}</p>
                        </div>
                      </div>
                      
                      {currentOrder.notes && (
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium">Notes</p>
                            <p className="text-sm">{currentOrder.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t">
                      <div>
                        <p className="text-xs text-gray-500">Earning</p>
                        <p className="font-medium">Rp {currentOrder.price.toLocaleString()}</p>
                      </div>
                      
                      <Button
                        className="bg-green-500 hover:bg-green-600 gap-1"
                        onClick={handleCompleteOrder}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Complete Order
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : availableOrders.length > 0 ? (
              <div className="space-y-4">
                {availableOrders.map((order) => (
                  <div key={order.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      {getServiceTypeIcon(order.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{order.type.toUpperCase()} Order</h4>
                      <p className="text-sm text-gray-500">
                        From: {order.pickup.address.substring(0, 20)}...
                      </p>
                      <p className="text-sm text-gray-500">
                        To: {order.destination.address.substring(0, 20)}...
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {order.type}
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Rp {order.price.toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      className="bg-gojek-primary hover:bg-gojek-secondary"
                      onClick={() => handleAcceptOrder(order.id)}
                    >
                      Accept
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No orders available at the moment</p>
                <p className="text-sm">Stay online to receive new orders</p>
              </div>
            )}
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
