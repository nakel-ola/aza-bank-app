import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Loading from "../../components/Loading";
import { forget } from "../../redux/features/userSlice";
import CardTemplate from "./CardTemplate";
import CodeInputs from "./CodeInputs";
import TitleCard from "./TitleCard";

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export const ForgetMutation = gql`
  mutation ForgetPassword($input: ForgetPasswordInput!) {
    forgetPassword(input: $input) {
      message
    }
  }
`;

const CodeMutation = gql`
  mutation ValidateCode($input: ValidateCodeInput!) {
    validateCode(input: $input) {
      validate
    }
  }
`;

const validateForm = (email: string, code: string): boolean => {
  if (email.match(emailRegex) && code.length === 5) {
    return false;
  }
  return true;
};

const ForgetCard = () => {
  const router = useRouter();

  const dispatch = useDispatch();

  const [email, setEmail] = useState<Required<string>>("");
  const [code, setCode] = useState<Required<string>>("");

  const [forgetPassword, { loading }] = useMutation(ForgetMutation);
  const [validateCode] = useMutation(CodeMutation);

  const getCode = async () => {
    let toaster = toast.loading("Requesting code...");

    await forgetPassword({
      variables: { input: { email } },
      onCompleted: (data) => {
        toast.success(data.forgetPassword.message, { id: toaster });
      },
      onError: (error: any) => {
        toast.error(error.message, { id: toaster });
        console.table(error);
      },
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let toaster = toast.loading("Loading......");

    await validateCode({
      variables: {
        input: {
          email,
          validationToken: code,
        },
      },
      onCompleted: (data) => {
        if (data.validateCode.validate) {
          router.push("?type=confirm");
          toast.success("Successfully Validated", { id: toaster });
          dispatch(forget({ email, validationToken: code }));
        } else {
          toast.error("Invalid Code", { id: toaster });
        }
      },
      onError: (error: any) => {
        toast.error(error.message, { id: toaster });
        console.error(error);
      },
    });
  };

  return (
    <div className="w-[90%] lg:w-[40%] grid place-items-center h-full">
      <CardTemplate className="grid place-items-center py-2">
        <TitleCard title="Forget your password..." />

        <form
          onSubmit={handleSubmit}
          className="w-[85%] grid place-items-center"
        >
          <Input
            placeholder="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <CodeInputs
            className="mt-4"
            value={code}
            onChange={(value) => setCode(value)}
          />

          <div className="w-[98%] mt-2 flex items-center justify-between">
            <p className=""></p>
            <button
              type="button"
              className="text-blue-600 hover:underline transition-all duration-300 disabled:text-gray-500 disabled:no-underline"
              onClick={getCode}
              disabled={!email.match(emailRegex)}
            >
              Get code
            </button>
          </div>

          {loading ? (
            <Loading type="spinningBubbles" className="my-5 text-blue-600" />
          ) : (
            <Button disabled={validateForm(email, code)} className="mt-5">
              Submit
            </Button>
          )}

          <div className="w-full flex items-center justify-center flex-col py-2">
            <div className="flex items-center justify-center mx-5">
              <p className="text-center text-black dark:text-white">
                By continuing, you agree to our{" "}
                <span className="text-blue-600 font-medium hover:underline cursor-pointer">
                  Terms
                </span>{" "}
                and
                <span className="ml-2 text-blue-600 font-medium hover:underline cursor-pointer">
                  Conditions.
                </span>
              </p>{" "}
            </div>
          </div>
        </form>
      </CardTemplate>
    </div>
  );
};

export default ForgetCard;
