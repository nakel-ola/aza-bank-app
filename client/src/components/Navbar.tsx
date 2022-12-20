import { Moon, Notification, Sun1, HambergerMenu } from "iconsax-react";
import { useRouter } from "next/router";
import React from "react";
import capitalizeFirstLetter from "../utils/capitalizeFirstLetter";
import { useTheme } from "../utils/theme";
import IconButton from "./IconButton";

interface Props {
  handleToggle(): void
}
const Navbar = (props: Props) => {
  const { handleToggle } = props;
  const router = useRouter();
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <div className="flex items-center justify-between min-h-[50px] w-full lg:w-[90%] sticky top-0 z-10 bg-white dark:bg-dark">
      <div className="flex">
        <IconButton className="flex lg:hidden" onClick={handleToggle}>
          <HambergerMenu className="text-black dark:text-white" />
        </IconButton>
        <p className="font-medium text-xl text-black dark:text-white">
          {router.pathname === "/"
            ? "Accounts"
            : capitalizeFirstLetter(router.pathname.split("/")[1])}
        </p>
      </div>

      <div className="flex items-center ">
        {/* Moon icon */}
        <IconButton onClick={() => setTheme(isDark ? "light" : "dark")}>
          {isDark ? (
            <Sun1 className="text-black dark:text-white" />
          ) : (
            <Moon className="text-black dark:text-white" />
          )}
        </IconButton>

        {/* Notification icon */}
        <IconButton>
          <Notification className="text-black dark:text-white" />
        </IconButton>
      </div>
    </div>
  );
};

export default Navbar;
