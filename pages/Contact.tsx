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
            We are conveniently located at the heart of Addis Ababa, right next to Bole International Airport.
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
                    <p className="text-gray-600">Addis Ababa Bole International Airport<br />Addis Ababa, Ethiopia</p>
                    <p className="text-sm text-gray-400 mt-1">Bole District</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-100 rounded-full">
                    <Phone className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">0900030836</p>
                    <p className="text-sm text-gray-400 mt-1">Available 24/7</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-100 rounded-full">
                    <Mail className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">info@Aura-web-service.com</p>
                    <p className="text-sm text-gray-400 mt-1">We reply within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="w-full h-full min-h-[400px] rounded-3xl overflow-hidden shadow-2xl shadow-gray-200 border border-gray-100 relative group">
              <iframe
                title="Elmos Hotel Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.873483018843!2d38.79630639999999!3d8.983787899999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b858fbf50bd97%3A0x93a0799b20ab0276!2sBole%20Addis%20Ababa%20International%20Airport!5e0!3m2!1sen!2set!4v1778742574975!5m2!1sen!2set"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="filter grayscale-[0.2] contrast-[1.1] group-hover:grayscale-0 transition-all duration-700"
              ></iframe>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-gray-100 text-[10px] font-bold uppercase tracking-wider text-amber-600 pointer-events-none">
                Bole International Airport
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </div>
  );
};

export default Contact;