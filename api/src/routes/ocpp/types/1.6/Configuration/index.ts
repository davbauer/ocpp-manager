import CoreProfile from "./CoreProfile";
import LocalAuthListManagementProfile from "./LocalAuthListManagementProfile";
import ReservationProfile from "./ReservationProfile";
import SmartChargingProfile from "./SmartChargingProfile";

export const ConfigurationKey = {
  ...CoreProfile,
  ...LocalAuthListManagementProfile,
  ...ReservationProfile,
  ...SmartChargingProfile,
} as const;

export type ConfigurationKey =
  (typeof ConfigurationKey)[keyof typeof ConfigurationKey];
