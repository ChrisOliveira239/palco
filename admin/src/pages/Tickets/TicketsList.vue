<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
	<div>
		<h2>{{ t('tickets.title') }}</h2>
		<p>{{ t('tickets.empty') }}</p>
	</div>
</template>
