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
import Loading from "../components/Loading";



const Home: NextPage = () => {
  const address = useAddress();
  const {contract, isLoading} = useContract(process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS)

  
  if (isLoading) return <Loading />

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
      // Next draw
      <div className="space-y-5 md:space-y-0 md:flex md:flex-row items-start justify-center md:space-x-5">
        <div className="stats-container">
        <h1 className="text-5xl text-white font-semibold text-center">The Next Draw</h1>
        
        <div className="flex justify-between p-2 space-x-2">
          <div className="stats">
            <h2 className=" text-sm">Total Pool</h2>
          <p className="text-xl ">0.1 MATIC</p>
          </div>
          <div className="stats">
            <h2 className="text-sm">Tickets Remaining</h2>
            <p className="text-xl">100 Tickets</p>
          </div>
        </div>
        
      <div className="stats-container space-y-2">
        <div>
          <div className="stats">
            <div className="flex justify-between items-center text-white pb-2">
              <h2>Price per ticket</h2>
              <p>0.01 MATIC</p>
            </div>
            <div className="flex text-white items-center space-x-2 bg-black p-4">
              <p>TICKETS</p>
              <input className="flex w-full bg-transparent text-right outline-none" type="number" />
            </div>
          </div>
        </div>
      </div>
        </div>
        </div>
        
        // PRice per Tickets
        <div>
          <div>

          </div>
        </div>
    </main>
  );
};

export default Home;
