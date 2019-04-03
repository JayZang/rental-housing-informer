import app from './app'
import appServerConfig from './config/appServer'

const listenPort = appServerConfig.port
const server = app.listen(listenPort, () => {
  console.log(`Server Started, listening on ${listenPort}`)
})

export default server