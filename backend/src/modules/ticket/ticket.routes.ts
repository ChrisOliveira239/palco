import { Router } from 'express'
import { TicketController } from './ticket.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const ticketRoutes = Router()
const controller = new TicketController()

ticketRoutes.post('/buy', controller.buy)
ticketRoutes.post('/:id/validate', authMiddleware, controller.validate)
ticketRoutes.get('/my', controller.myTickets)

export { ticketRoutes }
