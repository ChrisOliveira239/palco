import { defineStore } from 'pinia'
import { ref } from 'vue'

const { VITE_API_BACKEND: url } = import.meta.env

export const useArtistsStore = defineStore('artists', () => {
	const artists = ref([])
	const loading = ref(false)
	const error = ref(null)

	async function fetchArtists() {
		loading.value = true
		error.value = null

		try {
			const res = await fetch(`${url}/artists`)
			
			artists.value = await res.json()
		} catch (e) {
			error.value = e.message
			console.log(e);
		} finally {
			loading.value = false
		}
	}

	return { artists, loading, error, fetchArtists }
})
