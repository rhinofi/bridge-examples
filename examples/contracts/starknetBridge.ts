import {CallData, cairo} from 'starknet'
import {BridgeContractCallProps} from "../../types/types";
import {getStarknetWallet} from "../../helpers/starknet/getStarknetWallet";

export const callStarknetBridgeContract = async (
  {
    chainConfig,
    token,
    commitmentId,
    amount,
    callback,
  }: BridgeContractCallProps) => {
  const { account, provider } = getStarknetWallet(chainConfig)
  const tokenConfig = chainConfig.tokens[token]
  const amountWithDecimals = +amount * 10 ** tokenConfig.decimals
  const tokenAddress = tokenConfig.address
  const bridgeContractAddress = chainConfig.contractAddress

  const depositAmount = cairo.uint256(amountWithDecimals)
  const id = `0x${commitmentId}`
  const multiCall = await account.execute([
    {
      contractAddress: tokenAddress,
      entrypoint: 'approve',
      calldata: CallData.compile({
        spender: bridgeContractAddress,
        amount: depositAmount,
      }),
    },
    {
      contractAddress: bridgeContractAddress,
      entrypoint: 'deposit_with_id',
      calldata: CallData.compile({
        token: tokenAddress,
        amount: depositAmount,
        commitment_id: id,
      }),
    },
  ])

  callback?.(multiCall.transaction_hash)

  const result = await provider.waitForTransaction(multiCall.transaction_hash)

  if ('revert_reason' in result && 'execution_status' in result) {
    if (result.execution_status === 'REVERTED') {
      throw new Error(result.revert_reason)
    }
  }

  return {transactionHash: multiCall.transaction_hash}
}
