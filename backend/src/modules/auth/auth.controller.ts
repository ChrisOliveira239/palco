import { Request, Response, NextFunction } from 'express'
import { AuthService } from './auth.service'
import { z } from 'zod'

const registerSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
	name: z.string().min(2),
})

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

export class AuthController {
	private service = new AuthService()

	register = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = registerSchema.parse(req.body)
			const result = await this.service.register(data)
			return res.status(201).json(result)
		} catch (err) {
			next(err)
		}
	}

	login = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = loginSchema.parse(req.body)
			const result = await this.service.login(data)
			return res.json(result)
		} catch (err) {
			next(err)
		}
	}
}
