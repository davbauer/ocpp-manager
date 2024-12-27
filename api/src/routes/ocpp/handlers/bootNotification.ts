import { z } from "zod";
import { Setting } from "../../../lib/models/Setting";
import type { ActionHandler } from "./ActionHandler";
import {
  BootNotificationRequestSchema,
  BootNotificationResponseSchema,
} from "../types";
import type { WSCustomContext } from "../WSCustomContext";

export const bootNotification: ActionHandler = {
  handleRequest: async (
    payload: unknown,
    wsCtx: WSCustomContext
  ): Promise<z.infer<typeof BootNotificationResponseSchema>> => {
    let parsedData: z.infer<typeof BootNotificationRequestSchema>;

    try {
      parsedData = BootNotificationRequestSchema.parse(payload);
    } catch {
      return {
        currentTime: new Date().toISOString(),
        interval: 0,
        status: "Rejected",
      };
    }

    const currentTime = new Date().toISOString();
    const charger = wsCtx.get("charger");

    await charger.update({
      model: parsedData.chargePointModel,
      vendor: parsedData.chargePointVendor,
      firmwareVersion: parsedData.firmwareVersion,
      lastHeartbeat: currentTime,
    });

    // Fetch settings
    const settings = await Setting.findOneOrThrow();

    // Return the response
    return {
      currentTime,
      interval: settings.heartbeatInterval,
      status: charger.status as "Accepted" | "Rejected" | "Pending",
    };
  },
} as const;
