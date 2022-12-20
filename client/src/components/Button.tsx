import clsx from "clsx";
import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = (props: ButtonProps) => {
  const { className, children, ...rest } = props;
  return <button className={clsx("px-3 mr-2 font-medium rounded-lg h-fit py-[4px] text-black bg-primary hover:scale-105 active:scale-95 transition-all duration-300 disabled:scale-100 disabled:opacity-40 whitespace-nowrap", className)} {...rest}>{children}</button>;
};

export default Button;
