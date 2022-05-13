export type CredentialsDTO = {
  email: string
  password: string
}

export type UpdateUserDTO = {
  email?: string
  password?: string
  name?: string 
}