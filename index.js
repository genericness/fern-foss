import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fastify = Fastify({ logger: true });

await fastify.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
  prefix: "/" // serves files from root
});

fastify.server.on("upgrade", (req, socket, head) => {
  if (req.url.startsWith("/wisp/")) {
    wisp.routeRequest(req, socket, head);
  } else {
    socket.destroy();
  }
});

try {
  await fastify.listen({ port: 5001, host: "127.0.0.1" });
  console.log("Server running on http://127.0.0.1:5001");
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
