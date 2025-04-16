import { createConfig, fallback, http, cookieStorage, createStorage } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { env } from "@/lib/env";

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

// environment variables are defined in .env.local
// make sure to set them in your .env.local file
// or on project's environment tab on Vercel
/// @dev: On Next, these environment variables have to be named
/// @ with the prefix NEXT_PUBLIC_, else they will not be available in the browser
/// and only be available in the server-side environment
const sepoliaRpcUrl = env.NEXT_PUBLIC_SEPOLIA_RPC_URL;
const mainnetRpcUrl = env.NEXT_PUBLIC_MAINNET_RPC_URL;

export const config = createConfig({
  chains: [mainnet, sepolia],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: fallback([http(mainnetRpcUrl)]),
    [sepolia.id]: fallback([
      http(sepoliaRpcUrl),
      http("https://ethereum-sepolia-rpc.publicnode.com"),
    ]),
  },
});
