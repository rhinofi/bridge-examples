import 'dotenv/config'
import {ethers} from "ethers";
import {authenticate} from "../services/authentication";
import {getBridgeUserQuote} from "../services/getBridgeUserQuote";
import {getBridgeConfigs} from "../services/getConfigs";
import {commitBridgeUserQuote} from "../services/commitBridgeUserQuote";
import {getSolanaWallet} from "../helpers/solana/getSolanaWallet";
import {callSolanaBridgeContract} from "./contracts/solanaBridge";

const {EVM_PRIVATE_KEY, RECIPIENT} = process.env

const wallet = new ethers.Wallet(EVM_PRIVATE_KEY)

const amount = '3'
const chainIn = 'SOLANA'
const chainOut = 'SCROLL'
const token = 'USDT'

const solanaBridge = async () => {
  const { wallet: solanaWallet } = getSolanaWallet()
  const solanaWalletAddress = solanaWallet.publicKey.toString()

  // Get the bridge configs - contains the chain and token information for the bridge
  const configs = await getBridgeConfigs()

  // Authenticate the user with their wallet and get a jwt token
  const { jwt } = await authenticate(wallet)

  // Get a quote for the bridge - use the returned quoteId to commit the transaction
  const quote = await getBridgeUserQuote(wallet.address, {
    amount,
    chainIn,
    chainOut,
    token,
    mode: 'receive',
    depositor: solanaWalletAddress,
    recipient: RECIPIENT,
  }, jwt)

  if (!quote?.quoteId) {
    throw new Error('Failed to generate user quote.')
  }
  const commitResult = await commitBridgeUserQuote(wallet.address, quote.quoteId, jwt)

  const chainConfig = configs[chainIn]

  await callSolanaBridgeContract({
    chainConfig,
    amount: quote.payAmount,
    token,
    commitmentId: commitResult.quoteId,
    callback: (hash) => console.info('Transaction hash:', hash)
  })
}

solanaBridge()
