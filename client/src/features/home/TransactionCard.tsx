import clsx from "clsx";
import React from "react";
import { NumericFormat } from "react-number-format";
import { TableContent, TableRow } from "../../components/tables";
import { statusColor } from "../../utils/statusColor";

interface Props {
  id: string;
  description: string;
  amount: number;
  status: string;
  createdAt: Date;
  senderName: string;
  receiverName: string;
  type: string;
}
const TransactionCard = (props: Props) => {
  const { amount, createdAt, description, id, receiverName, type, status } =
    props;

  const items = [
    receiverName,
    amount,
    type,
    status,
    new Date(createdAt).toDateString(),
  ];

  return (
    <TableRow className="cursor-pointer">
      {items.map((item, index) => (
        <TableContent key={index}>
          {index === 1 ? (
            <NumericFormat
              thousandSeparator
              displayType="text"
              value={Number(item).toFixed(2)}
              prefix="₦ "
              renderText={(value: string) => (
                <p className="text-sm font-medium whitespace-nowrap text-neutral-800 dark:text-neutral-300">
                  {value}
                </p>
              )}
            />
          ) : (
            <p
              className={clsx(
                "text-sm font-medium whitespace-nowrap",
                index === 3
                  ? statusColor(item as string)
                  : "text-neutral-800 dark:text-neutral-300"
              )}
            >
              {item}
            </p>
          )}
        </TableContent>
      ))}
    </TableRow>
  );
};

export default TransactionCard;
