import controller from '../controllers/admin.js'
import { Router } from "express";

const router = Router()

router.post('/api/admin/login',controller.POST_LOGIN)
router.post('/api/admin/register',controller.POST_REGISTER)

router.put('/api/admin-update/',controller.UPDATE)


export default router