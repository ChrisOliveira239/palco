import { Request, Response, NextFunction } from 'express'
import { EventService } from './event.service'
import { z } from 'zod'

const createSchema = z.object({
	title: z.string().min(3),
	city: z.string().min(2),
	date: z.string().datetime(),
	price: z.number().min(0),
})

const updateSchema = createSchema.partial().extend({
	status: z.enum([ 'DRAFT', 'PUBLISHED', 'CANCELLED' ]).optional(),
})

export class EventController {
	private service = new EventService()

	list = async (_req: Request, res: Response, next: NextFunction) => {
		try {
			return res.json(await this.service.list())
		} catch (err) { next(err) }
	}

	getOne = async (req: Request, res: Response, next: NextFunction) => {
		try {
			return res.json(await this.service.getOne(req.params.id as string))
		} catch (err) { next(err) }
	}

	create = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = createSchema.parse(req.body)
			
			return res.status(201).json(await this.service.create(req.user.sub, data))
		} catch (err) { next(err) }
	}

	update = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = updateSchema.parse(req.body)
			return res.json(await this.service.update(req.params.id as string, req.user.sub, data))
		} catch (err) { next(err) }
	}

	remove = async (req: Request, res: Response, next: NextFunction) => {
		try {
			await this.service.remove(req.params.id as string, req.user.sub)
			return res.status(204).send()
		} catch (err) { next(err) }
	}
}
