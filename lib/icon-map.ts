import {
  Waves,
  Dumbbell,
  Flame,
  UtensilsCrossed,
  Wine,
  Presentation,
  Trees,
  Wifi,
  ParkingCircle,
  ConciergeBell,
  WashingMachine,
  Car,
  Sparkles,
  Bike,
  type LucideIcon,
} from "lucide-react";

export const facilityIconMap: Record<string, LucideIcon> = {
  pool: Waves,
  gym: Dumbbell,
  sauna: Flame,
  restaurant: UtensilsCrossed,
  bar: Wine,
  conference: Presentation,
  garden: Trees,
  wifi: Wifi,
  parking: ParkingCircle,
  "room-service": ConciergeBell,
  laundry: WashingMachine,
  transport: Car,
  spa: Sparkles,
  recreation: Bike,
};

export function getFacilityIcon(name?: string | null): LucideIcon {
  if (!name) return Sparkles;
  return facilityIconMap[name] ?? Sparkles;
}
