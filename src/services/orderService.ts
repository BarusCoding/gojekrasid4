
import { useToast } from "@/hooks/use-toast";

export interface OrderLocation {
  address: string;
  latitude: number;
  longitude: number;
}

export interface Order {
  id: string;
  type: 'goride' | 'gofood' | 'gomart' | 'gosend';
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  consumerId: string;
  driverId?: string;
  price: number;
  timestamp: number;
  pickup: OrderLocation;
  destination: OrderLocation;
  items?: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  restaurantName?: string;
  notes?: string;
}

// Mock local storage-based order service
export const orderService = {
  createOrder: (order: Omit<Order, 'id' | 'timestamp' | 'status'>): Order => {
    const newOrder = {
      ...order,
      id: `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: Date.now(),
      status: 'pending' as const
    };
    
    const orders = orderService.getOrders();
    orders.push(newOrder);
    localStorage.setItem('gojek_orders', JSON.stringify(orders));
    
    return newOrder;
  },
  
  getOrders: (): Order[] => {
    const ordersJson = localStorage.getItem('gojek_orders');
    return ordersJson ? JSON.parse(ordersJson) : [];
  },
  
  getOrder: (id: string): Order | undefined => {
    const orders = orderService.getOrders();
    return orders.find(order => order.id === id);
  },
  
  updateOrderStatus: (orderId: string, status: Order['status'], driverId?: string): Order | undefined => {
    const orders = orderService.getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
      orders[orderIndex] = {
        ...orders[orderIndex],
        status,
        ...(driverId && { driverId })
      };
      
      localStorage.setItem('gojek_orders', JSON.stringify(orders));
      return orders[orderIndex];
    }
    
    return undefined;
  },
  
  getOrdersByConsumerId: (consumerId: string): Order[] => {
    const orders = orderService.getOrders();
    return orders.filter(order => order.consumerId === consumerId);
  },
  
  getPendingOrdersForDrivers: (): Order[] => {
    const orders = orderService.getOrders();
    return orders.filter(order => order.status === 'pending');
  },
  
  getOrdersByDriverId: (driverId: string): Order[] => {
    const orders = orderService.getOrders();
    return orders.filter(order => order.driverId === driverId);
  }
};

// Custom hook for ordering
export const useOrder = () => {
  const { toast } = useToast();
  
  const placeOrder = (orderData: Omit<Order, 'id' | 'timestamp' | 'status'>) => {
    try {
      const newOrder = orderService.createOrder(orderData);
      toast({
        title: "Order Placed!",
        description: `Your ${orderData.type.toUpperCase()} order has been placed successfully.`,
      });
      return newOrder;
    } catch (error) {
      toast({
        title: "Failed to place order",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  const acceptOrder = (orderId: string, driverId: string) => {
    try {
      const updatedOrder = orderService.updateOrderStatus(orderId, 'accepted', driverId);
      if (updatedOrder) {
        toast({
          title: "Order Accepted!",
          description: `You have accepted the ${updatedOrder.type.toUpperCase()} order.`,
        });
      }
      return updatedOrder;
    } catch (error) {
      toast({
        title: "Failed to accept order",
        description: "There was an error accepting the order. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  const completeOrder = (orderId: string) => {
    try {
      const updatedOrder = orderService.updateOrderStatus(orderId, 'completed');
      if (updatedOrder) {
        toast({
          title: "Order Completed!",
          description: `The ${updatedOrder.type.toUpperCase()} order has been completed.`,
        });
      }
      return updatedOrder;
    } catch (error) {
      toast({
        title: "Failed to complete order",
        description: "There was an error completing the order. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  const cancelOrder = (orderId: string) => {
    try {
      const updatedOrder = orderService.updateOrderStatus(orderId, 'cancelled');
      if (updatedOrder) {
        toast({
          title: "Order Cancelled",
          description: `The ${updatedOrder.type.toUpperCase()} order has been cancelled.`,
        });
      }
      return updatedOrder;
    } catch (error) {
      toast({
        title: "Failed to cancel order",
        description: "There was an error cancelling the order. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  return {
    placeOrder,
    acceptOrder,
    completeOrder,
    cancelOrder,
    getConsumerOrders: orderService.getOrdersByConsumerId,
    getPendingOrdersForDrivers: orderService.getPendingOrdersForDrivers,
    getDriverOrders: orderService.getOrdersByDriverId,
    getOrder: orderService.getOrder
  };
};
