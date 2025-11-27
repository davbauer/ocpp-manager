import { HTTPException } from "hono/http-exception";
import { ChargeAuthorization } from "../models/ChargeAuthorization";
import { RfidTag } from "../models/RfidTag";

export interface ResolvedAuthorization {
  idTag: string;
  chargeAuthorization: ChargeAuthorization;
  rfidTag: RfidTag;
}

interface ResolveAuthorizationArgs {
  chargerId: number;
  chargeAuthorizationId?: number;
  rfidTagId?: number;
  idTag?: string;
}

const ensureAuthorizationActive = (authorization: ChargeAuthorization) => {
  if (authorization.expiryDate) {
    const expiresAt = new Date(authorization.expiryDate);
    if (expiresAt.getTime() <= Date.now()) {
      throw new HTTPException(400, {
        message: "Charge authorization is expired.",
      });
    }
  }
};

export async function resolveAuthorizationForCharger(
  args: ResolveAuthorizationArgs
): Promise<ResolvedAuthorization> {
  const { chargerId, chargeAuthorizationId, rfidTagId, idTag } = args;

  let authorization: ChargeAuthorization | null = null;
  let rfidTag: RfidTag | null = null;
  let resolvedIdTag: string | null = null;

  if (chargeAuthorizationId) {
    authorization = await ChargeAuthorization.findOneOrThrow({
      eb: (eb) => eb("id", "=", chargeAuthorizationId),
    });

    if (authorization.chargerId !== chargerId) {
      throw new HTTPException(400, {
        message:
          "Charge authorization does not belong to the requested charger.",
      });
    }

    ensureAuthorizationActive(authorization);
  }

  if (rfidTagId) {
    rfidTag = await RfidTag.findOne({
      eb: (eb) => eb("id", "=", rfidTagId),
    });

    if (!rfidTag) {
      throw new HTTPException(404, { message: "RFID tag not found." });
    }
  }

  if (!authorization && (rfidTag || idTag)) {
    const lookupIdTag = rfidTag?.rfidTag ?? idTag;
    if (!lookupIdTag) {
      throw new HTTPException(400, {
        message: "An idTag must be provided when the RFID tag is unknown.",
      });
    }

    authorization = await ChargeAuthorization.searchValidByIdTag({
      idTag: lookupIdTag,
      chargerId,
    });

    if (!authorization) {
      throw new HTTPException(404, {
        message: "No active charge authorization found for the provided tag.",
      });
    }
  }

  if (!authorization) {
    throw new HTTPException(400, {
      message:
        "Provide either chargeAuthorizationId, rfidTagId or idTag to perform this action.",
    });
  }

  ensureAuthorizationActive(authorization);

  if (!rfidTag && authorization.rfidTagId) {
    rfidTag = await RfidTag.findOne({
      eb: (eb) => eb("id", "=", authorization.rfidTagId),
    });
  }

  resolvedIdTag = idTag ?? rfidTag?.rfidTag ?? null;

  if (!resolvedIdTag) {
    throw new HTTPException(400, {
      message:
        "Unable to resolve an idTag for the requested action. Please attach an RFID tag to the authorization.",
    });
  }

  if (!rfidTag) {
    throw new HTTPException(400, {
      message:
        "An RFID tag record is required for this operation. Please attach an RFID tag to the authorization.",
    });
  }

  return {
    idTag: resolvedIdTag,
    chargeAuthorization: authorization,
    rfidTag,
  };
}
