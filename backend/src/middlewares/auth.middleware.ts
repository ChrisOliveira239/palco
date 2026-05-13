import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from './error.middleware'

interface JwtPayload {
	sub: string
	role: string
}

export function authMiddleware (req: Request, _res: Response, next: NextFunction) {
	const auth = req.headers.authorization
	if (!auth?.startsWith('Bearer ')) throw new AppError('Token ausente', 401)

	const token = auth.split(' ')[ 1 ]

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
		req.user = payload
		next()
	} catch {
		throw new AppError('Token inválido', 401)
	}
}
