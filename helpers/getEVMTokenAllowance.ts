import {ERC20__factory} from "./ERC20";
import {ChainConfig} from "../types/types";
import {ethers} from "ethers";

type AllowanceCallProps = {
  address: string
  chainConfig: ChainConfig
  token: string
}

/**
 * Retrieves the allowance of a specified token for a given address on a specified chain.
 *
 * @param {AllowanceCallProps} props - The properties required to call the allowance function.
 * @param {string} props.address - The address of the wallet to check the allowance for.
 * @param {ChainConfig} props.chainConfig - The configuration of the blockchain network.
 * @param {string} props.token - The token symbol to check the allowance for.
 * @returns {Promise<number>} The allowance amount of the token.
 * @throws Will throw an error if the allowance retrieval fails.
 */
export const getEVMTokenAllowance = async (
  {
    address,
    chainConfig,
    token,
  }: AllowanceCallProps): Promise<number> => {
  const ethersProvider = new ethers.JsonRpcProvider(chainConfig.rpc)
  const tokenConfig = chainConfig.tokens[token]
  const tokenAddress = tokenConfig.address
  const bridgeContractAddress = chainConfig.contractAddress

  const erc20Contract = ERC20__factory.connect(tokenAddress, ethersProvider)
  const contractAllowance = await erc20Contract.allowance(address, bridgeContractAddress)
  return parseFloat(contractAllowance.toString()) / 10 ** tokenConfig.decimals
}
