import { User } from '../entities/user.entity'
import { CustomRequest } from '../types/customRequest.type'
import { Response } from "express"
import { AppDataSource } from '../dataSource'
import { QueryFailedError } from 'typeorm'
import bcrypt from "bcryptjs"
import { DatabaseError } from 'pg-protocol'
import { validate } from "class-validator"


class UserController {
    static getOneByJwt = async (req: CustomRequest, res: Response) => {
        const id = <number>req.userId

        const userRepository = AppDataSource.getRepository(User)

        try {
            const user = await userRepository.findOneByOrFail({
                id: id
            })
            return res.status(201).send({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username
            })
        } catch (err) {
            return res.status(404).send(`User, with id: ${id}, not found`)
        }

    }

    static newUser = async (req: CustomRequest, res: Response) => {
        // Create a new user
        let user = {
            firstName: req.body['firstName'],
            lastName: req.body['lastName'],
            username: req.body['username'],
            password: bcrypt.hashSync(req.body['password'])
        }
        user = await AppDataSource.getRepository(User).create(user)

        // Try saving new user and return error code if username already exists or missing column
        try {
            const results = await AppDataSource.getRepository(User).save(user)
            return res.status(201).send({
                id: results.id,
                firstName: results.firstName,
                lastName: results.lastName,
                username: results.username
            })
        } catch (error) {
            if (error instanceof QueryFailedError) {
                const err: DatabaseError = error.driverError

                switch (err.code) {
                    case '23505':
                        return res.status(409).send("Username already exists")
                    break
                    case '23502':
                        return res.status(400).send(`Missing ${err.column} param in the body`)
                    break
                    default: return res.status(500).send(err.detail)

                }
            }
            return res.status(500).send("Unknown error")
        }
    }

    static updateOneByJwt = async (req: CustomRequest, res: Response) => {
        const id = <number>req.userId

        const userRepository = AppDataSource.getRepository(User)

        try {
            const user = await userRepository.findOneByOrFail({
                id: id
            })

            // Validate the new values on entity
            user.firstName = req.body['firstName']
            user.lastName = req.body['lastName']
            const errors = await validate(user)
            if (errors.length > 0) {
                return res.status(400).send(errors)
            }

            // Save changes and return message
            await userRepository.save(user)
            return res.send('User updated')
            
        } catch (err) {
            return res.status(404).send(`User, with id: ${id}, not found`)
        }

    }

}

export default UserController