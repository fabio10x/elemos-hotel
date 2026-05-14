import React, { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { Check, Users, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Room } from '../types';
import BookingModal from '../components/BookingModal';
import { useRooms } from '../hooks/useRooms';

const Rooms: React.FC = () => {
  const { rooms, loading, error, refetch } = useRooms();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCheckAvailability = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

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
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-10 w-10 text-amber-600 animate-spin" />
            <p className="text-gray-500 text-sm font-medium">Loading rooms...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Failed to load rooms</h3>
            <p className="text-gray-500 text-sm max-w-md">{error}</p>
            <button
              onClick={refetch}
              className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-md hover:bg-amber-600 transition-colors text-sm font-medium"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && rooms.length === 0 && (
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg">No rooms available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Please check back later.</p>
          </div>
        )}

        {/* Room Cards */}
        {!loading && !error && rooms.length > 0 && (
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
                    {room.is_featured && (
                      <div className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm shadow-md">
                        Featured
                      </div>
                    )}
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
                        <span>Max {room.max_guests} Guests</span>
                      </div>
                      <button 
                        onClick={() => handleCheckAvailability(room)}
                        className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-amber-600 transition-colors font-medium"
                      >
                        Check Availability
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        room={selectedRoom} 
      />
    </div>
  );
};

export default Rooms;