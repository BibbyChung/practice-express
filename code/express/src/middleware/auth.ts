import type { Request, Response } from 'express'
import jwt, { Secret, JwtPayload } from 'jsonwebtoken'
import createError from 'http-errors'

export type CustomRequest = Request & {
  username: string | JwtPayload
}

export type PayloadType = {
  data: {
    userId: string
    username: string
  }
  tokenType: string
  expiresIn: string
}

export const SECRET_KEY: Secret = `${process.env.ACCESS_TOKEN_SECRET}`

export const signAccessToken = (payload: PayloadType) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload.data, payload.tokenType, { expiresIn: payload.expiresIn }, (err, token) => {
      if (err) {
        reject(createError.InternalServerError())
      }
      resolve(token)
    })
  })
}

export const verifyToken = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization //req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1]
  if (!authHeader) {
    return next(createError.Unauthorized('Access token is required'))
  }
  if (!token) {
    return next(createError.Unauthorized()) //res.sendStatus(401);
  }
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      next(createError.Forbidden())
      //res.sendStatus(403);
    } else {
      ;(req as CustomRequest).username = (decoded as PayloadType['data']).username
      next()
    }
  })
}
