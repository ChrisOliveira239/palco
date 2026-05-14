<script setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n'
import { useEventsStore } from '../../stores/events';

const { t } = useI18n()
const store = useEventsStore();

onMounted(() => store.fetchEvents());
</script>

<template>
	<div>
		<h2>{{ t('events.title') }}</h2>

		<p v-if="store.loading">{{ t('loading') }}</p>
		<p v-else-if="store.error">{{ store.error }}</p>
		<p v-else-if="!store.events.length">{{ t('events.empty') }}</p>
		<table v-else>
			<thead>
				<tr>
					<th>{{ t('events.col_title') }}</th>
					<th>{{ t('events.col_city') }}</th>
					<th>{{ t('events.col_date') }}</th>
					<th>{{ t('events.col_status') }}</th>

				</tr>
			</thead>
			<tbody>
				<tr v-for="event in store.events" :key="event.id">
					<td>{{ event.title }}</td>
					<td>{{ event.city }}</td>
					<td>{{ new Date(event.date).toLocaleDateString('pt-BR') }}</td>
					<td>{{ event.status }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
