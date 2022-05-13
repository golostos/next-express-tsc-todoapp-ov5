import { Router } from "express";
import { checkSession } from '../../services/auth-service';
// import { verifyToken } from "../../service/auth-service";
import { CreateNewTask, DeleteTask, GetAllTasks, GetTaskById, UpdateTask } from "./tasks.controller";

const tasksRouter = Router()

tasksRouter.get('/tasks', checkSession, GetAllTasks)

tasksRouter.get('/tasks/:id', checkSession, GetTaskById)

tasksRouter.post('/tasks', checkSession, CreateNewTask)

tasksRouter.patch('/tasks/:id', checkSession, UpdateTask)

tasksRouter.delete('/tasks/:id', checkSession, DeleteTask)

export default tasksRouter