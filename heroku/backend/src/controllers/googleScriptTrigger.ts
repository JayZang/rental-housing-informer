import express, { Request, Response } from 'express'
import {
  Client,
  FlexBubble
} from '@line/bot-sdk'
import util591 from '../util/591'
import lineConfig from '../config/line'
import User, { UserDocumentType } from '../models/User'
import { SubscriptionRecordType } from '../models/RentalSubscriptionRecord591'

const router = express.Router()
const lineClinet = new Client(lineConfig)

router.get('/hours', routeHours)

export default router

////////// Router Functions //////////
async function routeHours(req: Request, res: Response) {
  const users = await User.find().populate('subscription591').exec()
  users.forEach(async (user: UserDocumentType) => {
    if (user.subscription591.length <= 0) return

    const queryString = (<SubscriptionRecordType><any>user.subscription591[0]).queryString
    const lineId = user.lineId
    const bubbleList: FlexBubble[] = []
    let rentalData = await util591.getRentalByQueryString(queryString)
    // 最多拿10筆顯示於 line 上
    rentalData = rentalData.slice(0, 10)

    rentalData.forEach(item => {
      bubbleList.push({
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
      })
    })

    lineClinet.pushMessage(lineId, {
      type: 'flex',
      altText: `您有${rentalData.length}筆新資料`,
      contents: {
        type: 'carousel',
        contents: bubbleList
      }
    })
  })

  res.send('ok')
}

