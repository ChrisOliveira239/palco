import axios from 'axios'

const asaas = axios.create({
	baseURL: process.env.ASAAS_BASE_URL,
	headers: {
		access_token: process.env.ASAAS_API_KEY,
		'Content-Type': 'application/json',
	},
})

interface CreateChargeDto {
	buyerEmail: string
	amount: number
	ticketId: string
	description: string
}

export class AsaasService {
	async getOrCreateCustomer (email: string): Promise<string> {
		const { data: existing } = await asaas.get(`/customers?email=${email}`)
		if (existing.data.length > 0) return existing.data[ 0 ].id

		const { data: created } = await asaas.post('/customers', {
			name: email,
			email,
			notificationDisabled: true,
		})
		return created.id
	}

	async createPixCharge ({ buyerEmail, amount, ticketId, description }: CreateChargeDto) {
		const customerId = await this.getOrCreateCustomer(buyerEmail)

		const { data } = await asaas.post('/payments', {
			customer: customerId,
			billingType: 'PIX',
			value: amount + 1, // R$1 taxa Palco
			dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[ 0 ],
			description,
			externalReference: ticketId,
		})

		const { data: pix } = await asaas.get(`/payments/${data.id}/pixQrCode`)

		return { id: data.id, pixQrCode: pix.encodedImage }
	}
}
