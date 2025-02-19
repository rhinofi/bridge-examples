import 'dotenv/config'
import {Account, RpcProvider} from "starknet";
import {ChainConfig} from "../../types/types";


const { STARKNET_PRIVATE_KEY, STARKNET_WALLET_ADDRESS } = process.env

if (!STARKNET_PRIVATE_KEY || !STARKNET_WALLET_ADDRESS) {
  throw new Error('STARKNET_PRIVATE_KEY and STARKNET_WALLET_ADDRESS are required, add them to your .env file.')
}

export const getStarknetWallet = (chainConfig: ChainConfig) => {
  const provider = new RpcProvider({ nodeUrl: chainConfig.rpc });

  const account = new Account(provider, STARKNET_WALLET_ADDRESS, STARKNET_PRIVATE_KEY);
  return {
    account, provider, address: STARKNET_WALLET_ADDRESS
  }
}