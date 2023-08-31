import {
  Web3Button,
  ConnectWallet,
  useAddress,
  useContract,
  useMetamask,
  useDisconnect,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import Head from "next/head";
import Image from "next/image";
import { NextPage } from "next";
import Header from "../components/Header";
import "tailwindcss/tailwind.css";
import Login from "../components/Login";
import Loading from "../components/Loading";
import { useState } from "react";
import { ethers } from "ethers";
import { currency } from "constants";
import CountdownTimer from "../components/CountdownTimer";
import toast, { Toaster } from "react-hot-toast";
import Web3 from "web3"; // Importera web3
import { toWei } from "web3-utils"; // Importera toWei från web3-utils

const Home: NextPage = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const address = useAddress();
  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  );
  const { data: remainingTickets } = useContractRead(
    contract,
    "RemainingTickets"
  );

  const { data: ticketPrice } = useContractRead(contract, "ticketPrice");
  const ticketPriceInEther = ticketPrice
    ? ethers.utils.formatEther(ticketPrice)
    : "0";

  const { data: currentWinningReward } = useContractRead(
    contract,
    "CurrentWinningReward"
  );

  const { data: ticketCommission } = useContractRead(
    contract,
    "ticketCommission"
  );

  const { data: expiration } = useContractRead(contract, "expiration");

  const { data: lastWinner } = useContractRead(contract, "lastWinner");
  const { data: lastWinnerAmount } = useContractRead(
    contract,
    "lastWinnerAmount"
  );

  const handleClick = async () => {
    if (!ticketPrice) return;

    const { mutateAsync: BuyTickets } = useContractWrite(
      contract,
      "BuyTickets"
    );

    const notification = toast.loading("Buying your tickets...");

    try {
      const data = await BuyTickets({
        value: ethers.utils.parseEther(
          (Number(ethers.utils.formatEther(ticketPrice)) * quantity).toString()
        ),
      });
      toast.success("Tickets purchased successfully!", {
        id: notification,
      });
      console.info("contract call success", data);
    } catch (err) {
      toast.error("Whoops something went wrong!", {
        id: "Notification",
      });
      console.error("Contract call failure", err);
    }
  };

  if (isLoading) return <Loading />;

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
      <div className="">
        <div className="space-y-5 md:space-y-0 md:flex md:flex-row items-start justify-center md:space-x-5">
          <div className="stats-container">
            <h1 className="text-5xl text-white font-semibold text-center">
              The Next Draw
            </h1>

            <div className="flex justify-between p-2 space-x-2">
              <div className="stats">
                <h2 className=" text-sm">Total Pool</h2>
                <p className="text-xl ">
                  {currentWinningReward &&
                    ethers.utils.formatEther(
                      currentWinningReward?.toString()
                    )}{" "}
                  {currency}
                </p>
              </div>
              <div className="stats">
                <h2 className="text-sm">Tickets Remaining</h2>
                <p className="text-xl">{remainingTickets?.toNumber()}</p>
              </div>
            </div>
            <div className="mt-5 mb-3">
              <CountdownTimer />
            </div>
          </div>
          <div className="stats-container space-y-2">
            <div>
              <div className="stats">
                <div className="flex justify-between items-center text-white pb-2">
                  <h2>Price per ticket: </h2>
                  <p>
                    {ticketPrice &&
                      ethers.utils.formatEther(ticketPrice?.toString())}{" "}
                    {currency}
                  </p>
                </div>
                <div className="flex text-white items-center space-x-2 bg-black p-4">
                  <p>TICKETS</p>
                  <input
                    className="flex w-full bg-transparent text-right outline-none"
                    type="number"
                    min={1}
                    max={10}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between text-emerald-300 text-sm italic font-extrabold">
                    <p>Total cost of tickets</p>
                    <p>
                      {ticketPrice &&
                        Number(
                          ethers.utils.formatEther(ticketPrice?.toString())
                        ) * quantity}{" "}
                      {currency}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-emerald-300 text-xs italic">
                    <p>Service fees</p>
                    <p>
                      {ticketCommission &&
                        ethers.utils.formatEther(
                          ticketCommission?.toString()
                        )}{" "}
                      {currency}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-emerald-300 text-xs italic">
                    <p>+ Network Fees</p>
                    <p>TBC</p>
                  </div>
                  <Web3Button
                    contractAddress="0x9109b4AdE0CAB5382261BC2Fb55e75f12B9211a1"
                    action={(contract) => {
                      contract.call("BuyTickets", [], {
                        value: ethers.utils.parseEther(
                          (Number(ticketPriceInEther) * quantity).toString()
                        ),
                      });
                    }}
                    style={{
                      backgroundColor: "#007bff",
                      color: "white",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                    disabled={
                      expiration?.toString() < Date.now().toString() ||
                      remainingTickets?.toNumber() === 0
                    }
                  >
                    BuyTickets
                  </Web3Button>
                </div>

                <button
                  disabled={
                    expiration?.toString() < Date.now().toString() ||
                    remainingTickets?.toNumber() == 0
                  }
                  className="mt-5 w-full bg-gradient-to-br from-orange-500 to-emerald-600 px-10 py-5 rounded-md text-white shadow-xl disabled:from-gray-600 disabled:to-gray-400 disabled:cursor-not-allowed disabled:text-gray-100"
                >
                  Buy tickets
                </button>

                <div>
                  <p>{lastWinner}</p>
                  <p>
                    {lastWinnerAmount &&
                      ethers.utils.formatEther(
                        lastWinnerAmount?.toString()
                      )}{" "}
                    {currency}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      // PRice per Tickets
    </main>
  );
};

export default Home;
