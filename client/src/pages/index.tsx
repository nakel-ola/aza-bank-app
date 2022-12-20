import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import ForgetCard from "../features/auth/ForgetCard";
import LogInCard from "../features/auth/LogInCard";
import PasswordCard from "../features/auth/PasswordCard";
import SignUpCard from "../features/auth/SignUpCard";

export default function Home() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const renderCard = () => {
    const toggle = router.query.type;
    
    switch (toggle) {
      case "signup":
        return <SignUpCard />;
      case "forget":
        return <ForgetCard />;
      case "confirm":
        return <PasswordCard />;

      default:
        return <LogInCard />;
    }
  };

  // https://storage.googleapis.com/aza-bank.appspot.com/logo.png
  return (
    <>
      <div className="w-screen h-screen grid place-items-center bg-slate-100 dark:bg-neutral-800">
        <Head>
          <title>Home</title>
          <meta name="description" content="" />
        </Head>

        {renderCard()}
      </div>
    </>
  );
}
