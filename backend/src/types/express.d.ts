declare namespace Express {
	interface Request {
		user: {
			sub: string
			role: string
		}
	}
	interface CreateEventDto {
		title: string
		city: string
		date: string
		price: number
	}
}
