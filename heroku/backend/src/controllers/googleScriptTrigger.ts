import express, { Request, Response } from 'express'
import {
  Client,
  FlexBubble,
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
    const bubbleList: FlexBubble[] = []

    data.data.data.forEach(item => {
      const bubble: FlexBubble = {
        type: 'bubble',
        hero: {
          type: 'image',
          url: item.cover,
          aspectRatio: '4:3',
          aspectMode: 'cover',
          size: 'full'
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [{
            type: 'text',
            text: item.address_img_title,
            size: 'lg',
            weight: 'bold'
          }, {
            type: 'separator',
            margin: 'sm'
          }, {
            type: 'text',
            text: item.kind_name + ' | ' + item.layout + ' | ' + item.floorInfo,
            margin: 'lg'
          }, {
            type: 'text',
            text: item.section_name + ' - ' + item.street_name
          }, {
            type: 'box',
            layout: 'horizontal',
            spacing: 'md',
            contents: [{
              type: 'text',
              text: item.price,
              color: '#FF4214',
              align: 'end',
              flex: 1,
              size: 'lg',
              weight: 'bold'
            }, {
              type: 'text',
              text: item.unit,
              flex: 0,
              gravity: 'bottom',
              size: 'xxs'
            }]
          }]
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [{
            type: 'button',
            style: 'link',
            height: 'sm',
            action: {
              type: 'uri',
              label: '591 連結',
              uri: `https://rent.591.com.tw/rent-detail-${item.id}.html`
            }
          }]
        }
      }

      bubbleList.push(bubble)
    })

    const message: FlexMessage = {
      type: 'flex',
      altText: `您有${data.data.data.length}筆新資料`,
      contents: {
        type: 'carousel',
        contents: bubbleList
      }
    }

    lineClinet.pushMessage(lineId, message)
  })

  res.send('ok')
}

