import 'dotenv/config'

const {API_URL} = process.env

/**
 * Retrieves the bridge user history from the server.
 *
 * @param {string} apiKey - The API key for authorization.
 * @returns {Promise<Object>} The response from the server containing the user history.
 * @throws Will throw an error if the request fails.
 */
// https://api.rhino.fi/bridge/docs - see docs for the response schema
export const getBridgeUserHistory = async (apiKey: string) => {
  try {
    const queryParams = new URLSearchParams({
      page: '1',
      limit: '20',
      sortBy: 'createdAt',
      sortDirection: 'desc',
    })
    const request = await fetch(`${API_URL}/bridge/history/user?${queryParams.toString()}`, {
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
