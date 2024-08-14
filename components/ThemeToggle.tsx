"use client";

import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import cx from "clsx";
import { LuMoon, LuSun } from "react-icons/lu";
import classes from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });
  const computedColorScheme = useComputedColorScheme("dark");
  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };
  return (
    <ActionIcon
      onClick={toggleColorScheme}
      variant="transparent"
      size="xl"
      aria-label="Toggle color scheme"
      color="orange"
    >
      <LuSun className={cx(classes.icon, classes.light)} />
      <LuMoon className={cx(classes.icon, classes.dark)} />
    </ActionIcon>
  );
}
