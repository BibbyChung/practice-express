import { Express, Request, Response } from 'express'
import { test01Router } from '~/routes/test01.routes'
import { authRouter } from '~/routes/auth.routes'

export const setupRouter = (app: Express) => {
  app.get('/', (req: Request, res: Response) => {
    res.send(`
    <div style="text-align:center">
      <div style="font-size: 70px">WELCOME</div>
      <div style="font-size: 40px">ONE PIECE</div>
    </div>
    `)
  })

  app.use('/test01', test01Router)
  app.use('/guest', authRouter)
}
