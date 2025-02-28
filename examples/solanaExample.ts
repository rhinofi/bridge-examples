import 'dotenv/config'
import {getBridgeUserQuote} from "../services/getBridgeUserQuote";
import {getBridgeConfigs} from "../services/getConfigs";
import {commitBridgeUserQuote} from "../services/commitBridgeUserQuote";
import {getSolanaWallet} from "../helpers/solana/getSolanaWallet";
import {callSolanaBridgeContract} from "./contracts/solanaBridge";

const { RECIPIENT, RHINO_API_KEY} = process.env

const amount = '3'
const chainIn = 'SOLANA'
const chainOut = 'SCROLL'
const token = 'USDT'

const solanaBridge = async () => {
  const { wallet: solanaWallet } = getSolanaWallet()
  const solanaWalletAddress = solanaWallet.publicKey.toString()

  // Get the bridge configs - contains the chain and token information for the bridge
  const configs = await getBridgeConfigs()

  // Get a quote for the bridge - use the returned quoteId to commit the transaction
  const quote = await getBridgeUserQuote({
    amount,
    chainIn,
    chainOut,
    token,
    mode: 'receive',
    depositor: solanaWalletAddress,
    recipient: RECIPIENT,
  }, RHINO_API_KEY)

  if (!quote?.quoteId) {
    throw new Error('Failed to generate user quote.')
  }
  const commitResult = await commitBridgeUserQuote(quote.quoteId, RHINO_API_KEY)

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
