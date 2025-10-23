import { Hono } from "hono";
import { Connector } from "../../lib/models/Connector";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { successResponse } from "../../lib/helpers/apiResponse";

export const connector = new Hono()
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
      
      const [connectors, totalCount] = await Promise.all([
        Connector.findMany({ limit, offset }),
        Connector.count(),
      ]);
      
      return successResponse(
        c,
        connectors.map((connector) => connector.serialize()),
        "Connectors retrieved successfully",
        totalCount
      );
    }
  )
  .get(
    "/detail",
    zValidator(
      "query",
      z.object({
        limit: z.coerce.number().optional(),
        offset: z.coerce.number().optional(),
      })
    ),
    async (c) => {
      const { limit, offset } = c.req.valid("query");
      
      const [connectors, totalCount] = await Promise.all([
        Connector.findMany({ limit, offset }),
        Connector.count(),
      ]);
      
      return successResponse(
        c,
        await Promise.all(
          connectors.map((connector) => connector.getDetailData())
        ),
        "Connector details retrieved successfully",
        totalCount
      );
    }
  )
  .post(
    "/:id/unlock-connector",
    zValidator(
      "param",
      z.object({
        id: z.coerce.number(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const connector = await Connector.findOneOrThrow({
        eb: (eb) => eb("connector.id", "=", id),
      });

      const data = await connector.unlock();

      return successResponse(
        c,
        {
          success: data[2].status === "Unlocked",
        },
        "Unlock command sent successfully"
      );
    }
  )
  .get(
    "/charger/:id",
    zValidator(
      "param",
      z.object({
        id: z.coerce.number(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");

      const connectors = await Connector.findMany({
        eb: (eb) => eb("chargerId", "=", id),
      });

      return successResponse(
        c,
        connectors.map((connector) => connector.serialize()),
        "Charger connectors retrieved successfully"
      );
    }
  )
  .get(
    "/charger/:id/detail",
    zValidator(
      "param",
      z.object({
        id: z.coerce.number(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");

      const connectors = await Connector.findMany({
        eb: (eb) => eb("chargerId", "=", id),
      });

      return successResponse(
        c,
        await Promise.all(
          connectors.map((connector) => connector.getDetailData())
        ),
        "Charger connector details retrieved successfully"
      );
    }
  );
