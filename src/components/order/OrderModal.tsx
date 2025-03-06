
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder, OrderLocation } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';
import { Bike, Car, ShoppingCart, Package, MapPin } from 'lucide-react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: string;
}

const MOCK_LOCATIONS = [
  { address: 'Home - 123 Main Street', latitude: -6.2088, longitude: 106.8456 },
  { address: 'Office - 456 Business Ave', latitude: -6.1751, longitude: 106.8650 },
  { address: 'Mall - Grand Indonesia', latitude: -6.1952, longitude: 106.8222 },
  { address: 'Airport - Soekarno-Hatta', latitude: -6.1256, longitude: 106.6558 },
];

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, service }) => {
  const { user } = useAuth();
  const { placeOrder } = useOrder();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(service || 'goride');
  
  // Form states
  const [pickup, setPickup] = useState<OrderLocation>(MOCK_LOCATIONS[0]);
  const [destination, setDestination] = useState<OrderLocation>(MOCK_LOCATIONS[1]);
  const [notes, setNotes] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [foodItems, setFoodItems] = useState([{ id: '1', name: 'Nasi Goreng', quantity: 1, price: 25000 }]);
  
  const calculatePrice = () => {
    switch (activeTab) {
      case 'goride':
        return 25000; // Base price for GoRide
      case 'gofood':
        return foodItems.reduce((total, item) => total + (item.price * item.quantity), 0) + 15000; // Items + delivery fee
      case 'gomart':
        return 50000; // Base price for GoMart
      case 'gosend':
        return 35000; // Base price for GoSend
      default:
        return 25000;
    }
  };
  
  const handleSubmit = () => {
    if (!user) return;
    
    const orderData = {
      consumerId: user.id,
      type: activeTab as 'goride' | 'gofood' | 'gomart' | 'gosend',
      pickup,
      destination,
      price: calculatePrice(),
      notes,
      ...(activeTab === 'gofood' && { 
        restaurantName, 
        items: foodItems 
      }),
    };
    
    const result = placeOrder(orderData);
    
    if (result) {
      onClose();
      toast({
        title: 'Order placed successfully!',
        description: `Your ${activeTab.toUpperCase()} order is now being processed.`,
      });
    }
  };
  
  const getServiceIcon = () => {
    switch (activeTab) {
      case 'goride':
        return <Bike className="w-5 h-5" />;
      case 'gofood':
        return <ShoppingCart className="w-5 h-5" />;
      case 'gomart':
        return <ShoppingCart className="w-5 h-5" />;
      case 'gosend':
        return <Package className="w-5 h-5" />;
      default:
        return <Bike className="w-5 h-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getServiceIcon()}
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Order
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue={service} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="goride" className="text-xs">GoRide</TabsTrigger>
            <TabsTrigger value="gofood" className="text-xs">GoFood</TabsTrigger>
            <TabsTrigger value="gomart" className="text-xs">GoMart</TabsTrigger>
            <TabsTrigger value="gosend" className="text-xs">GoSend</TabsTrigger>
          </TabsList>
          
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Pickup Location
              </label>
              <select 
                className="w-full p-2 border rounded-md" 
                value={pickup.address}
                onChange={(e) => {
                  const selected = MOCK_LOCATIONS.find(loc => loc.address === e.target.value);
                  if (selected) setPickup(selected);
                }}
              >
                {MOCK_LOCATIONS.map((loc) => (
                  <option key={loc.address} value={loc.address}>{loc.address}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Destination
              </label>
              <select 
                className="w-full p-2 border rounded-md" 
                value={destination.address}
                onChange={(e) => {
                  const selected = MOCK_LOCATIONS.find(loc => loc.address === e.target.value);
                  if (selected) setDestination(selected);
                }}
              >
                {MOCK_LOCATIONS.map((loc) => (
                  <option key={loc.address} value={loc.address}>{loc.address}</option>
                ))}
              </select>
            </div>
            
            {activeTab === 'gofood' && (
              <>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Restaurant</label>
                  <Input
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="Enter restaurant name"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium">Food Items</label>
                  {foodItems.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-2 mb-2">
                      <Input
                        value={item.name}
                        onChange={(e) => {
                          const newItems = [...foodItems];
                          newItems[index] = { ...newItems[index], name: e.target.value };
                          setFoodItems(newItems);
                        }}
                        placeholder="Item name"
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newItems = [...foodItems];
                          newItems[index] = { ...newItems[index], quantity: Number(e.target.value) };
                          setFoodItems(newItems);
                        }}
                        min={1}
                        className="w-16"
                      />
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) => {
                          const newItems = [...foodItems];
                          newItems[index] = { ...newItems[index], price: Number(e.target.value) };
                          setFoodItems(newItems);
                        }}
                        placeholder="Price"
                        className="w-24"
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFoodItems([...foodItems, { id: Date.now().toString(), name: '', quantity: 1, price: 0 }]);
                    }}
                  >
                    Add Item
                  </Button>
                </div>
              </>
            )}
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Additional Notes</label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions..."
              />
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Price</span>
                <span className="text-lg font-bold">Rp {calculatePrice().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-gojek-primary hover:bg-gojek-secondary">
            Place Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
