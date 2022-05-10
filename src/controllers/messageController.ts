import { Message } from '../entities/message.entity'
import { CustomRequest } from '../types/customRequest.type'
import { Response } from "express"
import { UserRepository } from '../repositories/user.repository'
import { MessageRepository } from '../repositories/message.repository'

class MessageController {
    static newMessage = async (req: CustomRequest, res: Response) => {
        const fromUserId = <number>req.userId


        const fromUser = await UserRepository.customFindOneByIdOrFail(fromUserId)
        const toUser = await UserRepository.customFindOneByIdOrFail(req.body['toUserId'] as number)
        if (toUser !== undefined && fromUser !== undefined) {
            const message = new Message()
            message.fromUser = fromUser
            message.toUser = toUser
            message.messageBody = req.body['messageBody']

            await MessageRepository.save(message)

            return res.status(201).send({
                fromUserId: message.fromUser.id,
                toUserId: message.toUser.id,
                messageBody: message.messageBody,
                id: message.id,
                isRead: message.isRead,
                createdAt: message.createdAt
            })
        }
        return res.status(400).send("toUserId not found")
    }
}

export default MessageController