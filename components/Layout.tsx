"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const Layout = ({ children }: { children: React.ReactNode }) => {
  interface Page {
    index: number;
    label: string;
    path: string;
    isActive: boolean;
    orderClass: string;
  }
  const pathname = usePathname();
  const pages: Page[] = [
    {
      index: 0,
      label: "HOME",
      path: "/",
      isActive: pathname == "/",
      orderClass: "order-1",
    },
    {
      index: 1,
      label: "METRONOME",
      path: "/metronome",
      isActive: pathname == "/metronome",
      orderClass: "order-1",
    },
    {
      index: 2,
      label: "TUNER",
      path: "/tuner",
      isActive: pathname == "/tuner",
      orderClass: "order-1",
    },
  ];
  let isActiveFlag = false;
  for (let page of pages) {
    if (isActiveFlag) {
      page.orderClass = "order-3";
    }
    if (page.isActive) {
      isActiveFlag = true;
    }
  }

  return (
    <div className="flex flex-row">
      {pages.map((page) => (
        <div
          key={page.index}
          className={
            "flex flex-col w-16 h-screen border-x-2 items-center justify-between " +
            page.orderClass
          }
        >
          <div
            className={
              "text-lg " + (page.isActive ? "text-primary" : "text-current")
            }
          >
            0{page.index}
          </div>
          {page.index == 0 && <ThemeToggle />}
          <Link
            href={page.path}
            className={
              "text-xl origin-left translate-x-2/4 -rotate-90 justify-self-end " +
              (page.isActive ? "text-primary" : "text-current")
            }
          >
            {page.label}
          </Link>
        </div>
      ))}
      <main className="grow order-2">{children}</main>
    </div>
  );
};

export default Layout;
