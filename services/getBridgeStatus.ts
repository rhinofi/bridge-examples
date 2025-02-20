import 'dotenv/config'

const {API_URL} = process.env

/**
 * Retrieves the bridge status for a given bridge ID from the server.
 *
 * @param {string} bridgeId - The ID of the bridge to retrieve the status for.
 * @param {string} apiKey - The API key for authorization.
 * @returns {Promise<Object>} The response from the server containing the bridge status.
 * @throws Will throw an error if the request fails.
 */
// https://api.rhino.fi/bridge/docs - see docs for the response schema
export const getBridgeStatus = async (bridgeId: string, apiKey: string) => {
  try {
    const request = await fetch(`${API_URL}/history/bridge/${bridgeId}`, {
      headers: {
        "content-type": "application/json",
        "authorization": apiKey
      },
      method: "GET",
    })

    return await request.json()
  } catch (error) {
    console.error(error)
    throw new Error('Failed to get user history.')
  }
}
