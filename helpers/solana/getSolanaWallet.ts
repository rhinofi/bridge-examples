import 'dotenv/config'
import { Keypair } from "@solana/web3.js";
import base58 from 'bs58'
import {Wallet} from "@coral-xyz/anchor";

const { SOLANA_PRIVATE_KEY } = process.env

if (!SOLANA_PRIVATE_KEY) {
  throw new Error('SOLANA_PRIVATE_KEY is required, add it to your .env file.')
}

export const getSolanaWallet = () => {
  const secretKey = base58.decode(SOLANA_PRIVATE_KEY)
  const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey))

  return {
    wallet: new Wallet(keypair),
    keypair
  }
}