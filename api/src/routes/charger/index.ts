import { Hono } from "hono";
import { Charger } from "../../lib/models/Charger";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";
import { ResetTypeEnum } from "../ocpp/types";
import { Setting } from "../../lib/models/Setting";
import { successResponse } from "../../lib/helpers/apiResponse";

export const charger = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        limit: z.coerce.number().optional(),
        offset: z.coerce.number().optional(),
      })
    ),
    async (c) => {
      const { limit, offset } = c.req.valid("query");
      const settings = await Setting.findOneOrThrow();
      const heartbeatIntervalWithBuffer = settings.heartbeatInterval + 10;

      const [chargers, totalCount] = await Promise.all([
        Charger.findMany({ limit, offset }),
        Charger.count(),
      ]);

      const chargersWithConnectivity = chargers.map((charger) => {
        const lastHeartbeatTime = charger.lastHeartbeat
          ? new Date(charger.lastHeartbeat).getTime()
          : 0;
        const now = Date.now();

        const connectivity: "Online" | "Offline" =
          lastHeartbeatTime > 0 &&
          now - lastHeartbeatTime <= heartbeatIntervalWithBuffer * 1000
            ? "Online"
            : "Offline";

        return {
          ...charger.serialize(),
          connectivity,
        };
      });

      return successResponse(
        c,
        chargersWithConnectivity,
        "Chargers retrieved successfully",
        totalCount
      );
    }
  )
  .patch(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.coerce.number(),
      })
    ),
    zValidator(
      "json",
      z.object({
        status: z.enum(["Accepted", "Rejected", "Pending"]),
        friendlyName: z.string(),
        shortcode: z.string().min(1).toLowerCase(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const { status, friendlyName, shortcode } = c.req.valid("json");

      const existingCharger = await Charger.findOne({
        eb: (eb) => eb("shortcode", "=", shortcode),
      });
      if (!existingCharger) {
        throw new HTTPException(400, {
          message: "A charger with this shortcode does not exist.",
        });
      }
      const charger = await Charger.findOneOrThrow({
        eb: (eb) => eb("id", "=", id),
      });

      await charger.update({
        status,
        friendlyName,
        shortcode,
      });

      return successResponse(
        c,
        charger.serialize(),
        "Charger updated successfully"
      );
    }
  )
  .delete(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.coerce.number(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");

      const existingCharger = await Charger.findOne({
        eb: (eb) => eb("id", "=", id),
      });
      if (!existingCharger) {
        throw new HTTPException(400, {
          message: "A charger with this id could not be found.",
        });
      }
      await existingCharger.delete();

      return successResponse(
        c,
        existingCharger.serialize(),
        "Charger deleted successfully"
      );
    }
  )
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        friendlyName: z.string(),
        shortcode: z.string().min(1).toLowerCase(),
      })
    ),
    async (c) => {
      const { friendlyName, shortcode } = c.req.valid("json");

      const existingCharger = await Charger.findOne({
        eb: (eb) => eb("shortcode", "=", shortcode),
      });
      if (existingCharger) {
        throw new HTTPException(400, {
          message: "A charger with this shortcode already exists.",
        });
      }

      const newCharger = await Charger.insert({
        friendlyName,
        shortcode,
        status: "Accepted",
      });

      return successResponse(
        c,
        newCharger.serialize(),
        "Charger created successfully",
        undefined,
        201
      );
    }
  )
  .post(
    "/:id/reset",
    zValidator(
      "param",
      z.object({
        id: z.coerce.number(),
      })
    ),
    zValidator(
      "json",
      z.object({
        type: z.nativeEnum(ResetTypeEnum),
      })
    ),
    async (c) => {
      const { type } = c.req.valid("json");
      const { id } = c.req.valid("param");

      const charger = await Charger.findOneOrThrow({
        eb: (eb) => eb("id", "=", id),
      });

      const data = await charger.reset(type);

      return successResponse(
        c,
        {
          success: data[2].status === "Accepted",
        },
        "Reset command sent successfully"
      );
    }
  );
