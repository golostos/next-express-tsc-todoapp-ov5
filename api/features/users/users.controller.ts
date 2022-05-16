import { RequestHandler, Request, Response, NextFunction } from "express";
import { createSession } from '../../services/auth-service';
import { middleware, userMiddleware } from '../../services/controller';
import { CredentialsDTO, UpdateUserDTO } from './users.dto';
import { CreateNewUserService, LoginService, UpdateUserService } from './users.service';

// export const GetAllUsers: RequestHandler = async (req, res) => {
//     const tasks = await User.findAll()
//     res.send(tasks)
// }

export const CreateNewUser = middleware<{}, CredentialsDTO>(async (req, res) => {
    const credentials = req.body
    const user = await CreateNewUserService(credentials)
    res.status(201).send(user)
})

export const Login = middleware<{}, CredentialsDTO>(async (req, res) => {
    const credentials = req.body
    const user = await LoginService(credentials)
    const session = await createSession(res, user.id)
    res.send({ message: 'Success' })
})

export const UpdateUser = userMiddleware<{ id: string }, UpdateUserDTO>(async (req, res) => {
    const { id } = req.params
    const userDto = req.body
    const updatedUser = await UpdateUserService(req.user, id, userDto)
    res.send(updatedUser)
})

