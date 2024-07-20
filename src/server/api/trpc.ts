import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "@/server/db";
import { cookies } from "next/headers";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

// Writing the Middlewares

const authMiddleware = t.middleware(async ({ next }) => {
  const token = cookies().get("token")?.value;

  if (!token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Please login first",
    });
  }

  const { email } = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

  return next({
    ctx: {
      email: email as string,
    },
  });
});

// Public (unauthenticated) procedure

export const publicProcedure = t.procedure;

// Private (authenticated) procedure

export const privateProcedure = t.procedure.use(authMiddleware);
