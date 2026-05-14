import { defineStore } from 'pinia'
import { ref } from 'vue'

const { VITE_API_BACKEND: url } = import.meta.env

export const useEventsStore = defineStore('events', () => {
	const events = ref([])
	const loading = ref(false)
	const error = ref(null)

	async function fetchEvents() {
		loading.value = true
		error.value = null
		try {
			const res = await fetch(`${url}/events`)
			events.value = await res.json()
		} catch (e) {
			error.value = e.message
		} finally {
			loading.value = false
		}
	}

	return { events, loading, error, fetchEvents }
})
