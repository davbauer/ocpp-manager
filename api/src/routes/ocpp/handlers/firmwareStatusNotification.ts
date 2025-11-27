import z from "zod";
import type { ActionHandler } from "./ActionHandler";
import {
  FirmwareStatusNotificationRequestSchema,
  FirmwareStatusNotificationResponseSchema,
} from "../types";
import type { WSCustomContext } from "../WSCustomContext";
import { logger } from "../../../lib/globals/logger";

/**
 * Handler for FirmwareStatusNotification messages.
 *
 * Sent by the Charge Point to inform the Central System about the progress
 * of a firmware update that was previously requested via UpdateFirmware.
 *
 * Status values:
 * - Idle: Firmware update is not active
 * - Downloading: Firmware is being downloaded
 * - Downloaded: Firmware has been downloaded successfully
 * - DownloadFailed: Firmware download failed
 * - Installing: Firmware is being installed
 * - Installed: Firmware has been successfully installed
 * - InstallationFailed: Firmware installation failed
 */
export const firmwareStatusNotification: ActionHandler = {
  handleRequest: async (
    payload: unknown,
    wsCtx: WSCustomContext
  ): Promise<z.infer<typeof FirmwareStatusNotificationResponseSchema>> => {
    const parsed = FirmwareStatusNotificationRequestSchema.parse(payload);
    const charger = wsCtx.get("charger");

    logger.info("FirmwareStatusNotification received", {
      shortcode: charger.shortcode,
      status: parsed.status,
    });

    // Return empty response as per OCPP 1.6 specification
    return {};
  },
} as const;
