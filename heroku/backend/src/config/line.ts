import dotenv from 'dotenv'

const config = dotenv.config({ path: '.env' })

export default {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || config.parsed.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET || config.parsed.CHANNEL_SECRET,
  yourUserId: process.env.YOUR_USER_ID || config.parsed.YOUR_USER_ID
}