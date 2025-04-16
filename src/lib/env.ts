import zod from "zod";

// we don't need to load dotenv as next does it for us
const envSchema = zod.object({
  NEXT_PUBLIC_SEPOLIA_RPC_URL: zod.string().url().nonempty(),
  NEXT_PUBLIC_MAINNET_RPC_URL: zod.string().url().nonempty(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  throw new Error("Invalid environment variables.");
}

export const env = parsed.data;
