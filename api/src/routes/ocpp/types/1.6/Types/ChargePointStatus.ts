export const ChargePointStatusEnum = {
  Available: "Available",
  Preparing: "Preparing",
  Charging: "Charging",
  SuspendedEVSE: "SuspendedEVSE",
  SuspendedEV: "SuspendedEV",
  Finishing: "Finishing",
  Reserved: "Reserved",
  Unavailable: "Unavailable",
  Faulted: "Faulted",
} as const;

export type ChargePointStatusEnum =
  (typeof ChargePointStatusEnum)[keyof typeof ChargePointStatusEnum];
