import { ApolloServer } from "@apollo/server";
import "reflect-metadata";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import { resolvers } from "@generated/type-graphql";
import { buildSchema } from "type-graphql";

import { PrismaClient } from "@prisma/client";

startServer();

async function startServer() {
  const app = express();

  const schema = await buildSchema({
    resolvers,
    validate: false,
  });
  const httpServer = http.createServer(app);

  const server = new ApolloServer<{ prisma: PrismaClient }>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  const prisma = new PrismaClient();
  await prisma.$connect();
  await server.start();

  app.use(
    "/graphql",
    cors({
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token, prisma }),
    })
  );

  const PORT = parseInt(process?.env?.PORT || "4000");

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}
