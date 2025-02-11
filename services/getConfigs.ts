import 'dotenv/config'
const {API_URL} = process.env

/**
 * Fetches the bridge configs from the server.
 *
 * @returns {Promise<Object>} The response from the server containing the bridge configs.
 * @throws Will throw an error if the request fails.
 */
// https://api.rhino.fi/bridge/docs - see docs for the response schema
export const getBridgeConfigs = async () => {
  try {
    const request = await fetch(`${API_URL}/bridge/configs`)

    return await request.json()
  } catch (error) {
    console.error(error)
    throw new Error('Failed to get bridge configs.')
  }
}