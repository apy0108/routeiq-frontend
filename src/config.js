// ChatIQ API Configuration
export const API_BASE = 'https://routeiq.duckdns.org';


export const DEFAULT_BOT_COLORS = [
  { name: 'Indigo', hex: '#4f46e5', label: 'Indigo' },
  { name: 'Sky Blue', hex: '#0284c7', label: 'Sky Blue' },
  { name: 'Emerald', hex: '#059669', label: 'Emerald' },
  { name: 'Amber', hex: '#d97706', label: 'Amber' },
  { name: 'Rose', hex: '#e11d48', label: 'Rose' },
  { name: 'Slate', hex: '#0f172a', label: 'Dark' },
];

export const BUSINESS_TYPES = [
  {
    id: 'healthcare',
    title: 'Healthcare',
    description: 'Clinics, dentists, and healthcare practices',
    defaultWelcome: 'Hello! How can I assist you with appointments, operating hours, or our services today?'
  },
  {
    id: 'ecommerce',
    title: 'Online Shop',
    description: 'E-commerce stores and retail products',
    defaultWelcome: 'Hi! Welcome to our store. Are you looking for product recommendations, shipping info, or order support?'
  },
  {
    id: 'food',
    title: 'Food & Dining',
    description: 'Restaurants, cafes, and catering',
    defaultWelcome: 'Welcome! How can I help you with our menu, specials, or table reservations today?'
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Schools, academies, and online courses',
    defaultWelcome: 'Hello! How can I help you explore programs, admissions, or course schedules?'
  },
  {
    id: 'realestate',
    title: 'Real Estate',
    description: 'Brokers, property listings, and rentals',
    defaultWelcome: 'Welcome! Are you looking to buy, sell, or rent? Let me know what property details you need.'
  },
  {
    id: 'general',
    title: 'General Business',
    description: 'Consulting, services, and software agencies',
    defaultWelcome: 'Hello! Welcome to our website. How can I help you with our services and pricing today?'
  },
];
