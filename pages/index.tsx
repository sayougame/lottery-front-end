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
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { currency } from "../constants";
import CountdownTimer from "../components/CountdownTimer";
import toast, { Toaster } from "react-hot-toast";
import Marquee from "react-fast-marquee";
import AdminControls from "../components/AdminControls";

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
  const [userTickets, setUserTickets] = useState(0);
  const { data: tickets } = useContractRead(contract, "getTickets");
  const {data: winnings} = useContractRead(
    contract,
    "getWinningsForAddress",
    [address]
  );

  useEffect(() => {
    if (!tickets) return;

    const totalTickets: string[] = tickets;


  

    const noOfUserTickets = totalTickets.reduce(
      (total, ticketAddress) => (ticketAddress === address ? total + 1 : total),
      0
    );
    setUserTickets(noOfUserTickets);
  }, [tickets, address]);

  const {mutateAsync: WithdrawWinnings} = useContractWrite(
    contract,
    "WithdrawWinnings"
  );

  const onWithdrawWinnings = async () => {
    const notification = toast.loading("Withdrawing winnings...")

    try {
      const data = await WithdrawWinnings([{}]);

      toast.success("Winnings withdrawn successfully!", {
        id: notification,
      });

    } catch (err) {
      toast.error("Whoops something went wrong!", {
        id: notification,
      });
    }

  }

  const { data: isLotteryOperator } = useContractRead(
    contract,
    "lotteryOperator"
  );

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
      <div>
        {winnings > 0 && (
         <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5">
          <button onClick={onWithdrawWinnings} className="p-5 bg-emerald-500 animate-pulse text-center rounded-xl w-full">
            <p className="font-bold">Winner!</p>
            <p>Total Winning: {ethers.utils.formatEther(winnings.toString())}{" "}</p>
            <br />
            <p className="font-semibold">Click here to withdraw</p>

          </button>
         </div> 
        )}
      </div>
      
      <div className="flex text-center justify-center">
        <div className=" text-white text-xl m-10">
          <p className="text-emerald-300 text-xl italic font-bold animate-pulse">
            Last Winner
          </p>
          <Marquee gradient={false} speed={100}>
            <p>
              {lastWinner} - WON -{" "}
              {lastWinnerAmount &&
                ethers.utils.formatEther(lastWinnerAmount?.toString())}{" "}
              {currency}
            </p>
          </Marquee>
        </div>
      </div>

      <div>
        {isLotteryOperator === address && (
         <div className="flex justify-center">
          <AdminControls />
         </div> 
        )}
      </div>
      
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
                      color: "#ffffff",
                      padding: "1.25rem 2.5rem",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      fontSize: "16px",
                      marginTop: "1.25rem",
                      marginBottom: "0.25rem",
                      width: "100%",
                      backgroundColor: "#013F34",
                    }}
                  >
                    Buy {quantity} tickets for{" "}
                    {ticketPrice &&
                      Number(ethers.utils.formatEther(ticketPrice.toString())) *
                        quantity}{" "}
                    {currency}
                  </Web3Button>
                </div>
                {userTickets > 0 && (
                  <div className="stats">
                    <p className="text-lg mb-2">
                      You have {userTickets} tickets in this draw
                    </p>
                    <div className="flex max-w-sm flex-wrap gap-x-2 gap-y-2">
                      {Array(userTickets)
                        .fill("")
                        .map((_, index) => (
                          <p
                            key={index}
                            className="text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic"
                          >
                            {index + 1}
                          </p>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      <footer className="border-t border-emerald-500/20 flex items-center text-white justify-between p-5">  
        <p className="text-xs text-emerald-900 pl-5">
          DISCORD TWITTER BLABLA
        </p>
        </footer>
      </div>
    </main>
  );
};

export default Home;
