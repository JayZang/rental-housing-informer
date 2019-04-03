import express, { Request, Response } from 'express'
import { 
  Client, 
  middleware as lineMiddleware, 
  WebhookEvent 
} from '@line/bot-sdk'
import lineConfig from '../config/line'

const router = express.Router()
const config = {
  channelAccessToken: lineConfig.channelAccessToken,
  channelSecret: lineConfig.channelSecret
}
const lineClient = new Client(config)

router.post('/webhook', lineMiddleware(config), lineReplyHook)

export default router

function lineReplyHook(req: Request, res: Response) {
  Promise
    .all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
}

function handleEvent(event: WebhookEvent) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return lineClient.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text + 666
  });
}

