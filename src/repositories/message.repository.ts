import { AppDataSource } from "../dataSource"
import { Message } from "../entities/message.entity"

export const MessageRepository = AppDataSource.getRepository(Message).extend({
    async customFindOneById(id: number) {
        try {
            return await this.findOneOrFail({
                where: {
                    id: id
                },
                relations: {
                    fromUser: true,
                    toUser: true
                }
            })
        } catch(error) {
            // console.log(error)
            return undefined
        }

    }
})