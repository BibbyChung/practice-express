import type { Request, Response } from 'express'
import Router from 'express-promise-router'

export const userRouter = Router()

userRouter.get('/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  return res.json({
    id,
    username: `username => ${id}`,
  })
})
