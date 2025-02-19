import 'dotenv/config'
import {ethers} from "ethers";
import {authenticate} from "../services/authentication";
import {getBridgeUserQuote} from "../services/getBridgeUserQuote";
import {getBridgeConfigs} from "../services/getConfigs";
import {commitBridgeUserQuote} from "../services/commitBridgeUserQuote";
import {getTronWallet} from "../helpers/tron/getTronWallet";
import {callTronBridgeContract} from "./contracts/tronBridge";

const {EVM_PRIVATE_KEY, RECIPIENT} = process.env

const wallet = new ethers.Wallet(EVM_PRIVATE_KEY)

const amount = '3'
const chainIn = 'TRON'
const chainOut = 'SCROLL'
const token = 'USDT'

const tronBridge = async () => {
  // Get the bridge configs - contains the chain and token information for the bridge
  const configs = await getBridgeConfigs()

  const tronWeb = getTronWallet()
  const tronWalletAddress = tronWeb.defaultAddress.base58

  if (!tronWalletAddress) {
    throw new Error('Failed to get Tron wallet address.')
  }

  // Authenticate the user with their wallet and get a jwt token
  const { jwt } = await authenticate(wallet)

  // Get a quote for the bridge - use the returned quoteId to commit the transaction
  const quote = await getBridgeUserQuote(wallet.address, {
    amount,
    chainIn,
    chainOut,
    token,
    mode: 'receive',
    depositor: tronWalletAddress,
    recipient: RECIPIENT,
  }, jwt)

  if (!quote?.quoteId) {
    throw new Error('Failed to generate user quote.')
  }
  const commitResult = await commitBridgeUserQuote(wallet.address, quote.quoteId, jwt)

  const chainConfig = configs[chainIn]

  callTronBridgeContract({
    tronWalletAddress,
    chainConfig,
    amount: quote.payAmount,
    token,
    commitmentId: commitResult.quoteId,
    callback: (hash) => console.info('Transaction hash:', hash)
  })
}

tronBridge()
