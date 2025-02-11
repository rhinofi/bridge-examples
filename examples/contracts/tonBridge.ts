import {beginCell, toNano, Address, TonClient, internal} from '@ton/ton'
import {getJettonWalletAddress} from "../../helpers/ton/getJettonWalletAddress";
import {BridgeContractCallProps} from "../../types/types";
import {getTonWallet} from "../../helpers/ton/getTonWallet";

/**
 * Calls the TON bridge contract to transfer tokens.
 *
 * @param {BridgeContractCallProps & {tonWalletAddress: string}} props - The properties required to call the bridge contract.
 * @returns {Promise<void>} The transaction receipt.
 * @throws Will throw an error if the transaction fails.
 */
export const callTonBridgeContract = async (
  {
    chainConfig,
    commitmentId,
    amount,
    token,
    tonWalletAddress,
  }: BridgeContractCallProps & {
    tonWalletAddress: string
  }): Promise<void> => {
  const tonClient = new TonClient({
    endpoint: chainConfig.rpc,
  })
  const {wallet, key} = await getTonWallet()
  const walletProvider = tonClient.open(wallet)
  const tokenConfig = chainConfig.tokens[token]
  const amountWithDecimals = +amount * 10 ** tokenConfig.decimals
  const tokenAddress = tokenConfig.address
  const bridgeContractAddress = chainConfig.contractAddress

  const jettonWalletContract = await getJettonWalletAddress(
    Address.parse(tonWalletAddress),
    Address.parse(tokenAddress),
    tonClient
  )
  const sourceAddress = Address.parse(tonWalletAddress)
  const destinationAddress = Address.parse(bridgeContractAddress)

  const forwardPayload = beginCell()
    .storeUint(BigInt(`0x${commitmentId}`), 96)
    .endCell()

  const forwardAmount = 0.02

  const body = beginCell()
    .storeUint(0xf8a7ea5, 32) // opcode for jetton transfer
    .storeUint(0, 64) // query id
    .storeCoins(BigInt(amountWithDecimals)) // jetton amount, amount * 10^9
    .storeAddress(destinationAddress) // TON wallet destination address
    .storeAddress(sourceAddress) // response excess destination
    .storeBit(0) // no custom payload
    .storeCoins(toNano(forwardAmount)) // forward amount (if >0, will send notification message)
    .storeBit(1) // we store forwardPayload as a reference
    .storeRef(forwardPayload)
    .endCell()

  const seqno: number = await walletProvider.getSeqno();

  return await walletProvider.sendTransfer({
    seqno,
    secretKey: key.secretKey,
    timeout: Math.floor(Date.now() / 1000) + 360,
    messages: [
      internal({
        to: jettonWalletContract.toString(),
        value: toNano(0.1),
        body: body,
      }),
    ],
  })
}
