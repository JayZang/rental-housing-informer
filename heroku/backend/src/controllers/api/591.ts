import express, { Request, Response } from 'express'
import service591 from '../../services/591Service'
import User from '../../models/User'
import Subscription591 from '../../models/RentalSubscriptionRecord591'

const router = express.Router()

// 新增 591 訂閱
router.post('/591/subscribe', newSubscription)

export default router

////////// Router Function //////////
// 新增 591 訂閱
async function newSubscription(req: Request, res: Response) {
  if (!req.user) {
    return res.json({
      result: false,
      errFields: {},
      errMsg: '使用者尚未登入'
    })
  }

  req.checkBody('title', '訂閱名稱 為必要欄位').notEmpty()
  req.checkBody('url')
    .notEmpty().withMessage('591網址 為必要欄位')
    .isURL().withMessage('591網址 必須為 URL 格式')
    .isURL({ require_host: true, host_whitelist: ['rent.591.com.tw'] }).withMessage('網址錯誤，請輸入591租屋網電腦版網址')
    .contains('region=').withMessage('591網址 確認有 "region"欄位')

  const err = req.validationErrors(true)

  if (err) {
    return res.json({
      result: false,
      errFields: err
    })
  }

  const queryString = req.body.url.split('?')[1]
  const title = req.body.title
  const userId = req.user.id

  const user = await User.findById(userId)
  if (!user) return res.json({
    result: false,
    errFields: {},
    errMsg: '系統發生錯誤，找不到此用戶'
  })

  const rentals = await service591.getRentals(queryString)
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

  res.json({
    result: true
  })
}