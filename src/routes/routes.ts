import { Router } from "express"
import auth from "./auth"
import user from "./user"
import message from "./message"

const routes = Router();

routes.use("/auth", auth)
routes.use("/user", user)
routes.use("/message", message)

export default routes