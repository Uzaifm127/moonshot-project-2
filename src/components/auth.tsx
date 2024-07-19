"use client";

import React from "react";
import Signup from "./signup";
import { useStore } from "@/store";
import Login from "./login";
import VerifyEmail from "./verify-email";

const Auth = () => {
  const { authScreen } = useStore();

  if (authScreen === "signup") {
    return <Signup />;
  } else if (authScreen === "verifyEmail") {
    return <VerifyEmail />;
  } else {
    return <Login />;
  }
};

export default Auth;
