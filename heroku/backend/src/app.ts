import express from 'express'
import bodyParser from 'body-parser'

const app = express()

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

import router591 from './controllers/591'
import lineRouter from './controllers/line'

app.use('/591/', router591)
app.use('/line/', lineRouter)

export default app