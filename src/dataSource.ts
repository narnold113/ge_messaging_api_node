import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "127.0.0.1",
    port: 5432,
    username: "nicolas",
    password: "nicolas113112",
    database: "nicolas",
    entities: ["src/entities/*.js"],
    synchronize: true,
    logging: false,
})