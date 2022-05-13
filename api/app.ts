import { config } from "dotenv";
import path from "path";
if (process.env.NODE_ENV === 'production') {
  config({ path: path.resolve(process.cwd(), '.env.production') })
} else config()
import cors from "cors";
import express, { ErrorRequestHandler } from "express";
import tasksRouter from "./features/tasks/tasks.router";
import HttpError from './services/httpError';
import usersRouter from "./features/users/users.router";
import cookieParser from 'cookie-parser';

const port = process.env.PORT || 4000

const app = express();

app.use(cors())
app.use('/api', express.json())
app.use(cookieParser());

app.use('/api', tasksRouter)
app.use('/api', usersRouter)

const nextError: ErrorRequestHandler = (err: HttpError, req, res, next) => {
  res.status(err.status || 500).send({
    message: err.message,
    name: err.name || 'UnknownError'
  })
}

app.use(nextError)

app.listen(port, () => {
  console.log('Server started at http://localhost:' + port)
})