import express, { Request, Response } from 'express'
import crypto from 'crypto'
import mongoose from 'mongoose'
import User, { UserSexEnum } from '../../models/User'

const router = express.Router()
const AUTH_VALID_KEY_DURATION = 3 * 60 * 60 * 1000

// 確認該用戶是否需要被認證
router.get('/authentication/:userId', checkIfNeedAuth)

// 用戶註冊，成功時返回 Line 指定回復碼
router.post('/authentication/:userId', handleAuthentication)

export default router

////////// Router Function //////////
// 確認該用戶是否需要被認證
async function checkIfNeedAuth(req: Request, res: Response) {
  const userId = req.params.userId
  const isValidId = mongoose.Types.ObjectId.isValid(userId)

  if (!isValidId) {
    return res.status(404).send()
  }

  const user = await User.findById(userId)
  if (!user || user.authInform.isAuth) {
    return res.status(404).send()
  }

  const now = new Date()
  const authKeyExpired = user.authInform.authKeyExpired
  const authKey = authKeyExpired && now < authKeyExpired ? user.authInform.authKey : undefined

  return res.send({
    authKey
  })
}

// 用戶註冊，成功時返回 Line 指定回復碼
async function handleAuthentication(req: Request, res: Response) {
  const userId = req.params.userId
  const password = req.body.password

  req.checkBody('account').trim()
    .notEmpty().withMessage('帳號 為必要欄位')
    .matches(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/).withMessage('帳號 由6-21字母和數字组成，不能是纯數字或纯英文')

  req.checkBody('email').trim()
    .notEmpty().withMessage('Email 為必要欄位')
    .isEmail().withMessage('Email 格式錯誤')

  req.checkBody('password').trim()
    .notEmpty().withMessage('密碼 為必要欄位')
    .matches(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/).withMessage('密碼 由6-21字母和數字组成，不能是纯數字或纯英文')

  req.checkBody('passwordConfirm')
    .notEmpty().withMessage('密碼確認 為必要欄位')
    .equals(password).withMessage('與密碼欄位不同')

  req.checkBody('fullName').trim()
    .notEmpty().withMessage('真實姓名 為必要欄位')

  req.checkBody('nickName').trim()
    .notEmpty().withMessage('暱稱 為必要欄位')

  req.checkBody('sex')
    .notEmpty().withMessage('性別為必要欄位')

  // 判斷是否為合法 mongo 合法 ObjectID
  const isValidId = mongoose.Types.ObjectId.isValid(userId)
  if (!isValidId) {
    return res.status(404).send()
  }

  // 驗證欄位
  let errors = req.validationErrors(true)
  if (errors) {
    return res.json({
      result: false,
      errFields: errors
    })
  }

  // 檢查帳號是否已被註冊
  const account = req.body.account
  const isAccountUsed = await User.find({ account })
  if (isAccountUsed.length > 0) {
    req.checkBody('account', '此帳號已被註冊').not().equals(account)
    errors = req.validationErrors(true)
    return res.json({
      result: false,
      errFields: errors
    })
  }

  // 搜尋指定用戶 Id，並確認其尚未帳號註冊認證過
  const user = await User.findById(userId)
  if (!user || user.authInform.isAuth) {
    return res.status(404).send()
  }

  const sha256 = crypto.createHash('sha256')
  const now = new Date()
  const hash = sha256.update(`${userId}.${now.valueOf()}`).digest('hex')
  const authKey = `auth-key=${hash}`

  user.authInform.authKey = authKey
  user.authInform.authKeyExpired = new Date(now.valueOf() + AUTH_VALID_KEY_DURATION)
  user.account = req.body.account
  user.email = req.body.email
  user.password = req.body.password
  user.fullName = req.body.fullName
  user.nickName = req.body.nickName
  switch (parseInt(req.body.sex)) {
    case UserSexEnum.Man:
      user.sex = UserSexEnum.Man
      break
    case UserSexEnum.Woman:
      user.sex = UserSexEnum.Woman
    default:
      user.sex = UserSexEnum.Man
  }

  await user.save()

  res.json({
    result: true,
    authKey
  })
}
