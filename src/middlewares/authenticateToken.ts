import { Response, NextFunction } from 'express'
import { CustomRequest } from '../types/customRequest.type'
import config from "../config/config"
import * as jwt from 'jsonwebtoken'

export const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = <string>req.headers.authorization
    const token: string = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, config.jwtSecret, (err: any, decoded: any) => {
        if (err) return res.sendStatus(403)
        const { userId } = decoded
        req.userId = userId
        next()
    })
}