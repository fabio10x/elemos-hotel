import React, { useState, useEffect } from 'react';
import { Menu, X, Hotel, Phone } from 'lucide-react';
import { NavItem } from '../types';
import { Link, useLocation } from 'react-router-dom';

const navItems: NavItem[] = [
  { label: 'Overview', path: '/' },
  { label: 'Rooms & Rates', path: '/rooms' },
  { label: 'Location & Contact', path: '/contact' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || isOpen ? 'bg-white/95 backdrop-blur-sm shadow-md text-gray-900' : 'bg-transparent text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <Hotel className={`h-8 w-8 ${isScrolled || isOpen ? 'text-amber-600' : 'text-amber-400'}`} />
              <span className="font-serif text-2xl font-bold tracking-wider uppercase">Elmos</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium hover:text-amber-500 transition-colors uppercase tracking-wide ${
                  location.pathname === item.path && (isScrolled || isOpen ? 'text-amber-600' : 'text-amber-400')
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="tel:0909477777"
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                 isScrolled || isOpen 
                  ? 'border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white' 
                  : 'border-white text-white hover:bg-white hover:text-gray-900'
              }`}
            >
              <Phone size={14} />
              <span>Book Now</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white text-gray-900 border-t">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block px-3 py-4 text-base font-medium hover:bg-amber-50 hover:text-amber-600 rounded-md"
              >
                {item.label}
              </Link>
            ))}
             <a
              href="tel:0909477777"
              className="block mt-4 w-full text-center bg-amber-600 text-white py-3 rounded-lg font-bold"
            >
              Call 090 947 7777
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;