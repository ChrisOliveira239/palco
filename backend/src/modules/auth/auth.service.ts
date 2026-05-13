import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middlewares/error.middleware'

interface RegisterDto {
	email: string
	password: string
	name: string
}

interface LoginDto {
	email: string
	password: string
}

export class AuthService {
	async register ({ email, password, name }: RegisterDto) {
		const exists = await prisma.user.findUnique({ where: { email } })
		if (exists) throw new AppError('Email já cadastrado')

		const hashed = await bcrypt.hash(password, 10)

		const user = await prisma.user.create({
			data: {
				email,
				password: hashed,
				artist: { create: { name } },
			},
			include: { artist: true },
		})

		const token = this.signToken(user.id, user.role)
		return { token, user: { id: user.id, email: user.email, role: user.role } }
	}

	async login ({ email, password }: LoginDto) {
		const user = await prisma.user.findUnique({ where: { email } })
		if (!user) throw new AppError('Credenciais inválidas', 401)

		const valid = await bcrypt.compare(password, user.password)
		if (!valid) throw new AppError('Credenciais inválidas', 401)

		const token = this.signToken(user.id, user.role)
		return { token, user: { id: user.id, email: user.email, role: user.role } }
	}

	private signToken (userId: string, role: string) {
		return jwt.sign(
			{ sub: userId, role },
			process.env.JWT_SECRET!,
			{ expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' } as jwt.SignOptions
		)
	}
}
