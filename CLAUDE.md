# CLAUDE.md — Palco + Vaga Fullstack Junior

## Regras
- Nunca edite arquivos. Explique, deixe dev aplicar.
- pt-BR sempre. Caveman. Sem enrolação.
- Christian = 4+ anos prod. Explique conceitos básicos das linguagens e dê exemplos.

## Dev: Christian Barbosa
**Domina:** JS/TS, Node/Express, React/RN, PHP/Laravel, Prisma, PostgreSQL, Next.js, Docker, Git, Playwright, JWT, AI tools.
**Aprofundar:** Vue 3 (tem React), MongoDB (tem SQL).
**Zerado:** Vue 3 prod, WCAG/ARIA, Codeception, Java.

## Vaga-alvo
Junior Fullstack — time client (sem Electron/C++/Swift).
Stack: PHP + MongoDB + Vue 3 + Pinia + vue-i18n + PHPUnit + Codeception. Java = diferencial.
**Back é o core da vaga — priorizar PHP, testes e MongoDB antes do front.**

## Projeto: Palco
Venda de ingressos para artistas independentes. PIX via Asaas. R$1,00/ingresso. Gratuito = sem taxa.

**Stack:**
- Frontend: Next.js 14 App Router + Tailwind + next-intl
- **Admin: Vue 3 + Vite + Pinia + vue-router + vue-i18n** ← aprende Vue aqui
- Backend: Node/Express/TS + Prisma + PostgreSQL
- **metrics-api: PHP/Laravel + MongoDB** ← aprende PHP+Mongo aqui
- Auth: JWT. Storage: R2. Pay: Asaas. Deploy: Vercel+Railway.

**Pastas:**
```
/frontend     # Next.js
/admin        # Vue 3 (aprendizado)
/backend      # Node/Express
/metrics-api  # PHP+MongoDB (aprendizado)
```

## Schema Prisma (resumido)
User(id,email,password,role) → Artist(name,bio,asaasId) → Event(title,city,date,price,status) → Ticket(qrCode,status) → Payment(asaasId,amount,fee=1.00,status)

## Módulos (ordem de prioridade)

**M1 — PHP/Laravel avançado (ALTA — back é core)**
Já tem base. Aprofundar: Service layer, Repository pattern, Form Requests, Policies, Events/Listeners, Queues.
Curso: Laracasts "Laravel From Scratch" v11 — pular básico, focar segunda metade.
Entregar: metrics-api com arquitetura em camadas (Controller→Service→Repository).

**M2 — PHPUnit + Codeception (ALTA)**
Lacuna real. PHPUnit: mocks, stubs, data providers. Codeception: API testing, auth, assert responses.
Curso: Laracasts "Testing Laravel" + Christoph Rumpel no YouTube (PHPUnit).
Entregar: suite de testes unitários + endpoint tests na metrics-api.

**M3 — MongoDB (ALTA)**
Lacuna real. Aggregation Pipeline, modelagem, indexes. Estuda junto com M1/M2 (metrics-api usa Mongo).
Curso: MongoDB University M001 (grátis) + "MongoDB com Laravel" no YouTube.
SQL→Mongo: tabela=collection, JOIN=$lookup, GROUP BY=$group, WHERE=$match.
Entregar: metrics-api Laravel+MongoDB (vendas, receita, tickets).

**M4 — Vue 3 (ALTA — front secundário)**
Lacuna real, mas menos crítico que o back. Parta do React.
Curso: Vue Mastery "Intro to Vue 3" (grátis) + "Vue 3 + Pinia" (pago).
React→Vue: useState=ref, useEffect=watch/onMounted, Redux=Pinia, hooks=composables, memo=computed, children=slot.
Entregar: painel admin com Pinia+vue-router+vue-i18n.

**M5 — Acessibilidade WCAG (ALTA — clientes governo)**
Lacuna real. WCAG AA, ARIA, semântica, teclado, contraste, axe/Lighthouse.
Curso: "Web Accessibility" Google/Udacity (grátis) + prática com axe DevTools.
Entregar: auditoria+correções no painel Vue.

**M6 — Java (BAIXA — diferencial)**
Só após M1-M5. Spring Boot básico, leitura de código.
Curso: Amigoscode "Spring Boot Quickstart" (grátis, YouTube).

## Ordem execução
Backend Node → Frontend Next → **M1 PHP avançado → M2 Testes PHP → M3 MongoDB** → M4 Vue admin → M5 Acessibilidade → M6 Java

## Uso
Cole este arquivo + diga: "Módulo X. Quero [objetivo]. Me ajuda com [tarefa]."

## Entrevista
Vue sem prod: "Estudei diffs, construí painel Vue 3 no Palco — posso mostrar código."
Fortes: PHP principal, 4+ anos prod, AI tools, Playwright, Palco como portfólio.
