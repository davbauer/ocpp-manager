import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { ChargeAuthorization } from "../../lib/models/ChargeAuthorization";
import { successResponse } from "../../lib/helpers/apiResponse";

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
      
      const [authorizations, totalCount] = await Promise.all([
        ChargeAuthorization.findMany({ limit, offset }),
        ChargeAuthorization.count(),
      ]);

      return successResponse(
        c,
        authorizations.map((auth) => auth.serialize()),
        "Authorizations retrieved successfully",
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
      
      const [authorizations, totalCount] = await Promise.all([
        ChargeAuthorization.findMany({ limit, offset }),
        ChargeAuthorization.count(),
      ]);

      return successResponse(
        c,
        await Promise.all(
          authorizations.map((authorization) => authorization.getFullDetail())
        ),
        "Authorization details retrieved successfully",
        totalCount
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

      return successResponse(
        c,
        newAuthorization.serialize(),
        "Authorization created successfully",
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

      return successResponse(
        c,
        authorization.serialize(),
        "Authorization updated successfully"
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

      const authorization = await ChargeAuthorization.findOneOrThrow({
        eb: (eb) => eb("id", "=", id),
      });

      await authorization.delete();

      return successResponse(
        c,
        authorization.serialize(),
        "Authorization deleted successfully"
      );
    }
  );
