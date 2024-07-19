"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { Checkbox } from "@/components/ui/checkbox";
import { categories } from "@/constants/array";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { api } from "@/trpc/react";
import { useToast } from "./ui/use-toast";

const Main = ({ interests }: { interests: string[] }) => {
  const itemsPerPage = 6;
  const totalPagesNumber = Math.ceil(categories.length / itemsPerPage);
  const totalPages = Array.from({ length: totalPagesNumber }, (_, i) => i + 1);
  const maxPages = 7;

  const [elementsToRender, setElementsToRender] = useState([""]);
  const [pagesToRender, setPagesToRender] = useState(
    totalPages.slice(0, maxPages),
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(sessionStorage.getItem("currentPage") ?? "1"),
  );

  const utils = api.useUtils();

  const { toast } = useToast();

  const updateUser = api.user.updateUserInterests.useMutation({
    onSuccess: async () => {
      await utils.user.getMe.invalidate();
    },

    onError: () => {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        duration: 2000,
      });
    },
  });

  useEffect(() => {
    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;

    const currentCategories = categories.slice(firstItemIndex, lastItemIndex);

    setElementsToRender(currentCategories);

    // Session storage because to prevent the reset of pagination after refresh.
    sessionStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);

  return (
    <Card className="mt-10 w-[30rem] rounded-2xl border border-[#C1C1C1] p-5">
      <CardHeader>
        <CardTitle className="text-center text-[1.7rem] font-semibold">
          Please mark your interests!
        </CardTitle>
        <CardDescription className="my-5 text-center text-black">
          <p>We will keep you notified.</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <h2 className="text-[1.15rem] font-medium">My saved interests!</h2>
        <div className="my-5 space-y-4">
          {elementsToRender.map((element) => (
            <div key={uuidv4()} className="flex items-center gap-x-2">
              <Checkbox
                id={element.toLowerCase()}
                checked={interests.includes(element)}
                onCheckedChange={async (checked) => {
                  try {
                    await updateUser.mutateAsync({
                      interest: element,
                      interests: interests,
                      operation: checked ? "update" : "remove",
                    });
                  } catch (error) {
                    console.error(error);
                  }
                }}
                disabled={updateUser.isPending}
              />
              <label
                htmlFor={element.toLowerCase()}
                className={cn(
                  "cursor-pointer",
                  updateUser.isPending && "pointer-events-none",
                )}
              >
                {element}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex text-[#ACACAC]">
        <Button
          onClick={() => {
            setCurrentPage(1);

            const lastIndex = maxPages;
            const startIndex = lastIndex - maxPages;

            setPagesToRender(totalPages.slice(startIndex, lastIndex + 1));
          }}
          className="h-auto cursor-pointer bg-transparent px-0 py-0 text-inherit hover:bg-transparent"
          disabled={pagesToRender[0] === 1 || updateUser.isPending}
        >
          <MdKeyboardDoubleArrowLeft size={25} />
        </Button>
        <Button
          onClick={() => {
            setCurrentPage((prev) => prev - 1);

            setPagesToRender((prev) => prev.map((element) => element - 1));
          }}
          className="h-auto cursor-pointer bg-transparent px-0 py-0 text-inherit hover:bg-transparent"
          disabled={pagesToRender[0] === 1 || updateUser.isPending}
        >
          <MdKeyboardArrowLeft size={25} />
        </Button>
        <div className="mx-2 flex gap-x-3 text-[1.15rem]">
          {pagesToRender.map((element) => (
            <Button
              key={uuidv4()}
              onClick={(e) => {
                const targetPageNumber = parseInt(e.currentTarget.innerText);

                setCurrentPage(targetPageNumber);
              }}
              className={cn(
                "h-auto cursor-pointer bg-transparent px-0 py-0 text-[1.15rem] text-inherit hover:bg-transparent",
                element === currentPage && "text-black",
              )}
            >
              {element}
            </Button>
          ))}
          {pagesToRender[pagesToRender.length - 1] !== totalPagesNumber && (
            <span>...</span>
          )}
        </div>
        <Button
          onClick={() => {
            setCurrentPage((prev) => prev + 1);

            setPagesToRender((prev) => prev.map((element) => element + 1));
          }}
          className="h-auto cursor-pointer bg-transparent px-0 py-0 text-inherit hover:bg-transparent"
          disabled={
            pagesToRender[pagesToRender.length - 1] === totalPagesNumber ||
            updateUser.isPending
          }
        >
          <MdKeyboardArrowRight size={25} />
        </Button>
        <Button
          onClick={() => {
            setCurrentPage(totalPagesNumber);

            const lastIndex = totalPagesNumber;
            const startIndex = lastIndex - maxPages;

            setPagesToRender(totalPages.slice(startIndex, lastIndex + 1));
          }}
          className="h-auto cursor-pointer bg-transparent px-0 py-0 text-inherit hover:bg-transparent"
          disabled={
            pagesToRender[pagesToRender.length - 1] === totalPagesNumber ||
            updateUser.isPending
          }
        >
          <MdKeyboardDoubleArrowRight size={25} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Main;
