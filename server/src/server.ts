import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import ShortUniqueId from "short-unique-id";
import z from "zod";
import cors from "@fastify/cors";

const prisma = new PrismaClient({
  log: ["query"],
});

const start = async () => {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  fastify.get("/pools/count", async (req, res) => {
    const count = await prisma.pool.count();

    return { count };
  });

  fastify.get("/users/count", async (req, res) => {
    const count = await prisma.user.count();

    return { count };
  });

  fastify.get("/guesses/count", async (req, res) => {
    const count = await prisma.guess.count();

    return { count };
  });

  fastify.post("/pools", async (req, res) => {
    const createPoolBody = z.object({
      title: z.string(),
    });

    const { title } = createPoolBody.parse(req.body);

    const generate = new ShortUniqueId({ length: 6 });
    const code = String(generate()).toUpperCase();

    await prisma.pool.create({
      data: {
        title,
        code,
      },
    });

    return res.status(201).send({ code });
  });

  await fastify.listen({ port: 3333 /*host: "0.0.0.0"*/ });
};

start();
