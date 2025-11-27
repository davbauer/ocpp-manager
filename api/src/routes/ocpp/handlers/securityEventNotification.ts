import z from "zod";
import type { ActionHandler } from "./ActionHandler";
import {
  SecurityEventNotificationRequestSchema,
  SecurityEventNotificationResponseSchema,
} from "../types";
import type { WSCustomContext } from "../WSCustomContext";
import { logger } from "../../../lib/globals/logger";

/**
 * Handler for SecurityEventNotification messages.
 *
 * SecurityEventNotification is part of the OCPP 1.6 Security Extension.
 * Charge points send this message to notify about security-related events
 * such as system time changes, firmware updates, authentication failures,
 * tamper detection, etc.
 *
 * The response is always an empty object as per the specification.
 */
export const securityEventNotification: ActionHandler = {
  handleRequest: async (
    payload: unknown,
    wsCtx: WSCustomContext
  ): Promise<z.infer<typeof SecurityEventNotificationResponseSchema>> => {
    const parsed = SecurityEventNotificationRequestSchema.parse(payload);
    const charger = wsCtx.get("charger");

    // Log the security event for monitoring purposes
    logger.info("SecurityEventNotification received", {
      shortcode: charger.shortcode,
      eventType: parsed.type,
      timestamp: parsed.timestamp,
      techInfo: parsed.techInfo ?? undefined,
    });

    // Return empty response as per OCPP 1.6 Security Extension specification
    return {};
  },
} as const;
