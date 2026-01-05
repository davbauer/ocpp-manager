import { type Selectable } from "kysely";
import { generateBaseModel } from "./base";
import type { DB } from "../db/DBTypes";
import type { z } from "zod";
import {
  UnlockConnectorResponseSchema,
  type UnlockConnectorRequestSchema,
} from "../../routes/ocpp/types";
import { ocppWebsocketManager } from "../../routes/ocpp/OCPPWebsocketManager";
import { db } from "../db/db";
import { Setting } from "./Setting";
import { Telemetry } from "./Telemetry";

export interface Connector extends Selectable<DB["connector"]> {}
export class Connector extends generateBaseModel(
  "connector",
  "id",
  "updatedAt"
) {
  async getLatestValidTelemetry() {
    const setting = await Setting.findOneOrThrow();

    // Use the larger of the two intervals, but ignore clockAlignedDataInterval if it's 0 (disabled)
    const effectiveInterval =
      setting.clockAlignedDataInterval > 0
        ? Math.max(setting.meterValueSampleInterval, setting.clockAlignedDataInterval)
        : setting.meterValueSampleInterval;

    const cutoffTime = new Date(Date.now() - (effectiveInterval + 10) * 1000);

    const telemetryData = await db
      .selectFrom("telemetry")
      .selectAll()
      .where("connectorId", "=", this.id)
      .where("createdAt", ">=", cutoffTime)
      .orderBy("createdAt", "desc")
      .executeTakeFirst();

    return telemetryData ? new Telemetry(telemetryData).serialize() : null;
  }

  async getDetailData() {
    const telemetry = await this.getLatestValidTelemetry();

    return {
      ...this.serialize(),
      telemetry,
    };
  }

  async unlock() {
    const charger = await db
      .selectFrom("charger")
      .selectAll("charger")
      .innerJoin("connector", "connector.chargerId", "charger.id")
      .where("connector.id", "=", this.id)
      .executeTakeFirstOrThrow();

    const message: z.infer<typeof UnlockConnectorRequestSchema> = {
      connectorId: this.connectorId,
    };

    return await ocppWebsocketManager.sendCall({
      shortcode: charger.shortcode,
      action: "UnlockConnector",
      message,
      responseSchema: UnlockConnectorResponseSchema,
    });
  }
}
