import { sql, type Selectable } from "kysely";
import { generateBaseModel } from "./base";
import type { DB } from "../db/DBTypes";
import { ChargeAuthorization } from "./ChargeAuthorization";
import { db } from "../db/db";
import { Connector } from "./Connector";
import { Charger } from "./Charger";

export interface Transaction extends Selectable<DB["transaction"]> {}
export class Transaction extends generateBaseModel("transaction", "id") {
  async getFullDetail() {
    const [chargeAuthorization, connector, estimatedEnergyDelivered] =
      await Promise.all([
        this.chargeAuthorizationId
          ? ChargeAuthorization.findOne({
              eb: (eb) => eb("id", "=", this.chargeAuthorizationId),
            })
          : null,
        Connector.findOne({
          eb: (eb) => eb("id", "=", this.connectorId),
        }),
        db
          .with("energy_samples", (db) =>
            db
              .selectFrom("telemetry")
              .select([
                sql<number>`
              (
                TRIM(BOTH '"' FROM JSONB_PATH_QUERY_FIRST(
                  telemetry.meter_value::jsonb,
                  '$.raw[*].sampledValue[*] ? (@.measurand == "Energy.Active.Import.Register").value'
                )::TEXT)::NUMERIC
                *
                CASE
                  WHEN COALESCE(TRIM(BOTH '"' FROM JSONB_PATH_QUERY_FIRST(
                    telemetry.meter_value::jsonb,
                    '$.raw[*].sampledValue[*] ? (@.measurand == "Energy.Active.Import.Register").unit'
                  )::TEXT), 'Wh') = 'kWh' THEN 1000
                  WHEN COALESCE(TRIM(BOTH '"' FROM JSONB_PATH_QUERY_FIRST(
                    telemetry.meter_value::jsonb,
                    '$.raw[*].sampledValue[*] ? (@.measurand == "Energy.Active.Import.Register").unit'
                  )::TEXT), 'Wh') = 'MWh' THEN 1000000
                  ELSE 1
                END
              )
            `.as("value_wh"),
                sql<string>`telemetry.created_at`.as("created_at"),
              ])
              .where("transactionId", "=", this.id)
              .where(
                sql<boolean>`
              JSONB_PATH_EXISTS(
                telemetry.meter_value::jsonb,
                '$.raw[*].sampledValue[*] ? (@.measurand == "Energy.Active.Import.Register")'
              )
            `
              )
          )
          .selectFrom("energy_samples")
          .select([
            sql<number>`MAX(value_wh) - MIN(value_wh)`.as(
              "totalEnergyDelivered"
            ),
            sql<string>`MAX(created_at)`.as("lastUpdateTimestamp"),
          ])
          .executeTakeFirst(),
      ]);

    // Get charger info - either from authorization or from connector
    let chargerInfo: { friendlyName: string; shortcode: string } | null = null;
    if (connector) {
      const charger = await Charger.findOne({
        eb: (eb) => eb("id", "=", connector.chargerId),
      });
      if (charger) {
        chargerInfo = {
          friendlyName: charger.friendlyName,
          shortcode: charger.shortcode,
        };
      }
    }

    const authDetail = chargeAuthorization
      ? await chargeAuthorization.getFullDetail()
      : null;

    return {
      ...this.serialize(),
      estimatedEnergyDelivered,
      connector: connector?.serialize() || null,
      chargeAuthorization: authDetail,
      // Fallback charger info when authorization is deleted
      charger: authDetail?.charger || chargerInfo,
    };
  }
}
