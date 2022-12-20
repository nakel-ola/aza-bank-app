import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { decode } from "jsonwebtoken";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";
import useLocalStorage from "../hooks/useLocalStorage";
import useUser from "../hooks/useUser";
import { login, logout } from "../redux/features/userSlice";
import { clearStorage, getStorage } from "../utils/localStorage";

const Wrapper = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const access_token = getStorage<string | null>("access_token", null);

  const user = decode(access_token!) as any;

  const { getUser } = useUser();

  useEffect(() => {
    if (access_token) {
      getUser();
    }
  }, [getUser, access_token]);

  useEffect(() => {
    const route = () => {
      if (router.pathname !== "/") router.replace("/");
    };
    if (access_token && user) {
      if (user?.exp * 1000 < new Date().getTime()) {
        clearStorage("access_token");
        route();
      } else {
        if (router.pathname === "/") router.replace("/account");
      }
    } else route();
  }, [dispatch, router, user, access_token]);
  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-white dark:bg-dark">
      {children}
    </div>
  );
};

export default Wrapper;
