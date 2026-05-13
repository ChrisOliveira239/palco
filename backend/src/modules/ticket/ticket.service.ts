import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../../lib/prisma'
import { AppError } from '../../middlewares/error.middleware'
import { AsaasService } from '../payment/asaas.service'

interface BuyDto {
	eventId: string
	buyerEmail: string
}

export class TicketService {
	private asaas = new AsaasService()

	async buy ({ eventId, buyerEmail }: BuyDto) {
		const event = await prisma.event.findUnique({ where: { id: eventId } })
		if (!event) throw new AppError('Evento não encontrado', 404)
		if (event.status !== 'PUBLISHED') throw new AppError('Evento não disponível')

		const ticket = await prisma.ticket.create({
			data: {
				qrCode: uuidv4(),
				eventId,
				buyerEmail,
			},
		})

		// evento gratuito — não passa pelo Asaas
		if (Number(event.price) === 0) {
			return { ticket, payment: null, pix: null }
		}

		const charge = await this.asaas.createPixCharge({
			buyerEmail,
			amount: Number(event.price),
			ticketId: ticket.id,
			description: event.title,
		})

		const payment = await prisma.payment.create({
			data: {
				asaasId: charge.id,
				amount: event.price,
				ticketId: ticket.id,
				status: 'PENDING',
			},
		})

		return { ticket, payment, pix: charge.pixQrCode }
	}

	async validate (ticketId: string) {
		const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } })
		
		if (!ticket) throw new AppError('Ingresso não encontrado', 404)
		if (ticket.status === 'USED') throw new AppError('Ingresso já utilizado')
		if (ticket.status === 'CANCELLED') throw new AppError('Ingresso cancelado')

		return prisma.ticket.update({
			where: { id: ticketId, status: 'ACTIVE' },
			data: { status: 'USED' },
		})
	}

	findByEmail (email: string) {
		return prisma.ticket.findMany({
			where: { buyerEmail: email },
			include: { event: { select: { title: true, date: true, city: true } } },
		})
	}
}
