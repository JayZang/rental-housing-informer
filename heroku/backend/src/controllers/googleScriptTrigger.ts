import express, { Request, Response } from 'express'
import {
  Client,
  TextMessage,
  ImageMessage
} from '@line/bot-sdk'
import util591 from '../util/591'
import lineConfig from '../config/line'
import User, { UserDocumentType } from '../models/User'
import { SubscriptionRecordType } from '../models/RentalSubscriptionRecord591'

const router = express.Router()
const lineClinet = new Client(lineConfig)

router.get('/hours', handleHoursEvent)

export default router

////////// Router Functions //////////
async function handleHoursEvent(req: Request, res: Response) {
  const users = await User.find().populate('subscription591').exec()
  users.forEach(async (user: UserDocumentType) => {
    if (user.subscription591.length <= 0) return

    const queryString = (<SubscriptionRecordType><any>user.subscription591[0]).queryString
    const data = await util591.getByQueryString(queryString)
    const lineId = user.lineId
    const message: TextMessage = {
      type: 'text',
      text: data.data.data[0].address
    }
    const imageMsg: ImageMessage = {
      type: 'image',
      originalContentUrl: data.data.data[1].cover,
      previewImageUrl: data.data.data[1].cover
    }
    console.log(data.data.data[1].cover)
    lineClinet.pushMessage(lineId, imageMsg)
  })

  res.send('ok')
}

