import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { BAMENDA_RESTAURANTS, MOCK_DELIVERY_RIDERS, BAMENDA_WAYPOINTS } from './src/data/bamendaData';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for prototype sessions
let ordersDatabase: any[] = [
  {
    id: 'bda-ord-101',
    orderNumber: 'BDA-ORD-8392',
    restaurantId: 'achu-queen-palace',
    restaurantName: 'Achu Queen Palace',
    restaurantAddress: 'Commercial Avenue, Bamenda',
    items: [
      {
        id: 'item-1',
        menuItem: BAMENDA_RESTAURANTS[0].menu[0],
        quantity: 2,
        customization: {
          spiceLevel: 'medium',
          selectedSide: 'Extra Kanda (+500 FCFA)',
          specialInstructions: 'Extra yellow soup broth in separate container please'
        },
        restaurantId: 'achu-queen-palace',
        restaurantName: 'Achu Queen Palace'
      },
      {
        id: 'item-2',
        menuItem: BAMENDA_RESTAURANTS[0].menu[3],
        quantity: 1,
        customization: {
          spiceLevel: 'mild',
          specialInstructions: 'Chilled palm wine'
        },
        restaurantId: 'achu-queen-palace',
        restaurantName: 'Achu Queen Palace'
      }
    ],
    subtotalFCFA: 8500,
    deliveryFeeFCFA: 1000,
    totalFCFA: 9500,
    status: 'in_transit',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    estimatedDeliveryTime: '12 mins',
    customerName: 'Che Foncha',
    customerPhone: '+237 677 42 19 80',
    deliveryAddress: {
      neighborhood: 'Mile 3 Nkwen',
      street: 'Hospital Roundabout Bypass, Che Villa',
      landmark: 'Opposite Amour Mezam Agency',
      lat: 5.9765,
      lng: 10.1780
    },
    payment: {
      method: 'mtn_momo',
      status: 'approved',
      phoneNumber: '+237 677 42 19 80',
      transactionRef: 'MOMO-BDA-928419',
      paidAt: new Date(Date.now() - 14 * 60 * 1000).toISOString()
    },
    securityHandoverPin: '7429',
    driver: { ...MOCK_DELIVERY_RIDERS[0] },
    telemetryHistory: [
      { time: '14:30', lat: 5.9592, lng: 10.1585, speedKmH: 0, event: 'Order Picked Up at Achu Queen Palace' },
      { time: '14:34', lat: 5.9628, lng: 10.1635, speedKmH: 36, event: 'Cruising via Commercial Avenue Customs Junction' },
      { time: '14:38', lat: 5.9680, lng: 10.1690, speedKmH: 34, event: 'Passing Presbyterian Church, Mile 2 Nkwen' }
    ]
  }
];

let reservationsDatabase: any[] = [
  {
    id: 'res-1',
    reservationNumber: 'BDA-RES-4912',
    restaurantId: 'abakwa-grill-lounge',
    restaurantName: 'Abakwa Grill & Lounge',
    tableId: 'ag-t2',
    tableNumber: 12,
    tableZone: 'Garden Cabana Pergola',
    partySize: 4,
    date: new Date().toISOString().split('T')[0],
    timeSlot: '19:30',
    customerName: 'Manka\'a Grace',
    customerPhone: '+237 699 22 18 34',
    specialRequests: 'Birthday celebration dinner, please prepare fresh Kati Kati with warm fufu corn on arrival',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  }
];

// Lazy Gemini client helper
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    try {
      geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.warn('Could not initialize Gemini Client:', err);
    }
  }
  return geminiClient;
}

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    region: 'Bamenda, Cameroon (Abakwa)',
    service: 'Bamenda Dine & Track API',
    timestamp: new Date().toISOString()
  });
});

// Get all restaurants
app.get('/api/restaurants', (req, res) => {
  res.json({ success: true, data: BAMENDA_RESTAURANTS });
});

// Get single restaurant
app.get('/api/restaurants/:id', (req, res) => {
  const restaurant = BAMENDA_RESTAURANTS.find(r => r.id === req.params.id);
  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found in Bamenda directory' });
  }
  res.json({ success: true, data: restaurant });
});

// Get fleet drivers
app.get('/api/drivers/fleet', (req, res) => {
  res.json({ success: true, data: MOCK_DELIVERY_RIDERS });
});

// Get all orders or filter by customerPhone
app.get('/api/orders', (req, res) => {
  res.json({ success: true, data: ordersDatabase });
});

// Get single order
app.get('/api/orders/:id', (req, res) => {
  const order = ordersDatabase.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, data: order });
});

// Place new order
app.post('/api/orders', (req, res) => {
  try {
    const {
      restaurantId,
      restaurantName,
      items,
      subtotalFCFA,
      deliveryFeeFCFA,
      totalFCFA,
      customerName,
      customerPhone,
      deliveryAddress,
      paymentMethod
    } = req.body;

    // Generate random 4-digit Security Handover PIN (e.g. "5821")
    const securityHandoverPin = Math.floor(1000 + Math.random() * 9000).toString();
    const orderNumber = `BDA-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrderId = `ord-${Date.now()}`;

    // Select suitable rider
    const assignedRider = { ...MOCK_DELIVERY_RIDERS[Math.floor(Math.random() * MOCK_DELIVERY_RIDERS.length)] };
    assignedRider.status = 'in_transit';

    const newOrder = {
      id: newOrderId,
      orderNumber,
      restaurantId,
      restaurantName,
      restaurantAddress: 'Commercial Avenue / Nkwen, Bamenda',
      items: items || [],
      subtotalFCFA: Number(subtotalFCFA) || 0,
      deliveryFeeFCFA: Number(deliveryFeeFCFA) || 800,
      totalFCFA: Number(totalFCFA) || 0,
      status: 'in_transit',
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: '25 mins',
      customerName: customerName || 'Valued Bamenda Diner',
      customerPhone: customerPhone || '+237 670 00 00 00',
      deliveryAddress: deliveryAddress || {
        neighborhood: 'Mile 3 Nkwen',
        street: 'Main Road',
        landmark: 'Near Church',
        lat: 5.9750,
        lng: 10.1760
      },
      payment: {
        method: paymentMethod || 'mtn_momo',
        status: paymentMethod === 'cash_on_delivery' ? 'pending' : 'approved',
        phoneNumber: customerPhone,
        transactionRef: `${paymentMethod?.toUpperCase() || 'MOMO'}-${Math.floor(100000 + Math.random() * 900000)}`,
        paidAt: new Date().toISOString()
      },
      securityHandoverPin,
      driver: assignedRider,
      telemetryHistory: [
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          lat: BAMENDA_WAYPOINTS[0].lat,
          lng: BAMENDA_WAYPOINTS[0].lng,
          speedKmH: 0,
          event: `Order confirmed at ${restaurantName}. Rider dispatched.`
        }
      ]
    };

    ordersDatabase.unshift(newOrder);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Keep your 4-digit Handover PIN handy.',
      data: newOrder
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Secure Handover Verification (Driver monitoring verification)
// When driver arrives, driver must enter the customer's 4-digit PIN to mark parcel delivered
app.post('/api/orders/:id/verify-handover', (req, res) => {
  const { id } = req.params;
  const { pinEntered, driverNotes } = req.body;

  const order = ordersDatabase.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (String(order.securityHandoverPin) !== String(pinEntered).trim()) {
    return res.status(400).json({
      success: false,
      message: 'Security Verification Failed: The 4-digit Handover PIN is incorrect. For safety, the driver cannot release this order without the correct OTP.'
    });
  }

  // Verification succeeded
  order.status = 'delivered';
  if (order.driver) {
    order.driver.status = 'idle';
  }
  order.telemetryHistory.push({
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    lat: order.deliveryAddress.lat,
    lng: order.deliveryAddress.lng,
    speedKmH: 0,
    event: `Secure Handover Verified with PIN ${pinEntered}. Parcel successfully delivered to ${order.customerName}.`
  });

  res.json({
    success: true,
    message: 'Handover verified successfully! Order completed.',
    data: order
  });
});

// Update order status or live telemetry simulation
app.post('/api/orders/:id/telemetry', (req, res) => {
  const { id } = req.params;
  const { lat, lng, speedKmH, status, streetName, event } = req.body;

  const order = ordersDatabase.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (order.driver) {
    if (lat !== undefined) order.driver.currentLat = lat;
    if (lng !== undefined) order.driver.currentLng = lng;
    if (speedKmH !== undefined) order.driver.speedKmH = speedKmH;
    if (streetName) order.driver.currentStreetName = streetName;
    if (status) {
      order.status = status;
      order.driver.status = status === 'delivered' ? 'idle' : 'in_transit';
    }
  }

  if (event) {
    order.telemetryHistory.push({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lat: lat || (order.driver?.currentLat ?? 5.9620),
      lng: lng || (order.driver?.currentLng ?? 10.1620),
      speedKmH: speedKmH || 25,
      event
    });
  }

  res.json({ success: true, data: order });
});

// Table Reservations
app.get('/api/reservations', (req, res) => {
  res.json({ success: true, data: reservationsDatabase });
});

app.post('/api/reservations', (req, res) => {
  try {
    const {
      restaurantId,
      restaurantName,
      tableId,
      tableNumber,
      tableZone,
      partySize,
      date,
      timeSlot,
      customerName,
      customerPhone,
      customerEmail,
      specialRequests
    } = req.body;

    const reservationNumber = `BDA-RES-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReservation = {
      id: `res-${Date.now()}`,
      reservationNumber,
      restaurantId,
      restaurantName,
      tableId: tableId || 'table-1',
      tableNumber: tableNumber || 1,
      tableZone: tableZone || 'Indoor Hearth',
      partySize: Number(partySize) || 2,
      date: date || new Date().toISOString().split('T')[0],
      timeSlot: timeSlot || '19:00',
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      specialRequests: specialRequests || '',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    reservationsDatabase.unshift(newReservation);

    res.status(201).json({
      success: true,
      message: 'Table reservation confirmed at ' + restaurantName,
      data: newReservation
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Local Payment Simulator (MTN MoMo, Orange Money, Express Union)
app.post('/api/payments/momo/push', (req, res) => {
  const { phoneNumber, amountFCFA } = req.body;
  const cleanPhone = (phoneNumber || '').replace(/\s+/g, '');

  if (!cleanPhone) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }

  // Simulate instant USSD prompt generation
  const txRef = `MOMO-237-${Math.floor(100000 + Math.random() * 900000)}`;
  
  res.json({
    success: true,
    provider: 'MTN Mobile Money Cameroon',
    transactionRef: txRef,
    amountFCFA,
    currency: 'XAF',
    ussdCode: '*126#',
    promptMessage: `Payment request of ${amountFCFA} FCFA sent to ${cleanPhone}. Please approve prompt on your MTN handset or dial *126#.`
  });
});

app.post('/api/payments/orange/push', (req, res) => {
  const { phoneNumber, amountFCFA } = req.body;
  const cleanPhone = (phoneNumber || '').replace(/\s+/g, '');

  const txRef = `OM-237-${Math.floor(100000 + Math.random() * 900000)}`;
  res.json({
    success: true,
    provider: 'Orange Money Cameroun',
    transactionRef: txRef,
    amountFCFA,
    currency: 'XAF',
    ussdCode: '#150#',
    promptMessage: `Demande de paiement de ${amountFCFA} FCFA envoyée au ${cleanPhone}. Validez avec votre code secret Orange Money via #150#.`
  });
});

// Gemini AI Culinary Concierge for Bamenda
app.post('/api/ai/concierge', async (req, res) => {
  const { message, previousMessages = [] } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  const ai = getGeminiClient();

  if (!ai) {
    // Elegant localized fallback if GEMINI_API_KEY is not configured
    const lower = message.toLowerCase();
    let reply = "Hello! I am your Abakwa Culinary Guide. In Bamenda, you must try our famous Achu with golden limestone soup and smoked kanda, or fire-charred Kati Kati with fufu corn and garden-fresh jamajama. What flavors do you crave today?";
    
    if (lower.includes('achu')) {
      reply = "Achu is our crown jewel! Pounded from smooth taro tubers, served with yellow soup crafted with native kanwa, red oil, and 15 medicinal spices. We recommend pairing it with smoked cow skin (kanda) and washed down with cold raffia palm wine from Mankon.";
    } else if (lower.includes('kati') || lower.includes('chicken')) {
      reply = "Kati Kati is flame-charred organic chicken sizzled in melted cow butter oil (mbi) and native hot pepper! It is traditionally eaten with hot yellow fufu corn and sauteed jamajama (huckleberry greens). Abakwa Grill & Lounge makes the finest in Mile 2!";
    } else if (lower.includes('fish') || lower.includes('braise')) {
      reply = "For roasted fish, try the whole Bar Fish at Abakwa Grill or Sonac Street, seasoned with Penja white pepper and crushed njangsang, served with golden dodo (fried plantains) and spicy piment!";
    } else if (lower.includes('table') || lower.includes('reserve')) {
      reply = "For table reservations, I recommend the Hilltop Horizon Lounge in Up Station for romantic sunset views over Bamenda valley, or the Garden Cabana at Abakwa Grill for family gatherings!";
    } else if (lower.includes('momo') || lower.includes('pay') || lower.includes('orange')) {
      reply = "We support instant MTN Mobile Money (*126#), Orange Money (#150#), Express Union, or Cash on Delivery. Every order comes with a unique 4-digit Security Handover PIN for safe delivery!";
    }

    return res.json({
      success: true,
      reply,
      suggestedDishes: [
        { name: 'Royal Bamenda Achu', restaurant: 'Achu Queen Palace', priceFCFA: 3500 },
        { name: 'Signature Kati Kati Combo', restaurant: 'Abakwa Grill & Lounge', priceFCFA: 4500 }
      ]
    });
  }

  try {
    const prompt = `You are "Chef Bih", an expert culinary sommelier and hospitality host for Bamenda, Cameroon (Abakwa).
You speak with warmth, authentic pride in Cameroonian Grassfields culture, and deep knowledge of North-West Region specialties:
- Achu with yellow soup (Canwa, spices) and kanda (cow skin) or black soup
- Kati Kati (flame-charred chicken in cow butter oil) with fufu corn and jamajama (huckleberry greens)
- Bamenda roasted fish with Penja white pepper and dodo (fried plantains)
- Fresh Raffia palm wine (Matango / Mimbo)
- Up Station, Commercial Avenue, Mile 2-4 Nkwen, Small Mankon
- Table reservations and secure delivery with 4-digit handover PINs and MTN MoMo / Orange Money.

Keep your response conversational, appetizing, welcoming, and concise (under 120 words). Provide advice, flavor notes, or recommendations matching the user's inquiry:
User query: "${message}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      success: true,
      reply: response.text || "Welcome to Bamenda dining! Let me know if you would like Achu, Kati Kati, or fresh roasted fish today."
    });
  } catch (err: any) {
    console.error('Gemini error:', err);
    res.json({
      success: true,
      reply: "Welcome to Abakwa! For an authentic feast, I highly recommend ordering the Royal Bamenda Achu with extra kanda from Achu Queen Palace or the Signature Kati Kati from Abakwa Grill!"
    });
  }
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & STATIC SERVING
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Abakwa Dine & Track Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
