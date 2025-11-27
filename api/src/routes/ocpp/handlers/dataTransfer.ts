import z from "zod";
import type { ActionHandler } from "./ActionHandler";
import {
  DataTransferRequestSchema,
  DataTransferResponseSchema,
  DataTransferStatusEnum,
} from "../types";
import type { WSCustomContext } from "../WSCustomContext";
import { logger } from "../../../lib/globals/logger";

/**
 * Handler for DataTransfer messages.
 *
 * DataTransfer is used for vendor-specific communication between the Charge Point
 * and the Central System. This can be initiated by either party.
 *
 * The vendorId identifies the vendor, and messageId (optional) identifies
 * the specific message type. The data field contains the actual payload.
 *
 * Since we don't implement any vendor-specific extensions, we respond with
 * UnknownVendorId to indicate we don't support the vendor's custom messages.
 * This is valid per OCPP 1.6 specification.
 */
export const dataTransfer: ActionHandler = {
  handleRequest: async (
    payload: unknown,
    wsCtx: WSCustomContext
  ): Promise<z.infer<typeof DataTransferResponseSchema>> => {
    const parsed = DataTransferRequestSchema.parse(payload);
    const charger = wsCtx.get("charger");

    logger.info("DataTransfer received", {
      shortcode: charger.shortcode,
      vendorId: parsed.vendorId,
      messageId: parsed.messageId ?? undefined,
      dataLength: parsed.data?.length ?? 0,
    });

    // We don't implement any vendor-specific messages, so we return UnknownVendorId
    // This is a valid response per OCPP 1.6 specification
    return {
      status: DataTransferStatusEnum.UnknownVendorId,
    };
  },
} as const;
