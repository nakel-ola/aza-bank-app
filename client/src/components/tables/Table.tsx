import React, { forwardRef, HTMLAttributes } from "react";

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  footerComponent?: React.ReactNode;
  headerComponent?: React.ReactNode;
}

const Table = (
  { children, footerComponent, headerComponent }: TableProps,
  ref: any
) => {
  return (
    <div
      ref={ref}
      className="bg-white dark:bg-dark rounded-lg overflow-auto my-8 flex flex-col w-full"
    >
      {headerComponent}
      <table className="w-full">{children}</table>
      {footerComponent}
    </div>
  );
};

Table.displayName = "Table";

export default forwardRef(Table);
