export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED'
export type TicketStatus = 'ACTIVE' | 'USED' | 'CANCELLED'
export type PaymentStatus = 'PENDING' | 'CONFIRMED' | 'FAILED' | 'REFUNDED'

export interface Artist {
	id: string
	name: string
	bio: string | null
}

export interface Event {
	id: string
	title: string
	city: string
	date: string        // ISO string vindo do backend
	price: string       // Decimal vem como string no JSON
	status: EventStatus
	artist: Artist
}

export interface Ticket {
	id: string
	qrCode: string
	status: TicketStatus
	buyerEmail: string
	event: Event
	payment: { status: PaymentStatus } | null
}
