import 'dotenv/config'
import {ethers, parseUnits} from 'ethers'
import {DVFDepositContract__factory} from "../../helpers/DVFDepositContract";
import {getEVMTokenAllowance} from "../../helpers/getEVMTokenAllowance";
import {ERC20__factory} from "../../helpers/ERC20";
import {BridgeContractCallProps} from "../../types/types";

const {EVM_PRIVATE_KEY} = process.env

/**
 * Calls the EVM bridge contract to deposit tokens or native currency.
 *
 * @param {BridgeContractCallProps} props - The properties required to call the bridge contract.
 * @param {ChainConfig} props.chainConfig - The configuration of the blockchain network.
 * @param {string} props.amount - The amount to be deposited.
 * @param {string} props.token - The token symbol to be deposited.
 * @param {string} props.commitmentId - The commitment ID for the deposit.
 * @param {function} [props.callback] - Optional callback function to be called with the transaction hash.
 * @returns {Promise<ethers.ContractTransactionReceipt | null>} The transaction receipt.
 * @throws Will throw an error if the transaction fails.
 */
export const callEvmBridgeContract = async (
  {
    chainConfig,
    amount,
    token,
    commitmentId,
    callback,
  }: BridgeContractCallProps): Promise<ethers.ContractTransactionReceipt | null> => {
  const wallet = new ethers.Wallet(EVM_PRIVATE_KEY, new ethers.JsonRpcProvider(chainConfig.rpc))
  const tokenConfig = chainConfig.tokens[token]
  const amountWithDecimals = +amount * 10 ** tokenConfig.decimals
  const tokenAddress = tokenConfig.address
  const bridgeContractAddress = chainConfig.contractAddress
  const isNativeToken = chainConfig.nativeTokenName === token

  const depositContract = DVFDepositContract__factory.connect(bridgeContractAddress, wallet)

  // For ERC20 tokens we call 'depositWithId' and for native tokens we call 'depositNativeWithId'
  if (!isNativeToken) {
    const allowance = await getEVMTokenAllowance({chainConfig, token, address: wallet.address})

    if (allowance === 0 || allowance < parseFloat(amount)) {
      const erc20Contract = ERC20__factory.connect(tokenAddress, wallet)
      const tx = await erc20Contract.approve(bridgeContractAddress, amountWithDecimals)
      await tx.wait()
    }

    const tx = await depositContract.depositWithId(tokenAddress, amountWithDecimals, BigInt(`0x${commitmentId}`))
    callback?.(tx.hash)
    return await tx.wait()
  }

  const tx = await depositContract.depositNativeWithId(BigInt(`0x${commitmentId}`), {
    value: parseUnits(amount, 'ether'),
  })
  callback?.(tx.hash)
  return await tx.wait()
}
