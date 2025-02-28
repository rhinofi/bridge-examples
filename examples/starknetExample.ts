import 'dotenv/config'
import {getBridgeUserQuote} from "../services/getBridgeUserQuote";
import {getBridgeConfigs} from "../services/getConfigs";
import {commitBridgeUserQuote} from "../services/commitBridgeUserQuote";
import {callStarknetBridgeContract} from "./contracts/starknetBridge";

const { RECIPIENT, STARKNET_WALLET_ADDRESS ,RHINO_API_KEY} = process.env

const amount = '0.0005'
const chainIn = 'STARKNET'
const chainOut = 'SCROLL'
const token = 'ETH'

const starknetBridge = async () => {
  // Get the bridge configs - contains the chain and token information for the bridge
  const configs = await getBridgeConfigs()

  const starknetWalletAddress = STARKNET_WALLET_ADDRESS

  if (!starknetWalletAddress) {
    throw new Error('Failed to get Tron wallet address.')
  }

  // Get a quote for the bridge - use the returned quoteId to commit the transaction
  const quote = await getBridgeUserQuote({
    amount,
    chainIn,
    chainOut,
    token,
    mode: 'receive',
    depositor: starknetWalletAddress,
    recipient: RECIPIENT,
  }, RHINO_API_KEY)

  if (!quote?.quoteId) {
    throw new Error('Failed to generate user quote.')
  }
  const commitResult = await commitBridgeUserQuote(quote.quoteId, RHINO_API_KEY)

  const chainConfig = configs[chainIn]

  callStarknetBridgeContract({
    chainConfig,
    amount: quote.payAmount,
    token,
    commitmentId: commitResult.quoteId,
    callback: (hash) => console.info('Transaction hash:', hash)
  })
}

starknetBridge()
