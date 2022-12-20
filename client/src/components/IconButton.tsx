import clsx from "clsx";
import React, { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

// {
//   children: ReactNode;
//   className?: string;
// }
const IconButton = (props: Props) => {
  const { children, className, ...rest } = props;
  return (
    <button
      className={clsx(
        "w-9 h-9 flex items-center justify-center mx-2 bg-slate-100 dark:bg-neutral-800 rounded-lg shrink-0 hover:scale-105 active:scale-95 transition-all duration-300",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default IconButton;
