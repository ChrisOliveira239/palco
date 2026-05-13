import { EventStatus } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { AppError } from '../../middlewares/error.middleware'

interface CreateEventDto {
	title: string
	city: string
	date: string
	price: number
}

export class EventService {
	list () {
		return prisma.event.findMany({
			where: { status: 'PUBLISHED' },
			include: { artist: { select: { name: true } } },
			orderBy: { date: 'asc' },
		})
	}

	async getOne (id: string) {
		const event = await prisma.event.findUnique({
			where: { id },
			include: { artist: { select: { name: true, bio: true } } },
		})
		if (!event) throw new AppError('Evento não encontrado', 404)
		return event
	}

	async create (userId: string, data: CreateEventDto) {
		const artist = await prisma.artist.findUnique({ where: { userId } })
		
		if (!artist) throw new AppError('Artista não encontrado', 404)

		return prisma.event.create({
			data: {
				...data,
				date: new Date(data.date),
				artistId: artist.id,
			},
		})
	}

	async update (id: string, userId: string, data: Partial<CreateEventDto> & { status?: EventStatus }) {
		await this.assertOwner(id, userId)
		return prisma.event.update({
			where: { id },
			data: data.date ? { ...data, date: new Date(data.date) } : data,
		})
	}

	async remove (id: string, userId: string) {
		await this.assertOwner(id, userId)
		await prisma.event.delete({ where: { id } })
	}

	private async assertOwner (eventId: string, userId: string) {
		const event = await prisma.event.findUnique({
			where: { id: eventId },
			include: { artist: true },
		})
		if (!event) throw new AppError('Evento não encontrado', 404)
		if (event.artist.userId !== userId) throw new AppError('Sem permissão', 403)
	}
}
