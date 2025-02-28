import 'dotenv/config'
import {ethers} from "ethers";
import {getBridgeUserQuote} from "../services/getBridgeUserQuote";
import {getBridgeConfigs} from "../services/getConfigs";
import {commitBridgeUserQuote} from "../services/commitBridgeUserQuote";
import {callEvmBridgeContract} from "./contracts/evmBridge";

const {EVM_PRIVATE_KEY, RHINO_API_KEY} = process.env

const wallet = new ethers.Wallet(EVM_PRIVATE_KEY)

const amount = '3'
const chainIn = 'SCROLL'
const chainOut = 'INK'
const token = 'USDT'

const evmBridge = async () => {
  // Get the bridge configs - contains the chain and token information for the bridge
  const configs = await getBridgeConfigs()

  // Get a quote for the bridge - use the returned quoteId to commit the transaction
  const quote = await getBridgeUserQuote({
    amount,
    chainIn,
    chainOut,
    token,
    mode: 'receive',
    depositor: wallet.address,
    recipient: wallet.address,
    amountNative: '0'
  }, RHINO_API_KEY)

  if (!quote?.quoteId) {
    throw new Error('Failed to generate user quote.')
  }
  // Commits the user quote to the server and returns the commitment id for the transaction
  const commitResult = await commitBridgeUserQuote(quote.quoteId, RHINO_API_KEY)

  if (!commitResult?.quoteId) {
    throw new Error('Failed to commit user quote.')
  }

  const chainConfig = configs[chainIn]

  await callEvmBridgeContract({
    chainConfig,
    amount: quote.payAmount,
    token,
    commitmentId: commitResult.quoteId,
    callback: (hash) => console.info('Transaction hash:', hash)
  })
}

evmBridge()
