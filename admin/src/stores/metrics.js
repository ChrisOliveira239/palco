import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const { VITE_API_METRICS: url } = import.meta.env;

export const useMetricsStore = defineStore('metrics', () => {
	const summary = ref(null)
	const loading = ref(false)
	const error = ref(null)

	const totalRevenue = computed(() => summary.value?.total_revenue ?? 0)
	const totalTickets = computed(() => summary.value?.total_tickets ?? 0)

	async function fetchSummary(artistId) {
		loading.value = true
		error.value = null

		try {
			const res = await fetch(`${url}/metrics/artist/${artistId}`)

			summary.value = await res.json()
		} catch (e) {
			error.value = e.message
		} finally {
			loading.value = false
		}
	}

	return { summary, loading, error, totalRevenue, totalTickets, fetchSummary }
})
