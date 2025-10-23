import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { RfidTag } from "../../lib/models/RfidTag";

export const rfidTag = new Hono()
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
      const tags = await RfidTag.findMany({
        limit,
        offset,
      });
      return c.json(tags.map((tag) => tag.serialize()));
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
      const tags = await RfidTag.findMany({
        limit,
        offset,
      });

      return c.json(await Promise.all(tags.map((tag) => tag.getFullDetail())));
    }
  )
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        friendlyName: z.string(),
        rfidTag: z.string(),
      })
    ),
    async (c) => {
      const { friendlyName, rfidTag } = c.req.valid("json");

      const newTag = await RfidTag.insert({
        friendlyName,

        rfidTag,
      });

      return c.json(newTag);
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
        friendlyName: z.string(),
        rfidTag: z.ostring(),
      })
    ),
    async (c) => {
      const { friendlyName, rfidTag } = c.req.valid("json");
      const { id } = c.req.valid("param");

      const tag = await RfidTag.findOneOrThrow({
        eb: (eb) => eb("id", "=", id),
      });

      await tag.update({
        friendlyName,
        rfidTag,
      });

      return c.json(tag.serialize());
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

      const tag = await RfidTag.findOneOrThrow({
        eb: (eb) => eb("id", "=", id),
      });

      await tag.delete();

      return c.json(tag.serialize());
    }
  );
