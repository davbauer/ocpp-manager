import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { ChargeAuthorization } from "../../lib/models/ChargeAuthorization";

export const chargeAuthorization = new Hono()
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
      const authorizations = await ChargeAuthorization.findMany({
        limit,
        offset,
      });

      return c.json(authorizations.map((auth) => auth.serialize()));
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
      const authorizations = await ChargeAuthorization.findMany({
        limit,
        offset,
      });

      return c.json(
        await Promise.all(
          authorizations.map((authorization) => authorization.getFullDetail())
        )
      );
    }
  )
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        chargerId: z.number(),
        expiryDate: z.coerce.date().nullable(),
        rfidTagId: z.number().nullable(),
      })
    ),
    async (c) => {
      const { chargerId, expiryDate, rfidTagId } = c.req.valid("json");

      const newAuthorization = await ChargeAuthorization.insert({
        chargerId,
        expiryDate: expiryDate,
        rfidTagId: rfidTagId || null,
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
        expiryDate: z.coerce.date().nullable(),
        rfidTagId: z.number().nullable(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const { chargerId, expiryDate, rfidTagId } = c.req.valid("json");

      const authorization = await ChargeAuthorization.findOneOrThrow({
        eb: (eb) => eb("id", "=", id),
      });

      await authorization.update({
        chargerId,
        expiryDate: expiryDate,
        rfidTagId: rfidTagId,
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
