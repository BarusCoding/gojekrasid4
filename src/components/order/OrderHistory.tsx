
import React, { useState, useEffect } from 'react';
import { useOrder } from '@/services/orderService';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bike, ShoppingCart, Package, MapPin, Clock } from 'lucide-react';

const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const { getConsumerOrders, cancelOrder } = useOrder();
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    if (user) {
      const userOrders = getConsumerOrders(user.id);
      setOrders(userOrders);
    }
  }, [user]);
  
  const handleCancelOrder = (orderId) => {
    const updatedOrder = cancelOrder(orderId);
    if (updatedOrder) {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );
    }
  };
  
  const getOrderIcon = (type) => {
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
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <div className="mt-6">
      <CardHeader className="px-0">
        <CardTitle>My Orders</CardTitle>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>You don't have any orders yet.</p>
          </div>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getOrderIcon(order.type)}
                    <div>
                      <h3 className="font-medium">{order.type.toUpperCase()}</h3>
                      <p className="text-xs text-gray-500">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {new Date(order.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                
                <div className="space-y-2 mt-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium">From</p>
                      <p className="text-sm">{order.pickup.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium">To</p>
                      <p className="text-sm">{order.destination.address}</p>
                    </div>
                  </div>
                  
                  {order.restaurantName && (
                    <div className="flex items-start gap-2">
                      <ShoppingCart className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium">Restaurant</p>
                        <p className="text-sm">{order.restaurantName}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="font-medium">Rp {order.price.toLocaleString()}</p>
                  </div>
                  
                  {order.status === 'pending' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </CardContent>
    </div>
  );
};

export default OrderHistory;
