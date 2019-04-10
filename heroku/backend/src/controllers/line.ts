import express, { Request, Response } from 'express'
import {
  Client,
  WebhookEvent,
  Message as LineMessage
} from '@line/bot-sdk'
import lineUtil from '../util/line'
import lineConfig from '../config/line'
import User from '../models/User'

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
  switch(event.type) {
    case 'message':
      const message = event.message

      switch(message.type) {
        case 'text':
          return replyText(event.replyToken, message.text)
        default:
          return Promise.resolve()
      }
    
    case 'follow':
      return handleFollow(event.replyToken, event.source.userId)
    
    case 'unfollow':
      return handleUnfollow(event.source.userId)

    default:
      Promise.resolve()
  }
}

// 回復單純文字訊息
function replyText(replyToken: string, texts: string | string[]) {
  texts = Array.isArray(texts) ? texts : [texts]
  return lineClient.replyMessage(
    replyToken,
    texts.map(text => ({ type: <any>'text', text }))
  )
}

// 回復 Line 樣式模板
function replyTemplate(replyToken: string, messages: LineMessage | LineMessage[]) {
  messages = Array.isArray(messages) ? messages : [messages]
  return lineClient.replyMessage(replyToken, messages)
}

// 處理加好友事件
async function handleFollow(replyToken: string, lineId: string) {
  let user = await User.findOne({ lineId })

  // 若是資料庫無此 Line ID 資料則為全新用戶，寫入新 Line 用戶，但未被認證
  // 若是資料庫已有此 Line ID，代表為舊用戶刪除後又新增好友
  user = user || new User({ lineId })

  user.isLineFollowing = true
  await user.save()

  // 使用者未認證，給予前往認證中心之連結
  if (!user.isAuth) {
    const userObjectId = user._id
    const messageTemplate = lineUtil.getAuthRequirementButtonTemplate(userObjectId)

    return replyTemplate(replyToken, messageTemplate)
  } 

  // 使用者沒有訂閱紀錄，給予前往訂閱中心之連結
  else if (user.subscription591.length === 0) {
    const messageTemplate = lineUtil.getNon591SubscriptionHintButtonTemplate()

    return replyTemplate(replyToken, messageTemplate)
  }
}

// 處理封鎖事件
async function handleUnfollow(lineId: string) {
  let user = await User.findOne({ lineId })

  if (!user) return Promise.resolve()

  user.isLineFollowing = false
  return user.save()
}