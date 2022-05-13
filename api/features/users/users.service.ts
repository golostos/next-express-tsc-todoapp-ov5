import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import db, { User } from '../../../prisma';
import { comparePassword, createPasswordHash } from '../../services/auth-service';
import HttpError from '../../services/httpError';
import { CredentialsDTO, UpdateUserDTO } from './users.dto';

export const CreateNewUserService = async ({ email, password }: CredentialsDTO) => {
  try {
    const user = await db.user.create({
      data: {
        email,
        passwordHash: await createPasswordHash(password)
      }
    })
    return user
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError)
      if (error.code === 'P2002') {
        throw new HttpError(400, 'The email is not unique')
      }
    throw error
  }
}

export const LoginService = async ({ email, password }: CredentialsDTO) => {
  const user = await db.user.findUnique({
    where: { email }
  })
  if (user && await comparePassword(password, user.passwordHash)) {
    return user
  }
  throw new HttpError(403, 'Wrong credentials')
}

export const UpdateUserService = async (user: User, userId: string, userDto: UpdateUserDTO) => {
  if (user && user.id === userId) {
    return db.user.update({
      where: { id: userId },
      data: userDto
    })
  }
  throw new HttpError(403, 'Permission denied')
}