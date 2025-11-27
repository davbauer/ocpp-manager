import { z } from "zod";
import { CiString50Type } from "../Types/CiString50Type";
import { CiString255Type } from "../Types/CiString255Type";

/**
 * SecurityEventNotification.req
 *
 * Sent by the Charge Point to the Central System to notify about security events.
 * This is part of the OCPP 1.6 Security Extension (OCPP 1.6J Security Whitepaper).
 *
 * Common security event types include:
 * - "SettingSystemTime" - System time was set/synchronized
 * - "FirmwareUpdated" - Firmware was updated
 * - "FailedToAuthenticateAtCsms" - Failed to authenticate with CSMS
 * - "CsmsFailedToAuthenticate" - CSMS failed to authenticate
 * - "MemoryExhaustion" - Memory exhaustion detected
 * - "InvalidMessages" - Invalid messages received
 * - "AttemptedReplayAttack" - Attempted replay attack detected
 * - "TamperDetectionActivated" - Tamper detection activated
 * - "InvalidFirmwareSignature" - Invalid firmware signature
 * - "InvalidFirmwareSigningCertificate" - Invalid firmware signing certificate
 * - "InvalidCentralSystemCertificate" - Invalid central system certificate
 * - "InvalidChargePointCertificate" - Invalid charge point certificate
 * - "InvalidTLSVersion" - Invalid TLS version
 * - "InvalidTLSCipherSuite" - Invalid TLS cipher suite
 */
export const SecurityEventNotificationRequestSchema = z.object({
  /** Type of the security event. This is a CiString50 containing the security event type. */
  type: CiString50Type,
  /** Date and time at which the event occurred. */
  timestamp: z.string().datetime({ offset: true }),
  /** Additional information about the occurred security event. Optional. */
  techInfo: CiString255Type.nullish(),
});

export type SecurityEventNotificationRequest = z.infer<
  typeof SecurityEventNotificationRequestSchema
>;

/**
 * SecurityEventNotification.conf
 *
 * Response to a SecurityEventNotification.req. This is an empty object as per
 * the OCPP 1.6 Security Extension specification.
 */
export const SecurityEventNotificationResponseSchema = z.object({});

export type SecurityEventNotificationResponse = z.infer<
  typeof SecurityEventNotificationResponseSchema
>;
