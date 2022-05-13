import { userMiddleware } from '../../services/controller';
import { CreateTaskDTO, EditTaskDTO } from './tasks.dto';
import { CreateNewTaskService, DeleteTaskService, GetAllTasksService, GetTaskByIdService, UpdateTaskService } from './tasks.service';

export const GetTaskById = userMiddleware<{ id: string }>(async (req, res) => {
    const taskId = req.params.id
    const task = await GetTaskByIdService(req.user.id, taskId)
    res.send(task)
})

export const GetAllTasks = userMiddleware(async (req, res) => {
    const tasks = await GetAllTasksService(req.user.id)
    res.send(tasks)
})

export const CreateNewTask = userMiddleware<{}, CreateTaskDTO>(async (req, res) => {
    const taskDto = req.body
    const newTask = await CreateNewTaskService(taskDto, req.user.id)
    res.status(201).send(newTask)
})

export const UpdateTask = userMiddleware<{ id: string }, EditTaskDTO>(async (req, res) => {
    const taskDto = req.body
    const taskId = req.params.id
    const updatedTask = await UpdateTaskService(req.user.id, taskId, taskDto)
    res.send(updatedTask)
})

export const DeleteTask = userMiddleware<{ id: string }>(async (req, res) => {
    const taskId = req.params.id
    const deletedTask = await DeleteTaskService(req.user.id, taskId)
    res.send(deletedTask)
})