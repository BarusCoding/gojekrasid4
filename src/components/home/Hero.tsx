
import React from 'react';
import SearchBar from '../shared/SearchBar';

const Hero: React.FC = () => {
  return (
    <section className="pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-6 animate-fade-in">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gojek-light text-gojek-primary text-xs font-medium mb-3">
            New! GoPayLater with flexible payment
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Your everyday <span className="text-gojek-primary">everything</span> app
          </h1>
          <p className="text-gray-600 max-w-md mb-4">
            Order food, rides, groceries, and much more. Experience convenience at your fingertips.
          </p>
          
          <div className="w-full max-w-lg mt-2">
            <SearchBar onSearch={(query) => console.log('Searching for:', query)} />
          </div>
        </div>
        
        <div className="relative h-40 md:h-64 rounded-2xl bg-gradient-to-r from-gojek-primary to-gojek-secondary overflow-hidden shadow-lg animate-scale-in">
          <div className="absolute inset-0 opacity-20 bg-pattern"></div>
          <div className="absolute inset-0 flex items-center justify-between px-6">
            <div className="text-white">
              <p className="font-semibold text-lg">Go with rewards</p>
              <p className="text-sm opacity-90">Earn points with every order</p>
              <button className="mt-3 px-4 py-1.5 rounded-full bg-white text-gojek-primary text-sm font-medium hover:bg-opacity-90 transition-all">
                Learn more
              </button>
            </div>
            <div className="hidden md:block w-28 h-28 rounded-full bg-white bg-opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
