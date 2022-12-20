import { useRef } from "react";
import useOnClickOutside from "../hooks/useOnClickOutside";
import SidebarContent from "./SidebarContent";

interface Props {
  toggle: boolean;
  setToggle(value: boolean): void;
}
const Menubar = (props: Props) => {
  const { setToggle, toggle } = props;
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setToggle(false));
  return (
    <div
      className={
        toggle
          ? "fixed top-0 right-0 h-screen w-full lg:hidden bg-black/50 z-[9999999]"
          : "-z-50"
      }
    >
      <div ref={ref} className="w-[250px] bg-white dark:bg-dark -mt-2 h-full">
        <SidebarContent handleToggle={() => setToggle(false)}/>
      </div>
    </div>
  );
};

export default Menubar;
