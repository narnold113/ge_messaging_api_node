import { CustomRequest } from '../types/customRequest.type'
import { Response } from "express"
import { AppDataSource } from '../dataSource'
import { User } from '../entities/user.entity'
import config from '../config/config'
import jwt from 'jsonwebtoken'

class AuthController {
    static login = async (req: CustomRequest, res: Response) => {
        // Get auth values from header
        const authHeader = req.headers.authorization
        if (!authHeader) {
            res.setHeader('WWW-Authenticate', 'Basic')
            res.sendStatus(401)
        }
        const [ username, password ] = Buffer.from(authHeader?.split(' ')[1] || '', 'base64').toString().split(':')

        // Check that username exists
        const userRepository = AppDataSource.getRepository(User)
        let user: User
        try {
            user = await userRepository.findOneByOrFail({
                username: username
            })            
        } catch (err) {
            return res.status(401).send("Username not found")
        }

        // Check password
        if (!user.checkPassword(password)) {
            return res.status(401).send("Incorrect password")
        }

        const token = jwt.sign(
            {userId: user.id},
            config.jwtSecret,
            {expiresIn: '2h'}
        )
        res.send({
            token: token
        })
    }
}

export default AuthController