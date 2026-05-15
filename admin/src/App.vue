<script setup>
import { useI18n } from 'vue-i18n'
import { RouterView, RouterLink } from 'vue-router'

const { t } = useI18n()
</script>

<template>
	<div class="app">
		<nav class="sidebar">
			<h1>Palco Admin</h1>
			<RouterLink to="/dashboard">{{ t('nav.dashboard') }}</RouterLink>
			<RouterLink to="/events">{{ t('nav.events') }}</RouterLink>
			<RouterLink to="/artists">{{ t('nav.artists') }}</RouterLink>
			<RouterLink to="/tickets">{{ t('nav.tickets') }}</RouterLink>
		</nav>
		<main class="content">
			<RouterView />
		</main>
	</div>
</template>

<style scoped>
.app {
	display: flex;
	min-height: 100vh;
}

.sidebar {
	width: 200px;
	background: #1a1a2e;
	color: white;
	padding: 1.5rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.sidebar h1{
	line-height: 1;
}

.sidebar a {
	color: #ccc;
	text-decoration: none;
}

.sidebar a.router-link-active {
	color: white;
	font-weight: bold;
}

.content {
	flex: 1;
	padding: 2rem;
}
</style>
