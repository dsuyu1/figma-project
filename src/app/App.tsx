import { useCallback, useMemo, useState } from "react";
import {
  Compass, Map, Search, Wallet, Users, Thermometer, RotateCcw,
} from "lucide-react";
import type { Activity, ItineraryDay, Tab, ToastItem, Trip } from "./types";
import { INITIAL_TRIPS, INITIAL_ITINERARIES } from "./data";
import { genId, ToastStack } from "./components/common";
import { QuickAddModal } from "./components/QuickAddModal";
import { NewTripModal } from "./components/NewTripModal";
import { AccountScreen } from "./components/AccountScreen";
import { ExploreScreen } from "./screens/ExploreScreen";
import { TripsScreen } from "./screens/TripsScreen";
import { DiscoverScreen } from "./screens/DiscoverScreen";
import { BudgetScreen } from "./screens/BudgetScreen";
import { FriendsScreen } from "./screens/FriendsScreen";
import { PreferencesProvider, usePreferences, FONT_FAMILY_CSS, getScaledTextSizeVars } from "./preferences";

const TABS: { id: Tab; label: string; icon: typeof Compass }[] = [
  { id: "explore", label: "Explore", icon: Compass },
  { id: "trips", label: "Trips", icon: Map },
  { id: "discover", label: "Discover", icon: Search },
  { id: "budget", label: "Budget", icon: Wallet },
  { id: "friends", label: "Friends", icon: Users },
];

const TAB_LABEL_KEY: Record<Tab, "tab.explore" | "tab.trips" | "tab.discover" | "tab.budget" | "tab.friends"> = {
  explore: "tab.explore",
  trips: "tab.trips",
  discover: "tab.discover",
  budget: "tab.budget",
  friends: "tab.friends",
};

function TabBar({ active, setActive }: { active: Tab; setActive: (t: Tab) => void }) {
  const { t } = usePreferences();
  return (
    <div className="flex-shrink-0 flex items-end bg-card/95 backdrop-blur-md border-t border-border px-2 pb-5 pt-2 safe-bottom">
      {TABS.map(({ id, icon: Icon }) => {
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
              {t(TAB_LABEL_KEY[id])}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  const { dark, accessibility } = usePreferences();
  const classes = [
    "relative bg-card overflow-hidden flex flex-col",
    dark ? "dark" : "",
    accessibility.highContrast ? "high-contrast" : "",
    accessibility.reduceMotion ? "reduce-motion" : "",
    accessibility.largerTouchTargets ? "larger-touch-targets" : "",
  ].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      style={{
        width: 390,
        height: 844,
        borderRadius: 52,
        fontFamily: FONT_FAMILY_CSS[accessibility.fontFamily],
        boxShadow: "0 0 0 2px #1A3F6F22, 0 0 0 10px #0D1B2A, 0 4px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
        ...getScaledTextSizeVars(accessibility.fontSize),
      } as React.CSSProperties}
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

function AccountDeletedScreen() {
  const { t, restoreAccount } = usePreferences();
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-3" style={{ background: "var(--background)" }}>
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-2">
        <RotateCcw size={24} className="text-muted-foreground" />
      </div>
      <h1 className="font-display text-xl font-semibold text-foreground">{t("account.deletedTitle")}</h1>
      <p className="text-sm text-muted-foreground">{t("account.deletedBody")}</p>
      <button
        onClick={restoreAccount}
        className="mt-4 bg-primary text-primary-foreground rounded-2xl px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        {t("account.createNew")}
      </button>
    </div>
  );
}

function AppShell() {
  const { accountDeleted, t } = usePreferences();
  const [activeTab, setActiveTab] = useState<Tab>("explore");
  const [newTripOpen, setNewTripOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [currentTripId, setCurrentTripId] = useState<number | null>(INITIAL_TRIPS[0]?.id ?? null);
  const [itineraries, setItineraries] = useState<Record<number, ItineraryDay[]>>(INITIAL_ITINERARIES);
  const [activeDay, setActiveDay] = useState(0);

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState("activity");

  const pushToast = useCallback((tItem: Omit<ToastItem, "id">) => {
    const id = genId();
    setToasts((prev) => [...prev, { ...tItem, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const currentTrip = useMemo(
    () => trips.find((tr) => tr.id === currentTripId) ?? null,
    [trips, currentTripId]
  );
  const currentItinerary = currentTripId !== null ? (itineraries[currentTripId] ?? []) : [];
  const clampedActiveDay = Math.min(activeDay, Math.max(currentItinerary.length - 1, 0));

  const handleSelectTrip = (id: number) => {
    setCurrentTripId(id);
    setActiveDay(0);
    setActiveTab("trips");
  };

  const openQuickAdd = (type: string) => {
    setQuickAddType(type);
    setQuickAddOpen(true);
  };

  const handleQuickAddActivity = (activity: Activity) => {
    if (currentTripId === null) return;
    setItineraries((prev) => {
      const days = prev[currentTripId] ?? [];
      const targetIdx = Math.min(clampedActiveDay, Math.max(days.length - 1, 0));
      const nextDays = days.map((day, i) => (i === targetIdx ? { ...day, activities: [...day.activities, activity] } : day));
      return { ...prev, [currentTripId]: nextDays };
    });
    const dayLabel = currentItinerary[clampedActiveDay]?.date ?? "";
    pushToast({ message: `${activity.label} added to ${dayLabel}.` });
  };

  const handleAddDay = () => {
    if (currentTripId === null) return;
    setItineraries((prev) => {
      const days = prev[currentTripId] ?? [];
      const newDay: ItineraryDay = { date: `Day ${days.length + 1}`, activities: [] };
      return { ...prev, [currentTripId]: [...days, newDay] };
    });
    setActiveDay(currentItinerary.length);
    pushToast({ message: "New day added to your itinerary." });
  };

  const handleDeleteActivity = (dayIdx: number, actIdx: number) => {
    if (currentTripId === null) return;
    let removed: Activity | null = null;
    setItineraries((prev) => {
      const days = prev[currentTripId] ?? [];
      const nextDays = days.map((day, di) => {
        if (di === dayIdx) {
          removed = day.activities[actIdx];
          return { ...day, activities: day.activities.filter((_, ai) => ai !== actIdx) };
        }
        return day;
      });
      return { ...prev, [currentTripId]: nextDays };
    });

    const snapshot = removed as Activity | null;
    if (!snapshot) return;

    let undone = false;
    pushToast({
      message: `"${snapshot.label}" removed.`,
      actionLabel: "Undo",
      onAction: () => {
        if (undone) return;
        undone = true;
        setItineraries((prev) => {
          const days = prev[currentTripId] ?? [];
          const nextDays = days.map((day, di) => {
            if (di === dayIdx) {
              const acts = [...day.activities];
              acts.splice(actIdx, 0, snapshot);
              return { ...day, activities: acts };
            }
            return day;
          });
          return { ...prev, [currentTripId]: nextDays };
        });
      },
    });
  };

  const handleDeleteTrip = (id: number) => {
    let removed: Trip | null = null;
    let removedIdx = -1;
    setTrips((prev) => {
      removedIdx = prev.findIndex((tr) => tr.id === id);
      removed = prev[removedIdx] ?? null;
      return prev.filter((tr) => tr.id !== id);
    });

    const snap = removed as Trip | null;
    const snapIdx = removedIdx;
    if (!snap) return;

    if (currentTripId === id) {
      const remaining = trips.filter((tr) => tr.id !== id);
      setCurrentTripId(remaining[0]?.id ?? null);
      setActiveDay(0);
    }

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
        setCurrentTripId(snap.id);
      },
    });
  };

  const handleCreateTrip = (destination: string, dates: string) => {
    const COVER_URLS = [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&auto=format",
    ];
    const newId = Date.now();
    const newTrip: Trip = {
      id: newId,
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
    setItineraries((prev) => ({ ...prev, [newId]: [{ date: "Day 1", activities: [] }] }));
    setCurrentTripId(newId);
    setActiveDay(0);
  };

  if (accountDeleted) {
    return (
      <PhoneFrame>
        <AccountDeletedScreen />
      </PhoneFrame>
    );
  }

  return (
    <>
      {/* Tab selector for desktop */}
      <div className="hidden lg:flex absolute top-8 left-1/2 -translate-x-1/2 gap-1 bg-white/60 backdrop-blur-sm rounded-2xl p-1.5 border border-white/80">
        {TABS.map(({ id }) => (
          <button
            key={`desktop-tab-${id}`}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              activeTab === id ? "bg-[#1A3F6F] text-white shadow-sm" : "text-[#7A8899] hover:text-[#1A3F6F]"
            }`}
          >
            {t(TAB_LABEL_KEY[id])}
          </button>
        ))}
      </div>

    <PhoneFrame>
      <div className="flex-1 overflow-hidden flex flex-col" style={{ background: "var(--background)" }}>
        <ToastStack toasts={toasts} dismiss={dismissToast} />

        <div className="flex-1 overflow-hidden transition-all duration-200">
          {activeTab === "explore" && (
            <ExploreScreen
              trips={trips}
              onNewTrip={() => setNewTripOpen(true)}
              onDeleteTrip={handleDeleteTrip}
              onQuickAdd={openQuickAdd}
              onOpenAccount={() => setAccountOpen(true)}
              onSelectTrip={handleSelectTrip}
            />
          )}
          {activeTab === "trips" && (
            <TripsScreen
              trip={currentTrip}
              itineraryDays={currentItinerary}
              onDeleteActivity={handleDeleteActivity}
              activeDay={clampedActiveDay}
              setActiveDay={setActiveDay}
              onQuickAdd={openQuickAdd}
              onAddDay={handleAddDay}
            />
          )}
          {activeTab === "discover" && <DiscoverScreen pushToast={pushToast} />}
          {activeTab === "budget" && <BudgetScreen trip={currentTrip} />}
          {activeTab === "friends" && (
            <FriendsScreen pushToast={pushToast} onOpenAccount={() => setAccountOpen(true)} />
          )}
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
          dayLabel={currentItinerary[clampedActiveDay]?.date ?? "Day 1"}
          onClose={() => setQuickAddOpen(false)}
          onAdd={handleQuickAddActivity}
        />
      )}

      {accountOpen && (
        <AccountScreen
          onClose={() => setAccountOpen(false)}
          pushToast={pushToast}
        />
      )}
    </PhoneFrame>
    </>
  );
}

export default function App() {
  return (
    <PreferencesProvider>
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

        <AppShell />
      </div>
    </PreferencesProvider>
  );
}
