<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMetricsStore } from '../stores/metrics'

const { t } = useI18n()
const metrics = useMetricsStore()
const artistId = ref('')

async function search() {
	if (!artistId.value.trim()) return

	await metrics.fetchSummary(artistId.value.trim())
}
</script>

<template>
	<div>
		<h2>{{ t('dashboard.title') }}</h2>

		<div class="search">
			<label>{{ t('dashboard.search_label') }}</label>
			<input v-model="artistId" type="text" placeholder="art-123" />
			<button @click="search">{{ t('dashboard.search_btn') }}</button>
		</div>

		<p v-if="metrics.loading">{{ t('loading') }}</p>
		<p v-else-if="metrics.error">{{ t('error') }}</p>

		<div v-else-if="metrics.summary" class="cards">
			<div class="card">
				<span>{{ t('dashboard.total_revenue') }}</span>
				<strong>R$ {{ metrics.totalRevenue }}</strong>
			</div>
			<div class="card">
				<span>{{ t('dashboard.total_tickets') }}</span>
				<strong>{{ metrics.totalTickets }}</strong>
			</div>
		</div>
	</div>
</template>

<style scoped>
.search {
	display: flex;
	gap: 0.5rem;
	align-items: center;
	margin-bottom: 1.5rem;
}

.search input {
	padding: 0.4rem 0.8rem;
	border: 1px solid #ccc;
	border-radius: 4px;
}

.search button {
	padding: 0.4rem 1rem;
	background: #1a1a2e;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

.cards {
	display: flex;
	gap: 1rem;
	margin-top: 1rem;
}

.card {
	background: #f4f4f4;
	padding: 1.5rem;
	border-radius: 8px;
	min-width: 160px;
}

.card strong {
	display: block;
	font-size: 1.8rem;
	margin-top: 0.5rem;
}
</style>
