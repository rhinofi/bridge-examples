import {getBridgeUserHistory} from "./services/getBridgeUserHistory";
import {getBridgeStatus} from "./services/getBridgeStatus";

const {RHINO_API_KEY} = process.env

// Can use the commitment id when executing the bridge or the _id from the history endpoint
const bridgeId = 'your_bridge_id'

const getHistoryOrStatus = async () => {
  // Get the status of a bridge by the bridge id
  const status = await getBridgeStatus(bridgeId, RHINO_API_KEY)
  console.info('Bridge status:', status)

  // Get the user history
  const history = await getBridgeUserHistory(RHINO_API_KEY)
  console.info('User history:', history)
}

getHistoryOrStatus()