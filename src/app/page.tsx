"use client";

import Auth from "@/components/auth";
import Main from "@/components/main";
import { api } from "@/trpc/react";
import { useRef } from "react";

export default function Home() {
  const screenRef = useRef<JSX.Element>();

  const query = api.user.getMe.useQuery();

  if (query.error?.data?.code === "UNAUTHORIZED") {
    screenRef.current = <Auth />;
  } else if (query.isSuccess && query.data.user) {
    screenRef.current = <Main interests={query.data.user.interests} />;
  } else if (query.isPending) {
    screenRef.current = (
      <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">
        Loading...
      </h1>
    );
  }

  return (
    <main className="flex justify-center pb-10">
      <div className="bg-[#cacaca] left-10 absolute z-50 pointer-events-none top-3 select-none rounded-lg px-4 py-2 font-semibold uppercase opacity-60">
        made by uzaif
      </div>
      {screenRef.current}
    </main>
  );
}
