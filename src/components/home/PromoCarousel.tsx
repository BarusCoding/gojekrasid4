
import React, { useState, useEffect, useRef } from 'react';

interface PromoItem {
  id: number;
  title: string;
  description: string;
  color: string;
}

const PromoCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  
  const promos: PromoItem[] = [
    {
      id: 1,
      title: '50% OFF your first ride',
      description: 'Use code: GOFIRST50',
      color: 'from-gojek-primary to-gojek-dark'
    },
    {
      id: 2,
      title: 'Free delivery on GoFood',
      description: 'Min. order Rp50.000',
      color: 'from-[#ED4055] to-[#D71149]'
    },
    {
      id: 3,
      title: '25% cashback with GoPay',
      description: 'Up to Rp25.000',
      color: 'from-[#00AED6] to-[#0097B5]'
    }
  ];

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = window.setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === promos.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => {
      resetTimeout();
    };
  }, [currentIndex, promos.length]);

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Special Offers</h2>
        <a href="#" className="text-sm text-gojek-primary hover:underline">All promos</a>
      </div>
      
      <div className="relative">
        <div className="overflow-hidden rounded-xl">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {promos.map((promo) => (
              <div 
                key={promo.id} 
                className="min-w-full p-0.5"
              >
                <div 
                  className={`h-36 rounded-xl bg-gradient-to-r ${promo.color} p-5 relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white opacity-10 -mr-6 -mt-6"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white opacity-10 -ml-6 -mb-6"></div>
                  
                  <div className="relative h-full flex flex-col justify-center">
                    <span className="bg-white bg-opacity-20 text-white text-xs py-1 px-3 rounded-full w-fit mb-2">
                      Limited time
                    </span>
                    <h3 className="text-white text-xl font-bold mb-1">{promo.title}</h3>
                    <p className="text-white text-sm opacity-90">{promo.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center mt-4">
          {promos.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 mx-1 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-gojek-primary w-4' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoCarousel;
