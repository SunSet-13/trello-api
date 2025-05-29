import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { BoardRoute } from '~/routes/v1/boardRoute.js'

const Router = express.Router()

// Check API status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 is running...', code: StatusCodes.OK })
})
//Board Api
Router.use('/boards', BoardRoute)
export const APIs_V1 = Router
