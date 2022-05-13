import db from '../../../prisma'
import HttpError from '../../services/httpError'
import { CreateTaskDTO, EditTaskDTO } from './tasks.dto'

export const GetAllTasksService = async (userId: string) => {
    const tasks = await db.task.findMany({ where: { userId } })
    if (tasks.length === 0) throw new HttpError(404, 'Can\'t find any tasks')
    return tasks
}

export const CreateNewTaskService = async (taskDto: CreateTaskDTO, userId: string) => {
    const task = await db.task.create({
        data: { ...taskDto, userId }
    })
    return task
}

export const GetTaskByIdService = async (userId: string, taskId: string) => {
    const task = await db.task.findUnique({ where: { id: taskId } })
    if (task === null) throw new HttpError(404, 'Can\'t find this task')
    if (task.userId !== userId) throw new HttpError(403, 'Permission denied')
    return task
}

export const DeleteTaskService = async (userId: string, taskId: string) => {
    const task = await db.task.findUnique({ where: { id: taskId } })
    if (task === null) throw new HttpError(404, 'Can\'t find this task')
    if (task.userId !== userId) throw new HttpError(403, 'Permission denied')
    return db.task.delete({ where: { id: taskId } })
}

export const UpdateTaskService = async (userId: string, taskId: string, taskDto: EditTaskDTO) => {
    const task = await db.task.findUnique({ where: { id: taskId } })
    if (task === null) throw new HttpError(404, 'Can\'t find this task')
    if (task.userId !== userId) throw new HttpError(403, 'Permission denied')
    const updatedTask = await db.task.update({ 
        where: { id: taskId },
        data: taskDto 
    })
    return updatedTask
}