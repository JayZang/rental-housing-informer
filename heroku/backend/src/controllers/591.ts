import express, { Request, Response } from 'express'
import service591 from '../services/591Service'
import User from '../models/User'
import Subscription591 from '../models/RentalSubscriptionRecord591'

const router = express.Router()

router.post('/subscribe/add', newSubscription)

export default router

////////// Router Function //////////
// 新增 591 訂閱
async function newSubscription(req: Request, res: Response) {
  req.checkBody('title', 'title 屬性為必要欄位').notEmpty()
  req.checkBody('queryString')
    .notEmpty().withMessage('queryString 屬性為必要欄位')
    .isURL().withMessage('queryString 必須為 URL 格式')
    .isURL({ require_host: true, host_whitelist: ['rent.591.com.tw'] }).withMessage('queryString 錯誤 URL Host 名稱')
    .contains('region=').withMessage('queryString 確認有 "region"欄位')

  const err = req.validationErrors(true)

  if (err) {
    return res.json({
      error: err
    })
  }

  const queryString = req.body.queryString.split('?')[1]
  const title = req.body.title
  const userId = '5ca9cb456f33bc08c40a923c'
  const user = await User.findById(userId)
  const rentals = await service591.getRentalByQueryString(queryString)
  const subscription591 = new Subscription591({
    userId,
    title,
    queryString,
    readRecord: rentals.map(item => item.id)
  })

  user.subscription591.unshift(subscription591._id)
  const subscription591Promise = subscription591.save()
  const userPromise = user.save()

  await Promise.all([subscription591Promise, userPromise])

  res.send('ok')
}