import 'dotenv/config'
const {API_URL} = process.env

type BridgeUserQuotePayload = {
  amount: string // eg. 0.2
  chainIn: string // eg. TON
  chainOut: string // eg. SOLANA
  token: string // eg. ETH | USDT | USDC
  mode: string // eg. receive | pay
  depositor: string
  recipient: string
  amountNative?: string
}

/**
 * Fetches a bridge user quote from the server.
 *
 * @param {BridgeUserQuotePayload} payload - The payload containing quote details.
 * @param {string} apiKey - The rhino api key for authorization.
 * @returns {Promise<Object>} The response from the server containing the quote.
 * @throws Will throw an error if the request fails.
 */
// https://api.rhino.fi/bridge/docs - see docs for the response schema
export const getBridgeUserQuote = async ( payload: BridgeUserQuotePayload, apiKey: string) => {
  try {
    const request = await fetch(`${API_URL}/bridge/quote/user`, {
      headers: {
        "content-type": "application/json",
        "authorization": apiKey
      },
      method: "POST",
      body: JSON.stringify(payload)
    })

    return await request.json()
  } catch (error) {
    console.error(error)
    throw new Error('Failed to generate user quote.')
  }
}
