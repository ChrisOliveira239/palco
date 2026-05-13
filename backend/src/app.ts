import express from 'express'
import 'dotenv/config'

import { authRoutes } from './modules/auth/auth.routes'
import { artistRoutes } from './modules/artist/artist.routes'
import { eventRoutes } from './modules/event/event.routes'
import { ticketRoutes } from './modules/ticket/ticket.routes'
import { paymentRoutes } from './modules/payment/payment.routes'
import { errorMiddleware } from './middlewares/error.middleware'

const app = express()

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/artists', artistRoutes)
app.use('/events', eventRoutes)
app.use('/tickets', ticketRoutes)
app.use('/payments', paymentRoutes)

app.use(errorMiddleware)

const PORT = process.env.PORT ?? 3333
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

export { app }
