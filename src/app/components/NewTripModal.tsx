import { useState } from "react";
import { ArrowLeft, Calendar, Check, ChevronRight, Plus, Search, X, CheckCircle } from "lucide-react";
import { FRIENDS } from "../data";
import { Avatar } from "./common";

export function NewTripModal({ onClose, onCreateTrip }: { onClose: () => void; onCreateTrip: (destination: string, dates: string) => void }) {
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
