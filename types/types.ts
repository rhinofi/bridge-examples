export type ChainConfig = {
  rpc: string
  contractAddress: string
  nativeTokenName: string
  tokens: Record<string, {
    token: string
    address: string
    decimals: number
  }>
}

export type BridgeContractCallProps = {
  chainConfig: ChainConfig
  amount: string
  token: string
  commitmentId: string
  callback?: (txHash: string) => void
}
