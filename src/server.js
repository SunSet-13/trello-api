import express from 'express'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb.js'
import exitHook from 'async-exit-hook'
import { env } from '~/config/environment.js'

const START_SERVER = () => {
  const app = express()

  app.get('/', async (_req, res) => {
    console.log(env)
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`3. Hello ${env.AUTHOR}, I am running at Host ${env.APP_HOST} and Port:${env.APP_PORT}/`)
  })

  exitHook(() => {
    console.log('4. Server is shutting down...')
    CLOSE_DB()
    // Đóng kết nối tới MongoDB
    console.log('5. Disconnected from MongoDB Cloud Atlas')
  })
}

// chỉ kết nối tới database thành công thì mới start server backend lên
// khởi động lập tức anonymous async function IIFE
;(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Cloud Atlas')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// console.log('1. Connecting to MongoDB Cloud Atlas...')
// CONNECT_DB()
//   .then(() => console.log('2. Connected to MongoDB Cloud Atlas'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })
