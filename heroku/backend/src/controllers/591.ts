import express, { Request, Response } from 'express'
import util591 from '../util/591'
import User from '../models/User'
import Subscription591 from '../models/RentalSubscriptionRecord591'

const router = express.Router()

router.post('/subscribe/add', newSubscription)

export default router

////////// Router Function //////////
// 新增 591 訂閱
async function newSubscription(req: Request, res: Response) {
  req.checkBody('title', 'title 屬性為必要欄位').notEmpty()
  req.checkBody('queryString', 'queryString 屬性為必要欄位').notEmpty()

  const err = req.validationErrors()

  if (err) {
    return res.json({
      error: err
    })
  }

  const {
    title,
    queryString
  } = req.body
  const userId = '5caab907c9fabc38a03ea14e'
  const user = await User.findById(userId)
  const rentals = await util591.getRentalByQueryString(queryString)
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