export type CreateTaskDTO = {
  text: string
  done?: boolean
}

export type EditTaskDTO = {
  text?: string
  done?: boolean
}