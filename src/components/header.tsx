import React from "react";
import { v4 as uuidv4 } from "uuid";
import Search from "./icons/search";
import ShoppingCart from "./icons/shopping-cart";
import ArrowLeft from "./icons/arrow-left";
import ArrowRight from "./icons/arrow-right";

const header = () => {
  return (
    <header>
      <div className="flex px-10 justify-end py-3">
        <ul className="flex items-center gap-x-5 text-[#333333]">
          <li>Help</li>
          <li>Orders & Returns</li>
          <li>Hi, John</li>
        </ul>
      </div>
      <div className="flex px-10 items-center justify-between py-3">
        <h2 className="text-3xl font-bold">ECOMMERCE</h2>
        <nav className="flex list-none gap-x-7 font-semibold">
          {["Categories", "Sale", "Clearance", "New stock", "Trending"].map(
            (item) => (
              <li key={uuidv4()}>{item}</li>
            ),
          )}
          <li></li>
        </nav>
        <div className="flex items-center gap-x-10">
          <Search />
          <ShoppingCart />
        </div>
      </div>
      <div className="flex items-center justify-center bg-[#F4F4F4] py-2">
        <div className="flex gap-x-7 items-center">
          <ArrowLeft />
          <p className="font-medium text-sm">Get 10% off on business sign up</p>
          <ArrowRight />
        </div>
      </div>
    </header>
  );
};

export default header;
