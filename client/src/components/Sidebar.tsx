import clsx from "clsx";
import React from "react";
import SidebarContent from "./SidebarContent";

const Sidebar = () => {
  return (
    <div
      className={clsx(
        "w-[250px] border-r-[2px] border-slate-100 dark:border-neutral-800 h-full hidden lg:block bg-white dark:bg-dark",
      )}
    >
      <SidebarContent />
    </div>
  );
};

export default Sidebar;
