import { createRouter, createWebHistory } from 'vue-router'

const routes = [
	{
		path: '/',
		redirect: '/dashboard',
	},
	{
		path: '/dashboard',
		component: () => import('../pages/Dashboard.vue'),
	},
	{
		path: '/events',
		component: () => import('../pages/Events/EventsList.vue'),
	},
	{
		path: '/artists',
		component: () => import('../pages/Artists/ArtistsList.vue'),
	},
	{
		path: '/tickets',
		component: () => import('../pages/Tickets/TicketsList.vue'),
	},
]

export default createRouter({
	history: createWebHistory(),
	routes,
})
