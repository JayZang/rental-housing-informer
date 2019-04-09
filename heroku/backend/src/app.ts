import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import appConfig from './config/appServer'
import lineConfig from './config/line'
import { middleware as lineMiddleware } from '@line/bot-sdk'
import expressValidator from 'express-validator'

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

// Router Setting
import router591 from './controllers/591'
import lineRouter from './controllers/line'
import googleScriptRouter from './controllers/googleScriptTrigger'

app.use('/591/', router591)
app.use('/line/', lineRouter)
app.use('/google-script-trigger/', googleScriptRouter)

export default app