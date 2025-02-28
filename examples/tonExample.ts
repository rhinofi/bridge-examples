import 'dotenv/config'
import {getBridgeUserQuote} from "../services/getBridgeUserQuote";
import {getBridgeConfigs} from "../services/getConfigs";
import {commitBridgeUserQuote} from "../services/commitBridgeUserQuote";
import {callTonBridgeContract} from "./contracts/tonBridge";
import {getTonWallet} from "../helpers/ton/getTonWallet";
import {toUserFriendlyAddress} from "@tonconnect/sdk";

const { RECIPIENT, RHINO_API_KEY} = process.env

const amount = '3'
const chainIn = 'TON'
const chainOut = 'SCROLL'
const token = 'USDT'
const isTestnet = true

const tonBridge = async () => {
  const { wallet: tonWallet } = await getTonWallet()
  const tonWalletAddress = toUserFriendlyAddress(tonWallet.address.toRawString(), isTestnet)
  // Get the bridge configs - contains the chain and token information for the bridge
  const configs = await getBridgeConfigs()

  // Get a quote for the bridge - use the returned quoteId to commit the transaction
  const quote = await getBridgeUserQuote({
    amount,
    chainIn,
    chainOut,
    token,
    mode: 'receive',
    depositor: tonWalletAddress,
    recipient: RECIPIENT,
  }, RHINO_API_KEY)

  if (!quote?.quoteId) {
    throw new Error('Failed to generate user quote.')
  }
  const commitResult = await commitBridgeUserQuote(quote.quoteId, RHINO_API_KEY)

  const chainConfig = configs[chainIn]

  await callTonBridgeContract({
    chainConfig,
    amount: quote.payAmount,
    token,
    commitmentId: commitResult.quoteId,
    tonWalletAddress: tonWalletAddress,
    callback: (hash) => console.info('Transaction hash:', hash)
  })
}

tonBridge()
