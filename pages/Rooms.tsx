import React from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { Check, Users } from 'lucide-react';
import { Room } from '../types';

const rooms: Room[] = [
  {
    id: 'executive',
    name: 'Executive Room',
    description: 'Spacious and elegant, perfect for business travelers offering extra workspace and comfort.',
    price: 14755,
    image: 'https://images.trvl-media.com/lodging/86000000/85310000/85305100/85305003/bf2c748a.jpg?impolicy=resizecrop&rw=1200&ra=fit',
    features: ['1 Double Bed', 'Free Breakfast', 'City View', 'Minibar', 'In-room Safe', 'Down Comforters']
  },
  {
    id: 'deluxe',
    name: 'Deluxe Twin Room',
    description: 'Ideal for friends or colleagues, featuring two comfortable twin beds and modern amenities.',
    price: 12318,
    image: 'https://images.trvl-media.com/lodging/86000000/85310000/85305100/85305003/1de3b08c.jpg?impolicy=resizecrop&rw=1200&ra=fit',
    features: ['2 Twin Beds', 'Free Breakfast', 'Select Comfort Beds', 'Work Desk', 'Rain Shower', 'Free Wi-Fi']
  },
  {
    id: 'standard',
    name: 'Standard Room',
    description: 'A cozy retreat with everything you need for a restful night.',
    price: 8455,
    image: 'https://images.trvl-media.com/lodging/86000000/85310000/85305100/85305003/6cdee2a5.jpg?impolicy=resizecrop&rw=1200&ra=fit',
    features: ['1 Queen Bed', 'Free Wi-Fi', 'TV', 'Room Service']
  }
];

const Rooms: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50 pb-20">
      <div className="bg-gray-900 text-white py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Accommodations</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose from our selection of well-appointed rooms designed for your comfort.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {rooms.map((room, index) => (
            <ScrollReveal key={room.id} delay={index * 100}>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row hover:shadow-2xl transition-all duration-300">
                <div className="md:w-2/5 relative h-64 md:h-auto">
                  <img 
                    src={room.image} 
                    alt={room.name} 
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  <div className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm shadow-md">
                    Featured
                  </div>
                </div>
                
                <div className="p-8 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl font-serif font-bold text-gray-900">{room.name}</h2>
                      <div className="text-right">
                        <span className="text-3xl font-bold text-amber-600">ETB {room.price.toLocaleString()}</span>
                        <span className="block text-xs text-gray-400">/ night</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6">{room.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {room.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <Check size={16} className="text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Users size={16} />
                      <span>Max 2 Guests</span>
                    </div>
                    <button className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-amber-600 transition-colors font-medium">
                      Check Availability
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rooms;