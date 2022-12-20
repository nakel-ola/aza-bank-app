import clsx from "clsx";
import { Edit2, Refresh } from "iconsax-react";
import React from "react";
import { NumericFormat } from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import IconButton from "../../components/IconButton";
import useUser from "../../hooks/useUser";
import { handleOpen } from "../../redux/features/popupSlice";
import { selectUser } from "../../redux/features/userSlice";


const BalanceCard = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const { getUser, loading } = useUser(true);

  return user ? (
    <div className="flex mt-10">
      <div className="mx-5 lg:mr-10 flex flex-col items-center">
        <div className="relative">
          <Avatar
            src={user?.photoUrl!}
            alt=""
            className="w-[100px] h-[100px] relative"
          />
          <label
            htmlFor="image"
            className="absolute top-0 right-0 bg-slate-100 rounded-lg dark:bg-neutral-800 hover:scale-105 active:scale-95 transition-all duration-300 ease-in cursor-pointer group"
          >
            <Edit2 className="text-black dark:text-white group-hover:scale-105 group-active:scale-95" />
          </label>
        </div>
        <p className="p-2 text-black dark:text-white font-medium text-lg whitespace-nowrap">
          {user?.lastName! + " " + user?.firstName!}
        </p>
      </div>
      {/* Avatar */}

      <div className="flex flex-col justify-between">
        {/* Your balance */}

        <div className="flex flex-col lg:flex-row">
          <Reel subtitle={user?.balance!} price title="Your Balance" />
          <Reel subtitle={user?.accountNumber!} title="Account Number" />
        </div>

        {/* Deposite */}

        <div className="my-2 ml-2">
          <Button onClick={() => dispatch(handleOpen({ type: "send" }))}>
            Send
          </Button>
          <Button onClick={() => dispatch(handleOpen({ type: "deposit" }))}>
            Deposit
          </Button>
        </div>
      </div>

      <IconButton className="ml-10 group" onClick={() => getUser()}>
        <Refresh
          className={clsx(
            "text-black dark:text-white",
            loading ? "animate-spin" : ""
          )}
        />
      </IconButton>
      {/* <input
        type="file"
        id="image"
        name="image"
        accept="image/*"
        multiple={false}
        className="hidden"
        onChange={(e) => handleChange?.(e)}
      /> */}
    </div>
  ) : null;
};

interface ReelProps {
  title: string;
  subtitle: string | number;
  price?: boolean;
}
const Reel = (props: ReelProps) => {
  const { subtitle, title, price } = props;
  return (
    <div className="mx-2 my-0">
      <p className="text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
        {title}
      </p>
      {price ? (
        <NumericFormat
          thousandSeparator
          displayType="text"
          value={Number(subtitle).toFixed(2)}
          prefix="₦ "
          renderText={(value: string) => (
            <p className="text-black dark:text-white text-xl font-medium whitespace-nowrap">
              {value}
            </p>
          )}
        />
      ) : (
        <p className="text-black dark:text-white text-xl font-medium whitespace-nowrap">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default BalanceCard;
