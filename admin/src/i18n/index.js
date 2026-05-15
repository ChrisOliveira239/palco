import { createI18n } from 'vue-i18n'
import ptBR from './locales/pt-BR.json'
import enUS from './locales/en-US.json'

export default createI18n({
	legacy: false,
	locale: 'pt-BR',
	fallbackLocale: 'en-US',
	messages: { 'pt-BR': ptBR, 'en-US': enUS }
})
