export const MeasurandEnum = {
  "Energy.Active.Export.Register": "Energy.Active.Export.Register",
  "Energy.Active.Import.Register": "Energy.Active.Import.Register",
  "Energy.Reactive.Export.Register": "Energy.Reactive.Export.Register",
  "Energy.Reactive.Import.Register": "Energy.Reactive.Import.Register",
  "Energy.Active.Export.Interval": "Energy.Active.Export.Interval",
  "Energy.Active.Import.Interval": "Energy.Active.Import.Interval",
  "Energy.Reactive.Export.Interval": "Energy.Reactive.Export.Interval",
  "Energy.Reactive.Import.Interval": "Energy.Reactive.Import.Interval",
  "Power.Active.Export": "Power.Active.Export",
  "Power.Active.Import": "Power.Active.Import",
  "Power.Offered": "Power.Offered",
  "Power.Reactive.Export": "Power.Reactive.Export",
  "Power.Reactive.Import": "Power.Reactive.Import",
  "Power.Factor": "Power.Factor",
  "Current.Import": "Current.Import",
  "Current.Export": "Current.Export",
  "Current.Offered": "Current.Offered",
  Voltage: "Voltage",
  Frequency: "Frequency",
  Temperature: "Temperature",
  SoC: "SoC",
  RPM: "RPM",
} as const;

export type MeasurandEnum = (typeof MeasurandEnum)[keyof typeof MeasurandEnum];
