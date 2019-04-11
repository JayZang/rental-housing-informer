import express, { Request, Response } from 'express'

const router = express.Router()

router.get('/authentication/:userId', handleAuthentication)

export default router

////////// Router Function //////////
function handleAuthentication(req: Request, res: Response) {
  res.send('123')
}
