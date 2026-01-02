import { sql } from "kysely";

/**
 * Energy Query Helpers for OCPP MeterValues
 * 
 * This module provides SQL query builders for extracting energy readings from
 * OCPP 1.6 MeterValues stored in PostgreSQL JSONB columns.
 * 
 * ## Background: SignedData (Eichrecht/OCMF) Issue
 * 
 * German calibration law (Eichrecht) compliant chargers (ABL, KEBA, go-e, Mennekes, etc.)
 * send signed meter values using the OCMF (Open Charge Metering Format) standard.
 * These values have `format: "SignedData"` and contain cryptographic signatures
 * instead of numeric values.
 * 
 * Example of SignedData value:
 * ```
 * "AP;0;3;ALC4OO6GFM73KDE62NLHK5FCZGFIKKQ7GM3MZ6PU;BIHEIWSHAAA..."
 * ```
 * or OCMF format:
 * ```
 * "OCMF|{\"FV\":\"1.0\",...}|{\"SD\":\"signature...\"}"
 * ```
 * 
 * These cannot be converted to NUMERIC and would cause PostgreSQL errors like:
 * `invalid input syntax for type numeric: "AP;0;3;..."`
 * 
 * ## Solution
 * 
 * All queries filter for records where:
 * 1. `format` field doesn't exist (normal numeric values - default is "Raw")
 * 2. OR `format` is explicitly NOT "SignedData"
 * 
 * This ensures only actual numeric energy readings are processed.
 * 
 * @see https://github.com/SAFE-eV/OCMF-Open-Charge-Metering-Format
 * @see OCPP 1.6 Specification - ValueFormat enum: "Raw" | "SignedData"
 */

// ============================================================================
// CONSTANTS - Define all values in one place for maintainability
// ============================================================================

/**
 * Constants for energy query patterns.
 * Defined first so they can be used in the SQL builder functions below.
 */
export const ENERGY_QUERY_CONSTANTS = {
  /** The OCPP measurand type for total imported energy */
  MEASURAND: "Energy.Active.Import.Register",
  
  /** Format value that indicates signed/encrypted data (to be excluded) */
  EXCLUDED_FORMAT: "SignedData",
  
  /** Default unit per OCPP specification when not specified */
  DEFAULT_UNIT: "Wh",
  
  /** 
   * Unit conversion multipliers to normalize all values to Wh (Watt-hours).
   * All energy calculations are done in Wh for consistency.
   */
  UNIT_MULTIPLIERS: {
    Wh: 1,
    kWh: 1000,
    MWh: 1000000,
  } as const,
} as const;

// Destructure for easier access
const { MEASURAND, EXCLUDED_FORMAT, DEFAULT_UNIT, UNIT_MULTIPLIERS } = ENERGY_QUERY_CONSTANTS;

/**
 * JSON path filter that matches valid numeric energy readings.
 * 
 * Filters:
 * - measurand must be "Energy.Active.Import.Register" (total imported energy)
 * - format must NOT be "SignedData" (excludes OCMF/Eichrecht signatures)
 * - format can be missing (defaults to "Raw" per OCPP spec)
 */
const VALID_ENERGY_FILTER = `@.measurand == "${MEASURAND}" && (!exists(@.format) || @.format != "${EXCLUDED_FORMAT}")`;

// ============================================================================
// SQL BUILDER FUNCTIONS
// ============================================================================

/**
 * Builds a SQL fragment for extracting energy values from meter_value JSON.
 * 
 * This function:
 * 1. Extracts the first matching sampledValue with valid numeric energy reading
 * 2. Converts the value to Wh (Watt-hours) based on the unit field
 * 3. Returns 0 if no valid reading exists (COALESCE protection)
 * 
 * Supported units (per OCPP 1.6):
 * - Wh (Watt-hours) - multiplier: ${UNIT_MULTIPLIERS.Wh}
 * - kWh (Kilowatt-hours) - multiplier: ${UNIT_MULTIPLIERS.kWh}
 * - MWh (Megawatt-hours) - multiplier: ${UNIT_MULTIPLIERS.MWh}
 * 
 * @param jsonColumn The JSON column reference (e.g., 'telemetry.meter_value' or 'tel.meter_value')
 * @returns SQL fragment that extracts and converts energy values to Wh
 * 
 * @example
 * ```typescript
 * db.selectFrom("telemetry")
 *   .select([buildEnergyValueSql("telemetry.meter_value").as("value_wh")])
 *   .where(buildEnergyExistenceCheck("telemetry.meter_value"))
 * ```
 */
export function buildEnergyValueSql(jsonColumn: string) {
  // Build the unit extraction path once
  const unitPath = `'$.raw[*].sampledValue[*] ? (${VALID_ENERGY_FILTER}).unit'`;
  const valuePath = `'$.raw[*].sampledValue[*] ? (${VALID_ENERGY_FILTER}).value'`;
  
  return sql<number>`
    COALESCE(
      (
        (TRIM(BOTH '"' FROM JSONB_PATH_QUERY_FIRST(
          ${sql.raw(jsonColumn)}::jsonb,
          ${sql.raw(valuePath)}
        )::TEXT))::NUMERIC
      )
      *
      CASE
        WHEN COALESCE(TRIM(BOTH '"' FROM JSONB_PATH_QUERY_FIRST(
          ${sql.raw(jsonColumn)}::jsonb,
          ${sql.raw(unitPath)}
        )::TEXT), ${DEFAULT_UNIT}) = 'kWh' THEN ${sql.raw(String(UNIT_MULTIPLIERS.kWh))}
        WHEN COALESCE(TRIM(BOTH '"' FROM JSONB_PATH_QUERY_FIRST(
          ${sql.raw(jsonColumn)}::jsonb,
          ${sql.raw(unitPath)}
        )::TEXT), ${DEFAULT_UNIT}) = 'MWh' THEN ${sql.raw(String(UNIT_MULTIPLIERS.MWh))}
        ELSE ${sql.raw(String(UNIT_MULTIPLIERS.Wh))}
      END,
      0
    )
  `;
}

/**
 * Builds a SQL condition for checking if telemetry has valid energy readings.
 * 
 * This check should ALWAYS be used as a WHERE condition before calling 
 * buildEnergyValueSql() to:
 * 1. Filter out rows that have no valid energy readings (performance optimization)
 * 2. Prevent NULL values in aggregations
 * 3. Leverage the GIN index on meter_value column for faster queries
 * 
 * @param jsonColumn The JSON column reference
 * @returns SQL fragment (boolean) that checks for presence of valid energy readings
 * 
 * @example
 * ```typescript
 * db.selectFrom("telemetry")
 *   .where(buildEnergyExistenceCheck("telemetry.meter_value"))
 *   .select([buildEnergyValueSql("telemetry.meter_value").as("value_wh")])
 * ```
 */
export function buildEnergyExistenceCheck(jsonColumn: string) {
  const existsPath = `'$.raw[*].sampledValue[*] ? (${VALID_ENERGY_FILTER})'`;
  
  return sql<boolean>`
    JSONB_PATH_EXISTS(
      ${sql.raw(jsonColumn)}::jsonb,
      ${sql.raw(existsPath)}
    )
  `;
}