import controller from '../controllers/test.js'
import { Router } from "express";

const router = Router()

router.post('/api/testAdd',controller.POST_QUESTION) //postman
router.post('/api/testAnswer/userSubject_id',controller.POST_ANSWER)

router.get('/api/testLevel',controller.GET)
router.get('/api/test/all',controller.GET_TEST) //postman

router.delete("/api/delete-test/:testId",controller.DELETE)

router.put("/api/test-update/:id",controller.UPDATE)

export default router