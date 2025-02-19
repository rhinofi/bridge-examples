import 'dotenv/config'
import {tronAbi} from "../../helpers/tron/tronAbi";
import {BridgeContractCallProps} from "../../types/types";
import {getTronWallet} from "../../helpers/tron/getTronWallet";

export const callTronBridgeContract = async (
  {
    chainConfig,
    token,
    amount,
    commitmentId,
    callback,
    tronWalletAddress
  }: BridgeContractCallProps & {
    tronWalletAddress: string
  }) => {
  const tronWeb = getTronWallet()
  const tokenConfig = chainConfig.tokens[token]
  const amountWithDecimals = +amount * 10 ** tokenConfig.decimals
  const tokenAddress = tokenConfig.address
  const bridgeContractAddress = chainConfig.contractAddress

  const {
    abi
  } = await tronWeb.trx.getContract(tokenAddress);

  const trc20Contract = tronWeb.contract(abi.entrys, tokenAddress);
  const allowance = await trc20Contract.allowance(tronWalletAddress, bridgeContractAddress).call();
  const formattedAllowance = parseInt(allowance, 10) / 10 ** tokenConfig.decimals;

  if (formattedAllowance < parseFloat(amount)) {
     await trc20Contract.approve(bridgeContractAddress, amountWithDecimals).send()
  }

  const contract = tronWeb.contract(tronAbi, bridgeContractAddress)
  const txHash = await contract.depositWithId(tokenAddress, amountWithDecimals, `0x${commitmentId}`).send({shouldPollResponse: true})
  callback?.(txHash)

  return {transactionHash: txHash}
}
