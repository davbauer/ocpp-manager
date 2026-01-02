import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { sql } from "kysely";
import { Transaction } from "../../lib/models/Transaction";
import { Connector } from "../../lib/models/Connector";
import { successResponse } from "../../lib/helpers/apiResponse";
import { db } from "../../lib/db/db";
import { buildEnergyValueSql, buildEnergyExistenceCheck } from "../../lib/helpers/energyQueries";

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

      const [transactions, totalCount] = await Promise.all([
        Transaction.findMany({
          limit,
          offset,
          orderBy: { column: "id", direction: "desc" },
        }),
        Transaction.count(),
      ]);

      return successResponse(
        c,
        transactions.map((transaction) => transaction.serialize()),
        "Transactions retrieved successfully",
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
        chargerId: z.coerce.number().optional(),
        connectorId: z.coerce.number().optional(),
        rfidTagId: z.coerce.number().optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
        status: z.enum(["all", "active", "completed"]).optional(),
      })
    ),
    async (c) => {
      const {
        limit,
        offset,
        chargerId,
        connectorId,
        rfidTagId,
        startDate,
        endDate,
        status,
      } = c.req.valid("query");

      // Build filter conditions
      const filters: Array<(eb: any) => any> = [];
      // Filters with table alias for CTE queries (joined tables)
      const cteFilters: Array<(eb: any) => any> = [];

      if (connectorId) {
        filters.push((eb: any) => eb("connectorId", "=", connectorId));
        cteFilters.push((eb: any) => eb("t.connectorId", "=", connectorId));
      } else if (chargerId) {
        // If charger is specified but not connector, get all connectors for that charger
        const chargers = await Connector.findMany({
          eb: (eb) => eb("chargerId", "=", chargerId),
        });
        const connectorIds = chargers.map((c) => c.serialize().id);
        if (connectorIds.length > 0) {
          filters.push((eb: any) => eb("connectorId", "in", connectorIds));
          cteFilters.push((eb: any) => eb("t.connectorId", "in", connectorIds));
        }
      }

      if (rfidTagId) {
        const rfidFilter = (eb: any) =>
          eb(
            "chargeAuthorizationId",
            "in",
            eb
              .selectFrom("ChargeAuthorization")
              .select("id")
              .where("rfidTagId", "=", rfidTagId)
          );
        const cteRfidFilter = (eb: any) =>
          eb(
            "t.chargeAuthorizationId",
            "in",
            eb
              .selectFrom("ChargeAuthorization")
              .select("id")
              .where("rfidTagId", "=", rfidTagId)
          );
        filters.push(rfidFilter);
        cteFilters.push(cteRfidFilter);
      }

      if (startDate) {
        filters.push((eb: any) =>
          eb("startTime", ">=", startDate.toISOString())
        );
        cteFilters.push((eb: any) =>
          eb("t.startTime", ">=", startDate.toISOString())
        );
      }

      if (endDate) {
        filters.push((eb: any) => eb("startTime", "<=", endDate.toISOString()));
        cteFilters.push((eb: any) => eb("t.startTime", "<=", endDate.toISOString()));
      }

      if (status === "active") {
        filters.push((eb: any) => eb("stopTime", "is", null));
        cteFilters.push((eb: any) => eb("t.stopTime", "is", null));
      } else if (status === "completed") {
        filters.push((eb: any) => eb("stopTime", "is not", null));
        cteFilters.push((eb: any) => eb("t.stopTime", "is not", null));
      }

      const filterFn =
        filters.length > 0
          ? (eb: any) => eb.and(filters.map((f) => f(eb)))
          : undefined;

      const cteFilterFn =
        cteFilters.length > 0
          ? (eb: any) => eb.and(cteFilters.map((f) => f(eb)))
          : undefined;

      // Only query estimated energy if we're not filtering to completed-only
      const shouldQueryEstimatedEnergy = status !== "completed";
      // Only query completed energy if we're not filtering to active-only
      const shouldQueryCompletedEnergy = status !== "active";

      // Run all queries in parallel for efficiency
      const [transactions, totalCount, completedEnergyResult, estimatedEnergyResult] = await Promise.all([
        Transaction.findMany({
          eb: filterFn,
          limit,
          offset,
          orderBy: { column: "id", direction: "desc" },
        }),
        Transaction.count({ eb: filterFn }),
        // Calculate total energy for completed transactions (skip if active-only)
        shouldQueryCompletedEnergy
          ? db
              .selectFrom("transaction")
              .$if(!!filterFn, (qb) => qb.where(filterFn!))
              .where("stopTime", "is not", null)
              .select(
                sql<number>`COALESCE(SUM(energy_delivered), 0)`.as("totalEnergyWh")
              )
              .executeTakeFirst()
          : Promise.resolve({ totalEnergyWh: 0 }),
        // Get estimated energy for active transactions (skip if completed-only)
        shouldQueryEstimatedEnergy
          ? db
              .with("active_energy", (db) =>
                db
                  .selectFrom("transaction as t")
                  .innerJoin("telemetry as tel", "tel.transactionId", "t.id")
                  .$if(!!cteFilterFn, (qb) => qb.where(cteFilterFn!))
                  .where("t.stopTime", "is", null)
                  .where(buildEnergyExistenceCheck("tel.meter_value"))
                  .select([
                    "t.id",
                    buildEnergyValueSql("tel.meter_value").as("value_wh"),
                  ])
              )
              .with("per_transaction_energy", (db) =>
                db
                  .selectFrom("active_energy")
                  .select([
                    "id",
                    sql<number>`MAX(value_wh) - MIN(value_wh)`.as("energy_delivered"),
                  ])
                  .groupBy("id")
              )
              .selectFrom("per_transaction_energy")
              .select(
                sql<number>`COALESCE(SUM(energy_delivered), 0)`.as("totalEstimatedWh")
              )
              .executeTakeFirst()
          : Promise.resolve({ totalEstimatedWh: 0 }),
      ]);

      const totalEstimatedWh = Number(estimatedEnergyResult?.totalEstimatedWh ?? 0);

      const totalEnergyWh =
        Number(completedEnergyResult?.totalEnergyWh ?? 0) + totalEstimatedWh;

      const responseData = {
        transactions: await Promise.all(
          transactions.map((transaction) => transaction.getFullDetail())
        ),
        totalEnergyWh,
        completedEnergyWh: Number(completedEnergyResult?.totalEnergyWh ?? 0),
        estimatedEnergyWh: totalEstimatedWh,
      };

      return successResponse(
        c,
        responseData,
        "Transaction details retrieved successfully",
        totalCount
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

      return successResponse(
        c,
        transaction.serialize(),
        "Transaction retrieved successfully"
      );
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

      return successResponse(
        c,
        await transaction.getFullDetail(),
        "Transaction details retrieved successfully"
      );
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

      return successResponse(
        c,
        await Promise.all(
          transactions.map((transaction) => transaction.getFullDetail())
        ),
        "Charger transactions retrieved successfully"
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

      return successResponse(
        c,
        await Promise.all(
          transactions.map((transaction) => transaction.getFullDetail())
        ),
        "Connector transactions retrieved successfully"
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

      return successResponse(
        c,
        transaction.serialize(),
        "Transaction deleted successfully"
      );
    }
  );
