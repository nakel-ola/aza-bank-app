import { useQuery } from "@apollo/client";
import Head from "next/head";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { TransactionsResponse } from "../../typing";
import Button from "../components/Button";
import LoadingCard from "../components/LoadingCard";
import TransactionsCard from "../features/home/TransactionsCard";
import { handleOpen } from "../redux/features/popupSlice";
import { TransactionsQuery } from "./account";

let limit = 10;
export default function Transactions() {
  const dispatch = useDispatch();

  const [state, setState] = useState({
    page: 1,
    start: 1,
    end: 10,
  });

  const { data, loading, refetch } = useQuery<TransactionsResponse>(
    TransactionsQuery,
    {
      fetchPolicy: "network-only",
      variables: { input: { page: 1, limit } },
      onCompleted: (data) => {
        console.log(data);
      },
      onError: (err) => {
        console.table(err);
      },
    }
  );

  const { end, page, start } = state;

  const handlePage = async (_: any, nextPage: number) => {
    let start = (nextPage - 1) * limit,
      end = limit + start;
    setState({ ...state, page: nextPage, start: start + 1, end });
    await refetch({
      input: { page: nextPage, limit },
    });
  };

  let pageCount = !loading ? Math.floor(data?.transactions?.totalItems! / limit) : 0;

  let pageDescription = `Showing ${start} to ${end} of ${Math.floor(
    pageCount * limit
  )} results`;

  return (
    <>
      <Head>
        <title>Transactions</title>
        <meta name="description" content="" />
      </Head>
      <div className="w-full lg:w-[90%] h-full">
        {loading ? (
          <div className="h-full grid place-items-center">
            <LoadingCard title="" />
          </div>
        ) : (
          <TransactionsCard
            data={data?.transactions?.results as any}
            title="Transactions history"
            forcePage={data?.transactions.page ?? page}
            pageCount={pageCount}
            onPageChange={handlePage}
            pageDescription={pageDescription}
            rightComponent={
              <div className="mb-2 ml-2">
                <Button onClick={() => dispatch(handleOpen({ type: "send" }))}>
                  Send
                </Button>
                <Button
                  onClick={() => dispatch(handleOpen({ type: "deposit" }))}
                >
                  Deposit
                </Button>
              </div>
            }
          />
        )}
      </div>
    </>
  );
}
