import { useState, useEffect, useCallback } from "react";
import {
  MapPin, Search, Calendar, Plus, ChevronRight, Star, Heart,
  Bookmark, DollarSign, Users, Map, Compass, Wallet, User,
  Plane, Hotel, Utensils, Clock, MoreHorizontal, Bell, Settings,
  ArrowLeft, Camera, Coffee, CheckCircle, Circle, GripVertical,
  TrendingUp, PieChart, SplitSquareHorizontal, Crown, Shield,
  Eye, ChevronDown, Thermometer, Wind, Sun, X, Check, Edit3,
  Navigation, Layers, Moon, Gear, Trash2, Info
} from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";

// ─── Types ──────────────────────────────────────────────────────────────────

type Tab = "explore" | "trips" | "discover" | "budget" | "friends";

type ToastItem = {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  color?: string;
};

type Trip = {
  id: number;
  destination: string;
  dates: string;
  coverUrl: string;
  members: { name: string; avatar: string }[];
  daysLeft: number;
  progress: number;
  budget: number;
  spent: number;
};

type Activity = {
  time: string;
  type: string;
  label: string;
  detail: string;
  icon: React.ElementType;
  color: string;
};

type ItineraryDay = {
  date: string;
  activities: Activity[];
};

// ─── Data ───────────────────────────────────────────────────────────────────

const INITIAL_TRIPS: Trip[] = [
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

const INITIAL_ITINERARY_DAYS: ItineraryDay[] = [
  {
    date: "Aug 12 · Mon",
    activities: [
      { time: "09:00", type: "flight", label: "Flight SFO → KIX", detail: "JAL 060 · 11h 30m", icon: Plane, color: "#1A3F6F" },
      { time: "17:30", type: "checkin", label: "Check-in: Nishiki Ryokan", detail: "Gion District", icon: Hotel, color: "#2EC4B6" },
      { time: "19:30", type: "food", label: "Dinner — Kikunoi Roan", detail: "Traditional kaiseki", icon: Utensils, color: "#FF6B4A" },
    ],
  },
  {
    date: "Aug 13 · Tue",
    activities: [
      { time: "07:00", type: "activity", label: "Fushimi Inari-taisha", detail: "2–3 hrs · Free entry", icon: MapPin, color: "#FF6B4A" },
      { time: "11:00", type: "food", label: "Lunch — Nishiki Market", detail: "Street food tour", icon: Utensils, color: "#F4A261" },
      { time: "14:00", type: "activity", label: "Arashiyama Bamboo Grove", detail: "45 min walk", icon: Camera, color: "#2EC4B6" },
      { time: "17:00", type: "food", label: "Coffee — % Arabica Kyoto", detail: "Higashiyama", icon: Coffee, color: "#1A3F6F" },
    ],
  },
];

const MAP_PINS = [
  { x: 38, y: 42, label: "Fushimi Inari", active: true },
  { x: 55, y: 30, label: "Nishiki Market", active: false },
  { x: 22, y: 55, label: "Arashiyama", active: false },
  { x: 62, y: 60, label: "Gion District", active: false },
  { x: 45, y: 68, label: "Ryokan", active: false },
];

const DISCOVER_TABS = ["Destinations", "Hotels", "Restaurants"];

const DESTINATIONS = [
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

const HOTELS = [
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

const RESTAURANTS = [
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

const EXPENSE_CATEGORIES = [
  { name: "Flights", amount: 1240, color: "#1A3F6F", icon: Plane },
  { name: "Hotels", amount: 960, color: "#2EC4B6", icon: Hotel },
  { name: "Dining", amount: 380, color: "#FF6B4A", icon: Utensils },
  { name: "Activities", amount: 220, color: "#F4A261", icon: Camera },
  { name: "Transport", amount: 180, color: "#00B4D8", icon: Navigation },
];

const RECENT_EXPENSES = [
  { label: "JAL 060 — SFO → KIX", category: "Flight", amount: 1240, date: "Jul 28", member: "You", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&auto=format" },
  { label: "Nishiki Ryokan · 10 nights", category: "Hotel", amount: 320, date: "Jul 25", member: "Mia", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&auto=format" },
  { label: "Kikunoi Roan dinner", category: "Dining", amount: 84, date: "Aug 12", member: "Ryo", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&auto=format" },
  { label: "Arashiyama rickshaw", category: "Activity", amount: 60, date: "Aug 13", member: "You", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&auto=format" },
];

const MONTHLY_SPEND = [
  { month: "Jun", amount: 320 },
  { month: "Jul", amount: 1560 },
  { month: "Aug", amount: 840 },
  { month: "Sep", amount: 180 },
];

const FRIENDS = [
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
    editing: null,
  },
];

const QUICK_ADD_TYPES = [
  { label: "Flight", icon: Plane, color: "#1A3F6F", type: "flight" },
  { label: "Hotel", icon: Hotel, color: "#2EC4B6", type: "checkin" },
  { label: "Dining", icon: Utensils, color: "#FF6B4A", type: "food" },
  { label: "Activity", icon: Camera, color: "#F4A261", type: "activity" },
];

// ─── Utility ──────────────────────────────────────────────────────────────────

function genId() {
  return Math.random().toString(36).slice(2);
}

// ─── Utility components ──────────────────────────────────────────────────────

function Avatar({ src, name, size = 32, ring = false }: { src: string; name: string; size?: number; ring?: boolean }) {
  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      className={`rounded-full object-cover flex-shrink-0 ${ring ? "ring-2 ring-white" : ""}`}
      style={{ width: size, height: size }}
    />
  );
}

function StarRating({ rating, reviews }: { rating: number; reviews?: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star size={12} className="fill-amber-400 text-amber-400" />
      <span className="text-xs font-semibold text-foreground">{rating}</span>
      {reviews !== undefined && <span className="text-xs text-muted-foreground">({reviews.toLocaleString()})</span>}
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: color ? `${color}18` : undefined, color: color ?? "var(--primary)" }}
    >
      {children}
    </span>
  );
}

// ─── Toast System ─────────────────────────────────────────────────────────────

function ToastStack({ toasts, dismiss }: { toasts: ToastItem[]; dismiss: (id: string) => void }) {
  const visible = toasts.slice(0, 2);
  if (!visible.length) return null;
  return (
    <div className="absolute top-12 left-3 right-3 z-[200] flex flex-col gap-2 pointer-events-none">
      {visible.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2 bg-foreground text-background rounded-xl px-3 py-2.5 shadow-lg pointer-events-auto transition-all duration-200"
          style={t.color ? { background: t.color } : undefined}
        >
          <p className="text-xs font-medium flex-1 leading-snug">{t.message}</p>
          {t.actionLabel && t.onAction && (
            <button
              onClick={() => { t.onAction!(); dismiss(t.id); }}
              className="text-xs font-bold underline flex-shrink-0 opacity-90 hover:opacity-100"
            >
              {t.actionLabel}
            </button>
          )}
          <button onClick={() => dismiss(t.id)} className="flex-shrink-0 opacity-70 hover:opacity-100">
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Quick-Add Modal ─────────────────────────────────────────────────────────

function QuickAddModal({
  initialType,
  onClose,
  onAdd,
}: {
  initialType: string;
  onClose: () => void;
  onAdd: (activity: Activity) => void;
}) {
  const typeInfo = QUICK_ADD_TYPES.find((t) => t.type === initialType) ?? QUICK_ADD_TYPES[3];
  const [label, setLabel] = useState("");
  const [time, setTime] = useState("09:00");

  const iconMap: Record<string, React.ElementType> = {
    flight: Plane,
    checkin: Hotel,
    food: Utensils,
    activity: Camera,
  };

  const handleAdd = () => {
    if (!label.trim()) return;
    onAdd({
      time,
      type: typeInfo.type,
      label: label.trim(),
      detail: "",
      icon: iconMap[typeInfo.type] ?? Camera,
      color: typeInfo.color,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full bg-card rounded-t-3xl p-6 pb-10 shadow-2xl transition-all duration-200">
        <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-6" />
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${typeInfo.color}18` }}>
              <typeInfo.icon size={16} style={{ color: typeInfo.color }} />
            </div>
            <h2 className="font-display text-lg font-semibold">Add {typeInfo.label}</h2>
          </div>
          <button onClick={onClose}><X size={20} className="text-muted-foreground" /></button>
        </div>

        <div className="space-y-3 mb-5">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Label</label>
            <input
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={`e.g. ${typeInfo.label === "Flight" ? "Flight LHR → JFK" : typeInfo.label === "Hotel" ? "Hotel check-in" : typeInfo.label === "Dining" ? "Dinner reservation" : "Museum visit"}`}
              className="w-full bg-input-background rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-input-background rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition"
            />
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={!label.trim()}
          className="w-full bg-primary text-primary-foreground rounded-2xl py-4 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          Add to Day 1
        </button>
      </div>
    </div>
  );
}

// ─── Settings Panel ───────────────────────────────────────────────────────────

function SettingsPanel({
  dark,
  onToggleDark,
  onClose,
  pushToast,
}: {
  dark: boolean;
  onToggleDark: () => void;
  onClose: () => void;
  pushToast: (t: Omit<ToastItem, "id">) => void;
}) {
  const [notifications, setNotifications] = useState(true);
  const [personalised, setPersonalised] = useState(true);
  const [shareData, setShareData] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [whatsNewOpen, setWhatsNewOpen] = useState(false);

  const handleSendFeedback = () => {
    setFeedbackOpen(false);
    setFeedback("");
    pushToast({ message: "Thanks for your feedback! We really appreciate it." });
  };

  return (
    <>
      <div className="fixed inset-0 z-[110] flex items-end">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full bg-card rounded-t-3xl p-6 pb-10 shadow-2xl max-h-[85vh] overflow-y-auto scrollbar-hide transition-all duration-200">
          <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-6" />
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-semibold">Settings</h2>
            <button onClick={onClose}><X size={20} className="text-muted-foreground" /></button>
          </div>

          {/* What's new */}
          <button
            onClick={() => setWhatsNewOpen(true)}
            className="w-full flex items-center gap-3 bg-muted/40 rounded-xl px-4 py-3 mb-4 hover:bg-muted/60 transition-colors"
          >
            <span className="text-sm font-semibold text-foreground flex-1 text-left">What's new</span>
            <span className="text-[10px] font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full">NEW</span>
            <ChevronRight size={14} className="text-muted-foreground" />
          </button>

          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Preferences</p>
          <div className="bg-card border border-border rounded-2xl overflow-hidden mb-4">
            {[
              { label: "Dark mode", value: dark, onToggle: onToggleDark },
              { label: "Notifications", value: notifications, onToggle: () => setNotifications((v) => !v) },
              { label: "Personalised recommendations", value: personalised, onToggle: () => setPersonalised((v) => !v) },
              { label: "Share trip data with partners", value: shareData, onToggle: () => setShareData((v) => !v) },
            ].map(({ label, value, onToggle }, i, arr) => (
              <div key={label} className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                <span className="text-sm text-foreground flex-1">{label}</span>
                <button
                  onClick={onToggle}
                  className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${value ? "bg-primary" : "bg-muted"}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${value ? "translate-x-4" : "translate-x-0"}`}
                  />
                </button>
              </div>
            ))}
          </div>

          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Support</p>
          <div className="bg-card border border-border rounded-2xl overflow-hidden mb-4">
            <button
              onClick={() => setFeedbackOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 border-b border-border hover:bg-muted/40 transition-colors"
            >
              <span className="text-sm text-foreground flex-1 text-left">Send feedback</span>
              <ChevronRight size={14} className="text-muted-foreground" />
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors">
              <span className="text-sm text-foreground flex-1 text-left">Privacy policy</span>
              <ChevronRight size={14} className="text-muted-foreground" />
            </button>
          </div>

          <p className="text-center text-[10px] text-muted-foreground mt-2">Wandr v1.0 · AI-assisted planning</p>
        </div>
      </div>

      {/* Feedback modal */}
      {feedbackOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setFeedbackOpen(false)} />
          <div className="relative w-full bg-card rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Send feedback</h3>
              <button onClick={() => setFeedbackOpen(false)}><X size={18} className="text-muted-foreground" /></button>
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what's on your mind..."
              rows={4}
              className="w-full bg-input-background rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition resize-none mb-4"
            />
            <button
              onClick={handleSendFeedback}
              disabled={!feedback.trim()}
              className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* What's new modal */}
      {whatsNewOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setWhatsNewOpen(false)} />
          <div className="relative w-full bg-card rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">What's new</h3>
              <button onClick={() => setWhatsNewOpen(false)}><X size={18} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-3 mb-4">
              {[
                "Split bill feature added",
                "Dark mode support",
                "Real-time collaboration status",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="text-primary font-bold">✦</span>
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setWhatsNewOpen(false)}
              className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Profile Edit Sheet ───────────────────────────────────────────────────────

function ProfileEditSheet({
  profile,
  onSave,
  onClose,
}: {
  profile: { name: string; handle: string; city: string };
  onSave: (p: { name: string; handle: string; city: string }) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(profile.name);
  const [handle, setHandle] = useState(profile.handle);
  const [city, setCity] = useState(profile.city);

  return (
    <div className="fixed inset-0 z-[100] flex items-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full bg-card rounded-t-3xl p-6 pb-10 shadow-2xl transition-all duration-200">
        <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-6" />
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold">Edit profile</h2>
          <button onClick={onClose}><X size={20} className="text-muted-foreground" /></button>
        </div>
        <div className="space-y-3 mb-5">
          {[
            { label: "Name", value: name, setter: setName, placeholder: "Your name" },
            { label: "Handle", value: handle, setter: setHandle, placeholder: "@handle" },
            { label: "Home city", value: city, setter: setCity, placeholder: "e.g. San Francisco" },
          ].map(({ label, value, setter, placeholder }) => (
            <div key={label}>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">{label}</label>
              <input
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-input-background rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => { onSave({ name, handle, city }); onClose(); }}
          className="w-full bg-primary text-primary-foreground rounded-2xl py-4 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

// ─── Screen: Explore ─────────────────────────────────────────────────────────

function ExploreScreen({
  trips,
  onNewTrip,
  onDeleteTrip,
  onQuickAdd,
  dark,
  onToggleDark,
  onOpenSettings,
}: {
  trips: Trip[];
  onNewTrip: () => void;
  onDeleteTrip: (id: number) => void;
  onQuickAdd: (type: string) => void;
  dark: boolean;
  onToggleDark: () => void;
  onOpenSettings: () => void;
}) {
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setConfirmDeleteId(null);
    setMenuOpenId(null);
    onDeleteTrip(id);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">Good morning</p>
            <h1 className="font-display text-2xl font-semibold text-foreground leading-tight">Ready to wander?</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={onToggleDark}
              className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-muted-foreground" />}
            </button>
            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Open settings"
            >
              <Settings size={14} className="text-muted-foreground" />
            </button>
            <div className="relative">
              <Avatar src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&auto=format" name="You" size={40} />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full border-2 border-white" />
            </div>
          </div>
        </div>

        {/* Search bar */}
        <button
          onClick={onNewTrip}
          className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-border hover:shadow-md transition-shadow"
        >
          <Search size={18} className="text-primary flex-shrink-0" />
          <span className="text-muted-foreground text-sm font-normal flex-1 text-left">Where to next?</span>
          <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <Plus size={14} className="text-white" />
          </div>
        </button>
      </div>

      {/* Active trips */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Your Trips</h2>
          <button className="text-xs text-primary font-medium">See all</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
          {trips.map((trip) => (
            <div
              key={`trip-card-${trip.id}`}
              className="flex-shrink-0 w-64 bg-card rounded-2xl overflow-hidden shadow-sm border border-border relative"
            >
              <div className="relative h-32 bg-muted">
                <img src={trip.coverUrl} alt={trip.destination} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-display text-sm font-semibold leading-tight">{trip.destination}</p>
                  <p className="text-white/70 text-xs mt-0.5">{trip.dates}</p>
                </div>
                <div className="absolute top-3 right-3 bg-accent/90 rounded-full px-2 py-0.5">
                  <p className="text-white text-[10px] font-semibold">{trip.daysLeft}d left</p>
                </div>
                {/* Trip menu button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === trip.id ? null : trip.id); }}
                  className="absolute top-3 left-3 w-6 h-6 bg-black/30 rounded-full flex items-center justify-center"
                >
                  <MoreHorizontal size={12} className="text-white" />
                </button>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex -space-x-1.5">
                    {trip.members.map((m) => (
                      <Avatar key={`member-${trip.id}-${m.name}`} src={m.avatar} name={m.name} size={22} ring />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">${trip.spent.toLocaleString()} / ${trip.budget.toLocaleString()}</p>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${trip.progress}%`, background: "linear-gradient(90deg, #1A3F6F, #2EC4B6)" }}
                  />
                </div>
              </div>

              {/* Trip menu dropdown */}
              {menuOpenId === trip.id && (
                <div className="absolute top-10 left-3 bg-white rounded-xl shadow-lg border border-border z-10 overflow-hidden min-w-[140px]">
                  <button
                    onClick={() => { setConfirmDeleteId(trip.id); setMenuOpenId(null); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-500 font-medium hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={13} />
                    Delete trip
                  </button>
                </div>
              )}

              {/* Confirm delete inline */}
              {confirmDeleteId === trip.id && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-4 z-20">
                  <p className="text-xs font-semibold text-foreground text-center mb-1">Delete this trip?</p>
                  <p className="text-[10px] text-muted-foreground text-center mb-3">This can't be undone.</p>
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="flex-1 text-xs font-medium bg-muted rounded-lg py-1.5"
                    >
                      Keep it
                    </button>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="flex-1 text-xs font-semibold bg-red-500 text-white rounded-lg py-1.5"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add trip card */}
          <button
            onClick={onNewTrip}
            className="flex-shrink-0 w-40 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-primary/40 transition-colors"
            style={{ minHeight: 168 }}
          >
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <Plus size={18} className="text-primary" />
            </div>
            <p className="text-xs font-medium text-muted-foreground">New trip</p>
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-5 mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">Quick Add</h2>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_ADD_TYPES.map(({ label, icon: Icon, color, type }) => (
            <button
              key={`quick-${label}`}
              onClick={() => onQuickAdd(type)}
              className="flex flex-col items-center gap-1.5 p-3 bg-card rounded-xl border border-border hover:shadow-sm transition-shadow"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Trending destinations */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Trending Now</h2>
          <TrendingUp size={14} className="text-accent" />
        </div>
        <div className="space-y-2">
          {[
            { name: "Tokyo, Japan", tag: "Culture · Food", temp: "28°C", imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=120&h=80&fit=crop&auto=format" },
            { name: "Barcelona, Spain", tag: "Architecture · Beach", temp: "31°C", imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=120&h=80&fit=crop&auto=format" },
          ].map(({ name, tag, temp, imageUrl }) => (
            <div key={`trending-${name}`} className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{name}</p>
                <p className="text-xs text-muted-foreground">{tag}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Sun size={11} />
                  <span>{temp}</span>
                </div>
                <button className="text-[10px] font-semibold text-primary px-2 py-0.5 bg-secondary rounded-full">Explore</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Screen: New Trip Modal ───────────────────────────────────────────────────

function NewTripModal({ onClose, onCreateTrip }: { onClose: () => void; onCreateTrip: (destination: string, dates: string) => void }) {
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState("2025-08-12");
  const [endDate, setEndDate] = useState("2025-08-22");
  const [step, setStep] = useState<"search" | "dates" | "done">("search");
  const [selected, setSelected] = useState("");

  const SUGGESTIONS = [
    { name: "Kyoto, Japan", sub: "City · Cultural", imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=120&h=80&fit=crop&auto=format" },
    { name: "Amalfi Coast, Italy", sub: "Region · Coastal", imageUrl: "https://images.unsplash.com/photo-1612698093158-e07ac200d44e?w=120&h=80&fit=crop&auto=format" },
    { name: "Santorini, Greece", sub: "Island · Scenic", imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=120&h=80&fit=crop&auto=format" },
  ];

  const filtered = SUGGESTIONS.filter(
    (s) => !query || s.name.toLowerCase().includes(query.toLowerCase())
  );
  const noMatch = query.length > 0 && filtered.length === 0;
  const displayList = noMatch ? SUGGESTIONS : filtered;

  const handleCreate = () => {
    const dateStr = `${startDate} – ${endDate}`;
    onCreateTrip(selected, dateStr);
    setStep("done");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full bg-card rounded-t-3xl p-6 pb-10 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide transition-all duration-200">
        {/* Handle */}
        <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-6" />

        {step === "search" && (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-semibold">Plan a new trip</h2>
              <button onClick={onClose}><X size={20} className="text-muted-foreground" /></button>
            </div>

            <div className="relative mb-4">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Where to?"
                className="w-full bg-input-background rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>

            {noMatch && (
              <p className="text-xs text-muted-foreground mb-2 px-1">No exact matches. Showing popular destinations instead.</p>
            )}

            <p className="text-xs text-muted-foreground font-medium mb-3 uppercase tracking-wide">Popular</p>
            <div className="space-y-2">
              {displayList.map((s) => (
                <button
                  key={`suggestion-${s.name}`}
                  onClick={() => { setSelected(s.name); setStep("dates"); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/60 transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.sub}</p>
                  </div>
                  <ChevronRight size={16} className="ml-auto text-muted-foreground" />
                </button>
              ))}
            </div>
          </>
        )}

        {step === "dates" && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setStep("search")}><ArrowLeft size={20} className="text-foreground" /></button>
              <h2 className="font-display text-xl font-semibold">{selected}</h2>
            </div>

            <p className="text-xs text-muted-foreground font-medium mb-3 uppercase tracking-wide">Trip dates</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: "Depart", value: startDate, setter: setStartDate },
                { label: "Return", value: endDate, setter: setEndDate },
              ].map(({ label, value, setter }) => (
                <div key={`date-${label}`} className="bg-muted/50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-primary flex-shrink-0" />
                    <input
                      type="date"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="text-sm font-semibold text-foreground bg-transparent outline-none w-full"
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground font-medium mb-3 uppercase tracking-wide">Invite trip-mates</p>
            <div className="flex gap-2 mb-6">
              {FRIENDS.slice(0, 2).map((f) => (
                <button key={`invite-${f.name}`} className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2">
                  <Avatar src={f.avatar} name={f.name} size={24} />
                  <span className="text-xs font-medium text-foreground">{f.name.split(" ")[0]}</span>
                  <Check size={12} className="text-primary" />
                </button>
              ))}
              <button className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                  <Plus size={12} className="text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">Add</span>
              </button>
            </div>

            <button
              onClick={handleCreate}
              className="w-full bg-primary text-primary-foreground rounded-2xl py-4 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Create Trip
            </button>
          </>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-primary" />
            </div>
            <h2 className="font-display text-xl font-semibold mb-1">Trip created!</h2>
            <p className="text-sm text-muted-foreground mb-6">{selected} is ready to plan.</p>
            <button
              onClick={onClose}
              className="w-full bg-primary text-primary-foreground rounded-2xl py-4 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Start planning
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Screen: Trips (Itinerary) ────────────────────────────────────────────────

function TripsScreen({
  itineraryDays,
  onDeleteActivity,
  activeDay,
  setActiveDay,
  onQuickAdd,
}: {
  itineraryDays: ItineraryDay[];
  onDeleteActivity: (dayIdx: number, actIdx: number) => void;
  activeDay: number;
  setActiveDay: (d: number) => void;
  onQuickAdd: (type: string) => void;
}) {
  const [view, setView] = useState<"split" | "map" | "list">("split");
  const [activePin, setActivePin] = useState(0);
  const trip = INITIAL_TRIPS[0];

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="px-5 pt-12 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="font-display text-xl font-semibold text-foreground leading-tight">{trip.destination}</h1>
            <p className="text-xs text-muted-foreground">{trip.dates}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {trip.members.slice(0, 3).map((m) => (
                <Avatar key={`trip-member-${m.name}`} src={m.avatar} name={m.name} size={28} ring />
              ))}
            </div>
            <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <Plus size={14} className="text-primary" />
            </button>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex gap-1 bg-muted/50 rounded-xl p-1 mt-3">
          {([
            { id: "split", icon: Layers, label: "Split" },
            { id: "map", icon: Map, label: "Map" },
            { id: "list", icon: GripVertical, label: "List" },
          ] as const).map(({ id, icon: Icon, label }) => (
            <button
              key={`view-${id}`}
              onClick={() => setView(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                view === id ? "bg-white shadow-sm text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Day tabs */}
      <div className="flex gap-2 px-5 mb-3 overflow-x-auto scrollbar-hide flex-shrink-0">
        {itineraryDays.map((day, i) => (
          <button
            key={`day-tab-${i}`}
            onClick={() => setActiveDay(i)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
              activeDay === i
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-muted-foreground border border-border"
            }`}
          >
            {day.date}
          </button>
        ))}
        <button className="flex-shrink-0 w-8 h-8 rounded-xl border border-dashed border-border flex items-center justify-center">
          <Plus size={12} className="text-muted-foreground" />
        </button>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {(view === "split" || view === "map") && (
          <div className={`${view === "split" ? "h-44" : "flex-1"} flex-shrink-0 relative mx-5 rounded-2xl overflow-hidden bg-[#D4E4F0]`}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(26,63,111,0.06)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="#D4E4F0" />
              <rect width="100" height="100" fill="url(#grid)" />
              <path d="M 10 50 Q 40 45 60 50 Q 80 55 95 48" stroke="white" strokeWidth="2" fill="none" />
              <path d="M 30 15 Q 35 40 38 65 Q 40 80 42 95" stroke="white" strokeWidth="1.5" fill="none" />
              <path d="M 55 10 Q 58 35 62 60 Q 65 80 68 95" stroke="white" strokeWidth="1.5" fill="none" />
              <ellipse cx="20" cy="35" rx="10" ry="7" fill="#B5D5A8" opacity="0.6" />
              <ellipse cx="75" cy="70" rx="12" ry="8" fill="#B5D5A8" opacity="0.5" />
              <rect x="45" y="20" width="18" height="12" rx="2" fill="#C8D8E8" opacity="0.8" />
              {MAP_PINS.map((pin, i) => (
                <g key={`pin-${i}`} onClick={() => setActivePin(i)} style={{ cursor: "pointer" }}>
                  <circle cx={pin.x} cy={pin.y} r={activePin === i ? 5 : 3.5}
                    fill={activePin === i ? "#FF6B4A" : "#1A3F6F"}
                    stroke="white" strokeWidth="1.5" />
                  {activePin === i && (
                    <>
                      <circle cx={pin.x} cy={pin.y} r="8" fill="#FF6B4A" opacity="0.15" />
                      <foreignObject x={pin.x - 30} y={pin.y + 7} width="60" height="20">
                        <div className="bg-white rounded px-1.5 py-0.5 text-center shadow-sm">
                          <span style={{ fontSize: 7, fontWeight: 600, color: "#0D1B2A" }}>{pin.label}</span>
                        </div>
                      </foreignObject>
                    </>
                  )}
                </g>
              ))}
            </svg>
            <div className="absolute top-3 right-3 flex flex-col gap-1.5">
              <button className="w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center">
                <Plus size={12} className="text-foreground" />
              </button>
              <button className="w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center">
                <span className="text-xs font-bold text-foreground">−</span>
              </button>
            </div>
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
              <p className="text-[10px] font-semibold text-foreground">{MAP_PINS[activePin].label}</p>
            </div>
          </div>
        )}

        {/* Timeline */}
        {(view === "split" || view === "list") && (
          <div className="flex-1 overflow-y-auto scrollbar-hide px-5 mt-3 pb-20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Timeline</p>
              <button
                onClick={() => onQuickAdd("activity")}
                className="flex items-center gap-1 text-xs text-primary font-medium"
              >
                <Plus size={12} />
                Add
              </button>
            </div>
            <div className="relative">
              <div className="absolute left-[28px] top-2 bottom-2 w-px bg-border" />
              <div className="space-y-3">
                {itineraryDays[activeDay]?.activities.map((act, i) => (
                  <div key={`activity-${activeDay}-${i}`} className="flex gap-3 items-start group">
                    <div className="flex-shrink-0 w-14 text-right">
                      <span className="text-[10px] font-mono text-muted-foreground">{act.time}</span>
                    </div>
                    <div
                      className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center z-10 mt-0.5"
                      style={{ background: act.color }}
                    >
                      <act.icon size={9} className="text-white" />
                    </div>
                    <div className="flex-1 bg-card border border-border rounded-xl p-3 shadow-sm group-hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground leading-tight">{act.label}</p>
                          {act.detail && <p className="text-[10px] text-muted-foreground mt-0.5">{act.detail}</p>}
                        </div>
                        <button
                          onClick={() => onDeleteActivity(activeDay, i)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100"
                          aria-label="Remove activity"
                        >
                          <Trash2 size={11} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating add button (G7) */}
      <button
        onClick={() => onQuickAdd("activity")}
        className="absolute bottom-4 right-4 w-12 h-12 bg-primary rounded-2xl shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity z-10"
        aria-label="Add activity"
      >
        <Plus size={20} className="text-white" />
      </button>
    </div>
  );
}

// ─── Screen: Discover ─────────────────────────────────────────────────────────

function DiscoverScreen({ pushToast }: { pushToast: (t: Omit<ToastItem, "id">) => void }) {
  const [tab, setTab] = useState(0);
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);
  const [infoTooltipVisible, setInfoTooltipVisible] = useState(false);

  const allItems = [DESTINATIONS, HOTELS, RESTAURANTS];

  const toggleSave = (key: string, initial: boolean) => {
    const nowSaved = key in saved ? !saved[key] : !initial;
    setSaved((prev) => ({ ...prev, [key]: nowSaved }));
    if (nowSaved) {
      pushToast({ message: "Saved! We'll show you more places like this." });
    }
  };

  const isSaved = (key: string, initial: boolean) => key in saved ? saved[key] : initial;

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      <div className="px-5 pt-12 pb-4 flex-shrink-0">
        <h1 className="font-display text-2xl font-semibold text-foreground mb-1">Discover</h1>
        <p className="text-sm text-muted-foreground mb-4">Curated picks for your next adventure</p>

        <div className="relative mb-5">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search destinations, hotels..."
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition"
          />
        </div>

        <div className="flex gap-2">
          {DISCOVER_TABS.map((t, i) => (
            <button
              key={`discover-tab-${t}`}
              onClick={() => setTab(i)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                tab === i ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* G11 — sorted by label */}
        <div className="flex items-center gap-1 mt-2">
          <p className="text-[10px] text-muted-foreground">Sorted by: Traveler ratings</p>
          <div className="relative">
            <button
              onClick={() => setInfoTooltipVisible((v) => !v)}
              className="text-muted-foreground"
              aria-label="Rating info"
            >
              <Info size={11} />
            </button>
            {infoTooltipVisible && (
              <div className="absolute left-0 top-5 bg-foreground text-background rounded-xl px-3 py-2 text-[10px] w-48 z-20 shadow-lg">
                We rank by verified traveler ratings. Sponsored results are not shown.
              </div>
            )}
          </div>
        </div>
      </div>

      {tab === 0 && (
        <div className="mx-5 mb-5 rounded-2xl overflow-hidden relative h-48 bg-muted flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=700&h=400&fit=crop&auto=format"
            alt="Kyoto"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge color="#FF6B4A">Editor's Pick</Badge>
            <h3 className="text-white font-display text-lg font-semibold mt-1">Kyoto in Autumn</h3>
            <p className="text-white/70 text-xs">Maple season · Oct–Nov 2025</p>
          </div>
        </div>
      )}

      <div className="px-5 flex-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          {tab === 0 ? "Recommended Destinations" : tab === 1 ? "Top-Rated Hotels" : "Must-Try Restaurants"}
        </p>

        {/* G1 info chip */}
        {tab === 0 && (
          <div className="flex items-center gap-1.5 mb-3 bg-muted/50 rounded-xl px-3 py-2">
            <Info size={11} className="text-muted-foreground flex-shrink-0" />
            <p className="text-[10px] text-muted-foreground">Suggestions are based on popularity ratings, not real-time availability.</p>
          </div>
        )}

        <div className="space-y-3 pb-6">
          {(allItems[tab] as any[]).map((item, i) => {
            const key = item.name;
            const savedState = isSaved(key, item.saved);
            return (
              <div key={`discover-item-${i}`} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="relative h-36 bg-muted">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  <div className="relative">
                    <button
                      onClick={() => toggleSave(key, item.saved)}
                      onMouseEnter={() => setTooltipVisible(key)}
                      onMouseLeave={() => setTooltipVisible(null)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                    >
                      <Bookmark size={14} className={savedState ? "fill-accent text-accent" : "text-foreground"} />
                    </button>
                    {/* G16 tooltip */}
                    {tooltipVisible === key && (
                      <div className="absolute top-12 right-3 bg-foreground text-background rounded-xl px-2 py-1 text-[10px] w-36 z-10 shadow-lg">
                        Saving this improves your recommendations.
                      </div>
                    )}
                  </div>
                  {tab === 0 && (
                    <div className="absolute bottom-3 left-3"><Badge color="#2EC4B6">{(item as any).tag}</Badge></div>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{(item as any).location ?? (item as any).tag}</p>
                    </div>
                    {tab === 1 && (
                      <p className="text-sm font-bold text-primary flex-shrink-0">${(item as any).price}<span className="text-xs font-normal text-muted-foreground">/n</span></p>
                    )}
                    {tab === 2 && (
                      <p className="text-sm font-semibold text-muted-foreground flex-shrink-0">{(item as any).price}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <StarRating rating={item.rating} reviews={item.reviews} />
                    <button className="flex items-center gap-1 text-xs font-semibold text-primary bg-secondary px-3 py-1.5 rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Plus size={11} />
                      Add to trip
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Budget ───────────────────────────────────────────────────────────

function BudgetScreen() {
  const trip = INITIAL_TRIPS[0];
  const total = EXPENSE_CATEGORIES.reduce((s, c) => s + c.amount, 0);
  const remaining = trip.budget - total;
  const [splitOpen, setSplitOpen] = useState(false);
  const [budgetBannerDismissed, setBudgetBannerDismissed] = useState(false);
  const overBudget = total / trip.budget > 0.8;

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      <div className="px-5 pt-12 pb-4">
        {/* G3 budget warning banner */}
        {overBudget && !budgetBannerDismissed && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
            <span className="text-amber-500 text-sm mt-0.5">⚠</span>
            <p className="text-xs text-amber-700 font-medium flex-1 leading-snug">
              You're approaching your budget limit. Consider reviewing expenses.
            </p>
            <button onClick={() => setBudgetBannerDismissed(true)} className="text-amber-400 flex-shrink-0">
              <X size={14} />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground leading-tight">Budget</h1>
            <p className="text-xs text-muted-foreground">{trip.destination}</p>
          </div>
          <button className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center">
            <Plus size={16} className="text-primary" />
          </button>
        </div>

        {/* Summary card */}
        <div
          className="rounded-2xl p-5 mb-2 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1A3F6F, #0e2a4a)" }}
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/5" />
          <div className="absolute -right-8 top-8 w-32 h-32 rounded-full bg-white/5" />
          <p className="text-xs text-white/60 font-medium uppercase tracking-wide mb-1">Total Budget</p>
          <p className="font-display text-3xl font-semibold mb-4">${trip.budget.toLocaleString()}</p>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full"
              style={{ width: `${(total / trip.budget) * 100}%`, background: "linear-gradient(90deg, #2EC4B6, #FF6B4A)" }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <div>
              <p className="text-white/60">Spent</p>
              <p className="font-semibold">${total.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-white/60">Remaining</p>
              <p className="font-semibold text-[#2EC4B6]">${remaining.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* G2 disclaimer */}
        <p className="text-[10px] text-muted-foreground mb-4 px-1">Prices shown are estimates and may vary.</p>

        {/* Pie + categories */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie data={EXPENSE_CATEGORIES} dataKey="amount" cx="50%" cy="50%" innerRadius={28} outerRadius={52} strokeWidth={2} stroke="white">
                    {EXPENSE_CATEGORIES.map((c, i) => <Cell key={`pie-${i}`} fill={c.color} />)}
                  </Pie>
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {EXPENSE_CATEGORIES.map((c, i) => (
                <div key={`cat-${i}`} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                  <span className="text-xs text-muted-foreground flex-1">{c.name}</span>
                  <span className="text-xs font-semibold font-mono text-foreground">${c.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly bar chart */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Monthly Spend</p>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_SPEND} barSize={20}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#7A8899" }} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                  formatter={(v: any) => [`$${v}`, ""]}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {MONTHLY_SPEND.map((_, i) => <Cell key={`bar-${i}`} fill={i === 1 ? "#FF6B4A" : "#1A3F6F"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Split bill CTA */}
        <button
          onClick={() => setSplitOpen(!splitOpen)}
          className="w-full flex items-center gap-3 bg-card border border-border rounded-2xl p-4 mb-4 hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
            <SplitSquareHorizontal size={18} className="text-primary" />
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-semibold text-foreground">Split Bill</p>
            <p className="text-xs text-muted-foreground">Settle up with trip-mates</p>
          </div>
          <ChevronDown size={16} className={`text-muted-foreground transition-transform ${splitOpen ? "rotate-180" : ""}`} />
        </button>

        {splitOpen && (
          <div className="bg-card border border-border rounded-2xl p-4 mb-4 space-y-3">
            {FRIENDS.map((f, i) => {
              const share = Math.round(total / 3);
              const diff = i === 0 ? -84 : i === 1 ? 42 : 42;
              return (
                <div key={`split-${f.name}`} className="flex items-center gap-3">
                  <Avatar src={f.avatar} name={f.name} size={32} />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-foreground">{f.name.split(" ")[0]}</p>
                    <p className="text-[10px] text-muted-foreground">${share} share</p>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${diff < 0 ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"}`}>
                    {diff < 0 ? "owes" : "gets"} ${Math.abs(diff)}
                  </div>
                </div>
              );
            })}
            <button className="w-full bg-primary text-primary-foreground rounded-xl py-2.5 text-xs font-semibold mt-2">
              Send reminders
            </button>
          </div>
        )}

        {/* Recent expenses */}
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recent Expenses</p>
        <div className="space-y-2 pb-6">
          {RECENT_EXPENSES.map((e, i) => (
            <div key={`expense-${i}`} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
              <Avatar src={e.avatar} name={e.member} size={32} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{e.label}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge color="#7A8899">{e.category}</Badge>
                  <span className="text-[10px] text-muted-foreground">{e.date}</span>
                </div>
              </div>
              <p className="text-sm font-bold font-mono text-foreground flex-shrink-0">${e.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Friends ──────────────────────────────────────────────────────────

function FriendsScreen({ pushToast }: { pushToast: (t: Omit<ToastItem, "id">) => void }) {
  const [activeUser, setActiveUser] = useState<typeof FRIENDS[0] | null>(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profile, setProfile] = useState({ name: "You", handle: "@wandr_user", city: "San Francisco" });

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      <div className="px-5 pt-12 pb-4">
        {/* Profile section */}
        <div className="flex items-center gap-3 bg-card border border-border rounded-2xl p-4 mb-5">
          <div className="relative flex-shrink-0">
            <Avatar src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop&auto=format" name="You" size={48} />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{profile.name}</p>
            <p className="text-xs text-muted-foreground">{profile.handle}</p>
            <p className="text-[10px] text-muted-foreground">{profile.city}</p>
          </div>
          <button
            onClick={() => setEditProfileOpen(true)}
            className="flex items-center gap-1 text-xs font-semibold text-primary bg-secondary px-3 py-1.5 rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Edit3 size={11} />
            Edit profile
          </button>
        </div>

        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">Trip-mates</h1>
            <p className="text-xs text-muted-foreground">{INITIAL_TRIPS[0].destination}</p>
          </div>
          <button className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-2 rounded-xl">
            <Plus size={12} />
            Invite
          </button>
        </div>

        {/* Collaboration status banner */}
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/15 rounded-2xl p-3 mb-5">
          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 animate-pulse" />
          <p className="text-xs font-medium text-primary">
            <span className="font-semibold">Mia</span> and <span className="font-semibold">Ryo</span> are active now
          </p>
          <div className="ml-auto flex -space-x-1.5">
            {FRIENDS.slice(0, 2).map((f) => (
              <Avatar key={`collab-${f.name}`} src={f.avatar} name={f.name} size={20} ring />
            ))}
          </div>
        </div>

        {/* Friends list */}
        <div className="space-y-3 mb-6">
          {FRIENDS.map((f, i) => {
            const RoleIcon = f.roleIcon;
            return (
              <button
                key={`friend-${i}`}
                onClick={() => setActiveUser(activeUser?.name === f.name ? null : f)}
                className={`w-full flex items-center gap-3 bg-card border rounded-2xl p-4 transition-all duration-200 ${
                  activeUser?.name === f.name ? "border-primary/30 shadow-md" : "border-border hover:shadow-sm"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <Avatar src={f.avatar} name={f.name} size={48} />
                  <span
                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                    style={{ background: f.status === "online" ? "#22c55e" : "#F59E0B" }}
                  />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{f.name}</p>
                    <div
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: `${f.roleColor}18`, color: f.roleColor }}
                    >
                      <RoleIcon size={9} />
                      {f.role}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{f.handle}</p>
                  {f.editing && (
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <p className="text-[10px] text-green-600 font-medium">Editing: {f.editing}</p>
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-muted-foreground">{f.trips} trips</p>
                  <p className="text-[10px] text-muted-foreground">{f.location}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Permissions panel */}
        {activeUser && (
          <div className="bg-card border border-border rounded-2xl p-4 mb-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Permissions — {activeUser.name.split(" ")[0]}</p>
            {[
              { label: "View itinerary", icon: Eye, granted: true },
              { label: "Edit itinerary", icon: Edit3, granted: activeUser.role !== "Viewer" },
              { label: "Manage budget", icon: Wallet, granted: activeUser.role === "Co-planner" },
              { label: "Invite members", icon: Users, granted: activeUser.role === "Co-planner" },
            ].map(({ label, icon: Icon, granted }) => (
              <div key={`perm-${label}`} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <Icon size={14} className="text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-foreground flex-1">{label}</span>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${granted ? "bg-green-50" : "bg-muted"}`}>
                  {granted
                    ? <Check size={11} className="text-green-500" />
                    : <X size={11} className="text-muted-foreground" />
                  }
                </div>
              </div>
            ))}
            <div className="flex gap-2 mt-3">
              <button className="flex-1 text-xs font-semibold text-primary bg-secondary rounded-xl py-2">Change role</button>
              <button className="flex-1 text-xs font-semibold text-red-500 bg-red-50 rounded-xl py-2">Remove</button>
            </div>
          </div>
        )}

        {/* Activity feed */}
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recent Activity</p>
        <div className="space-y-2 pb-6">
          {[
            { user: FRIENDS[0], action: "added Arashiyama to Day 2", time: "2m ago" },
            { user: FRIENDS[1], action: "updated the budget — added ¥12,000", time: "14m ago" },
            { user: FRIENDS[0], action: "invited Ryo to the trip", time: "1h ago" },
            { user: FRIENDS[2], action: "saved The Peninsula hotel", time: "3h ago" },
          ].map(({ user, action, time }, i) => (
            <div key={`activity-feed-${i}`} className="flex items-start gap-3 bg-card border border-border rounded-xl p-3">
              <Avatar src={user.avatar} name={user.name} size={28} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground">
                  <span className="font-semibold">{user.name.split(" ")[0]}</span> {action}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editProfileOpen && (
        <ProfileEditSheet
          profile={profile}
          onSave={(p) => {
            setProfile(p);
            pushToast({ message: "Profile updated successfully." });
          }}
          onClose={() => setEditProfileOpen(false)}
        />
      )}
    </div>
  );
}

// ─── Bottom Tab Bar ───────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: typeof Compass }[] = [
  { id: "explore", label: "Explore", icon: Compass },
  { id: "trips", label: "Trips", icon: Map },
  { id: "discover", label: "Discover", icon: Search },
  { id: "budget", label: "Budget", icon: Wallet },
  { id: "friends", label: "Friends", icon: Users },
];

function TabBar({ active, setActive }: { active: Tab; setActive: (t: Tab) => void }) {
  return (
    <div className="flex-shrink-0 flex items-end bg-card/95 backdrop-blur-md border-t border-border px-2 pb-5 pt-2 safe-bottom">
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={`tab-${id}`}
            onClick={() => setActive(id)}
            className="flex-1 flex flex-col items-center gap-1 py-1.5 transition-all duration-200"
          >
            <div
              className={`w-10 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isActive ? "bg-primary/10" : ""
              }`}
            >
              <Icon
                size={isActive ? 20 : 18}
                className={`transition-all duration-200 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
            </div>
            <span
              className={`text-[9px] font-semibold tracking-wide transition-all duration-200 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Phone Frame ─────────────────────────────────────────────────────────────

function PhoneFrame({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  return (
    <div
      className={`relative bg-card overflow-hidden flex flex-col${dark ? " dark" : ""}`}
      style={{
        width: 390,
        height: 844,
        borderRadius: 52,
        boxShadow: "0 0 0 2px #1A3F6F22, 0 0 0 10px #0D1B2A, 0 4px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 w-32 h-8 bg-[#0D1B2A] rounded-b-2xl flex items-center justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#222]" />
        <div className="w-12 h-2 rounded-full bg-[#1a1a1a]" />
      </div>
      {/* Status bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-8 pt-2 pb-1 z-40">
        <span className="text-[10px] font-semibold text-foreground/70 font-mono mt-2">9:41</span>
        <div className="flex items-center gap-1 mt-2">
          <div className="flex gap-0.5 items-end">
            {[3, 5, 7, 9].map((h, i) => (
              <div key={`signal-${i}`} className={`w-0.5 rounded-sm ${i < 3 ? "bg-foreground/70" : "bg-foreground/20"}`} style={{ height: h }} />
            ))}
          </div>
          <div className="text-foreground/70">
            <Thermometer size={10} />
          </div>
          <div className="w-5 h-2.5 rounded-sm border border-foreground/40 flex items-center px-0.5">
            <div className="w-3 h-1.5 rounded-[1px] bg-foreground/70" />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("explore");
  const [newTripOpen, setNewTripOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>(INITIAL_ITINERARY_DAYS);
  const [activeDay, setActiveDay] = useState(0);

  // Quick-add modal state
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState("activity");

  const pushToast = useCallback((t: Omit<ToastItem, "id">) => {
    const id = genId();
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const openQuickAdd = (type: string) => {
    setQuickAddType(type);
    setQuickAddOpen(true);
  };

  const handleQuickAddActivity = (activity: Activity) => {
    setItineraryDays((prev) => {
      const next = prev.map((day, i) => {
        if (i === 0) {
          return { ...day, activities: [...day.activities, activity] };
        }
        return day;
      });
      return next;
    });
    pushToast({ message: `${activity.label} added to Day 1.` });
  };

  const handleDeleteActivity = (dayIdx: number, actIdx: number) => {
    let removed: Activity | null = null;
    setItineraryDays((prev) => {
      const next = prev.map((day, di) => {
        if (di === dayIdx) {
          removed = day.activities[actIdx];
          return { ...day, activities: day.activities.filter((_, ai) => ai !== actIdx) };
        }
        return day;
      });
      return next;
    });

    const snapshot = removed as Activity | null;
    if (!snapshot) return;

    let undone = false;
    const id = genId();
    pushToast({
      message: `"${snapshot.label}" removed.`,
      actionLabel: "Undo",
      onAction: () => {
        if (undone) return;
        undone = true;
        setItineraryDays((prev) =>
          prev.map((day, di) => {
            if (di === dayIdx) {
              const acts = [...day.activities];
              acts.splice(actIdx, 0, snapshot);
              return { ...day, activities: acts };
            }
            return day;
          })
        );
      },
    });
  };

  const handleDeleteTrip = (id: number) => {
    let removed: Trip | null = null;
    let removedIdx = -1;
    setTrips((prev) => {
      removedIdx = prev.findIndex((t) => t.id === id);
      removed = prev[removedIdx] ?? null;
      return prev.filter((t) => t.id !== id);
    });

    const snap = removed as Trip | null;
    const snapIdx = removedIdx;
    if (!snap) return;

    let undone = false;
    pushToast({
      message: `"${snap.destination}" deleted.`,
      actionLabel: "Undo",
      onAction: () => {
        if (undone) return;
        undone = true;
        setTrips((prev) => {
          const next = [...prev];
          next.splice(snapIdx, 0, snap);
          return next;
        });
      },
    });
  };

  const handleCreateTrip = (destination: string, dates: string) => {
    const COVER_URLS = [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&auto=format",
    ];
    const newTrip: Trip = {
      id: Date.now(),
      destination,
      dates,
      coverUrl: COVER_URLS[Math.floor(Math.random() * COVER_URLS.length)],
      members: [
        { name: "You", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&auto=format" },
      ],
      daysLeft: 120,
      progress: 0,
      budget: 2000,
      spent: 0,
    };
    setTrips((prev) => [...prev, newTrip]);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-8"
      style={{
        background: "linear-gradient(135deg, #E8F0FA 0%, #D4E4F0 40%, #F0E8F0 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Desktop label */}
      <div className="hidden lg:block absolute top-8 left-8">
        <p className="font-display text-sm font-semibold text-[#1A3F6F]/60 tracking-wide">Wandr</p>
        <p className="text-xs text-[#7A8899]">Travel planning, together.</p>
      </div>

      {/* Tab selector for desktop */}
      <div className="hidden lg:flex absolute top-8 left-1/2 -translate-x-1/2 gap-1 bg-white/60 backdrop-blur-sm rounded-2xl p-1.5 border border-white/80">
        {TABS.map(({ id, label }) => (
          <button
            key={`desktop-tab-${id}`}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              activeTab === id ? "bg-[#1A3F6F] text-white shadow-sm" : "text-[#7A8899] hover:text-[#1A3F6F]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <PhoneFrame dark={dark}>
        <div className="flex-1 overflow-hidden flex flex-col" style={{ background: "var(--background)" }}>
          {/* Toast stack */}
          <ToastStack toasts={toasts} dismiss={dismissToast} />

          <div className="flex-1 overflow-hidden transition-all duration-200">
            {activeTab === "explore" && (
              <ExploreScreen
                trips={trips}
                onNewTrip={() => setNewTripOpen(true)}
                onDeleteTrip={handleDeleteTrip}
                onQuickAdd={openQuickAdd}
                dark={dark}
                onToggleDark={() => setDark((v) => !v)}
                onOpenSettings={() => setSettingsOpen(true)}
              />
            )}
            {activeTab === "trips" && (
              <TripsScreen
                itineraryDays={itineraryDays}
                onDeleteActivity={handleDeleteActivity}
                activeDay={activeDay}
                setActiveDay={setActiveDay}
                onQuickAdd={openQuickAdd}
              />
            )}
            {activeTab === "discover" && <DiscoverScreen pushToast={pushToast} />}
            {activeTab === "budget" && <BudgetScreen />}
            {activeTab === "friends" && <FriendsScreen pushToast={pushToast} />}
          </div>
          <TabBar active={activeTab} setActive={setActiveTab} />
        </div>

        {newTripOpen && (
          <NewTripModal
            onClose={() => setNewTripOpen(false)}
            onCreateTrip={handleCreateTrip}
          />
        )}

        {quickAddOpen && (
          <QuickAddModal
            initialType={quickAddType}
            onClose={() => setQuickAddOpen(false)}
            onAdd={handleQuickAddActivity}
          />
        )}

        {settingsOpen && (
          <SettingsPanel
            dark={dark}
            onToggleDark={() => setDark((v) => !v)}
            onClose={() => setSettingsOpen(false)}
            pushToast={pushToast}
          />
        )}
      </PhoneFrame>
    </div>
  );
}
