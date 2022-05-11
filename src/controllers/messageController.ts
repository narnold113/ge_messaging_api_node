import { Message } from '../entities/message.entity'
import { CustomRequest } from '../types/customRequest.type'
import { Response } from "express"
import { UserRepository } from '../repositories/user.repository'
import { MessageRepository } from '../repositories/message.repository'


class MessageController {
    static newMessage = async (req: CustomRequest, res: Response) => {
        const fromUserId = <number>req.userId

        const fromUser = await UserRepository.customFindOneById(fromUserId)
        const toUser = await UserRepository.customFindOneById(req.body['toUserId'] as number)
        if (toUser !== undefined && fromUser !== undefined) {
            const message = new Message()
            message.fromUser = fromUser
            message.toUser = toUser
            message.messageBody = req.body['messageBody']

            await MessageRepository.save(message)

            return res.status(201).send({
                id: message.id,
                fromUserId: message.fromUser.id,
                toUserId: message.toUser.id,
                messageBody: message.messageBody,
                isRead: message.isRead,
                createdAt: message.createdAt
            })
        }
        return res.status(400).send("toUserId not found")
    }

    static getMessage = async (req: CustomRequest, res: Response) => {
        const messageId = parseInt(req.query.messageId as string)
        const message = await MessageRepository.customFindOneById(messageId)
        if (message) {
            return res.status(200).send({
                id: message.id,
                fromUserId: message.fromUser.id,
                toUserId: message.toUser.id,
                messageBody: message.messageBody,
                isRead: message.isRead,
                createdAt: message.createdAt
            })
        }
        return res.status(400).send("messageId not found")
    }

    static getMessages = async (req: CustomRequest, res: Response) => {
        const toUserId = <number>req.userId
        const fromUserId = req.query.fromUserId ?? false

        const messages = await MessageRepository.createQueryBuilder('message')
            .select(["message.id", "message.messageBody", "message.isRead", "message.createdAt"])
            .innerJoinAndSelect("message.fromUser", "fromUser")
            .innerJoinAndSelect("message.toUser", "toUser")
            .where("toUser.id = :toUserId", { toUserId: toUserId })
            .andWhere(fromUserId ? "fromUser.id = :fromUserId" : "message.id is not null", { fromUserId: fromUserId })
            .orderBy("message.createdAt", "DESC")
            .getMany()

        if (messages.length > 0) {
            const messages2 = messages.map((message) => {
                return {
                    id: message.id,
                    toUserId: message.toUser.id,
                    fromUserId: message.fromUser.id,
                    messageBody: message.messageBody,
                    isRead: message.isRead,
                    createdAt: message.createdAt
                }
            })
            return res.send(messages2)
        }
        return res.send("No messages found")
    }

    static markMessageAsRead = async (req: CustomRequest, res: Response) => {
        const messageId = parseInt(req.query.messageId as string)
        const messageUpdateResult = await MessageRepository.createQueryBuilder()
            .update(Message, { isRead: true })
            .where("id = :id", { id:messageId })
            .returning('*')
            .updateEntity(true)
            .execute()
        const affected: number = messageUpdateResult?.affected || 0
        switch (true) {
            case (affected === 0):
                return res.status(400).send("messageId not found")
            case (affected === 1):
                return res.status(200).send({
                    id: messageUpdateResult.raw[0]['id'],
                    fromUserId: messageUpdateResult.raw[0]['fromUserId'],
                    toUserId: messageUpdateResult.raw[0]['toUserId'],
                    messageBody: messageUpdateResult.raw[0]['messageBody'],
                    isRead: messageUpdateResult.raw[0]['isRead'],
                    createdAt: messageUpdateResult.raw[0]['createdAt']
                })
            case (affected > 1):
                return res.status(500).send("Unknown error")
        }
    }
}

export default MessageController