import { AppDataSource } from "../dataSource";
import { User } from "../entities/user.entity";

export const UserRepository = AppDataSource.getRepository(User).extend({
    async customFindOneById(id: number) {
        try {
            return await this.findOneByOrFail({id: id})
        } catch(error) {
            // console.log(error)
            return undefined
        }

    }
})