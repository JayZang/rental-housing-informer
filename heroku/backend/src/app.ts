import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import appConfig from './config/appServer'
import lineConfig from './config/line'
import { middleware as lineMiddleware } from '@line/bot-sdk'
import expressValidator from 'express-validator'
import path from 'path'
import fs from 'fs'

// Mongo DB 連線
const mongoUri = appConfig.mongoUri
mongoose.Promise = Promise
mongoose.connect(mongoUri, {useNewUrlParser: true})
  .then(() => console.log('資料庫連線成功'))
  .catch(err => console.log('資料庫線失敗', err.toString()))

const app = express()

// Express Setting
app.use('/line/', lineMiddleware(lineConfig))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressValidator())
app.use(express.static(path.join(__dirname, '../public'), { maxAge: 31557600000 }))

import loginTokenToUserMiddleware from './middlewares/loginTokenToUser'
app.use(loginTokenToUserMiddleware)

// Router Setting
import apiRouter from './controllers/api'
import lineRouter from './controllers/line'
import googleScriptRouter from './controllers/googleScriptTrigger'

app.use('/api/', apiRouter)
app.use('/line/', lineRouter)
app.use('/google-script-trigger/', googleScriptRouter)
app.use('*', (req, res, next) => {
  try {
    const html = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf-8')
    res.send(html)
  } catch {
    next()
  }
})

export default app