/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Authorization {
  chargerId: number;
  createdAt: Generated<string>;
  expiryDate: Generated<string | null>;
  id: Generated<number>;
  idTag: string;
  parentIdTag: Generated<string | null>;
  status: string;
  updatedAt: Generated<string>;
}

export interface Chargers {
  createdAt: Generated<string>;
  firmwareVersion: Generated<string | null>;
  friendlyName: Generated<string>;
  id: Generated<number>;
  lastHeartbeat: Generated<string | null>;
  model: Generated<string>;
  serialNumber: Generated<string>;
  shortcode: string;
  status: Generated<string>;
  updatedAt: Generated<string>;
  vendor: Generated<string>;
}

export interface ChargerStatus {
  connectorId: number;
  errorCode: Generated<string | null>;
  heartbeatTimestamp: Generated<string | null>;
  id: Generated<number>;
  info: Generated<string | null>;
  status: string;
  vendorErrorCode: Generated<string | null>;
}

export interface Connectors {
  chargerId: number;
  connectorId: number;
  createdAt: Generated<string>;
  errorCode: Generated<string | null>;
  id: Generated<number>;
  info: Generated<string | null>;
  maxCurrent: Generated<number>;
  status: Generated<string>;
  updatedAt: Generated<string>;
  vendorErrorCode: Generated<string | null>;
}

export interface Migrations {
  createdAt: Generated<string | null>;
  id: Generated<number | null>;
  name: string;
}

export interface Settings {
  heartbeatInterval: Generated<number>;
  id: Generated<number>;
  systemMaintenance: Generated<number>;
}

export interface Telemetry {
  current: Generated<number>;
  id: Generated<number>;
  meterValue: number;
  sampledValue: Generated<string | null>;
  timestamp: Generated<string>;
  transactionId: number;
  voltage: Generated<number>;
}

export interface Transactions {
  connectorId: number;
  createdAt: Generated<string>;
  id: Generated<number>;
  idTag: string;
  meterStart: number;
  meterStop: number | null;
  paymentStatus: Generated<string>;
  reason: Generated<string | null>;
  startTime: string;
  status: Generated<string>;
  stopTime: string | null;
  transactionId: number;
  userId: number;
}

export interface DB {
  authorization: Authorization;
  chargers: Chargers;
  chargerStatus: ChargerStatus;
  connectors: Connectors;
  migrations: Migrations;
  settings: Settings;
  telemetry: Telemetry;
  transactions: Transactions;
}
