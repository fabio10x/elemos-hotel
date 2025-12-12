export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  features: string[];
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
