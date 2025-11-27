import z from "zod";
import type { ActionHandler } from "./ActionHandler";
import {
  DiagnosticsStatusNotificationRequestSchema,
  DiagnosticsStatusNotificationResponseSchema,
} from "../types";
import type { WSCustomContext } from "../WSCustomContext";
import { logger } from "../../../lib/globals/logger";

/**
 * Handler for DiagnosticsStatusNotification messages.
 *
 * Sent by the Charge Point to inform the Central System about the status
 * of a diagnostics upload that was previously requested via GetDiagnostics.
 *
 * Status values:
 * - Idle: Diagnostics upload is not active
 * - Uploading: Diagnostics file is being uploaded
 * - Uploaded: Diagnostics file has been successfully uploaded
 * - UploadFailed: Upload of diagnostics file failed
 */
export const diagnosticsStatusNotification: ActionHandler = {
  handleRequest: async (
    payload: unknown,
    wsCtx: WSCustomContext
  ): Promise<z.infer<typeof DiagnosticsStatusNotificationResponseSchema>> => {
    const parsed = DiagnosticsStatusNotificationRequestSchema.parse(payload);
    const charger = wsCtx.get("charger");

    logger.info("DiagnosticsStatusNotification received", {
      shortcode: charger.shortcode,
      status: parsed.status,
    });

    // Return empty response as per OCPP 1.6 specification
    return {};
  },
} as const;
