import { Request, Response, NextFunction } from 'express'
import { TicketService } from './ticket.service'
import { z } from 'zod'

const buySchema = z.object({
	eventId: z.string(),
	buyerEmail: z.string().email(),
})

export class TicketController {
	private service = new TicketService()

	buy = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = buySchema.parse(req.body)
			return res.status(201).json(await this.service.buy(data))
		} catch (err) { next(err) }
	}

	validate = async (req: Request, res: Response, next: NextFunction) => {
		try {
			return res.json(await this.service.validate(req.params.id as string))
		} catch (err) { next(err) }
	}

	myTickets = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const email = z.string().email().parse(req.query.email)
			return res.json(await this.service.findByEmail(email))
		} catch (err) { next(err) }
	}
}
