import HomeClientSection from "@/components/HomeClientSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simple Storage Contract Demo",
  description: "Demo for interacting with the SimpleStorage contract",
};

export default function Home() {
  return <HomeClientSection />;
}
