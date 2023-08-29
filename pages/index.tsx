import {
  ConnectWallet,
  useAddress,
  useContract,
  useMetamask,
  useDisconnect,
} from "@thirdweb-dev/react";
import Head from "next/head";
import Image from "next/image";
import { NextPage } from "next";
import Header from "../components/Header";
import "tailwindcss/tailwind.css";
import Login from "../components/Login";

const Home: NextPage = () => {
  const address = useAddress();

  if (!address) return <Login />;
  return (
    <main className="bg-black min-h-screen flex flex-col">
      <Head>
        <title>Big Pig Lottery</title>
      </Head>
      <h1>Lets build an app</h1>

      <div>
        <Header />
      </div>
    </main>
  );
};

export default Home;
