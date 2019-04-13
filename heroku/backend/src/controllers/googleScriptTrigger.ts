import express, { Request, Response, NextFunction } from 'express'
import _ from 'lodash'
import { Client } from '@line/bot-sdk'
import util591 from '../util/591'
import lineUtil from '../util/line'
import lineConfig from '../config/line'
import appConfig from '../config/appServer'
import User, { UserDocumentType } from '../models/User'
import { SubscriptionRecordDocumentType } from '../models/RentalSubscriptionRecord591'

const router = express.Router()
const lineClinet = new Client(lineConfig)
const GSTK = appConfig.googleScriptTriggerKey

router.get('/hours', checkIsFromValid, routeHours)

export default router

////////// Router Functions //////////
// 每小時定時搜尋的路由，由 Google App Script 觸發
async function routeHours(req: Request, res: Response) {
  const promises: Promise<any>[] = []
  const users = await User.findHoursPushTargets()
  users.forEach((user: UserDocumentType) => {
    const promise = new Promise(async (resolve, reject) => {
      // 判斷有無訂閱
      if (user.subscription591.length <= 0) return resolve()

      const subscription591 = <SubscriptionRecordDocumentType><any>user.subscription591[0]
      const queryString = subscription591.queryString
      const lineId = user.lineId
      const rentalData = await util591.getRentalByQueryString(queryString)

      // 取得未於已讀記錄中的租屋資訊，最多拿10筆顯示於 line 上
      const unReadRental = rentalData
        .filter(item => !_.includes(subscription591.readRecord, item.id))
        .splice(0, 10)

      // 將送於 line 推撥之租屋物件加入為已讀陣列
      subscription591.readRecord = subscription591.readRecord.concat(unReadRental.map(item => item.id))

      const bubbleList = unReadRental.map(item => lineUtil.getRentalBubbleTemplate(item))
      const savePromise = unReadRental.length > 0 ? subscription591.save() : Promise.resolve()
      const linePromise = bubbleList.length > 0 ? lineClinet.pushMessage(lineId, {
        type: 'flex',
        altText: `您有${unReadRental.length}筆新租屋物件`,
        contents: {
          type: 'carousel',
          contents: bubbleList
        }
      }) : Promise.resolve()

      await Promise.all([savePromise, linePromise])
      resolve()
    })

    promises.push(promise)
  })

  // 等待 DB 儲存好及 line 發送完畢之後返回 http response
  Promise.all(promises)
    .then(() => res.send('ok'))
}

////////// 自訂函數 //////////
// Middleware，從 request 認證是否為合法來源送來的
function checkIsFromValid(req: Request, res: Response, next: NextFunction) {
  const rcvGSTK = req.header('X-Auth')
  if (GSTK === rcvGSTK) return next()
  else res.status(401).send()
}

