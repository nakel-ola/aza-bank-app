import React, { ReactNode, useState } from "react";
import { useSelector } from "react-redux";
import Menubar from "../components/Menubar";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DepositCard from "../features/home/DepositCard";
import SendMoneyCard from "../features/home/SendMoneyCard";
import { selectPopup } from "../redux/features/popupSlice";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const popupState = useSelector(selectPopup);
  const [toggle, setToggle] = useState(false);
  return (
    <>
      {toggle && <Menubar toggle={toggle} setToggle={setToggle} />}
      <div className="w-[100vw] md:w-[100vw] 2xl:w-[1000px] flex h-screen">
        <Sidebar />

        <main className="w-full lg:w-[calc(100%-220px)] flex flex-col items-center h-full overflow-y-scroll">
          <Navbar handleToggle={() => setToggle(!toggle)} />
          {children}
        </main>
      </div>

      {popupState.open && (
        <>
          {popupState.type === "send" && <SendMoneyCard />}
          {popupState.type === "deposit" && <DepositCard />}
        </>
      )}
    </>
  );
};

export default AppLayout;
