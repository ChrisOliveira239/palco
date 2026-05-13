import { Router } from 'express'
import { EventController } from './event.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const eventRoutes = Router()
const controller = new EventController()

eventRoutes.get('/', controller.list)
eventRoutes.get('/:id', controller.getOne)
eventRoutes.post('/', authMiddleware, controller.create)
eventRoutes.put('/:id', authMiddleware, controller.update)
eventRoutes.delete('/:id', authMiddleware, controller.remove)

export { eventRoutes }
