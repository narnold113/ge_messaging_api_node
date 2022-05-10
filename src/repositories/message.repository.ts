import { AppDataSource } from "../dataSource"
import { Message } from "../entities/message.entity"

export const MessageRepository = AppDataSource.getRepository(Message).extend({
    async customFindOneByIdOrFail(id: number) {
        try {
            return await this.findOneByOrFail({id: id})
        } catch(error) {
            console.log(error)
            return undefined
        }

    }
})