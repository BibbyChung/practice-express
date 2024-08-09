import type { Request, Response } from 'express'
import Router from 'express-promise-router'
import createError from 'http-errors'
import { signAccessToken } from '~/middleware/auth'
import { isPasswordMatch } from '~/utils/encryption'

export const authRouter = Router()

authRouter.post('/login', async (req: Request, res: Response, next: Function) => {
  const { username, password } = req.body

  const user = {
    id: '001',
    username: 'bb',
    password: '1111',
  }

  if (user) {
    const match = await isPasswordMatch(password, user.password)
    if (!match) {
      res.json(createError.Unauthorized('Wrong Password'))
    }
    const userId = user.id
    const username = user.username
    const payloadAccess = {
      data: { userId, username },
      tokenType: `${process.env.ACCESS_TOKEN_SECRET}`,
      expiresIn: '1d',
    }

    const accessToken = await signAccessToken(payloadAccess)

    const payloadRefresh = {
      data: { userId, username },
      tokenType: `${process.env.REFRESH_TOKEN_SECRET}`,
      expiresIn: '1d',
    }

    const refreshToken = await signAccessToken(payloadRefresh)

    if (accessToken && refreshToken) {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // umur token 24jam
        // secure: true,
      })
      res.json({ username: user.username })
    }

    // next(createError.InternalServerError());
  }
})

authRouter.post('/register', async (req: Request, res: Response, next: Function) => {
  const { email, username, password } = req.body
  res.json({ msg: 'Register Berhasil' })
  // next(createError.InternalServerError());
})

authRouter.delete('/logout', async (req: Request, res: Response, next: Function) => {
  const refreshToken = req.cookies.refreshToken

  if (refreshToken) {
    const user = {
      id: '001',
      username: 'bb',
      password: '1111',
    }

    if (!user) {
      return res.sendStatus(204)
    }

    res.clearCookie('refreshToken')
    return res.sendStatus(200)
  } else {
    return res.sendStatus(204)
  }

  // next(createError.InternalServerError());
})
