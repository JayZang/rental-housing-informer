import express, { Request, Response } from 'express'
import util591 from '../util/591'

const router = express.Router()

async function getAll(req: Request, res: Response) {
  const data = await util591.getAllRentalHouse()
  res.send(data)
}

router.get('/', getAll)

export default router