import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Transaction } from "../../lib/models/Transaction";
import { Connector } from "../../lib/models/Connector";

export const transaction = new Hono()
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
      const transactions = await Transaction.findMany({
        limit,
        offset,
      });
      return c.json(
        transactions.reverse().map((transaction) => transaction.serialize())
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
      const transactions = await Transaction.findMany({
        limit,
        offset,
      });

      return c.json(
        await Promise.all(
          transactions
            .reverse()
            .map((transaction) => transaction.getFullDetail())
        )
      );
    }
  )

  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.coerce.number(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");

      const transaction = await Transaction.findOneOrThrow({
        eb: (eb) => eb("id", "=", id),
      });

      return c.json(transaction.serialize());
    }
  )
  .get(
    "/:id/detail",
    zValidator(
      "param",
      z.object({
        id: z.coerce.number(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");

      const transaction = await Transaction.findOneOrThrow({
        eb: (eb) => eb("id", "=", id),
      });

      return c.json(await transaction.getFullDetail());
    }
  )
  .get(
    "/charger/:chargerId/detail",
    zValidator(
      "param",
      z.object({
        chargerId: z.coerce.number(),
      })
    ),
    async (c) => {
      const { chargerId } = c.req.valid("param");

      const chargers = await Connector.findMany({
        eb: (eb) => eb("chargerId", "=", chargerId),
      });

      let transactions: Transaction[] = [];

      if (chargers.length) {
        transactions = await Transaction.findMany({
          eb: (eb) =>
            eb(
              "connectorId",
              "in",
              chargers.map((x) => x.serialize()).map((x) => x.id)
            ),
        });
      }

      return c.json(
        await Promise.all(
          transactions.map((transaction) => transaction.getFullDetail())
        )
      );
    }
  )
  .get(
    "/connector/:connectorId/detail",
    zValidator(
      "param",
      z.object({
        connectorId: z.coerce.number(),
      })
    ),
    async (c) => {
      const { connectorId } = c.req.valid("param");

      const transactions = await Transaction.findMany({
        eb: (eb) => eb("connectorId", "=", connectorId),
      });

      return c.json(
        await Promise.all(
          transactions.map((transaction) => transaction.getFullDetail())
        )
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

      const transaction = await Transaction.findOneOrThrow({
        eb: (eb) => eb("id", "=", id),
      });

      await transaction.delete();

      return c.json(transaction.serialize());
    }
  );
