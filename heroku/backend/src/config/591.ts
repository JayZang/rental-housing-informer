import dotenv from 'dotenv'

const config = dotenv.config({ path: '.env' })

export default {
  homeURL: process.env.RENTAL_591_HOME_URL || config.parsed.RENTAL_591_HOME_URL,
  apiURL: process.env.RENTAL_591_API_URL || config.parsed.RENTAL_591_API_URL
}