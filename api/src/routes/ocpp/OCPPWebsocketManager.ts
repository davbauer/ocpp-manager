import { logger } from "../../lib/globals/logger";
import { z, ZodError } from "zod";
import {
  ActionEnum,
  CallErrorSchema,
  CallResultSchema,
  CallSchema,
  createCallResultSchema,
  ErrorCodeEnum,
} from "./types";
import { WSCustomContext } from "./WSCustomContext";
import type { WSContext } from "hono/ws";
import { Charger } from "../../lib/models/Charger";
import { handler } from "./handlers";
import { HTTPException } from "hono/http-exception";

type CallResult<T = any> = z.infer<typeof CallResultSchema> & [3, string, T];

class OCPPWebsocketManager {
  private connections: Map<
    string,
    {
      ws: WSContext<unknown>;
      wsCtx: WSCustomContext;
      pendingRequests: Map<string, (response: CallResult | undefined) => void>;
    }
  > = new Map();

  public async setConnection(
    shortcode: string,
    ws: WSContext<unknown>
  ): Promise<void> {
    const wsCtx = await this.updateWsCtx(shortcode);
    this.connections.set(shortcode, {
      ws,
      wsCtx,
      pendingRequests: new Map(),
    });
  }

  public cleanInactiveConnections(): void {
    this.connections.forEach((conn, key) => {
      if ([0, 1].includes(conn.ws.readyState)) return;
      this.connections.delete(key);
      logger.info("Removed inactive connection", { shortcode: key });
    });
  }

  public async sendCall<T extends z.ZodTypeAny>({
    shortcode,
    action,
    message,
    responseSchema,
  }: {
    shortcode: string;
    action: ActionEnum;
    message: unknown;
    responseSchema?: T;
  }): Promise<z.infer<ReturnType<typeof createCallResultSchema<T>>>> {
    const connection = this.connections.get(shortcode);

    if (!connection) {
      logger.error("No active connection for shortcode", { shortcode });
      throw new HTTPException(500, {
        message: `No active connection for shortcode: ${shortcode}`,
      });
    }

    const randomId = crypto.randomUUID().toString();
    const request: z.infer<typeof CallSchema> = [2, randomId, action, message];

    return new Promise((resolve, reject) => {
      connection.pendingRequests.set(randomId, (response) => {
        if (response) {
          try {
            const schema = createCallResultSchema(responseSchema || z.any());
            const validatedResponse = schema.parse(response);
            resolve(
              validatedResponse as z.infer<
                ReturnType<typeof createCallResultSchema<T>>
              >
            );
          } catch (error) {
            logger.error("Response validation failed", {
              action,
              shortcode,
              error: error instanceof Error ? error.message : String(error),
            });
            reject(
              new HTTPException(422, { message: "Invalid response format" })
            );
          }
        } else {
          reject(
            new HTTPException(408, {
              message: `Request timed out for shortcode: ${shortcode}`,
            })
          );
        }
      });

      try {
        this.sendMessage({
          shortcode,
          rawMessage: JSON.stringify(request),
        });

        setTimeout(() => {
          if (connection.pendingRequests.has(randomId)) {
            connection.pendingRequests.delete(randomId);
            logger.error("Request timed out", { action, shortcode, randomId });
            reject(
              new HTTPException(408, {
                message: `Request timed out for shortcode: ${shortcode}`,
              })
            );
          }
        }, 10000);
      } catch (error) {
        connection.pendingRequests.delete(randomId);
        logger.error("Failed to send request", {
          action,
          shortcode,
          error: error instanceof Error ? error.message : String(error),
        });
        reject(
          new HTTPException(500, {
            message: `Failed to send request for shortcode: ${shortcode}`,
          })
        );
      }
    });
  }

  public async sendMessage({
    rawMessage,
    shortcode,
  }: {
    rawMessage: string;
    shortcode: string;
  }): Promise<void> {
    const connection = this.connections.get(shortcode);

    if (!connection) {
      logger.error("No active connection for shortcode", { shortcode });
      throw new Error(`No active connection for shortcode: ${shortcode}`);
    }

    logger.http("Sending raw message", { rawMessage, shortcode });
    try {
      connection.ws.send(rawMessage);
    } catch (error) {
      logger.error("Failed to send raw message", {
        shortcode,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  public async handleIncomingMessage(
    shortcode: string,
    message: string
  ): Promise<void> {
    const connection = this.connections.get(shortcode);

    if (!connection) {
      logger.warn("Received message for unknown shortcode", { shortcode });
      return;
    }

    try {
      const parsedMessage = JSON.parse(message);
      connection.wsCtx = await this.updateWsCtx(shortcode);

      if (Array.isArray(parsedMessage)) {
        const [messageType, messageId]: [
          messageType: 2 | 3 | 4,
          messageId: string,
        ] = parsedMessage as any;

        switch (messageType) {
          case 2: {
            // Try to parse the Call message with schema validation
            const parseResult = CallSchema.safeParse(parsedMessage);

            if (!parseResult.success) {
              // Schema validation failed - likely an unknown/unsupported action
              const [, messageId, action] = parsedMessage as [
                number,
                string,
                string,
                unknown,
              ];

              // Check if this is specifically an unknown action error
              const actionError = parseResult.error.issues.find(
                (issue) =>
                  issue.code === "invalid_enum_value" && issue.path[0] === 2
              );

              if (actionError) {
                logger.warn("Received unsupported OCPP action", {
                  shortcode,
                  action,
                  messageId,
                });

                // Send CallError with NotSupported error code
                const callError: [number, string, string, string, object] = [
                  4,
                  messageId,
                  ErrorCodeEnum.NotSupported,
                  `Action '${action}' is not supported`,
                  {},
                ];

                this.sendMessage({
                  rawMessage: JSON.stringify(callError),
                  shortcode,
                });
                return;
              }

              // Other validation errors
              logger.error("Invalid Call message format", {
                shortcode,
                error: parseResult.error.message,
              });

              const callError: [number, string, string, string, object] = [
                4,
                messageId || "unknown",
                ErrorCodeEnum.FormationViolation,
                "Invalid message format",
                {},
              ];

              this.sendMessage({
                rawMessage: JSON.stringify(callError),
                shortcode,
              });
              return;
            }

            const parsed = parseResult.data;
            logger.info("incoming request (type 2)", { shortcode, message });
            const messageResponse = await handler(parsed, connection.wsCtx);
            if (messageResponse) {
              this.sendMessage({
                rawMessage: JSON.stringify(messageResponse),
                shortcode,
              });
            }
            break;
          }

          case 3: {
            const resolve = connection.pendingRequests.get(messageId);
            if (resolve) {
              const result = CallResultSchema.parse(parsedMessage);
              resolve(result as CallResult);
              connection.pendingRequests.delete(messageId);
              logger.info("Resolved CallResult", {
                shortcode,
                messageId,
                message: JSON.stringify(result),
              });
            }
            break;
          }

          case 4: {
            const resolve = connection.pendingRequests.get(messageId);
            if (resolve) {
              const error = CallErrorSchema.parse(parsedMessage);
              logger.error("Call Error received", { shortcode, error });
              connection.pendingRequests.delete(messageId);
              throw new HTTPException(400, { message: error[3] });
            }
            break;
          }

          default:
            logger.warn("Unhandled message type received", {
              shortcode,
              messageType,
              message,
            });
        }
      } else {
        logger.http("Unsolicited message received", { shortcode, message });
      }
    } catch (error) {
      logger.error("Error handling incoming message", {
        shortcode,
        error: error instanceof Error ? error.message : String(error),
      });

      // Don't re-throw errors from message handling - log them but keep the connection alive
      // The error has already been logged, and re-throwing would crash the server
      // For ZodError or other validation errors, we've already sent an appropriate CallError
      if (error instanceof ZodError) {
        // Validation errors are already handled above for Call messages
        // This catch is for any ZodError that slips through (e.g., from handlers)
        return;
      }

      // For other errors, we should not crash the entire server
      // The connection will stay alive and can continue processing other messages
    }
  }

  public async updateWsCtx(shortcode: string): Promise<WSCustomContext> {
    try {
      let charger = await Charger.findOne({
        eb: (eb) => eb("shortcode", "=", shortcode),
      });

      if (!charger) {
        logger.info("Creating new charger", { shortcode });
        charger = await Charger.insert({
          friendlyName: "Detected Charger",
          shortcode,
        });
      } else {
        await charger.update({
          lastHeartbeat: new Date().toISOString(),
        });
      }

      return new WSCustomContext({ charger });
    } catch (error) {
      logger.error("Error updating context", {
        shortcode,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new HTTPException(500, {
        message: "Failed to fetch or update charger",
      });
    }
  }

  public getActiveConnection(shortcode: string) {
    return this.connections.get(shortcode);
  }

  public getActiveConnections() {
    return this.connections;
  }
}

export const ocppWebsocketManager = new OCPPWebsocketManager();
