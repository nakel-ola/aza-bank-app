import clsx from "clsx";
import { Blur, Logout, Repeat, Setting, User } from "iconsax-react";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/features/userSlice";
import { clearStorage } from "../utils/localStorage";

const SidebarContent = ({ handleToggle }: { handleToggle?(): void }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const items = [
    {
      Icon: User,
      title: "My Account",
      path: "/account",
    },
    {
      Icon: Repeat,
      title: "Transactions",
      path: "/transactions",
    },
    {
      Icon: Setting,
      title: "Settings",
      path: "/settings",
    },
    {
      Icon: Logout,
      title: "Logout",
      path: null,
    },
  ];

  const match = (path: string | null) => {
    return router.pathname === path;
  };
  return (
    <div className="">
      {/* Logo */}

      <div className="flex items-center m-2">
        <span className="w-9 h-9 flex items-center justify-center">
          <Blur variant="Bold" size={25} className="text-primary" />
        </span>

        <p className="font-medium text-xl text-primary">Aza Bank</p>
      </div>

      {/* sidebar items */}

      <div className="mt-10">
        {items.map(({ Icon, title, path }, index: number) => (
          <button
            key={index}
            className={clsx(
              "flex items-center m-2 font-medium w-[92%] rounded-lg px-2 hover:scale-105 active:scale-95 transition-all duration-300 my-4",
              match(path)
                ? "bg-primary text-black"
                : "bg-transparent hover:bg-slate-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-400"
            )}
            onClick={() => {
              if (path) router.push(path);
              else {
                clearStorage("access_token");
                router.push("/")
                dispatch(logout())
              }
              handleToggle?.();
            }}
          >
            <span className="w-9 h-9 flex items-center justify-center mr-1">
              <Icon
                className={clsx(
                  "",
                  match(path)
                    ? "text-black"
                    : "text-neutral-700 dark:text-neutral-400"
                )}
              />
            </span>
            {title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SidebarContent;
