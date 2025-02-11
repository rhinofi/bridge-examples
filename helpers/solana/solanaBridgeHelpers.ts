import { PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddressSync } from '@solana/spl-token'
import { Buffer } from 'buffer'

export const getSolanaBridgeKey = async (bridgeContractAddress: string) => {
  const programId = new PublicKey(bridgeContractAddress)
  return PublicKey.findProgramAddressSync([Buffer.from('rhino_bridge')], programId)[0]
}

export const getSolanaPoolKey = async (bridgeContractAddress: string, mint: string) => {
  const programId = new PublicKey(bridgeContractAddress)
  const bridgeKey = await getSolanaBridgeKey(bridgeContractAddress)
  const mintId = new PublicKey(mint)
  return PublicKey.findProgramAddressSync([bridgeKey.toBuffer(), mintId.toBuffer()], programId)[0]
}

export const getSolanaPoolAuthority = async (bridgeContractAddress: string, mint: string) => {
  const programId = new PublicKey(bridgeContractAddress)
  const bridgeKey = await getSolanaBridgeKey(bridgeContractAddress)
  const mintId = new PublicKey(mint)
  return PublicKey.findProgramAddressSync(
    [bridgeKey.toBuffer(), mintId.toBuffer(), Buffer.from('authority')],
    programId,
  )[0]
}

export const getSolanaPoolTokenAccount = async (bridgeContractAddress: string, mint: string) => {
  const poolAuthority = await getSolanaPoolAuthority(bridgeContractAddress, mint)
  const mintId = new PublicKey(mint)
  return getAssociatedTokenAddressSync(mintId, poolAuthority, true)
}

export const getSolanaDepositorAccount = async (secondaryWalletAddress: string, mint: string) => {
  const mintId = new PublicKey(mint)
  const depositor = new PublicKey(secondaryWalletAddress)
  return getAssociatedTokenAddressSync(mintId, depositor, true)
}
