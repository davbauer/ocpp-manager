import path from "path";
import { Hono, type Context } from "hono";
import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { serveStatic } from "@hono/node-server/serve-static";
import { api } from "./routes/index";
import { logger } from "./lib/globals/logger";
import { cors } from "hono/cors";
import { globalErrorHandler } from "./lib/globals/globalErrorHandler";

export function createApp() {
  const staticPath = "./build";
  const staticPathFallbackFile = path.join(staticPath, "index.html");

  const app = new Hono()
    .use(cors())
    .use(async (c: Context, next) => {
      await next();
      globalErrorHandler(c);
    })
    // .use(customLogger)
    .use("*", serveStatic({ root: staticPath }));

  const nodeWs = createNodeWebSocket({ app });

  const typedApp = app.route("/api", api(nodeWs));

  typedApp.use("*", serveStatic({ path: staticPathFallbackFile }));

  const server = serve(
    {
      fetch: app.fetch,
      port: 3000,
    },
    (info) => {
      logger.http(`Listening on http://0.0.0.0:${info.port}`);
    }
  );

  // Gracefully handle socket errors (e.g., ECONNRESET from abrupt client disconnections)
  server.on("connection", (socket) => {
    socket.on("error", (err: NodeJS.ErrnoException) => {
      logger.warn("Socket error", { code: err.code, message: err.message });
    });
  });

  nodeWs.injectWebSocket(server);

  return typedApp;
}

export const app = createApp();
export type AppType = ReturnType<typeof createApp>;
