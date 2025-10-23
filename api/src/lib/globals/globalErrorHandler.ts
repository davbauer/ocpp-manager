import type { Context } from "hono";

import type { UnofficialStatusCode } from "hono/utils/http-status";

export const globalErrorHandler = (c: Context) => {
  if (!c.error) return;

  const humanReadableMessage = replaceErrorHumanReadable(c.error);

  console.info(`\
**************************\n\
** GLOBAL ERROR HANDLER **\n\
Cause: ${c.error.cause}\n\
Message: ${c.error.message}\n\
Name: ${c.error.name}\n\
RepondedWith: ${humanReadableMessage}\n\
** GLOBAL ERROR HANDLER **\n\
**************************`);

  c.res = c.json(
    {
      message: humanReadableMessage,
    },
    c.res.status as UnofficialStatusCode
  );
};

function replaceErrorHumanReadable(error: Context["error"]): string {
  /**
   * Unique constraint violation errors by postgres
   */
  const uniqueConstraintRegex =
    /duplicate key value violates unique constraint "(.*?)"/;
  let match = error?.message.match(uniqueConstraintRegex);
  if (match) {
    return "Entry already exists";
  }

  /**
   * Foreign key constrain errors by postgres
   */
  const regex =
    /update or delete on table "(.*?)" violates foreign key constraint "(.*?)" on table "(.*?)"/;
  match = error?.message.match(regex);
  if (match) {
    const tableName = match[1];
    const targetTable = match[3];

    return `${normalizeTableName(tableName, {
      firstCharUpper: true,
    })} is already used in ${normalizeTableName(targetTable)}`;
  }

  return error?.message ?? "Unknown Error";
}

function normalizeTableName(
  tableName: string,
  options: {
    firstCharUpper: boolean;
  } = { firstCharUpper: false }
): string {
  let normalized = tableName.replace(/_/g, " ");

  if (options.firstCharUpper) {
    normalized = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }

  return normalized;
}
