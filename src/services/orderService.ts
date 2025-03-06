
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

// Sample orders for demonstration
const sampleOrders: Order[] = [
  {
    id: 'order-123456',
    type: 'goride',
    status: 'pending',
    consumerId: '3',
    price: 25000,
    timestamp: Date.now() - 3600000,
    pickup: {
      address: 'Jl. Sudirman No. 1, Jakarta',
      latitude: -6.2088,
      longitude: 106.8456
    },
    destination: {
      address: 'Jl. Gatot Subroto No. 10, Jakarta',
      latitude: -6.2297,
      longitude: 106.8251
    },
    notes: 'Please call when you arrive'
  },
  {
    id: 'order-123457',
    type: 'gofood',
    status: 'pending',
    consumerId: '3',
    price: 78000,
    timestamp: Date.now() - 7200000,
    pickup: {
      address: 'McDonalds Sarinah',
      latitude: -6.1934,
      longitude: 106.8241
    },
    destination: {
      address: 'Jl. Thamrin No. 25, Jakarta',
      latitude: -6.1957,
      longitude: 106.8231
    },
    restaurantName: 'McDonalds',
    items: [
      {
        id: 'item-1',
        name: 'Big Mac',
        quantity: 2,
        price: 50000
      },
      {
        id: 'item-2',
        name: 'Fries',
        quantity: 1,
        price: 28000
      }
    ],
    notes: 'Extra ketchup please'
  }
];

// Initialize local storage with sample orders if none exist
const initializeOrders = () => {
  if (!localStorage.getItem('gojek_orders')) {
    localStorage.setItem('gojek_orders', JSON.stringify(sampleOrders));
  }
};

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
    initializeOrders();
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

// Call initialize when the module is loaded
initializeOrders();

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
