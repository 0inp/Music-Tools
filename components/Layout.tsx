"use client";

import { Anchor, Container, Flex, Text } from "@mantine/core";
import { usePathname } from "next/navigation";
import React from "react";
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
      orderClass: "1",
    },
    {
      index: 1,
      label: "METRONOME",
      path: "/metronome",
      isActive: pathname == "/metronome",
      orderClass: "1",
    },
    {
      index: 2,
      label: "TUNER",
      path: "/tuner",
      isActive: pathname == "/tuner",
      orderClass: "1",
    },
  ];
  let isActiveFlag = false;
  for (let page of pages) {
    if (isActiveFlag) {
      page.orderClass = "3";
    }
    if (page.isActive) {
      isActiveFlag = true;
    }
  }

  return (
    <Flex direction="row">
      {pages.map((page) => (
        <Flex
          key={page.index}
          direction="column"
          align="center"
          justify="space-between"
          w="xl"
          bd="1px solid dark.0"
          style={{ order: page.orderClass }}
          h="100vh"
        >
          <Text size="lg" c={page.isActive ? "orange.5" : "dimmed"}>
            0{page.index}
          </Text>
          {page.index == 0 && <ThemeToggle />}
          <Anchor
            href={page.path}
            underline="never"
            size="lg"
            c={page.isActive ? "orange.5" : "dimmed"}
            style={{
              "transform-origin": "left",
              rotate: "270deg",
              translate: "50% 0%",
            }}
          >
            {page.label}
          </Anchor>
        </Flex>
      ))}
      <Container style={{ flexGrow: "1", order: "2" }}>{children}</Container>
    </Flex>
  );
};

export default Layout;
