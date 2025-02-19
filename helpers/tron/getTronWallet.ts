import 'dotenv/config'
import {TronWeb, providers} from "tronweb";

const { TRON_PRIVATE_KEY } = process.env

if (!TRON_PRIVATE_KEY) {
  throw new Error('TRON_PRIVATE_KEY is required, add it to your .env file.')
}

export const getTronWallet = () => {
  return new TronWeb({
    fullHost: new providers.HttpProvider('https://api.shasta.trongrid.io'),
    // headers: { "TRON-PRO-API-KEY": 'your api key' }, -- if using a custom RPC
    privateKey: TRON_PRIVATE_KEY
  })
}