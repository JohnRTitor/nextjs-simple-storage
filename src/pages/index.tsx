import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import CommonHeader from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Head>
        <title>Blockchain Connect Demo!</title>
        <meta
          name="description"
          content="Demo for connecting to blockchain using Ethers.js, Next.js and Tailwind CSS."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CommonHeader />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        Hello World!
      </main>
    </div>
  );
}
