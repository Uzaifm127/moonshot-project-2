import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { sendEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { privateProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      const user = await ctx.db.user.findFirst({
        where: {
          email,
        },
        select: {
          email: true,
          password: true,
        },
      });

      const isUserExist = !!user;

      if (!isUserExist) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Invalid email or password",
        });
      }

      const correctPassword = await bcrypt.compare(password, user.password);

      if (!correctPassword) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Invalid email or password",
        });
      }

      const token = jwt.sign({ email }, process.env.JWT_SECRET!);

      return { message: "Logged in successfully", token };
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input;

      const hashedPassword = await bcrypt.hash(password, 10);

      await ctx.db.user.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
        },
      });

      const token = jwt.sign({ email }, process.env.JWT_SECRET!);

      return { message: "Account created successfully", token };
    }),

  sendEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      // Checking the user if already exists or not.
      const userExists = !!(await ctx.db.user.findFirst({
        where: {
          email: input.email,
        },

        select: {
          email: true,
        },
      }));

      if (userExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exist",
        });
      }

      const code = await sendEmail(input.email);

      // Hashing the code because the code goes on the client side which get access by hacker.
      const hashedCode = await bcrypt.hash(code.toString(), 10);

      return hashedCode;
    }),

  verifyUser: publicProcedure
    .input(z.object({ code: z.string(), hashedCode: z.string() }))
    .mutation(async ({ input }) => {
      const { code, hashedCode } = input;

      const isCorrect = await bcrypt.compare(code, hashedCode);

      return isCorrect;
    }),

  getMe: privateProcedure.query(async ({ ctx }) => {
    const { email } = ctx;

    const user = await ctx.db.user.findFirst({
      where: {
        email,
      },

      select: {
        interests: true,
      },
    });

    return { user };
  }),

  updateUserInterests: privateProcedure
    .input(
      z.object({
        operation: z.enum(["update", "remove"]),
        interest: z.string(),
        interests: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { interest, operation, interests } = input;

      let dataToUpdate;

      if (operation === "update") {
        dataToUpdate = [...interests, interest];
      } else {
        dataToUpdate = interests.filter((element) => element !== interest);
      }

      await ctx.db.user.update({
        where: {
          email: ctx.email,
        },

        data: {
          interests: dataToUpdate,
        },
      });
    }),
});
