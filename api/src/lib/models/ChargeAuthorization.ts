import type { Selectable } from "kysely";
import { db } from "../db/db";
import { RfidTag } from "./RfidTag";
import { generateBaseModel } from "./base";
import type { DB } from "../db/DBTypes";
import { Charger } from "./Charger";

export interface ChargeAuthorization
  extends Selectable<DB["chargeAuthorization"]> {}
export class ChargeAuthorization extends generateBaseModel(
  "chargeAuthorization",
  "id",
  "updatedAt"
) {
  static async searchValidByIdTag({
    idTag,
    chargerId,
  }: {
    idTag: string;
    chargerId: number;
  }): Promise<ChargeAuthorization | null> {
    let tag = await RfidTag.findOne({
      eb: (eb) => eb("rfidTag", "=", idTag),
    });

    if (!tag) {
      tag = await RfidTag.insert({
        friendlyName: "Detected Tag",
        rfidTag: idTag,
      });
    }

    const authRecord = await db
      .selectFrom("chargeAuthorization as auth")
      .innerJoin("rfidTag", "auth.rfidTagId", "rfidTag.id")
      .selectAll("auth")
      .where("rfidTag.rfidTag", "=", idTag)
      .where("auth.chargerId", "=", chargerId)
      .where((eb) =>
        eb.or([
          eb("auth.expiryDate", "is", null),
          eb("auth.expiryDate", ">", new Date()),
        ])
      )
      .orderBy("auth.createdAt", "asc")
      .executeTakeFirst();

    return authRecord ? new this(authRecord) : null;
  }

  async getFullDetail() {
    const [charger, tag] = await Promise.all([
      Charger.findOneOrThrow({
        eb: (eb) => eb("id", "=", this.chargerId),
      }),
      this.rfidTagId
        ? RfidTag.findOneOrThrow({
            eb: (eb) => eb("id", "=", this.rfidTagId),
          })
        : null,
    ]);

    return {
      ...this.serialize(),
      charger: charger.serialize(),
      tag: tag ? tag.serialize() : null,
    };
  }
}
