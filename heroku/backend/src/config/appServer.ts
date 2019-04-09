import dotenv from 'dotenv'

const config = dotenv.config({ path: '.env' })

export default {
  port: process.env.PORT || config.parsed.SERVER_LISTEN_PORT,
  mongoUri: process.env.MONGODB_URI || config.parsed.MONGODB_URI,
}