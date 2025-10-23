import { Hono } from "hono";
import { Connector } from "../../lib/models/Connector";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

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
      const connectors = await Connector.findMany({
        limit,
        offset,
      });
      return c.json(connectors.map((connector) => connector.serialize()));
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
      const connectors = await Connector.findMany({
        limit,
        offset,
      });
      return c.json(
        await Promise.all(
          connectors.map((connector) => connector.getDetailData())
        )
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

      return c.json({
        success: data[2].status === "Unlocked",
      });
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

      return c.json(connectors.map((connector) => connector.serialize()));
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

      return c.json(
        await Promise.all(
          connectors.map((connector) => connector.getDetailData())
        )
      );
    }
  );
