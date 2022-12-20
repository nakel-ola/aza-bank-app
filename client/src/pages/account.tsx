import { gql, useQuery } from "@apollo/client";
import Head from "next/head";
import React from "react";
import { TransactionsResponse } from "../../typing";
import LoadingCard from "../components/LoadingCard";
import BalanceCard from "../features/home/BalanceCard";
import TransactionsCard from "../features/home/TransactionsCard";

export const TransactionsQuery = gql`
  query Transactions($input: GetTransactionsInput!) {
    transactions(input: $input) {
      page
      totalItems
      results {
        id
        amount
        receiverName
        type
        status
        createdAt
      }
    }
  }
`;

let limit = 10;

export default function Account() {
  const { data, loading } = useQuery<TransactionsResponse>(TransactionsQuery, {
    variables: { input: { page: 1, limit } },
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.table(err);
    },
  });

  return (
    <>
      <div className="w-full lg:w-[90%] h-full">
        <Head>
          <title>Account</title>
          <meta name="description" content="" />
        </Head>

        {loading ? (
          <div className="h-full grid place-items-center">
            <LoadingCard title="" />
          </div>
        ) : (
          <>
            {/* balance */}

            <BalanceCard />

            {/* latest transaction */}

            <TransactionsCard data={data?.transactions.results ?? []} />
          </>
        )}
      </div>
    </>
  );
}
