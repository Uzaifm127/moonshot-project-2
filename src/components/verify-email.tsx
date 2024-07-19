"use client";

import React, { useCallback, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { useStore } from "@/store";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "./ui/use-toast";
import { api } from "@/trpc/react";
import { setCookies } from "@/lib/actions/set-cookies";

const VerifyEmail = () => {
  const { userDetails } = useStore();

  const utils = api.useUtils();

  const verifyUser = api.user.verifyUser.useMutation({
    onSuccess: async (verified) => {
      if (verified) {
        await createUser.mutateAsync(userDetails);

        if (createUser.isError) {
        } else {
          return;
        }
      } else {
        toast({
          variant: "destructive",
          title: "Invalid OTP",
          duration: 2000,
        });
      }
    },
  });

  const createUser = api.user.create.useMutation({
    onError: (error) => {
      toast({
        variant: "destructive",
        title: error.message,
        duration: 2000,
      });
    },
    onSuccess: async (data) => {
      toast({
        title: data?.message,
        duration: 2000,
      });

      await setCookies(data.token);

      await utils.user.getMe.invalidate();
    },
  });

  const [otp, setOpt] = useState<string>("");

  const { toast } = useToast();

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      try {
        e.preventDefault();

        if (!otp || otp.length < 8) {
          toast({
            variant: "destructive",
            title: "Enter OTP",
            duration: 2000,
          });
          return;
        }

        await verifyUser.mutateAsync({
          code: otp,
          hashedCode: userDetails.code,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [otp, toast, verifyUser, userDetails],
  );

  return (
    <Card className="mt-10 w-[30rem] rounded-2xl border border-[#C1C1C1] p-5">
      <CardHeader>
        <CardTitle className="mb-3 text-center text-3xl font-semibold">
          Verify your email
        </CardTitle>
        <CardDescription className="my-6 text-center text-base text-black">
          Enter the 8 digit code you have received on{" "}
          <span className="font-medium">
            {userDetails.name.slice(0, 3)}***@gmail.com
          </span>
        </CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="w-full space-y-1">
            <label htmlFor="otp" className="text-sm">
              Code
            </label>
            <InputOTP
              value={otp}
              onChange={(value) => setOpt(value)}
              maxLength={8}
              containerClassName="justify-between"
              disabled={verifyUser.isPending}
              required
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <InputOTPGroup key={uuidv4()}>
                  <InputOTPSlot
                    index={index}
                    className="border border-[#C1C1C1]"
                  />
                </InputOTPGroup>
              ))}
            </InputOTP>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={verifyUser.isPending || createUser.isPending}
            className="mb-2 mt-8 h-auto w-full bg-black py-4 font-medium uppercase hover:bg-black"
          >
            {verifyUser.isPending ? "Verfying. Please wait..." : "Verify"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default VerifyEmail;
