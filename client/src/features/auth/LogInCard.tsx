import { gql, useMutation } from "@apollo/client";
import { Eye, EyeSlash } from "iconsax-react";
import { useRouter } from "next/router";
import React, { ChangeEvent, useState } from "react";
import { toast } from "react-hot-toast";
import ReactLoading from "react-loading";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Loading from "../../components/Loading";
import { setStorage } from "../../utils/localStorage";
import CardTemplate from "./CardTemplate";
import TitleCard from "./TitleCard";

const LoginMutation = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      access_token
    }
  }
`;

var emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

type FormProps = {
  email: string;
  password: string;
};

const validateForm = (form: FormProps): boolean => {
  const { email, password } = form;

  if (email.match(emailRegex) && password.length >= 8) {
    return false;
  }

  return true;
};

const LogInCard = () => {
  const router = useRouter();
  const [form, setForm] = useState<FormProps>({ email: "", password: "" });

  const [toggle, setToggle] = useState(false);

  const [loginUser, { loading }] = useMutation(LoginMutation);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setForm({ ...form, [target.name]: target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let toster = toast.loading("Loading......");

    await loginUser({
      variables: { input: form },
      onCompleted: (data) => {
        setStorage("access_token", data.login.access_token);
        toast.success("Login Successfully", { id: toster });
        router.replace("/account");
      },
      onError: (error: any) => {
        toast.error(error.message, { id: toster });
      },
    });
  };

  return (
    <div className="w-[90%] lg:w-[40%] grid place-items-center h-full">
      <CardTemplate className="grid place-items-center pt-2 pb-5">
        <TitleCard title="Sign in to your account to continue..." />
        <form
          onSubmit={handleSubmit}
          className="w-[85%] grid place-items-center"
        >
          <Input
            className="my-2"
            placeholder="email"
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            className="my-2 mt-4"
            placeholder="password"
            id="password"
            name="password"
            type={toggle ? "text" : "password"}
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
          {loading ? (
            <Loading type="spinningBubbles" className="my-5 text-blue-600" />
          ) : (
            <Button
              type="submit"
              className="my-5"
              disabled={validateForm(form)}
            >
              Login
            </Button>
          )}
          <div className="w-full flex items-center justify-around pb-2">
            <button
              type="button"
              className="text-blue-500 hover:underline transition-all duration-300 cursor-pointer font-medium"
              onClick={() => router.push("/?type=signup")}
            >
              Don&rsquo;t have an account?{" "}
            </button>
            <button
              type="button"
              className="text-blue-500 hover:underline transition-all duration-300 cursor-pointer font-medium"
              onClick={() => router.push("?type=forget")}
            >
              Forget password?
            </button>
          </div>
        </form>
      </CardTemplate>
    </div>
  );
};

export default LogInCard;
