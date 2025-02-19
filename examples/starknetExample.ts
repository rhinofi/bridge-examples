import 'dotenv/config'
import {ethers} from "ethers";
import {authenticate} from "../services/authentication";
import {getBridgeUserQuote} from "../services/getBridgeUserQuote";
import {getBridgeConfigs} from "../services/getConfigs";
import {commitBridgeUserQuote} from "../services/commitBridgeUserQuote";
import {callStarknetBridgeContract} from "./contracts/starknetBridge";

const {EVM_PRIVATE_KEY, RECIPIENT, STARKNET_WALLET_ADDRESS} = process.env

const wallet = new ethers.Wallet(EVM_PRIVATE_KEY)

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

  // Authenticate the user with their wallet and get a jwt token
  const { jwt } = await authenticate(wallet)

  // Get a quote for the bridge - use the returned quoteId to commit the transaction
  const quote = await getBridgeUserQuote(wallet.address, {
    amount,
    chainIn,
    chainOut,
    token,
    mode: 'receive',
    depositor: starknetWalletAddress,
    recipient: RECIPIENT,
  }, jwt)

  if (!quote?.quoteId) {
    throw new Error('Failed to generate user quote.')
  }
  const commitResult = await commitBridgeUserQuote(wallet.address, quote.quoteId, jwt)

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
