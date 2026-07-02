import {
  Plane, Hotel, Utensils, Camera, Navigation, Crown, Edit3, Eye,
} from "lucide-react";
import type { Trip, ItineraryDay } from "./types";

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 1,
    destination: "Kyoto, Japan",
    dates: "Aug 12–22, 2025",
    coverUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop&auto=format",
    members: [
      { name: "You", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&auto=format" },
      { name: "Mia", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&auto=format" },
      { name: "Ryo", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&auto=format" },
    ],
    daysLeft: 44,
    progress: 68,
    budget: 3200,
    spent: 1480,
  },
  {
    id: 2,
    destination: "Amalfi Coast, Italy",
    dates: "Oct 5–14, 2025",
    coverUrl: "https://images.unsplash.com/photo-1612698093158-e07ac200d44e?w=600&h=400&fit=crop&auto=format",
    members: [
      { name: "You", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&auto=format" },
      { name: "Sara", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&auto=format" },
    ],
    daysLeft: 96,
    progress: 22,
    budget: 4800,
    spent: 840,
  },
];

export const INITIAL_ITINERARIES: Record<number, ItineraryDay[]> = {
  1: [
    {
      date: "Aug 12 · Mon",
      activities: [
        { time: "09:00", type: "flight", label: "Flight SFO → KIX", detail: "JAL 060 · 11h 30m", icon: Plane, color: "#1A3F6F", transportMode: "flight" },
        { time: "17:30", type: "checkin", label: "Check-in: Nishiki Ryokan", detail: "Gion District", icon: Hotel, color: "#2EC4B6" },
        { time: "19:30", type: "food", label: "Dinner — Kikunoi Roan", detail: "Traditional kaiseki", icon: Utensils, color: "#FF6B4A" },
      ],
    },
    {
      date: "Aug 13 · Tue",
      activities: [
        { time: "07:00", type: "activity", label: "Fushimi Inari-taisha", detail: "2–3 hrs · Free entry", icon: Camera, color: "#FF6B4A" },
        { time: "11:00", type: "food", label: "Lunch — Nishiki Market", detail: "Street food tour", icon: Utensils, color: "#F4A261" },
        { time: "14:00", type: "activity", label: "Arashiyama Bamboo Grove", detail: "45 min walk", icon: Camera, color: "#2EC4B6" },
        { time: "17:00", type: "food", label: "Coffee — % Arabica Kyoto", detail: "Higashiyama", icon: Utensils, color: "#1A3F6F" },
      ],
    },
  ],
  2: [
    {
      date: "Oct 5 · Sun",
      activities: [
        { time: "10:15", type: "flight", label: "Flight SFO → NAP", detail: "DL 122 · 13h 05m", icon: Plane, color: "#1A3F6F", transportMode: "flight" },
        { time: "18:00", type: "checkin", label: "Check-in: Hotel Santa Caterina", detail: "Amalfi", icon: Hotel, color: "#2EC4B6" },
      ],
    },
  ],
};

export const MAP_PINS = [
  { x: 38, y: 42, label: "Fushimi Inari", active: true },
  { x: 55, y: 30, label: "Nishiki Market", active: false },
  { x: 22, y: 55, label: "Arashiyama", active: false },
  { x: 62, y: 60, label: "Gion District", active: false },
  { x: 45, y: 68, label: "Ryokan", active: false },
];

export const DISCOVER_TABS = ["Destinations", "Hotels", "Restaurants"];

export const DESTINATIONS = [
  {
    name: "Santorini, Greece",
    tag: "Island · Summer",
    rating: 4.9,
    reviews: 2341,
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop&auto=format",
    saved: true,
  },
  {
    name: "Bali, Indonesia",
    tag: "Tropical · Year-round",
    rating: 4.7,
    reviews: 5820,
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop&auto=format",
    saved: false,
  },
  {
    name: "Patagonia, Chile",
    tag: "Adventure · Nov–Mar",
    rating: 4.8,
    reviews: 1203,
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=400&fit=crop&auto=format",
    saved: false,
  },
];

export const HOTELS = [
  {
    name: "The Peninsula Tokyo",
    location: "Marunouchi",
    rating: 4.9,
    price: 580,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&auto=format",
    saved: false,
  },
  {
    name: "Nishiki Ryokan",
    location: "Gion, Kyoto",
    rating: 4.8,
    price: 320,
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop&auto=format",
    saved: true,
  },
  {
    name: "Park Hyatt Kyoto",
    location: "Higashiyama",
    rating: 4.7,
    price: 440,
    imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop&auto=format",
    saved: false,
  },
];

export const RESTAURANTS = [
  {
    name: "Kikunoi Roan",
    location: "Gion · Kaiseki",
    rating: 4.9,
    price: "¥¥¥",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&auto=format",
    saved: true,
  },
  {
    name: "Nishiki Market Stalls",
    location: "Downtown · Street food",
    rating: 4.6,
    price: "¥",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&auto=format",
    saved: false,
  },
  {
    name: "% Arabica Kyoto",
    location: "Higashiyama · Café",
    rating: 4.7,
    price: "¥¥",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop&auto=format",
    saved: false,
  },
];

// Okabe-Ito colorblind-safe palette, used when accessibility.colorBlindMode !== "off"
export const COLORBLIND_SAFE_PALETTE = ["#0072B2", "#E69F00", "#009E73", "#D55E00", "#56B4E9", "#CC79A7"];

export const EXPENSE_CATEGORIES = [
  { name: "Flights", amount: 1240, color: "#1A3F6F", icon: Plane, description: "Airfare for all trip-mates" },
  { name: "Hotels", amount: 960, color: "#2EC4B6", icon: Hotel, description: "Lodging & accommodation" },
  { name: "Dining", amount: 380, color: "#FF6B4A", icon: Utensils, description: "Restaurants, cafés & street food" },
  { name: "Activities", amount: 220, color: "#F4A261", icon: Camera, description: "Tours, tickets & experiences" },
  { name: "Transport", amount: 180, color: "#00B4D8", icon: Navigation, description: "Local transit, taxis & rentals" },
];

export const RECENT_EXPENSES = [
  { label: "JAL 060 — SFO → KIX", category: "Flight", amount: 1240, date: "Jul 28", member: "You", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&auto=format" },
  { label: "Nishiki Ryokan · 10 nights", category: "Hotel", amount: 320, date: "Jul 25", member: "Mia", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&auto=format" },
  { label: "Kikunoi Roan dinner", category: "Dining", amount: 84, date: "Aug 12", member: "Ryo", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&auto=format" },
  { label: "Arashiyama rickshaw", category: "Activity", amount: 60, date: "Aug 13", member: "You", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&auto=format" },
];

export const MONTHLY_SPEND = [
  { month: "Jun", amount: 320 },
  { month: "Jul", amount: 1560 },
  { month: "Aug", amount: 840 },
  { month: "Sep", amount: 180 },
];

export const FRIENDS = [
  {
    name: "Mia Tanaka",
    handle: "@mia.tanaka",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=128&h=128&fit=crop&auto=format",
    role: "Co-planner",
    roleIcon: Crown,
    roleColor: "#F4A261",
    status: "online",
    location: "Tokyo",
    trips: 8,
    editing: "Itinerary Day 2",
  },
  {
    name: "Ryo Matsuda",
    handle: "@ryo.mat",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&auto=format",
    role: "Editor",
    roleIcon: Edit3,
    roleColor: "#2EC4B6",
    status: "online",
    location: "Osaka",
    trips: 4,
    editing: "Budget",
  },
  {
    name: "Sara Chen",
    handle: "@sarachen",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&auto=format",
    role: "Viewer",
    roleIcon: Eye,
    roleColor: "#7A8899",
    status: "away",
    location: "San Francisco",
    trips: 12,
    editing: null as string | null,
  },
];

export const QUICK_ADD_TYPES = [
  { label: "Flight", icon: Plane, color: "#1A3F6F", type: "flight" },
  { label: "Hotel", icon: Hotel, color: "#2EC4B6", type: "checkin" },
  { label: "Dining", icon: Utensils, color: "#FF6B4A", type: "food" },
  { label: "Activity", icon: Camera, color: "#F4A261", type: "activity" },
  { label: "Transport", icon: Navigation, color: "#00B4D8", type: "transport" },
];

export const TRANSPORT_MODES: { id: "flight" | "train" | "car" | "bus" | "ferry" | "bike" | "walk" | "rideshare"; label: string }[] = [
  { id: "flight", label: "Flight" },
  { id: "train", label: "Train" },
  { id: "car", label: "Car" },
  { id: "bus", label: "Bus" },
  { id: "ferry", label: "Ferry" },
  { id: "rideshare", label: "Rideshare" },
  { id: "bike", label: "Bike" },
  { id: "walk", label: "Walk" },
];
