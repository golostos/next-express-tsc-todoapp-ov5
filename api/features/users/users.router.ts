import { Router } from "express";
import { checkAdmin, checkSession } from '../../services/auth-service';
import { CreateNewUser, Login, UpdateUser } from "./users.controller";

const usersRouter = Router()

// usersRouter.get('/users', GetAllUsers)

usersRouter.post('/users', CreateNewUser)

usersRouter.post('/users/login', Login)

usersRouter.patch('/users/:id', checkSession, UpdateUser)

usersRouter.delete('/users/:id', checkSession, checkAdmin, UpdateUser)

export default usersRouter