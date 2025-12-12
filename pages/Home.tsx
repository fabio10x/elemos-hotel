import React from 'react';
import { Star, Wifi, Coffee, Car, ShieldCheck } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <img 
            src="https://images.trvl-media.com/lodging/86000000/85310000/85305100/85305003/e9315eeb.jpg?impolicy=resizecrop&rw=1200&ra=fit" 
            alt="Elmos Hotel Exterior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6">
              ELMOS HOTEL
            </h1>
            <p className="text-xl md:text-2xl text-amber-400 font-light tracking-wide mb-8">
              MESKEL FLOWER | ADDIS ABABA
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/rooms" className="px-8 py-3 bg-amber-600 text-white rounded-md font-medium hover:bg-amber-700 transition-colors">
                View Rooms
              </Link>
              <Link to="/contact" className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white text-white rounded-md font-medium hover:bg-white hover:text-gray-900 transition-colors">
                Contact Us
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Experience Luxury</h2>
              <div className="w-24 h-1 bg-amber-500 mx-auto mb-6" />
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Located in the vibrant Meskel Flower district, Elmos Hotel offers a blend of modern comfort and Ethiopian hospitality. Rated 3.9/5 by our guests, we provide a 4-star experience with premium amenities.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <ScrollReveal delay={100} className="p-6 bg-gray-50 rounded-xl text-center hover:shadow-lg transition-shadow">
              <Wifi className="h-10 w-10 text-amber-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Free Wi-Fi</h3>
              <p className="text-sm text-gray-500">High-speed internet in all rooms and public areas.</p>
            </ScrollReveal>
            
            <ScrollReveal delay={200} className="p-6 bg-gray-50 rounded-xl text-center hover:shadow-lg transition-shadow">
              <Coffee className="h-10 w-10 text-amber-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Free Breakfast</h3>
              <p className="text-sm text-gray-500">Start your day with our complimentary buffet.</p>
            </ScrollReveal>

            <ScrollReveal delay={300} className="p-6 bg-gray-50 rounded-xl text-center hover:shadow-lg transition-shadow">
              <Car className="h-10 w-10 text-amber-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Free Parking</h3>
              <p className="text-sm text-gray-500">Secure on-site parking for all guests.</p>
            </ScrollReveal>

            <ScrollReveal delay={400} className="p-6 bg-gray-50 rounded-xl text-center hover:shadow-lg transition-shadow">
              <ShieldCheck className="h-10 w-10 text-amber-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Safe & Secure</h3>
              <p className="text-sm text-gray-500">In-room safes and 24/7 security.</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Visual Showcase */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <ScrollReveal className="relative h-96 rounded-lg overflow-hidden">
                <img 
                  src="https://images.trvl-media.com/lodging/86000000/85310000/85305100/85305003/0f855e40.jpg?impolicy=resizecrop&rw=1200&ra=fit" 
                  alt="Interior" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </ScrollReveal>
              <ScrollReveal delay={200} className="space-y-6">
                <div className="flex items-center gap-2 text-amber-500">
                  <Star className="fill-current" size={20} />
                  <Star className="fill-current" size={20} />
                  <Star className="fill-current" size={20} />
                  <Star className="fill-current" size={20} />
                </div>
                <h2 className="text-4xl font-serif font-bold">Unwind in Style</h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Whether you are traveling for business or leisure, Elmos Hotel provides the perfect sanctuary. Our rooms feature select comfort beds, down comforters, and minibars to ensure your stay is relaxing.
                </p>
                <div className="pt-4">
                  <div className="text-3xl font-bold text-amber-500">3.9 / 5</div>
                  <p className="text-sm text-gray-500">Based on 73 verified reviews</p>
                </div>
              </ScrollReveal>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;