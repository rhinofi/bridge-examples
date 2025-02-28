import 'dotenv/config'

const {API_URL} = process.env

/**
 * Commits a bridge user quote to the server.
 *
 * @param {string} quoteId - The quote id to commit.
 * @param {string} apiKey - The rhino api key for authorization.
 * @returns {Promise<Object>} The response from the server.
 * @throws Will throw an error if the request fails.
 */
export const commitBridgeUserQuote = async ( quoteId: string, apiKey: string) => {
  try {
    const request = await fetch(`${API_URL}/bridge/quote/commit/${quoteId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': apiKey,
      },
    })

    return await request.json()
  } catch (error) {
    console.error(error)
    throw new Error('Failed to commit bridge user quote.')
  }
}
