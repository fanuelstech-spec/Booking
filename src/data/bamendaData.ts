import { Restaurant, BamendaZone, DeliveryRider } from '../types';

export const BAMENDA_ZONES: BamendaZone[] = [
  { name: 'commercial_ave', label: 'Commercial Avenue (Abakwa Center)', deliveryFeeFCFA: 700, estimatedMins: 20, lat: 5.9592, lng: 10.1585 },
  { name: 'mile_2_nkwen', label: 'Mile 2 Nkwen (Church Junction)', deliveryFeeFCFA: 900, estimatedMins: 25, lat: 5.9680, lng: 10.1690 },
  { name: 'mile_3_nkwen', label: 'Mile 3 Nkwen (Hospital Roundabout)', deliveryFeeFCFA: 1000, estimatedMins: 30, lat: 5.9750, lng: 10.1760 },
  { name: 'mile_4_nkwen', label: 'Mile 4 Nkwen (Post Office area)', deliveryFeeFCFA: 1200, estimatedMins: 35, lat: 5.9860, lng: 10.1850 },
  { name: 'up_station', label: 'Up Station (Governor\'s Hill / Ridge)', deliveryFeeFCFA: 1300, estimatedMins: 35, lat: 5.9420, lng: 10.1680 },
  { name: 'small_mankon', label: 'Small Mankon (Palace Way)', deliveryFeeFCFA: 900, estimatedMins: 25, lat: 5.9520, lng: 10.1420 },
  { name: 'food_market', label: 'Food Market / Sonac Street', deliveryFeeFCFA: 600, estimatedMins: 18, lat: 5.9570, lng: 10.1520 },
  { name: 'old_town', label: 'Old Town Bamenda', deliveryFeeFCFA: 800, estimatedMins: 22, lat: 5.9630, lng: 10.1480 },
  { name: 'bambili_junction', label: 'Bambili Junction Corridor', deliveryFeeFCFA: 1800, estimatedMins: 45, lat: 6.0020, lng: 10.2200 }
];

export const BAMENDA_RESTAURANTS: Restaurant[] = [
  {
    id: 'achu-queen-palace',
    name: 'Achu Queen Palace',
    tagline: 'The North-West\'s Legendary Achu Yellow Soup & Smoked Kanda Hearth',
    neighborhood: 'Commercial Avenue, Bamenda',
    address: 'Opposite City Chemist, Commercial Avenue, Bamenda',
    rating: 4.9,
    reviewCount: 428,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
    ],
    cuisines: ['Traditional Achu', 'Grassfields Delicacies', 'Soups & Kanda'],
    openingHours: '08:00 AM - 09:30 PM (Daily)',
    phone: '+237 677 84 19 20',
    deliveryTimeEst: '20 - 35 mins',
    minOrderFCFA: 2000,
    deliveryFeeBaseFCFA: 700,
    coordinates: { lat: 5.9592, lng: 10.1585 },
    tables: [
      { id: 'aq-t1', tableNumber: 1, zone: 'indoor_hearth', capacity: 2, features: ['Traditional Stool Seating', 'Near Spices Station'] },
      { id: 'aq-t2', tableNumber: 2, zone: 'indoor_hearth', capacity: 4, features: ['Center Room', 'Hand-washing Pot'] },
      { id: 'aq-t3', tableNumber: 3, zone: 'vip_balcony', capacity: 6, features: ['Street View', 'Quiet Zone', 'Carved Wood Table'] },
      { id: 'aq-t4', tableNumber: 4, zone: 'vip_balcony', capacity: 8, isReserved: true, features: ['Family Table', 'Air Flow'] },
      { id: 'aq-t5', tableNumber: 5, zone: 'garden_cabana', capacity: 4, features: ['Outdoor Breeze', 'Shaded Parasol'] },
      { id: 'aq-t6', tableNumber: 6, zone: 'garden_cabana', capacity: 10, features: ['Celebration Table', 'Palm Wine Cooler'] }
    ],
    menu: [
      {
        id: 'aq-m1',
        name: 'Royal Bamenda Achu (Yellow Soup)',
        localName: 'Achu with Yellow Soup & Kanda',
        category: 'traditional',
        description: 'Velvety pounded taro with iconic limestone yellow soup seasoned with 15 native spices, served with tender smoked cow skin (kanda), beef chunks, and boiled egg.',
        priceFCFA: 3500,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        spiciness: 'medium',
        prepTimeMinutes: 15,
        isPopular: true,
        availableSides: ['Extra Kanda (+500 FCFA)', 'Smoked Fish (+1000 FCFA)', 'Extra Achu Cake (+800 FCFA)', 'Boiled Egg (+300 FCFA)']
      },
      {
        id: 'aq-m2',
        name: 'Royal Achu Black Soup Special',
        localName: 'Achu with Black Soup & Bush Meat',
        category: 'traditional',
        description: 'Rare herbal black soup made with scorched plantain skins, roasted spices, and aromatic medicinal herbs, paired with tender beef and smoked fish.',
        priceFCFA: 4000,
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
        spiciness: 'mild',
        prepTimeMinutes: 20,
        isPopular: false,
        availableSides: ['Extra Cow Leg (+1000 FCFA)', 'Extra Kanda (+500 FCFA)']
      },
      {
        id: 'aq-m3',
        name: 'Spicy Goat Meat Pepper Soup',
        localName: 'Goat Pepper Soup (Abakwa Hot)',
        category: 'soups_stews',
        description: 'Steaming country-spiced broth infused with Penja white pepper, alligator pepper, and fresh tender goat meat cuts that warm the soul.',
        priceFCFA: 3000,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
        spiciness: 'abakwa_hot',
        prepTimeMinutes: 15,
        isPopular: true,
        availableSides: ['Boiled Plantains (+500 FCFA)', 'Boiled White Yam (+600 FCFA)', 'French Bread (+300 FCFA)']
      },
      {
        id: 'aq-m4',
        name: 'Fresh Tapped Raffia Palm Wine (1L Carafe)',
        localName: 'Matango / White Mimbo',
        category: 'drinks',
        description: 'Direct from Mankon valley palm groves, sweet natural effervescence, unadulterated and served chilled in a calabash or ceramic jug.',
        priceFCFA: 1500,
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
        spiciness: 'none',
        prepTimeMinutes: 5,
        isPopular: true
      },
      {
        id: 'aq-m5',
        name: 'Kwacoco Bible with Smoked Mackerel',
        localName: 'Kwacoco Bible',
        category: 'traditional',
        description: 'Freshly grated cocoyam steamed in broad plantain leaves with rich red palm oil, crayfish, country onions, and flakey smoked fish.',
        priceFCFA: 2500,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        spiciness: 'mild',
        prepTimeMinutes: 15,
        isPopular: false
      }
    ]
  },
  {
    id: 'abakwa-grill-lounge',
    name: 'Abakwa Grill & Lounge',
    tagline: 'World-Renowned Kati Kati, Charred Butter Chicken & Jamajama Greens',
    neighborhood: 'Mile 2 Nkwen, Bamenda',
    address: 'Opposite Presbyterian Church Center, Mile 2 Nkwen, Bamenda',
    rating: 4.8,
    reviewCount: 384,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'
    ],
    cuisines: ['Authentic Kati Kati', 'Fufu Corn & Jamajama', 'Charcoal Grills'],
    openingHours: '10:00 AM - 11:00 PM (Daily)',
    phone: '+237 675 22 90 14',
    deliveryTimeEst: '25 - 40 mins',
    minOrderFCFA: 2500,
    deliveryFeeBaseFCFA: 900,
    coordinates: { lat: 5.9680, lng: 10.1690 },
    tables: [
      { id: 'ag-t1', tableNumber: 11, zone: 'indoor_hearth', capacity: 4, features: ['Acoustic Corner', 'Bamboo Deco'] },
      { id: 'ag-t2', tableNumber: 12, zone: 'garden_cabana', capacity: 6, features: ['Garden Pergola', 'Smoker View'] },
      { id: 'ag-t3', tableNumber: 13, zone: 'garden_cabana', capacity: 8, features: ['Live Music Stage View', 'Private Waiter'] },
      { id: 'ag-t4', tableNumber: 14, zone: 'vip_balcony', capacity: 4, features: ['Elevated Terrace', 'Night String Lights'] }
    ],
    menu: [
      {
        id: 'ag-m1',
        name: 'Signature Abakwa Kati Kati Combo',
        localName: 'Kati Kati with Fufu Corn & Jamajama',
        category: 'grills',
        description: 'Authentic local organic chicken flame-charred over hot coals, tossed in boiling melted cow butter oil (mbi) and spiced red pepper, served alongside steaming yellow fufu corn and sauteed huckleberry leaves (jamajama).',
        priceFCFA: 4500,
        image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
        spiciness: 'medium',
        prepTimeMinutes: 25,
        isPopular: true,
        availableSides: ['Extra Fufu Corn (+600 FCFA)', 'Extra Jamajama Greens (+600 FCFA)', 'Extra Butter Pepper Sauce (+400 FCFA)']
      },
      {
        id: 'ag-m2',
        name: 'Full Charcoal Roasted Bar Fish (Mankon Style)',
        localName: 'Poisson Braisé Bar avec Dodo',
        category: 'grills',
        description: 'Whole fresh Bar fish marinated in crushed wild Djansang, white Penja pepper, ginger, and garlic, charcoal grilled to perfection with spicy onion salsa and golden fried sweet ripe plantains (dodo).',
        priceFCFA: 5500,
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
        spiciness: 'abakwa_hot',
        prepTimeMinutes: 30,
        isPopular: true,
        availableSides: ['Fried Dodo (+600 FCFA)', 'Steamed Cassava Stick (Bobolo) (+500 FCFA)', 'Fried White Yam (+700 FCFA)']
      },
      {
        id: 'ag-m3',
        name: 'Smoked Pork Ribs in Spicy Tamarind Glaze',
        localName: 'Porc Braisé Épicé',
        category: 'grills',
        description: 'Tender pork ribs slow-smoked with coffee wood, basted in a tangy-spicy herb glaze, served with roasted plantains and kankan pepper dip.',
        priceFCFA: 4000,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        spiciness: 'medium',
        prepTimeMinutes: 20,
        isPopular: false
      },
      {
        id: 'ag-m4',
        name: 'Chilled Ginger & Hibiscus Punch (Folere)',
        localName: 'Jus de Folere Naturel',
        category: 'drinks',
        description: 'Hand-brewed hibiscus flower infusion with crushed local ginger, cloves, fresh mint leaves, and pure mountain honey.',
        priceFCFA: 1200,
        image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
        spiciness: 'none',
        prepTimeMinutes: 5,
        isPopular: true
      }
    ]
  },
  {
    id: 'hilltop-horizon-lounge',
    name: 'Hilltop Horizon & View Deck',
    tagline: 'Panoramic Views over Bamenda Valley with Fine Dining & Sunset Grills',
    neighborhood: 'Up Station, Bamenda',
    address: 'Near Governor\'s Office Junction, Up Station Ridge, Bamenda',
    rating: 4.9,
    reviewCount: 312,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80'
    ],
    cuisines: ['Hilltop Dining', 'Roasted Fish & Suya', 'Continental & Cocktails'],
    openingHours: '11:00 AM - 12:00 Midnight (Daily)',
    phone: '+237 679 11 44 88',
    deliveryTimeEst: '30 - 45 mins',
    minOrderFCFA: 3000,
    deliveryFeeBaseFCFA: 1300,
    coordinates: { lat: 5.9420, lng: 10.1680 },
    tables: [
      { id: 'hh-t1', tableNumber: 21, zone: 'hilltop_terrace', capacity: 2, features: ['Edge View Deck', 'Sunset Panorama', 'Romantic Candle'] },
      { id: 'hh-t2', tableNumber: 22, zone: 'hilltop_terrace', capacity: 4, features: ['Edge View Deck', 'Telescope Access'] },
      { id: 'hh-t3', tableNumber: 23, zone: 'hilltop_terrace', capacity: 6, isReserved: false, features: ['Valley Overlook', 'Fire Pit Nearby'] },
      { id: 'hh-t4', tableNumber: 24, zone: 'vip_balcony', capacity: 12, features: ['Executive Glass Enclosure', 'Private Bar Service'] }
    ],
    menu: [
      {
        id: 'hh-m1',
        name: 'Hilltop Suya Platter Deluxe',
        localName: 'Abakwa Beef & Chicken Suya Feast',
        category: 'grills',
        description: 'Tender thin-sliced beef and boneless chicken dusted with roasted peanut kankan spice, red chili, and ginger, seared over open fire and garnished with sweet onions and tomatoes.',
        priceFCFA: 4200,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
        spiciness: 'abakwa_hot',
        prepTimeMinutes: 20,
        isPopular: true,
        availableSides: ['Golden Dodo (+600 FCFA)', 'Spicy French Fries (+800 FCFA)']
      },
      {
        id: 'hh-m2',
        name: 'Grand Eru with Water Fufu & Smoked Cow Skin',
        localName: 'Eru and Water Fufu',
        category: 'traditional',
        description: 'Finely sliced forest okok leaves simmered slowly in virgin red palm oil, waterleaf, smoked dry fish, and tender kanda pieces, served with soft silky water fufu cakes.',
        priceFCFA: 3800,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        spiciness: 'mild',
        prepTimeMinutes: 18,
        isPopular: true
      },
      {
        id: 'hh-m3',
        name: 'Crispy Fried Plantain Chips Basket (Dodo Basket)',
        localName: 'Alloco / Dodo Panier',
        category: 'sides',
        description: 'Crisp caramelized sweet plantain discs dusted with sea salt and served with our famous piment mayonnaise dip.',
        priceFCFA: 1500,
        image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=800&q=80',
        spiciness: 'mild',
        prepTimeMinutes: 10
      }
    ]
  },
  {
    id: 'mankon-heritage-hearth',
    name: 'Mankon Heritage Hearth',
    tagline: 'Centuries of Traditional Abakwa Culinary Recipes in an Authentic Courtyard',
    neighborhood: 'Small Mankon, Bamenda',
    address: 'Palace Road, Near Mankon Fon\'s Cultural Ground, Bamenda',
    rating: 4.7,
    reviewCount: 219,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
    ],
    cuisines: ['Grassfields Royal Feasts', 'Kati Kati', 'Achu & Palm Wine'],
    openingHours: '09:00 AM - 10:00 PM (Daily)',
    phone: '+237 674 39 88 12',
    deliveryTimeEst: '25 - 40 mins',
    minOrderFCFA: 2000,
    deliveryFeeBaseFCFA: 900,
    coordinates: { lat: 5.9520, lng: 10.1420 },
    tables: [
      { id: 'mh-t1', tableNumber: 31, zone: 'indoor_hearth', capacity: 4, features: ['Toghu Fabric Cushions', 'Heritage Carvings'] },
      { id: 'mh-t2', tableNumber: 32, zone: 'garden_cabana', capacity: 6, features: ['Bamboo Shade', 'Raffia Palm View'] },
      { id: 'mh-t3', tableNumber: 33, zone: 'garden_cabana', capacity: 10, features: ['Royal Courtyard Table', 'Dedicated Host'] }
    ],
    menu: [
      {
        id: 'mh-m1',
        name: 'Fon\'s Special Kati Kati Platter',
        localName: 'Royal Kati Kati with Fufu Corn',
        category: 'grills',
        description: 'Farm-fresh country cockerel smoked and braised in mountain butter oil with whole country peppers, served with organic fufu corn and jamajama.',
        priceFCFA: 5000,
        image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
        spiciness: 'medium',
        prepTimeMinutes: 25,
        isPopular: true
      },
      {
        id: 'mh-m2',
        name: 'Traditional Ndole with Plantains & Shrimps',
        localName: 'Ndole Royal aux Crevettes',
        category: 'traditional',
        description: 'Tender bitterleaf leaves cooked in ground peanuts, garlic, ginger, stock fish, and topped with sizzling sautéed red onions and river prawns.',
        priceFCFA: 4000,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        spiciness: 'mild',
        prepTimeMinutes: 20,
        isPopular: true,
        availableSides: ['Boiled Ripe Plantains (+500 FCFA)', 'Fried Plantains (+600 FCFA)', 'Miondo Sticks (+500 FCFA)']
      }
    ]
  }
];

export const MOCK_DELIVERY_RIDERS: DeliveryRider[] = [
  {
    id: 'rider-tatah',
    name: 'Tatah Emmanuel',
    phone: '+237 677 31 09 82',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    motoModel: 'Bajaj Boxer 150 (Yellow-Green Courier)',
    plateNumber: 'NW 4821-BA',
    rating: 4.95,
    totalTrips: 480,
    currentLat: 5.9620,
    currentLng: 10.1620,
    speedKmH: 34,
    batteryPercent: 88,
    headingDeg: 45,
    currentStreetName: 'Ascending Hospital Roundabout towards Mile 2',
    helmetVerified: true,
    status: 'in_transit'
  },
  {
    id: 'rider-chi',
    name: 'Chi Neba Collins',
    phone: '+237 675 19 88 41',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    motoModel: 'TVS Star HLX 125 (Speedy Delivery)',
    plateNumber: 'NW 7290-BA',
    rating: 4.88,
    totalTrips: 340,
    currentLat: 5.9550,
    currentLng: 10.1550,
    speedKmH: 26,
    batteryPercent: 74,
    headingDeg: 120,
    currentStreetName: 'Commercial Avenue near Finance Building',
    helmetVerified: true,
    status: 'en_route_pickup'
  },
  {
    id: 'rider-fuh',
    name: 'Fuh Blessing',
    phone: '+237 671 90 44 11',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    motoModel: 'Yamaha Crux 110 (Cargo Insulated Box)',
    plateNumber: 'NW 3110-BA',
    rating: 4.92,
    totalTrips: 512,
    currentLat: 5.9470,
    currentLng: 10.1640,
    speedKmH: 30,
    batteryPercent: 92,
    headingDeg: 310,
    currentStreetName: 'Station Hill S-Curves climbing to Up Station',
    helmetVerified: true,
    status: 'at_customer'
  }
];

// Realistic Bamenda Road Waypoints for live simulation:
export const BAMENDA_WAYPOINTS = [
  { name: 'Achu Queen Palace (Commercial Ave)', lat: 5.9592, lng: 10.1585, desc: 'Pick up at restaurant kitchen' },
  { name: 'City Chemist Roundabout', lat: 5.9605, lng: 10.1610, desc: 'Merging onto main Commercial Avenue artery' },
  { name: 'Customs Junction / Sonac St Exit', lat: 5.9628, lng: 10.1635, desc: 'Navigating through central commerce corridor' },
  { name: 'Hospital Roundabout (Regional Hospital)', lat: 5.9650, lng: 10.1660, desc: 'Crossing Hospital Junction towards Nkwen' },
  { name: 'Mile 2 Nkwen T-Junction', lat: 5.9680, lng: 10.1690, desc: 'Passing Presbyterian Church & local bakery' },
  { name: 'Mile 3 Nkwen Market Cross', lat: 5.9750, lng: 10.1760, desc: 'Entering Mile 3 residential and business stretch' },
  { name: 'Customer Destination Gate (Mile 3 Nkwen)', lat: 5.9765, lng: 10.1780, desc: 'Arrived at dropoff point. Awaiting Security OTP Handover' }
];
