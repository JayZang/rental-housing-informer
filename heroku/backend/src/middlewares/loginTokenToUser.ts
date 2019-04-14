import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import appConfig from '../config/appServer'

const func: RequestHandler =  function (req, res, next) {
  const jwtSecret = appConfig.jwtSecret
  const parsedToken = req.header('X-Auth')
  try {
    const user: any = jwt.verify(parsedToken, jwtSecret)
    req.user = user
  } catch {}

  next()
}

export default func