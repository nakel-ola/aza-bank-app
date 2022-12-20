import clsx from "clsx";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};
const CardTemplate = (props: Props) => {
  const { children, className } = props;
  return (
    <div
      className={clsx(
        "w-[95%] md:w-[80%] rounded-lg dark:bg-dark dark:shadow-black/30 bg-white shadow-sm overflow-hidden pb-2",
        className
      )}
    >
      {children}
    </div>
  );
};

export default CardTemplate;
