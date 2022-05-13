import { Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import { nanoid } from 'nanoid';
import crypto from "crypto"
import db from '../../prisma';

export async function createPasswordHash(password: string) {
  const salt = await bcryptjs.genSalt(10)
  return bcryptjs.hash(password, salt)
}

export async function comparePassword(password: string, hash: string) {
  if (typeof password === 'string') {
    const result = await bcryptjs.compare(password, hash)
    return result
  }
  else return false
}

export async function createSession(res: Response, userId: string) {
  const sid = nanoid() // Example: WKlEdLMwTjJE9cSfOuniI
  const token = sign(sid, process.env.SECRET || 'WKlEdLMwTjJE9cSfOuniI') // WKlEdLMwTjJE9cSfOuniI.KKF2QT4fwpMeJf36POk6yJV_adQssw5c // DB + JWT
  res.cookie('sid', token, { httpOnly: true, maxAge: 2 * 24 * 60 * 60 * 1000 })
  const session = await db.session.create({
    data: {
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      sessionToken: sid,
      userId
    }
  })
  return session
}

export async function checkSession(req: Request, res: Response, next: NextFunction) {
  const sidCookie: string = req.cookies['sid']
  if (sidCookie) {
    const sid = unsign(sidCookie, process.env.SECRET || 'WKlEdLMwTjJE9cSfOuniI')
    if (typeof sid === 'string') {
      const session = await db.session.findUnique({
        where: { sessionToken: sid },
        include: { user: true }
      })
      if (session) {
        if (+session.expires > Date.now()) {
          req.user = session.user
          return next()
        }
        await db.session.delete({ where: { sessionToken: sid } })
        res.clearCookie('sid')
      }
    }
  }
  res.status(401).send({ status: 'Wrong session' })
}

function sign(token: string, secret: string) {
  return token + '.' + crypto
    .createHmac('sha256', secret)
    .update(token)
    .digest('base64')
    .replace(/\=+$/, '');
};

export function unsign(val: string, secret: string) {
  const str = val.slice(0, val.lastIndexOf('.'));
  const mac = sign(str, secret);
  return sha1(mac) === sha1(val) ? str : false;
};

function sha1(str: string) {
  return crypto.createHash('sha1').update(str).digest('hex');
}