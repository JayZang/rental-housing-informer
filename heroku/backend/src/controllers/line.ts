import express, { Request, Response } from 'express'
import {
  Client,
  WebhookEvent
} from '@line/bot-sdk'
import lineConfig from '../config/line'

const router = express.Router()
const lineClient = new Client(lineConfig)

router.post('/webhook', lineReplyHook)

export default router

///////// Router Functions /////////
function lineReplyHook(req: Request, res: Response) {
  Promise
    .all(req.body.events.map(replyHandleEvent))
    .then(result => res.json(result))
    .catch((err) => {
      console.error(err)
      res.status(500).end()
    })
}

///////// Other Functions /////////
function replyHandleEvent(event: WebhookEvent) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve()
  }

  return lineClient.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text + 666
  })
}

