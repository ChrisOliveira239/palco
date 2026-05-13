import { Router } from 'express'
import { PaymentController } from './payment.controller'

const paymentRoutes = Router()
const controller = new PaymentController()

paymentRoutes.post('/webhook', controller.webhook)

export { paymentRoutes }
