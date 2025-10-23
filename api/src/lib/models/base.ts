import {
  type Expression,
  type ExpressionBuilder,
  type Insertable,
  type Selectable,
  type Transaction,
  type Updateable,
} from "kysely";
import type { ExtractTableAlias } from "../../../node_modules/kysely/dist/esm/parser/table-parser.js";
import { HTTPException } from "hono/http-exception";
import type { DB } from "../db/DBTypes.js";
import { db } from "../db/db.js";

export function generateBaseModel<
  T extends keyof DB,
  PK extends Extract<keyof Selectable<DB[T]>, string>,
>(table: T, primaryKey: PK, updatedAtField?: keyof Updateable<DB[T]>) {
  /**
   * Utility type that filters out function properties and explicitly excludes `t`.
   */
  type DataOnly<T> = {
    [K in keyof T as K extends "t"
      ? never
      : T[K] extends (...args: any[]) => any
        ? never
        : K]: T[K];
  };

  type ChildType<M extends typeof BaseModel> = M & {
    new (options: Selectable<DB[typeof table]>): InstanceType<M>;
  };

  class BaseModel {
    protected static readonly tableName = table;
    protected static readonly primaryKey = primaryKey;

    /**
     * @deprecated This property will be removed soon. Instead of using `t`,
     * please access properties directly on the model instance.
     *
     * The `t` property is made non-enumerable to ensure it does not appear in JSON serialization.
     * This configuration helps prevent unnecessary data leakage and keeps the output clean when
     * instances of this model are sent in HTTP responses, for instance in Hono, where `JSON.stringify`
     * could otherwise expose internal properties unintentionally.
     */
    readonly t: Readonly<Selectable<DB[T]>>;

    constructor(options: Selectable<DB[T]>) {
      this.t = options;
      Object.assign(this, options);
    }

    /**
     * Returns a JSON-safe, type-safe representation of the instance,
     * excluding the `t` property and any functions. Can optionally filter by specific keys.
     *
     * @param keys - Optional array of keys to include in the output. If omitted, includes all data properties.
     */
    serialize<K extends keyof DataOnly<this>>(
      keys?: K[]
    ): Pick<DataOnly<this>, K> {
      const { t, ...publicProperties } = this;

      const dataOnlyProperties = Object.fromEntries(
        Object.entries(publicProperties).filter(
          ([_, value]) => typeof value !== "function"
        )
      ) as DataOnly<this>;

      if (keys) {
        const filteredProperties = Object.fromEntries(
          keys.map((key) => [key, dataOnlyProperties[key]])
        ) as Pick<DataOnly<this>, K>;

        return filteredProperties;
      }

      return dataOnlyProperties as Pick<DataOnly<this>, K>;
    }

    /**
     * Updates the record with the provided options and synchronizes the instance.
     * Optionally updates the `updated_at` field unless overridden by `options.noUpdateAtUpdate`.
     */
    async update(
      options: Updateable<DB[T]>,
      trx?: Transaction<DB>,
      optionsExtras?: { noUpdateAtUpdate?: boolean }
    ) {
      if (
        updatedAtField &&
        !optionsExtras?.noUpdateAtUpdate &&
        !(updatedAtField in options)
      ) {
        const fieldKey = updatedAtField as keyof Selectable<DB[T]>;
        const fieldValue = this.t[fieldKey];

        if (typeof fieldValue === "string") {
          options[updatedAtField as keyof Updateable<DB[T]>] =
            new Date().toISOString() as any;
        } else if (
          fieldValue instanceof Date ||
          !isNaN(new Date(String(fieldValue)).getTime())
        ) {
          options[updatedAtField as keyof Updateable<DB[T]>] =
            new Date() as any;
        } else {
          console.warn(
            `Unable to determine type for field '${String(
              updatedAtField
            )}' to update automatically.`
          );
        }
      }

      const result = await (trx ?? db)
        .updateTable(table as keyof DB)
        .set(options)
        .where(primaryKey as any, "=", this.t[primaryKey])
        .returningAll()
        .executeTakeFirstOrThrow();

      Object.assign(this.t, result);
      Object.assign(this, result);
    }

    /**
     * Deletes the record from the database.
     */
    async delete(trx?: Transaction<DB>) {
      await (trx ?? db)
        .deleteFrom(table)
        .where(primaryKey as any, "=", this.t[primaryKey])
        .execute();
    }

    /**
     * Inserts a new record in the database with the provided options.
     * Returns the created model instance.
     */
    static async insert<M extends typeof BaseModel>(
      this: ChildType<M>,
      options: Insertable<DB[T]>,
      trx?: Transaction<DB>
    ) {
      const result = await (trx ?? db)
        .insertInto(BaseModel.tableName)
        .values(options)
        .returningAll()
        .executeTakeFirstOrThrow();

      return new this(result) as InstanceType<M>;
    }

    /**
     * Finds a single record based on the provided expression builder.
     */
    static async findOne<M extends typeof BaseModel>(
      this: ChildType<M>,
      options: {
        eb?: (
          eb: ExpressionBuilder<DB, ExtractTableAlias<DB, T>>
        ) => Expression<any>;
      } = {},
      trx?: Transaction<DB>
    ) {
      const records = await this.findMany({ eb: options.eb, limit: 1 }, trx);
      return records.length > 0 ? records[0] : null;
    }

    /**
     * Finds multiple records based on the provided expression builder and limit.
     */
    static async findMany<M extends typeof BaseModel>(
      this: ChildType<M>,
      options: {
        eb?: (
          eb: ExpressionBuilder<DB, ExtractTableAlias<DB, T>>
        ) => Expression<any>;
        limit?: number;
        offset?: number;
        orderBy?: { column: keyof Selectable<DB[T]>; direction?: 'asc' | 'desc' };
      } = {},
      trx?: Transaction<DB>
    ) {
      const records = await (trx ?? db)
        .selectFrom(this.tableName)
        .$if(!!options.eb, (qb) => qb.where(options.eb!))
        .$if(!!options.orderBy, (qb) => 
          qb.orderBy(options.orderBy!.column as any, options.orderBy!.direction ?? 'asc')
        )
        .$if(!!options.limit, (qb) => qb.limit(options.limit!))
        .$if(!!options.offset, (qb) => qb.offset(options.offset!))
        .selectAll()
        .execute();

      return records.map(
        (record) =>
          new this(record as unknown as Selectable<DB[T]>) as InstanceType<M>
      );
    }

    /**
     * Counts records based on the provided expression builder.
     */
    static async count<M extends typeof BaseModel>(
      this: ChildType<M>,
      options: {
        eb?: (
          eb: ExpressionBuilder<DB, ExtractTableAlias<DB, T>>
        ) => Expression<any>;
      } = {},
      trx?: Transaction<DB>
    ) {
      const result = await (trx ?? db)
        .selectFrom(this.tableName)
        .$if(!!options.eb, (qb) => qb.where(options.eb!))
        .select((eb) => eb.fn.countAll<number>().as("count"))
        .executeTakeFirst();

      return Number(result?.count ?? 0);
    }

    /**
     * Finds one record based on the provided options or throws an HTTPException if not found.
     */
    static async findOneOrThrow<M extends typeof BaseModel>(
      this: ChildType<M>,
      options: {
        eb?: (
          eb: ExpressionBuilder<DB, ExtractTableAlias<DB, T>>
        ) => Expression<any>;
      } = {},
      trx?: Transaction<DB>
    ) {
      const record = await this.findOne(options, trx);
      if (!record) {
        throw new HTTPException(500, { message: "Error retrieving record." });
      }
      return record;
    }
  }

  return BaseModel;
}
