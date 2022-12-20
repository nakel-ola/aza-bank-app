import React from "react";
import { TransactionType } from "../../../typing";
import Pagination from "../../components/Pagination";
import {
  Header,
  TableBody,
  TableHead,
  TableList,
} from "../../components/tables";
import Table from "../../components/tables/Table";
import TransactionCard from "./TransactionCard";

const tableList: TableList[] = [
  {
    title: "Receiver",
  },
  {
    title: "Amount",
  },
  {
    title: "Type",
  },
  {
    title: "Status",
  },
  {
    title: "CreatedAt",
  },
];

interface TransactionsProps {
  data: TransactionType[];
  title?: string;
  pageCount?: number;
  forcePage?: number;
  pageDescription?: string;
  rightComponent?: React.ReactNode;
  onPageChange?(event: React.ChangeEvent<unknown>, page: number): void;
}

const TransactionsCard = (props: TransactionsProps) => {
  const {
    data,
    pageCount = 0,
    onPageChange,
    forcePage,
    pageDescription,
    title = "Latest transactions",
    rightComponent,
  } = props;
  const items = data.map((item) => ({
    ...item,
    createdAt: new Date(item.createdAt),
  }));
  return (
    <div className="mt-10 pb-5">
      <Table
        headerComponent={
          <Header
            width="w-[500px]"
            title={title}
            showSearch={false}
            rightComponent={rightComponent}
          />
        }
        footerComponent={
          pageCount && pageCount > 0 ? (
            <Pagination
              breakLabel="•••"
              pageCount={pageCount}
              onPageChange={onPageChange}
              forcePage={forcePage}
              pageDescription={pageDescription}
            />
          ) : null
        }
      >
        <TableHead tableList={tableList} />
        <TableBody disableDivider={!(pageCount && pageCount > 0)}>
          {items.map((item: TransactionType) => (
            <TransactionCard key={item.id} {...item} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsCard;
