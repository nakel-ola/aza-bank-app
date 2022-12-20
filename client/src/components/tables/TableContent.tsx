import clsx from "clsx";
import React, { HTMLAttributes } from "react";

interface TableContentProps extends HTMLAttributes<HTMLTableCellElement> {}

const TableContent = ({ children, className }: TableContentProps) => {
  return (
    <td
      className={clsx(
        "p-3 text-sm text-white whitespace-nowrap shrink-0",
        className
      )}
    >
      {children}
    </td>
  );
};

export default TableContent;
