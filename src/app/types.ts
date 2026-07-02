export type Tab = "explore" | "trips" | "discover" | "budget" | "friends";

export type ToastItem = {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  color?: string;
};

export type Trip = {
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

export type TransportMode = "flight" | "train" | "car" | "bus" | "ferry" | "bike" | "walk" | "rideshare";

export type Activity = {
  time: string;
  type: string;
  label: string;
  detail: string;
  icon: React.ElementType;
  color: string;
  transportMode?: TransportMode;
};

export type ItineraryDay = {
  date: string;
  activities: Activity[];
};

export type Language = "en" | "es" | "fr" | "ja" | "pt";

export type ColorBlindMode = "off" | "protanopia" | "deuteranopia" | "tritanopia";

export type FontFamilyChoice = "default" | "serif" | "mono" | "dyslexic";

export type FontSizeChoice = "small" | "medium" | "large" | "xlarge";

export type ProfileVisibility = "public" | "friends" | "private";

export type Profile = {
  name: string;
  handle: string;
  city: string;
};

export type PrivacySettings = {
  personalisedRecommendations: boolean;
  shareDataWithPartners: boolean;
  locationSharing: boolean;
  activityStatusVisible: boolean;
  profileVisibility: ProfileVisibility;
};

export type AccessibilitySettings = {
  highContrast: boolean;
  colorBlindMode: ColorBlindMode;
  reduceMotion: boolean;
  largerTouchTargets: boolean;
  ttsEnabled: boolean;
  fontFamily: FontFamilyChoice;
  fontSize: FontSizeChoice;
};
