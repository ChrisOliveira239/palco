import { prisma } from '../../lib/prisma'

// Asaas envia vários eventos — só nos importa PAYMENT_RECEIVED
export class PaymentService {
	async handleWebhook (body: { event: string; payment: { id: string; status: string } }) {
		if (body.event !== 'PAYMENT_RECEIVED') return

		const payment = await prisma.payment.findUnique({
			where: { asaasId: body.payment.id },
		})
		
		if (!payment) return

		await prisma.payment.update({
			where: { id: payment.id },
			data: { status: 'CONFIRMED' },
		})
	}
}
