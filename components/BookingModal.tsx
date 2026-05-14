import React, { useState } from 'react';
import { X, CheckCircle2, Phone, Send } from 'lucide-react';
import { Room } from '../types';
import { supabase } from '../supabaseClient';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, room }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    checkIn: '',
    checkOut: ''
  });

  const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;
  const RES_TABLE = 'Aura-basic-reservations';

  if (!isOpen || !room) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1) Create a reservation inquiry (pending) in Supabase for the admin panel
      const { error: insertError } = await supabase.from(RES_TABLE).insert({
        room_id: room.id,
        guest_name: formData.name,
        guest_email: formData.email,
        check_in: formData.checkIn,
        check_out: formData.checkOut,
        status: 'pending',
      });

      if (insertError) {
        throw insertError;
      }

      // 2) Keep the email notification flow (Formspree) for the hotel team
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          roomName: room.name,
          roomId: room.id,
          roomPrice: room.price,
          _subject: `New Availability Inquiry for ${room.name}`,
        }),
      });

      // If the email fails, we still keep the inquiry in Supabase (admin can see it).
      // We'll show success either way to avoid losing the customer's request.
      if (!response.ok) {
        console.warn('Formspree email failed, but inquiry saved in Supabase');
      }

      {
        setSubmitted(true);
        setTimeout(() => {
          setTimeout(() => {
            setSubmitted(false);
            onClose();
          }, 3000);
        }, 500);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("We couldn't send your request right now. Please try calling instead.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {submitted ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900">Request Sent</h3>
            <p className="text-sm text-gray-500 mt-2">
              We'll contact you at <span className="text-gray-900 font-medium">{formData.email}</span> shortly.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 pb-0 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-serif font-bold text-gray-900">{room.name}</h3>
                <p className="text-xs text-amber-600 font-medium">Availability Inquiry</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 pt-4 space-y-6">
              {/* Call Action - Minimal */}
              <a
                href="tel:0900030836"
                className="flex items-center justify-center gap-3 w-full bg-amber-600 text-white py-4 rounded-2xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20 text-sm font-bold"
              >
                <Phone size={18} />
                Call 090 003 0836
              </a>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-[1px] bg-gray-100"></div>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">or email us</span>
                <div className="flex-1 h-[1px] bg-gray-100"></div>
              </div>

              {/* Minimal Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Check-in</label>
                    <input
                      required
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.checkIn}
                      onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-amber-500 border-2 outline-none text-xs transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Check-out</label>
                    <input
                      required
                      type="date"
                      min={formData.checkIn || new Date().toISOString().split('T')[0]}
                      value={formData.checkOut}
                      onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-amber-500 border-2 outline-none text-xs transition-all"
                    />
                  </div>
                </div>

                <input
                  required
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-amber-500 border-2 outline-none text-xs transition-all"
                />

                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-amber-500 border-2 outline-none text-xs transition-all"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 text-amber-600 py-3 rounded-xl font-bold hover:bg-amber-50 transition-all text-xs border border-amber-100 mt-2 disabled:opacity-50 disabled:cursor-wait"
                >
                  <Send size={14} className={loading ? 'animate-pulse' : ''} />
                  {loading ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
