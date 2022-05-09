import { User } from '../entities/user.entity'
import { CustomRequest } from '../types/customRequest.type'
import { Response } from "express"
import { AppDataSource } from '../dataSource'

class UserController {
    static getOneByJwt = async (req: CustomRequest, res: Response) => {
        const id = <number>req.userId

        const userRepository = AppDataSource.getRepository(User)

        try {
            const user = await userRepository.findOneByOrFail({
                id: id
            })
            return res.send(user)
        } catch (err) {
            return res.status(404).send(`User, with id: ${id}, not found`)
        }

    }

    static newUser = async (req: CustomRequest, res: Response) => {
        const newUser = await AppDataSource.getRepository(User).create(req.body)
        const results = await AppDataSource.getRepository(User).save(newUser)
        return res.send(results)
    }
}

export default UserController