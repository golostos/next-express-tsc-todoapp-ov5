import { Router } from "express";
import { checkSession } from '../../services/auth-service';
import { CreateNewUser, Login, UpdateUser } from "./users.controller";

const usersRouter = Router()

// usersRouter.get('/users', GetAllUsers)

usersRouter.post('/users', CreateNewUser)

usersRouter.post('/users/login', Login)

usersRouter.patch('/users/:id', checkSession, UpdateUser)

export default usersRouter