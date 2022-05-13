import { ErrorRequestHandler, NextFunction, Response, Request, RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import db, { User } from '../../prisma';
import { unsign } from './auth-service';
import HttpError from './httpError';

interface ParamsDictionary {
  [key: string]: string;
}

export type IUserRequest<Params = {}, ResBody = any, ReqBody = any> = Request<Params, ResBody, ReqBody> & {
  user: User
}

type UserRequestHandler<Params = ParamsDictionary, ResBody = any, ReqBody = any> =
  (req: IUserRequest<Params, ResBody, ReqBody>, res: Response<ResBody | { error: any }>, next: NextFunction) => any

export interface IController {
  [method: string]: RequestHandler
}

type Layer = {
  handle: UserRequestHandler | ErrorRequestHandler
  name: string
  path: string
}

function catchError(err: HttpError, req: Request, res: Response, next: NextFunction) {
  const routers: Layer[] = req.app._router.stack
  if (routers.find(layer => layer.handle.length === 4)) next(err)
  else res.status(err.status || 500).send({ error: err.message })
}

export function middleware<Params = ParamsDictionary, ReqBody = any, ResBody = any>
  (method: RequestHandler<Params, ResBody, ReqBody>) {
  const decoratedMethod: RequestHandler<Params, ResBody | { error: any }, ReqBody> =
    async function (req, res, next) {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ error: errors.array() });
        }
        return method(req, res, next)
      } catch (error) {
        catchError(error as HttpError, req as Request<any>, res, next)
      }
    }
  return decoratedMethod
}

export function userMiddleware<Params = ParamsDictionary, ReqBody = any, ResBody = any>
  (method: UserRequestHandler<Params, ResBody, ReqBody>) {
  const decoratedMethod: RequestHandler<Params, ResBody | { error: any }, ReqBody> =
    async function (req, res, next) {
      try {
        if (!req.user) throw new HttpError(403, 'Permission denied')
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ error: errors.array() });
        }
        return method(req as IUserRequest<Params, ResBody, ReqBody>, res, next)
      } catch (error) {
        const err = error as HttpError
        if (err.status === 401) {
          const sidCookie: string = req.cookies['sid']
          if (sidCookie) {
            const sid = unsign(sidCookie, process.env.SECRET || 'WKlEdLMwTjJE9cSfOuniI')
            if (typeof sid === 'string') await db.session.delete({ where: { id: sid } })
            res.clearCookie('sid')
          }
        }
        catchError(err, req as Request<any>, res, next)
      }
    }
  return decoratedMethod
}

export function controller<T extends IController>(controllerObj: T): T {
  const decoratedController: IController = {}
  Object.getOwnPropertyNames(controllerObj).map(method => controllerObj[method]).forEach(method => {
    decoratedController[method.name] = middleware(method)
  })
  return decoratedController as T
}