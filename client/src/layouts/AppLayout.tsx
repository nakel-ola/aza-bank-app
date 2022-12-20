import React, { ChangeEvent, ReactNode, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menubar from "../components/Menubar";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DepositCard from "../features/home/DepositCard";
import ImageCard from "../features/home/ImageCard";
import SendMoneyCard from "../features/home/SendMoneyCard";
import { handleOpen, selectPopup } from "../redux/features/popupSlice";
import { toBase64 } from "../utils/toBase64";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const popupState = useSelector(selectPopup);
  const [toggle, setToggle] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newUrl = await toBase64(file);
      setFile(file);
      dispatch(handleOpen({ type: "image", data: newUrl }));
    }
  };
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
          {popupState.type === "image" && <ImageCard file={file} setFile={setFile} />}
        </>
      )}

      <input
        type="file"
        id="image"
        name="image"
        accept="image/*"
        multiple={false}
        className="hidden"
        onChange={(e) => handleChange?.(e)}
      />
    </>
  );
};

export default AppLayout;
