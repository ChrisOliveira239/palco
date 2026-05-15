<script setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n'
import { useArtistsStore } from '../../stores/artists';

const { t } = useI18n()
const store = useArtistsStore();

onMounted(() => store.fetchArtists());
</script>

<template>
	<div>
		<h2>{{ t('artists.title') }}</h2>

		<p v-if="store.loading">{{ t('loading') }}</p>
		<p v-else-if="store.error">{{ store.error }}</p>
		<p v-else-if="!store.artists.length">{{ t('artists.empty') }}</p>
		<ul v-else>
			<li v-for="artists in store.artists" :key="artists.id">
				{{ artists.name }}
			</li>
		</ul>
	</div>
</template>
