import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Youtube, Send } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-amber-500">AURA WEB SERVICE</h3>
            <p className="text-gray-400 leading-relaxed">
              Experience the heart of Addis Ababa at Bole International Airport.
              Luxury accommodation meeting authentic Ethiopian hospitality.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold uppercase tracking-wider">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="h-5 w-5 text-amber-500 shrink-0 mt-1" />
                <span>Addis Ababa Bole International Airport,<br />Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="h-5 w-5 text-amber-500 shrink-0" />
                <a href="tel:0900030836" className="hover:text-white transition-colors">090 003 0836</a>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="h-5 w-5 text-amber-500 shrink-0" />
                <a href="mailto:frezer.antenhe.dev@gmail.com" className="hover:text-white transition-colors">info@Aura-web-service</a>
              </div>
            </div>
          </div>

          {/* Social / Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold uppercase tracking-wider">Connect</h4>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gray-800 p-2 rounded-full hover:bg-amber-600 transition-colors"
                title="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gray-800 p-2 rounded-full hover:bg-amber-600 transition-colors"
                title="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gray-800 p-2 rounded-full hover:bg-amber-600 transition-colors"
                title="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gray-800 p-2 rounded-full hover:bg-amber-600 transition-colors"
                title="YouTube"
              >
                <Youtube size={20} />
              </a>
              <a 
                href="https://t.me" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gray-800 p-2 rounded-full hover:bg-amber-600 transition-colors"
                title="Telegram"
              >
                <Send size={20} />
              </a>
            </div>
            <div className="pt-2">
              <a
                href="#/admin/login"
                className="text-xs uppercase tracking-wider text-gray-400 hover:text-amber-400 transition-colors"
              >
                Staff Login
              </a>
            </div>
            <p className="text-sm text-gray-500 pt-4">
              © {new Date().getFullYear()} Aura Web Service. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;