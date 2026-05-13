import { Request, Response, NextFunction } from 'express'
import { PaymentService } from './payment.service'

export class PaymentController {
  private service = new PaymentService()

  webhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.handleWebhook(req.body)
      return res.status(200).send()
    } catch (err) { next(err) }
  }
}
