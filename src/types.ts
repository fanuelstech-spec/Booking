export type OrderStatus = 
  | 'received' 
  | 'preparing' 
  | 'driver_assigned' 
  | 'picked_up' 
  | 'in_transit' 
  | 'arrived' 
  | 'delivered' 
  | 'cancelled';

export type PaymentMethod = 'mtn_momo' | 'orange_money' | 'express_union' | 'cash_on_delivery';

export type PaymentStatus = 'pending' | 'processing' | 'approved' | 'failed';

export interface MenuItem {
  id: string;
  name: string;
  localName?: string;
  category: 'traditional' | 'grills' | 'soups_stews' | 'drinks' | 'sides';
  description: string;
  priceFCFA: number;
  image: string;
  spiciness: 'none' | 'mild' | 'medium' | 'abakwa_hot';
  prepTimeMinutes: number;
  isPopular?: boolean;
  isVegetarian?: boolean;
  availableSides?: string[];
  allergens?: string[];
}

export interface Table {
  id: string;
  tableNumber: number;
  zone: 'hilltop_terrace' | 'indoor_hearth' | 'vip_balcony' | 'garden_cabana';
  capacity: number;
  isReserved?: boolean;
  features: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  neighborhood: string;
  address: string;
  rating: number;
  reviewCount: number;
  image: string;
  galleryImages: string[];
  bannerImage: string;
  cuisines: string[];
  openingHours: string;
  phone: string;
  deliveryTimeEst: string;
  minOrderFCFA: number;
  deliveryFeeBaseFCFA: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  tables: Table[];
  menu: MenuItem[];
}

export interface CartCustomization {
  spiceLevel: 'mild' | 'medium' | 'abakwa_hot';
  selectedSide?: string;
  specialInstructions?: string;
}

export interface CartItem {
  id: string; // unique item instance id in cart
  menuItem: MenuItem;
  quantity: number;
  customization: CartCustomization;
  restaurantId: string;
  restaurantName: string;
}

export interface DeliveryRider {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  motoModel: string;
  plateNumber: string;
  rating: number;
  totalTrips: number;
  currentLat: number;
  currentLng: number;
  speedKmH: number;
  batteryPercent: number;
  headingDeg: number;
  currentStreetName: string;
  helmetVerified: boolean;
  status: 'idle' | 'assigned' | 'en_route_pickup' | 'in_transit' | 'at_customer';
}

export interface Order {
  id: string;
  orderNumber: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  items: CartItem[];
  subtotalFCFA: number;
  deliveryFeeFCFA: number;
  totalFCFA: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: {
    neighborhood: string;
    street: string;
    landmark: string;
    lat: number;
    lng: number;
  };
  payment: {
    method: PaymentMethod;
    status: PaymentStatus;
    phoneNumber?: string;
    transactionRef?: string;
    paidAt?: string;
  };
  // Security Handover OTP: 4-digit code provided to customer.
  // Delivery driver must enter this code to complete delivery and verify legitimate handover.
  securityHandoverPin: string;
  driver?: DeliveryRider;
  telemetryHistory: {
    time: string;
    lat: number;
    lng: number;
    speedKmH: number;
    event: string;
  }[];
}

export interface TableReservation {
  id: string;
  reservationNumber: string;
  restaurantId: string;
  restaurantName: string;
  tableId: string;
  tableNumber: number;
  tableZone: string;
  partySize: number;
  date: string;
  timeSlot: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  specialRequests?: string;
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled';
  createdAt: string;
  qrCodeUrl?: string;
}

export interface BamendaZone {
  name: string;
  label: string;
  deliveryFeeFCFA: number;
  estimatedMins: number;
  lat: number;
  lng: number;
}
