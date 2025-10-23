import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { RfidTag } from "../../lib/models/RfidTag";
import { successResponse } from "../../lib/helpers/apiResponse";

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

      const [tags, totalCount] = await Promise.all([
        RfidTag.findMany({ limit, offset }),
        RfidTag.count(),
      ]);

      return successResponse(
        c,
        tags.map((tag) => tag.serialize()),
        "RFID tags retrieved successfully",
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

      const [tags, totalCount] = await Promise.all([
        RfidTag.findMany({ limit, offset }),
        RfidTag.count(),
      ]);

      return successResponse(
        c,
        await Promise.all(tags.map((tag) => tag.getFullDetail())),
        "RFID tag details retrieved successfully",
        totalCount
      );
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

      return successResponse(
        c,
        newTag.serialize(),
        "RFID tag created successfully",
        undefined,
        201
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
        friendlyName: z.string(),
        rfidTag: z.string(),
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

      return successResponse(
        c,
        tag.serialize(),
        "RFID tag updated successfully"
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

      const tag = await RfidTag.findOneOrThrow({
        eb: (eb) => eb("id", "=", id),
      });

      await tag.delete();

      return successResponse(
        c,
        tag.serialize(),
        "RFID tag deleted successfully"
      );
    }
  );
