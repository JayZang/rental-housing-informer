import axios from 'axios'
import { AddSubscriptionResponse } from './types' 

/**
 * 訂閱 591 租屋
 * @param authToken 
 * @param param 
 */
export async function addSubscription(
  authToken: string,
  param: {
    title: string,
    url: string
  }
): Promise<AddSubscriptionResponse> {
  const res = await axios.post('/api/591/subscribe', param, {
    headers: {
      'X-Auth': authToken
    }
  })

  return res.data
}