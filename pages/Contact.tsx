import React from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-white">
       <div className="bg-gray-100 py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4 text-gray-900">Location & Contact</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We are conveniently located in the Meskel Flower area on Gabon Street.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <ScrollReveal>
            <div className="space-y-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900">Get in Touch</h2>
              <p className="text-gray-600">
                Have a question about your reservation or need assistance planning your stay? 
                Our team is here to help 24/7.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-100 rounded-full">
                    <MapPin className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">Gabon St, XQV8+G2X<br/>Addis Ababa, Ethiopia</p>
                    <p className="text-sm text-gray-400 mt-1">Meskel Flower District</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-100 rounded-full">
                    <Phone className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">090 947 7777</p>
                    <p className="text-sm text-gray-400 mt-1">Available 24/7</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-100 rounded-full">
                    <Mail className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">info@elmoshotel.com</p>
                    <p className="text-sm text-gray-400 mt-1">We reply within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="bg-gray-200 w-full h-full min-h-[400px] rounded-2xl overflow-hidden relative shadow-inner">
               {/* Simplified visual representation of a map since we can't use a real interactive map API without a key */}
               <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                  <div className="text-center p-6">
                     <MapPin className="h-12 w-12 text-amber-600 mx-auto mb-2 animate-bounce" />
                     <h3 className="font-bold text-gray-700">Meskel Flower, Gabon Street</h3>
                     <p className="text-gray-500 text-sm">Interactive map disabled for demo</p>
                  </div>
               </div>
               {/* Overlay with image to make it look nicer */}
               <img 
                 src="https://images.trvl-media.com/lodging/86000000/85310000/85305100/85305003/cea0c168.jpg?impolicy=resizecrop&rw=1200&ra=fit"
                 className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
                 alt="Location Background"
               />
            </div>
          </ScrollReveal>

        </div>
      </div>
    </div>
  );
};

export default Contact;