import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type {
  AccessibilitySettings, Language, PrivacySettings, Profile, TransportMode,
} from "./types";
import { translate, type TranslationKey } from "./i18n";

type PreferencesContextValue = {
  dark: boolean;
  toggleDark: () => void;

  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: TranslationKey) => string;

  profile: Profile;
  setProfile: (p: Profile) => void;

  privacy: PrivacySettings;
  updatePrivacy: (patch: Partial<PrivacySettings>) => void;

  accessibility: AccessibilitySettings;
  updateAccessibility: (patch: Partial<AccessibilitySettings>) => void;

  preferredTransportModes: TransportMode[];
  toggleTransportMode: (m: TransportMode) => void;

  speak: (text: string) => void;

  accountDeleted: boolean;
  deleteAccount: () => void;
  restoreAccount: () => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

const DEFAULT_PRIVACY: PrivacySettings = {
  personalisedRecommendations: true,
  shareDataWithPartners: false,
  locationSharing: true,
  activityStatusVisible: true,
  profileVisibility: "friends",
};

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  highContrast: false,
  colorBlindMode: "off",
  reduceMotion: false,
  largerTouchTargets: false,
  ttsEnabled: false,
  fontFamily: "default",
  fontSize: "medium",
};

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [profile, setProfile] = useState<Profile>({ name: "You", handle: "@wandr_user", city: "San Francisco" });
  const [privacy, setPrivacy] = useState<PrivacySettings>(DEFAULT_PRIVACY);
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY);
  const [preferredTransportModes, setPreferredTransportModes] = useState<TransportMode[]>(["flight", "train", "car"]);
  const [accountDeleted, setAccountDeleted] = useState(false);

  const toggleDark = useCallback(() => setDark((v) => !v), []);

  const t = useCallback((key: TranslationKey) => translate(language, key), [language]);

  const updatePrivacy = useCallback((patch: Partial<PrivacySettings>) => {
    setPrivacy((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateAccessibility = useCallback((patch: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => ({ ...prev, ...patch }));
  }, []);

  const toggleTransportMode = useCallback((m: TransportMode) => {
    setPreferredTransportModes((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  }, []);

  const speak = useCallback((text: string) => {
    if (!accessibility.ttsEnabled) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<Language, string> = { en: "en-US", es: "es-ES", fr: "fr-FR", ja: "ja-JP", pt: "pt-BR" };
    utterance.lang = langMap[language];
    window.speechSynthesis.speak(utterance);
  }, [accessibility.ttsEnabled, language]);

  const deleteAccount = useCallback(() => setAccountDeleted(true), []);
  const restoreAccount = useCallback(() => {
    setAccountDeleted(false);
    setPrivacy(DEFAULT_PRIVACY);
    setAccessibility(DEFAULT_ACCESSIBILITY);
    setProfile({ name: "You", handle: "@wandr_user", city: "San Francisco" });
  }, []);

  const value = useMemo<PreferencesContextValue>(() => ({
    dark, toggleDark,
    language, setLanguage, t,
    profile, setProfile,
    privacy, updatePrivacy,
    accessibility, updateAccessibility,
    preferredTransportModes, toggleTransportMode,
    speak,
    accountDeleted, deleteAccount, restoreAccount,
  }), [dark, toggleDark, language, t, profile, privacy, updatePrivacy, accessibility, updateAccessibility, preferredTransportModes, toggleTransportMode, speak, accountDeleted, deleteAccount, restoreAccount]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within a PreferencesProvider");
  return ctx;
}

export const FONT_FAMILY_CSS: Record<AccessibilitySettings["fontFamily"], string> = {
  default: "'DM Sans', sans-serif",
  serif: "'Georgia', 'Times New Roman', serif",
  mono: "'IBM Plex Mono', 'Courier New', monospace",
  dyslexic: "'Comic Sans MS', 'Comic Sans', sans-serif",
};

export const FONT_SIZE_SCALE: Record<AccessibilitySettings["fontSize"], number> = {
  small: 0.9,
  medium: 1,
  large: 1.15,
  xlarge: 1.35,
};

// Tailwind's text-* utilities read from these CSS custom properties (rem-based, resolved
// against the root html font-size). Re-declaring them scoped to the phone frame lets the
// font-size preference scale all standard text-xs..text-3xl usage without touching every
// component, since custom properties cascade to descendants that reference var(--text-*).
const TEXT_SIZE_BASE_REM: Record<string, number> = {
  "--text-xs": 0.75,
  "--text-sm": 0.875,
  "--text-base": 1,
  "--text-lg": 1.125,
  "--text-xl": 1.25,
  "--text-2xl": 1.5,
  "--text-3xl": 1.875,
};

export function getScaledTextSizeVars(fontSize: AccessibilitySettings["fontSize"]): Record<string, string> {
  const scale = FONT_SIZE_SCALE[fontSize];
  return Object.fromEntries(
    Object.entries(TEXT_SIZE_BASE_REM).map(([key, rem]) => [key, `${rem * scale}rem`])
  );
}
