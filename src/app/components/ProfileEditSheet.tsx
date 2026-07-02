import { useState } from "react";
import { X } from "lucide-react";
import type { Profile } from "../types";
import { usePreferences } from "../preferences";

export function ProfileEditSheet({
  profile,
  onSave,
  onClose,
}: {
  profile: Profile;
  onSave: (p: Profile) => void;
  onClose: () => void;
}) {
  const { t } = usePreferences();
  const [name, setName] = useState(profile.name);
  const [handle, setHandle] = useState(profile.handle);
  const [city, setCity] = useState(profile.city);

  return (
    <div className="fixed inset-0 z-[130] flex items-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full bg-card rounded-t-3xl p-6 pb-10 shadow-2xl transition-all duration-200">
        <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-6" />
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold">{t("friends.editProfile")}</h2>
          <button onClick={onClose} aria-label={t("common.close")}><X size={20} className="text-muted-foreground" /></button>
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
          {t("common.saveChanges")}
        </button>
      </div>
    </div>
  );
}
