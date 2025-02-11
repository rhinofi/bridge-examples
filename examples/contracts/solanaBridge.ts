import {Connection, PublicKey} from '@solana/web3.js'
import {AnchorProvider, Program, BN} from '@coral-xyz/anchor'
import {
  getSolanaBridgeKey,
  getSolanaDepositorAccount,
  getSolanaPoolAuthority,
  getSolanaPoolKey,
  getSolanaPoolTokenAccount,
} from '../../helpers/solana/solanaBridgeHelpers'
import {IDL} from "../../helpers/solana/bridgeIDL";
import {BridgeContractCallProps} from "../../types/types";
import {getSolanaWallet} from "../../helpers/solana/getSolanaWallet";

export const callSolanaBridgeContract = async (
  {
    chainConfig,
    token,
    commitmentId,
    amount,
    callback,
  }: BridgeContractCallProps) => {
  const { wallet } = getSolanaWallet()
  const solanaWalletAddress = wallet.publicKey.toString()

  const tokenConfig = chainConfig.tokens[token]
  const amountWithDecimals = +amount * 10 ** tokenConfig.decimals
  const tokenAddress = tokenConfig.address
  const bridgeContractAddress = chainConfig.contractAddress

  const connection = new Connection(chainConfig.rpc)

  const options = AnchorProvider.defaultOptions()
  const anchorProvider = new AnchorProvider(connection, wallet, options)

  const depositor = new PublicKey(solanaWalletAddress)
  const bridgeKey = await getSolanaBridgeKey(bridgeContractAddress)
  const poolKey = await getSolanaPoolKey(bridgeContractAddress, tokenAddress)
  const poolAuthority = await getSolanaPoolAuthority(bridgeContractAddress, tokenAddress)
  const poolAccount = await getSolanaPoolTokenAccount(bridgeContractAddress, tokenAddress)
  const depositorAccount = await getSolanaDepositorAccount(solanaWalletAddress, tokenAddress)

  // @ts-ignore
  const program = new Program(IDL, bridgeContractAddress, anchorProvider)

  const accounts = {
    bridge: bridgeKey,
    pool: poolKey,
    poolAuthority,
    poolAccount: poolAccount,
    depositor,
    mint: new PublicKey(tokenAddress),
    depositorAccount: depositorAccount,
  }

  if (!program.methods?.['depositWithId']) {
    throw new Error('Program methods not found')
  }

  const depositTxHash = await program.methods['depositWithId'](new BN(amountWithDecimals), new BN(commitmentId, 'hex'))
    .accounts(accounts)
    .signers([])
    .rpc()

  await connection.getSignatureStatus(depositTxHash)
  callback?.(depositTxHash)

  return {transactionHash: depositTxHash}
}
