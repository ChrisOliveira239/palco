import { Router } from 'express'
import { ArtistController } from './artist.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const artistRoutes = Router()
const controller = new ArtistController()

artistRoutes.get('/', controller.list)
artistRoutes.get('/:id', controller.getOne)
artistRoutes.put('/me', authMiddleware, controller.updateMe)

export { artistRoutes }
