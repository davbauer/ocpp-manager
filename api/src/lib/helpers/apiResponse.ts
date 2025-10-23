import type { Context } from "hono";

export interface ApiResponse<T = any> {
  message: string;
  data: T;
  total_count?: number;
}

export function successResponse<T>(
  c: Context,
  data: T,
  message: string = "Success",
  totalCount?: number,
  statusCode: 200 | 201 = 200
) {
  const response: ApiResponse<T> = {
    message,
    data,
  };

  if (totalCount !== undefined) {
    response.total_count = totalCount;
  }

  return c.json(response, statusCode);
}
