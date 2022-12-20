import clsx from "clsx";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import React from "react";
import usePagination, { UsePaginationItem } from "../hooks/usePagination";
import useStateEffect from "../hooks/useStateEffect";

interface Props {
  pageCount: number;
  forcePage?: number;
  width?: string;
  breakLabel: string;
  onPageChange?(event: React.ChangeEvent<unknown>, page: number): void;
  pageDescription?: string;
}

const Pagination = (props: Props) => {
  const {
    pageCount,
    forcePage = 1,
    breakLabel,
    onPageChange,
    pageDescription,
  } = props;

  const [page, setPage] = useStateEffect<number>(forcePage, [forcePage]);

  const { pages, previous, next } = usePagination({
    count: pageCount,
    page,
    componentName: "paginate",
    onChange: (event, index) => {
      setPage(index);
      onPageChange?.(event, index);
    },
  });

  const renderPages = () =>
    pages.map((item: UsePaginationItem, index: number) => (
      <NumberCard
        key={index}
        selected={item.selected}
        onClick={item.onClick}
        page={
          ["start-ellipsis", "end-ellipsis"].includes(item.type)
            ? breakLabel
            : item.page
        }
      />
    ));

  return (
    <div className="md:w-full flex items-center justify-center lg:justify-between">
      <div className="mx-2 hidden lg:flex">
        <p className="font-medium text-neutral-600 dark:text-neutral-400">{pageDescription}</p>
      </div>
      <div className="flex items-center my-2 mx-2 rounded-xl border-[1.5px] border-slate-100 dark:border-neutral-800">
        <button
          disabled={previous.page === 0}
          className="h-[35px] w-[35px] flex items-center justify-center disabled:scale-100 hover:scale-105 active:scale-95 border-r-[1.5px] border-slate-100 dark:border-neutral-800"
          onClick={previous.onClick}
        >
          <ArrowLeft2
            size={25}
            className="text-neutral-700 dark:text-neutral-400"
          />
        </button>

        <div className="flex items-center w-fit overflow-hidden divide-x-[1.5px] divide-slate-100 dark:divide-neutral-800">
          {renderPages()}
        </div>

        <button
          disabled={next.page === pages.length + 1}
          className="h-[35px] w-[35px] flex items-center justify-center disabled:scale-100 hover:scale-105 active:scale-95 border-l-[1.5px] border-slate-100 dark:border-neutral-800"
          onClick={next.onClick}
        >
          <ArrowRight2
            size={25}
            className="text-neutral-700 dark:text-neutral-400"
          />
        </button>
      </div>
    </div>
  );
};

type NumberCardProps = {
  selected: boolean;
  page: number | string;
  onClick: React.ReactEventHandler;
};

const NumberCard = (props: NumberCardProps) => {
  const { selected, onClick, page } = props;
  return (
    <div className="flex">
      <button
        className={clsx(
          "text-center transitions-all ease duration-300 h-[35px] w-[35px] text-base font-medium hover:scale-105 active:scale-95",
          selected
            ? "bg-slate-200 dark:bg-neutral-700 text-black dark:text-white"
            : "text-neutral-700 dark:text-neutral-400"
        )}
        onClick={onClick}
      >
        {page}
      </button>
    </div>
  );
};

export default Pagination;
