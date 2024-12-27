import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { ChargeAuthorization } from "../../lib/models/ChargeAuthorization";

export const chargeAuthorization = new Hono()
  .get("/", async (c) => {
    const authorizations = await ChargeAuthorization.findMany();
    return c.json(authorizations.map((auth) => auth.serialize()));
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        chargerId: z.number(),
        connectorId: z.number().nullable(),
        expiryDate: z.coerce.date().nullable(),
        rfidTagId: z.number().nullable(),
        wLimit: z.number().nullable(),
      })
    ),
    async (c) => {
      const { chargerId, connectorId, expiryDate, rfidTagId, wLimit } =
        c.req.valid("json");

      const newAuthorization = await ChargeAuthorization.insert({
        chargerId,
        connectorId: connectorId || null,
        expiryDate: expiryDate,
        rfidTagId: rfidTagId || null,
        wLimit: wLimit || null,
      });

      return c.json(newAuthorization.serialize(), 201);
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
        chargerId: z.number(),
        connectorId: z.number().nullable(),
        expiryDate: z.coerce.date().nullable(),
        rfidTagId: z.number().nullable(),
        wLimit: z.number().nullable(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const { chargerId, connectorId, expiryDate, rfidTagId, wLimit } =
        c.req.valid("json");

      const authorization = await ChargeAuthorization.findOneOrThrow({
        eb: (eb) => eb("id", "=", id),
      });

      await authorization.update({
        chargerId,
        connectorId: connectorId || null,
        expiryDate: expiryDate,
        rfidTagId: rfidTagId,
        wLimit: wLimit || null,
      });

      return c.json(authorization.serialize());
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

      const authorization = await ChargeAuthorization.findOneOrThrow({
        eb: (eb) => eb("id", "=", id),
      });

      await authorization.delete();

      return c.json(authorization.serialize());
    }
  );
