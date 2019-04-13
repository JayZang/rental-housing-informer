import express, { Request, Response } from 'express'
import {
  EventSource,
  WebhookEvent
} from '@line/bot-sdk'
import lineUtil, { TextMessageInstructions } from '../util/line'
import User from '../models/User'

const router = express.Router()

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
function replyHandleEvent(event: WebhookEvent): Promise<any> {
  switch (event.type) {
    case 'message':
      const message = event.message

      switch (message.type) {
        case 'text':
          return handleTextMessage(event.replyToken, event.source, message.text)
        default:
          return Promise.resolve()
      }

    case 'follow':
      return handleFollow(event.replyToken, event.source.userId)

    case 'unfollow':
      return handleUnfollow(event.source.userId)

    default:
      return Promise.resolve()
  }
}

// 處理加好友事件
async function handleFollow(replyToken: string, lineId: string): Promise<any> {
  let user = await User.findOne({ lineId })

  // 若是資料庫無此 Line ID 資料則為全新用戶，寫入新 Line 用戶，但未被認證
  // 若是資料庫已有此 Line ID，代表為舊用戶刪除後又新增好友
  user = user || new User({ lineId })

  user.isLineFollowing = true
  await user.save()

  // 使用者未認證，給予前往認證中心之連結
  if (!user.authInform.isAuth) {
    const userObjectId = user._id
    const messageTemplate = lineUtil.getAuthRequirementButtonTemplate(userObjectId)

    return lineUtil.replyTemplate(replyToken, messageTemplate)
  }

  // 使用者沒有訂閱紀錄，給予前往訂閱中心之連結
  else if (user.subscription591.length === 0) {
    const messageTemplate = lineUtil.getNon591SubscriptionHintButtonTemplate()

    return lineUtil.replyTemplate(replyToken, messageTemplate)
  }

  return Promise.resolve()
}

// 處理封鎖事件
async function handleUnfollow(lineId: string): Promise<any> {
  const user = await User.findOne({ lineId })

  if (!user) return Promise.resolve()

  user.isLineFollowing = false
  return user.save()
}

// 處理文字訊息事件
function handleTextMessage(replyToken: string, source: EventSource, text: string): Promise<any> {
  const instructionKey = lineUtil.checkTextInstruction(text)
  if (instructionKey) {
    return handleInstruction(replyToken, source, text, instructionKey)
  }

  return lineUtil.replyText(replyToken, text)
}

// 指令中介路由處理
function handleInstruction(replyToken: string, source: EventSource , text: string, instructionKey: string): Promise<any> {
  switch (instructionKey) {
    case TextMessageInstructions.UserAuth:
      return handleUserAuth(replyToken, source, text)
    default:
      return Promise.resolve()
  }
}

// 用戶在 Line 1.1 聊天室上輸入註冊認證碼
async function handleUserAuth(replyToken: string, source: EventSource, text: string): Promise<any> {
  // 限定為 1.1 聊天室
  const sourceType = source.type
  if (sourceType !== 'user')
    return Promise.resolve()

  const lineId = source.userId
  const user = await User.findByLineId(lineId)
  if (!user) {
    // 當使用者加 line bot 為好友時，應會將其存入資料庫，因此不該會搜尋不到此用戶資料
    return lineUtil.replyText(replyToken, '伺服器出現了一些錯誤!')
  } else if (user.authInform.isAuth) {
    // 認證過之用戶不必回覆
    return Promise.resolve()
  }

  const now = new Date()
  const authKey = user.authInform.authKey
  const authKeyExpired = user.authInform.authKeyExpired

  if (!authKey || !authKeyExpired) {
    return lineUtil.replyText(replyToken, '您尚未註冊')
  } else if (text !== authKey) {
    return lineUtil.replyText(replyToken, '認證碼錯誤')
  } else if (now > authKeyExpired) {
    return lineUtil.replyText(replyToken, '認證碼已過期，請重新註冊')
  }

  user.authInform.isAuth = true
  user.authInform.authDate = now
  await user.save()

  return lineUtil.replyText(replyToken, '用戶註冊及認證成功!')
}