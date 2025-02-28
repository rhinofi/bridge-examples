import 'dotenv/config'
import {Wallet} from "ethers";

const {API_URL} = process.env

/**
 * Generates an authentication message for the user to sign.
 *
 * @returns {
 *   message: string,
 *   createdAt: Date
 * } An object containing the message and the creation date.
 */
const getAuthMessageV3 = () => {
  const createdAt = new Date()
  return {
    message: `To protect your rhino.fi privacy we ask you to sign in with your wallet to see your data.
Signing in on ${createdAt.toUTCString()}. For your safety, only sign this message on rhino.fi!`,
    createdAt,
  }
}

/**
 * Authenticates the user by signing a message with their evm wallet and sending the signature to the server, returns a
 * temporary api key if successful to be used in subsequent requests.
 *  Only use this method if you have not received a personal api key from rhino.
 *
 * @param wallet
 * @returns {string} The api key from the authentication server.
 * @throws Will throw an error if authentication fails.
 */
export const authenticate = async (wallet: Wallet) => {
  try {
    const {message, createdAt} = getAuthMessageV3()
    const signature = await wallet.signMessage(message)

    const request = await fetch(`${API_URL}/authentication/auth/evm-signature/${wallet.address.toLowerCase()}`, {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        version: 3,
        signature,
        createdAt
      })
    })
    return request.json().then(data => data.jwt as string)
  } catch (error) {
    console.error(error)
    throw new Error('Failed to authenticate')
  }
}

