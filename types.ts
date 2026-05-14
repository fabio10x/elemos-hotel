export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  features: string[];
  max_guests: number;
  is_featured: boolean;
  created_at?: string;
}

export type ReservationStatus = 'pending' | 'booked' | 'cancelled';

export interface Reservation {
  id: string;
  room_id: string;
  guest_name: string;
  guest_email: string;
  check_in: string; // ISO date (YYYY-MM-DD)
  check_out: string; // ISO date (YYYY-MM-DD)
  status: ReservationStatus;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
}

export interface NavItem {
  label: string;
  path: string;
}
