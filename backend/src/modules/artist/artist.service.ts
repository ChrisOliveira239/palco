import { prisma } from '../../lib/prisma'
import { AppError } from '../../middlewares/error.middleware'

export class ArtistService {
	list () {
		return prisma.artist.findMany({
			select: { id: true, name: true, bio: true },
		})
	}

	async getOne (id: string) {
		const artist = await prisma.artist.findUnique({
			where: { id },
			include: {
				events:
				{
					where: { status: 'PUBLISHED' }
				}
			},
		})

		if (!artist) throw new AppError('Artista não encontrado', 404);
		
		return artist
	}

	async update (userId: string, data: { name?: string; bio?: string }) {
		const artist = await prisma.artist.findUnique({ where: { userId } })
		if (!artist) throw new AppError('Artista não encontrado', 404)
		return prisma.artist.update({ where: { id: artist.id }, data })
	}
}
