import type { Event, Ticket } from "@/types"
const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

async function req<T> (path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(`${BASE}${path}`, {
		headers: { 'Content-Type': 'application/json' },
		...init,
	})
	if (!res.ok) throw new Error(await res.text())
	return res.json() as Promise<T>
}

export const api = {
	events: {
		list: () => req<Event[]>('/events'),
		get: (id: string) => req<Event>(`/events/${id}`),
	},
	tickets: {
		buy: (body: { eventId: string; buyerEmail: string }) =>
			req('/tickets/buy', { method: 'POST', body: JSON.stringify(body) }),
		mine: (email: string) =>
			req<Ticket[]>(`/tickets/my?email=${encodeURIComponent(email)}`),
	},
}
