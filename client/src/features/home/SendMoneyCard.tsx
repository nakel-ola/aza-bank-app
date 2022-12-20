import { gql, useMutation } from "@apollo/client";
import { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "../../components/Button";
import Input from "../../components/Input";
import LoadingCard from "../../components/LoadingCard";
import PopupTemplate from "../../components/PopupTemplate";
import TextArea from "../../components/TextArea";
import useUser from "../../hooks/useUser";
import { handleClose } from "../../redux/features/popupSlice";

const SendTransactionMutation = gql`
  mutation SendTransaction($input: SendTransactionInput!) {
    sendTransaction(input: $input) {
      message
    }
  }
`;

interface Props {}

interface FormType {
  accountNumber: number;
  accountName: string;
  amount: number;
  description: string;
}

const validate = (form: FormType): boolean => {
  const { accountName, accountNumber, amount, description } = form;
  if (accountName.length > 0 && accountNumber > 0 && amount > 0) {
    return false;
  }
  return true;
};
const SendMoneyCard = (props: Props) => {
  const dispatch = useDispatch();

  const [sendTransaction, { error }] = useMutation(SendTransactionMutation);

  const [form, setForm] = useState<FormType>({
    accountNumber: 0,
    accountName: "",
    amount: 0,
    description: "",
  });
  const [loading, setLoading] = useState(false);
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

    await sendTransaction({
      variables: {
        input: {
          ...form,
          accountNumber: Number(form.accountNumber),
          amount: Number(form.amount),
        },
      },
      onCompleted: (data) => {
        getUser({
          onCompleted: () => {
            setLoading(false);
            close();
            console.log(data);
          },
        });
      },
      onError: (data) => {
        setLoading(false);
        console.table(data);
      },
    });
  };

  return (
    <PopupTemplate title="Send Money" onOutsideClick={close}>
      {!loading ? (
        <form
          onSubmit={handleSubmit}
          className="grid place-items-center w-full mt-3"
        >
          <Input
            className="w-[90%] my-2"
            placeholder="Account number"
            name="accountNumber"
            type="number"
            value={form.accountNumber}
            onChange={handleChange}
          />
          <Input
            className="w-[90%] my-2"
            placeholder="Account name"
            name="accountName"
            type="text"
            value={form.accountName}
            onChange={handleChange}
          />
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
            <Button type="submit" disabled={validate(form)}>
              Submit
            </Button>
          </div>
        </form>
      ) : (
        <LoadingCard title="Sending money" />
      )}
    </PopupTemplate>
  );
};

export default SendMoneyCard;
