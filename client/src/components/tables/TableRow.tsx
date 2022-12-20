import clsx from "clsx";
import React, { HTMLAttributes } from "react";

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}
const TableRow = ({ children, className, onClick }: TableRowProps) => {
  return (
    <tr className={clsx("bg-white dark:bg-dark ", className)} onClick={onClick}>
      {children}
    </tr>
  );
};

export default TableRow;
