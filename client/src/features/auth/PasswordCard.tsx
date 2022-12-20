import { gql, useMutation } from "@apollo/client";
import { Eye, EyeSlash } from "iconsax-react";
import { useRouter } from "next/router";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Loading from "../../components/Loading";
import { forget, selectValidateUser } from "../../redux/features/userSlice";
import { setStorage } from "../../utils/localStorage";
import CardTemplate from "./CardTemplate";
import TitleCard from "./TitleCard";

const PasswordMutation = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      access_token
    }
  }
`;

type FormType = {
  password: string;
  confirmPassword: string;
};

const validateForm = (form: FormType): boolean => {
  const { confirmPassword, password } = form;
  if (
    password.length >= 8 &&
    confirmPassword.length >= 8 &&
    password === confirmPassword
  ) {
    return false;
  }
  return true;
};

const PasswordCard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const validate = useSelector(selectValidateUser);

  const [form, setForm] = useState<FormType>({
    password: "",
    confirmPassword: "",
  });
  const [toggle, setToggle] = useState(false);

  const [changePassword, { loading }] = useMutation(PasswordMutation);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setForm({ ...form, [target.name]: target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let loginToast = toast.loading("Loading......");

    await changePassword({
      variables: {
        input: {
          password: form.confirmPassword,
          ...validate,
        },
      },
      onCompleted: (data) => {
        setStorage("access_token", data.changePassword.access_token);
        toast.success("Successfully changed password", { id: loginToast });
        router.replace("/account");
        dispatch(forget(null));
      },
      onError: (error: any) => {
        toast.error(error.message, { id: loginToast });
        console.table(error);
      },
    });
  };

  useEffect(() => {
    if (!validate) {
      router.replace("?type=forget");
    }
  }, [validate, router]);

  return (
    <div className="w-[90%] lg:w-[40%] grid place-items-center h-full">
      <CardTemplate className="grid place-items-center pt-2 pb-5">
        <TitleCard title="Create New Password" />
        <form
          onSubmit={handleSubmit}
          className="w-[85%] grid place-items-center"
        >
          <Input
            placeholder="Password"
            id="password"
            name="password"
            type={toggle ? "text" : "password"}
            className="my-2"
            value={form.password}
            onChange={handleChange}
            endAdornment={
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  className="flex items-center justify-center w-[25px] h-[25px]"
                  onClick={() => setToggle(!toggle)}
                >
                  {toggle ? (
                    <EyeSlash
                      size={25}
                      variant="Bold"
                      className="dark:text-neutral-300 text-[20px] px-[2px] text-[#212121]"
                    />
                  ) : (
                    <Eye
                      size={25}
                      variant="Bold"
                      className="dark:text-neutral-300 text-[20px] px-[2px] text-[#212121]"
                    />
                  )}
                </button>
              </div>
            }
          />

          <Input
            placeholder="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            className="mt-4 my-2"
            type={toggle ? "text" : "password"}
            value={form.confirmPassword}
            onChange={handleChange}
            endAdornment={
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  className="flex items-center justify-center w-[25px] h-[25px]"
                  onClick={() => setToggle(!toggle)}
                >
                  {toggle ? (
                    <EyeSlash
                      size={25}
                      variant="Bold"
                      className="dark:text-neutral-300 text-[20px] px-[2px] text-[#212121]"
                    />
                  ) : (
                    <Eye
                      size={25}
                      variant="Bold"
                      className="dark:text-neutral-300 text-[20px] px-[2px] text-[#212121]"
                    />
                  )}
                </button>
              </div>
            }
          />

          {loading ? (
            <Loading type="spinningBubbles" className="my-5 text-blue-600" />
          ) : (
            <Button
              type="submit"
              className="my-5"
              disabled={validateForm(form)}
            >
              Confirm
            </Button>
          )}
        </form>
      </CardTemplate>
    </div>
  );
};

export default PasswordCard;
