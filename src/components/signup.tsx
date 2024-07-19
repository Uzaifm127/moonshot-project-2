"use client";

import React, { useCallback } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import type { signupSchema } from "@/lib/validator";
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

const Signup = () => {
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const sendEmail = api.user.sendEmail.useMutation({
    onSuccess: (code) => {
      setUserDetails({ ...signupForm.getValues(), code });

      setAuthScreen("verifyEmail");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: error.message || "Something went wrong",
        duration: 2000,
      });
    },
  });

  const { toast } = useToast();

  const { setUserDetails, setAuthScreen } = useStore();

  const onSubmit = useCallback(
    async (data: z.infer<typeof signupSchema>) => {
      try {
        if (data.password.length < 8) {
          toast({
            variant: "destructive",
            title: "Password must be of 8 length.",
            duration: 2000,
          });
          return;
        }

        // Asynchronously mutation happens
        await sendEmail.mutateAsync({ email: data.email });
      } catch (error) {
        console.error(error);
      }
    },
    [toast, sendEmail],
  );

  return (
    <Card className="mt-10 w-[30rem] rounded-2xl border border-[#C1C1C1] p-5">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-semibold">
          Create your account
        </CardTitle>
      </CardHeader>
      <Form {...signupForm}>
        <form onSubmit={signupForm.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={signupForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-[#C1C1C1]"
                      placeholder="Enter"
                      disabled={sendEmail.isPending}
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={signupForm.control}
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
                      disabled={sendEmail.isPending}
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={signupForm.control}
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
                      disabled={sendEmail.isPending}
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
              disabled={sendEmail.isPending}
              className="my-2 h-auto w-full bg-black py-4 font-medium uppercase hover:bg-black"
            >
              {sendEmail.isPending
                ? "Creating your account..."
                : "Create account"}
            </Button>

            <Separator color="#C1C1C1" className="my-5 w-full" />

            <p className="text-[#333333]">
              Have an Account?{" "}
              <span
                onClick={() => setAuthScreen("login")}
                className={cn(
                  "cursor-pointer text-[18px] font-medium uppercase text-black",
                  sendEmail.isPending && "pointer-events-none",
                )}
              >
                Login
              </span>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default Signup;
