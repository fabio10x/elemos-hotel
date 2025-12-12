import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-amber-500">ELMOS HOTEL</h3>
            <p className="text-gray-400 leading-relaxed">
              Experience the heart of Addis Ababa at Meskel Flower. 
              Luxury accommodation meeting authentic Ethiopian hospitality.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold uppercase tracking-wider">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="h-5 w-5 text-amber-500 shrink-0 mt-1" />
                <span>XQV8+G2X, Gabon St,<br/>Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="h-5 w-5 text-amber-500 shrink-0" />
                <a href="tel:0909477777" className="hover:text-white transition-colors">090 947 7777</a>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="h-5 w-5 text-amber-500 shrink-0" />
                <a href="mailto:info@elmoshotel.com" className="hover:text-white transition-colors">info@elmoshotel.com</a>
              </div>
            </div>
          </div>

          {/* Social / Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold uppercase tracking-wider">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-amber-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-amber-600 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
            <p className="text-sm text-gray-500 pt-4">
              © {new Date().getFullYear()} Elmos Hotel. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;