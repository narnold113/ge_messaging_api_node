import "reflect-metadata"
import express, { Application } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import routes from './routes/routes'
import chalk from 'chalk'
import { AppDataSource } from "./dataSource"

// establish database connection
AppDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

const app: Application = express()

// Call midlewares
app.use(cors())
app.use(helmet())
app.use(bodyParser.json())

app.use('/', routes)

app.listen(5050, () => console.log(chalk.bgGreenBright('Server listening on port 5050...')))
