import { NextFunction, Request, Response } from "express"
import logger from '../logger.ts'

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err)
  res.status(500).send({ errors: [{ status: 500, message: "Internal Server Error" }] })
  next()
}

export default errorHandler