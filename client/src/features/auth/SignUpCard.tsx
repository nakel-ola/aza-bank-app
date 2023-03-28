import { gql, useMutation } from "@apollo/client";
import { Eye, EyeSlash } from "iconsax-react";
import { useRouter } from "next/router";
import React, { ChangeEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Loading from "../../components/Loading";
import { login } from "../../redux/features/userSlice";
import { setStorage } from "../../utils/localStorage";
import CardTemplate from "./CardTemplate";
import TitleCard from "./TitleCard";

const RegisterMutation = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      access_token
    }
  }
`;

interface FormType {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
}

var emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const validateForm = (data: FormType): boolean => {
  const { firstName, lastName, email, phoneNumber, password } = data;
  let name = firstName + " " + lastName;
  if (
    name.length >= 5 &&
    email.match(emailRegex) &&
    phoneNumber.toString().length >= 10 &&
    password.length >= 8
  ) {
    return false;
  }
  return true;
};

const SignUpCard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form, setForm] = useState<FormType>({
    email: "",
    lastName: "",
    firstName: "",
    phoneNumber: "",
    password: "",
  });

  const [toggle, setToggle] = useState(false);

  const [register, { loading }] = useMutation(RegisterMutation);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setForm({ ...form, [target.name]: target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let toaster = toast.loading("Loading......");

    await register({
      variables: { input: form },
      onCompleted: (data) => {
        setStorage("access_token", data.register.access_token);
        toast.success("Account created successfully", { id: toaster });
        router.replace("/account");
      },
      onError: (error: any) => {
        toast.error("Something went wrong", { id: toaster });
        console.table(error);
      },
    });
  };

  return (
    <div className="w-[90%] lg:w-[40%] grid place-items-center h-full">
      <CardTemplate className="grid place-items-center pt-2 pb-5">
        <TitleCard title="Create an account to continue..." />
        <form
          onSubmit={handleSubmit}
          className="w-[85%] grid place-items-center"
        >
          <div className="flex items-center">
            <Input
              className="my-2 mr-2"
              placeholder="First name"
              type="text"
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
            <Input
              className="my-2 ml-2"
              placeholder="Last name"
              type="text"
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>
          <Input
            className="my-2 mt-4"
            placeholder="Email"
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            className="my-2 mt-4"
            placeholder="Phone number"
            type="number"
            id="phoneNumber"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
          />
          <Input
            className="my-2 mt-4"
            placeholder="  Password"
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
              Create Account
            </Button>
          )}
          <div className="w-full flex items-center justify-start pb-2">
            <button
              type="button"
              className="text-blue-500 hover:underline transition-all duration-300 cursor-pointer font-medium"
              onClick={() => router.push("?type=login")}
            >
              Already have an account?{" "}
            </button>
          </div>
        </form>
      </CardTemplate>
    </div>
  );
};

export default SignUpCard;
