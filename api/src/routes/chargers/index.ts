import { Hono } from "hono";
import { Chargers } from "../../lib/models/Chargers";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";

export const chargers = new Hono()
  .get("/", async (c) => {
    const chargers = await Chargers.findMany();
    return c.json(chargers.map((charger) => charger.serialize()));
  })
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
        enabled: z.boolean(),
        friendlyName: z.ostring(),
        shortcode: z.string().min(1).toLowerCase(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const { enabled, friendlyName, shortcode } = c.req.valid("json");

      const existingCharger = await Chargers.findOne({
        eb: (eb) => eb("shortcode", "=", shortcode),
      });
      if (!existingCharger) {
        throw new HTTPException(400, {
          message: "A charger with this shortcode does not exist.",
        });
      }
      const charger = await Chargers.findOneOrThrow({
        eb: (eb) => eb("id", "=", id),
      });

      await charger.update({
        enabled: enabled ? 1 : 0,
        friendlyName,
        shortcode,
      });

      return c.json(charger.serialize());
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

      const existingCharger = await Chargers.findOne({
        eb: (eb) => eb("id", "=", id),
      });
      if (!existingCharger) {
        throw new HTTPException(400, {
          message: "A charger with this id could not be found.",
        });
      }
      await existingCharger.delete();

      return c.json(existingCharger.serialize());
    }
  )
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        friendlyName: z.ostring(),
        shortcode: z.string().min(1).toLowerCase(),
      })
    ),
    async (c) => {
      const { friendlyName, shortcode } = c.req.valid("json");

      const existingCharger = await Chargers.findOne({
        eb: (eb) => eb("shortcode", "=", shortcode),
      });
      if (existingCharger) {
        throw new HTTPException(400, {
          message: "A charger with this shortcode already exists.",
        });
      }

      const newCharger = await Chargers.insert({
        friendlyName,
        shortcode,
        enabled: 1,
      });

      return c.json(newCharger.serialize(), 201);
    }
  );