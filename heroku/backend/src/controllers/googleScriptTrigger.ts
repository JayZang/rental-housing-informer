import express, { Request, Response } from 'express'
import {
  Client,
  TextMessage,
  ImageMessage,
  FlexMessage
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
    const message: FlexMessage = {
      type: 'flex',
      altText: 'altText',
      contents: {
        type: 'bubble',
        hero: {
          type: 'image',
          url: data.data.data[1].cover,
          aspectRatio: '4:3',
          aspectMode: 'cover',
          size: 'full'
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [{
            type: 'text',
            text: data.data.data[1].address_img_title,
            size: 'lg',
            weight: 'bold'
          }, {
            type: 'separator',
            margin: 'sm'
          }, {
            type: 'text',
            text: data.data.data[1].kind_name + ' | ' + data.data.data[1].layout + ' | ' + data.data.data[1].floorInfo,
            margin: 'md'
          }, {
            type: 'text',
            text: data.data.data[1].section_name + ' - ' + data.data.data[1].street_name
          }, {
            type: 'text',
            text: data.data.data[1].price + ' ' + data.data.data[1].unit,
            align: 'end',
            margin: 'lg'
          }]
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [{
            type: 'separator',
            margin: 'none'
          }, {
            type: 'button',
            style: 'link',
            action: {
              type: 'uri',
              label: '591 連結',
              uri: `https://rent.591.com.tw/rent-detail-${data.data.data[1].id}.html`
            }
          }]
        }
      }
    }
    console.log(data.data.data[1].cover)
    lineClinet.pushMessage(lineId, message)
  })

  res.send('ok')
}

