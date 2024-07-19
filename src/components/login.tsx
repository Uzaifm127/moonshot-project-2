"use client";

import React, { useCallback } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import type { loginSchema, signupSchema } from "@/lib/validator";
import type { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { useStore } from "@/store";
import { useToast } from "./ui/use-toast";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { setCookies } from "@/lib/actions/set-cookies";

const Login = () => {
  const utils = api.useUtils();

  const loginMutation = api.user.login.useMutation({
    onSuccess: async (data) => {
      toast({
        title: data.message,
        duration: 2000,
      });

      await setCookies(data.token);

      await utils.user.getMe.invalidate();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: error.message,
        duration: 2000,
      });
    },
  });

  const loginForm = useForm<z.infer<typeof signupSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { toast } = useToast();

  const { setAuthScreen } = useStore();

  const onSubmit = useCallback(
    async (data: z.infer<typeof loginSchema>) => {
      try {
        if (data.password.length < 8) {
          toast({
            variant: "destructive",
            title: "Password must be of 8 length.",
            duration: 2000,
          });
          return;
        }

        const { email, password } = data;

        await loginMutation.mutateAsync({ email, password });
      } catch (error) {
        console.error(error);
      }
    },
    [toast, loginMutation],
  );

  return (
    <Card className="mt-10 w-[30rem] rounded-2xl border border-[#C1C1C1] p-5">
      <CardHeader>
        <CardTitle className="mb-4 text-center text-2xl font-semibold">
          Login
        </CardTitle>
        <CardDescription className="space-y-4 text-center text-black">
          <h1 className="text-[1.4rem] font-medium">
            Welcome back to ECOMMERCE
          </h1>
          <p>The next gen business marketplace</p>
        </CardDescription>
      </CardHeader>
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-[#C1C1C1]"
                      type="email"
                      placeholder="Enter"
                      disabled={loginMutation.isPending}
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-[#C1C1C1]"
                      type="password"
                      placeholder="Enter"
                      disabled={loginMutation.isPending}
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col">
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="my-2 h-auto w-full bg-black py-4 font-medium uppercase tracking-[7%] hover:bg-black"
            >
              {loginMutation.isPending ? "Please wait..." : "Login"}
            </Button>

            <Separator color="#C1C1C1" className="my-5 w-full" />

            <p className="text-[#333333]">
              Don’t have an Account?{" "}
              <span
                onClick={() => setAuthScreen("signup")}
                className={cn(
                  "cursor-pointer text-[18px] font-medium uppercase text-black",
                  loginMutation.isPending && "pointer-events-none",
                )}
              >
                Sign up
              </span>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default Login;
