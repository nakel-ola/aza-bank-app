import { gql, useMutation } from "@apollo/client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "../../components/Button";
import Input from "../../components/Input";
import LoadingCard from "../../components/LoadingCard";
import PopupTemplate from "../../components/PopupTemplate";
import TextArea from "../../components/TextArea";
import useUser from "../../hooks/useUser";
import { handleClose } from "../../redux/features/popupSlice";

// depositTransaction

const DepositeTransactionMutation = gql`
  mutation DepositTransaction($input: DepositTransactionInput!) {
    depositTransaction(input: $input) {
      message
    }
  }
`;
interface FormType {
  amount: number;
  description: string;
}

const DepositCard = () => {
  const dispatch = useDispatch();

  const [_, setLoading] = useState(false);

  const [depositTransaction, { error, loading }] = useMutation(
    DepositeTransactionMutation
  );

  const [form, setForm] = useState<FormType>({
    amount: 0,
    description: "",
  });

  const { getUser } = useUser(true);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const close = () => dispatch(handleClose());

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await depositTransaction({
      variables: {
        input: {
          ...form,
          amount: Number(form.amount),
        },
      },
      onCompleted: () => {
        getUser({
          onCompleted: () => {
            setLoading(false);
            close();
          },
        });
      },
      onError: (data) => {
        console.table(data);
        setLoading(false);
      },
    });
  };
  return (
    <PopupTemplate title="Deposit Money" onOutsideClick={close}>
      {!loading ? (
        <form
          onSubmit={handleSubmit}
          className="grid place-items-center w-full mt-3"
        >
          <Input
            className="w-[90%] my-2"
            placeholder="Amount"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
          />

          <TextArea
            className="w-[90%] my-2"
            placeholder="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          {error && (
            <div className="text-center">
              <p className="text-red-500">{error.message}</p>
            </div>
          )}

          <div className="my-2">
            <Button
              type="button"
              className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white"
              onClick={close}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!(form.amount > 0)}>
              Submit
            </Button>
          </div>
        </form>
      ) : (
        <LoadingCard title="Adding money" />
      )}
    </PopupTemplate>
  );
};

export default DepositCard;
