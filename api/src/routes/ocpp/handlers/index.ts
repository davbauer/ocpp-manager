import { logger } from "../../../lib/globals/logger";
import { authorize } from "./authorize";
import { bootNotification } from "./bootNotification";
import { heartbeat } from "./heartbeat";
import { statusNotification } from "./statusNotification";
import { securityEventNotification } from "./securityEventNotification";
import { CallResultSchema, CallSchema } from "../types";
import type { WSCustomContext } from "../WSCustomContext";
import type { z } from "zod";
import { meterValues } from "./meterValues";
import { startTransaction } from "./startTransaction";
import { stopTransaction } from "./stopTransaction";

export const handler = async (
  message: z.infer<typeof CallSchema>,
  wsCtx: WSCustomContext
): Promise<z.infer<typeof CallResultSchema> | void> => {
  try {
    const messageType = message[0]; // 2 for request, 3 for response
    const uniqueId = message[1]; // Unique ID for the request-response pair
    const action = message[2]; // The action (e.g., "BootNotification")
    const payload = message[3]; // Payload

    if (messageType === 3) {
      logger.warn("Skipped message since message type = 3");
      return;
    }

    let responsePayload = {};

    switch (action) {
      case "Authorize":
        responsePayload = await authorize.handleRequest(payload, wsCtx);
        break;

      case "BootNotification":
        responsePayload = await bootNotification.handleRequest(payload, wsCtx);
        break;

      case "Heartbeat":
        responsePayload = await heartbeat.handleRequest(payload, wsCtx);
        break;

      case "StatusNotification":
        responsePayload = await statusNotification.handleRequest(
          payload,
          wsCtx
        );
        break;

      case "MeterValues":
        responsePayload = await meterValues.handleRequest(payload, wsCtx);
        break;

      case "StartTransaction":
        responsePayload = await startTransaction.handleRequest(payload, wsCtx);
        break;

      case "StopTransaction":
        responsePayload = await stopTransaction.handleRequest(payload, wsCtx);
        break;

      case "SecurityEventNotification":
        responsePayload = await securityEventNotification.handleRequest(
          payload,
          wsCtx
        );
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return [3, uniqueId, responsePayload];
  } catch (error) {
    console.error("Error processing message:", error);
    return [
      4,
      "unique-error-id",
      { errorCode: "InternalError", errorDescription: String(error) },
    ];
  }
};
