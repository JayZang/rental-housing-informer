import dotenv from 'dotenv'

const config = dotenv.config({ path: '.env' })

export default {
  domain: process.env.SERVER_DOMAIN || config.parsed.SERVER_DOMAIN,
  port: process.env.PORT || config.parsed.SERVER_LISTEN_PORT,
  mongoUri: process.env.MONGODB_URI || config.parsed.MONGODB_URI,
  googleScriptTriggerKey: process.env.GOOGLE_APP_SCRIPT_TRIGGER_KEY || config.parsed.GOOGLE_APP_SCRIPT_TRIGGER_KEY,
  jwtSecret: process.env.JWT_SECRET || config.parsed.JWT_SECRET
}