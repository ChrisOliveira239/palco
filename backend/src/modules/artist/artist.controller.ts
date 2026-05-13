import { Request, Response, NextFunction } from 'express'
import { ArtistService } from './artist.service'
import { z } from 'zod'

const updateSchema = z.object({
	name: z.string().min(2).optional(),
	bio: z.string().optional(),
})

export class ArtistController {
	private service = new ArtistService()

	list = async (_req: Request, res: Response, next: NextFunction) => {
		try {
			return res.json(await this.service.list())
		} catch (err) { next(err) }
	}

	getOne = async (req: Request, res: Response, next: NextFunction) => {
		try {
			return res.json(await this.service.getOne(req.params.id as string))
		} catch (err) {
			next(err)
		}
	}

	updateMe = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = updateSchema.parse(req.body);

			return res.json(await this.service.update(req.user.sub, data))
		} catch (err) { next(err) }
	}
}
