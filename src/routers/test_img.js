import controller from '../controllers/test_img.js'
import { Router } from "express";

const router = Router()

router.post('/api/testImgAdd',controller.POST_QUESTION_IMG)
router.post('/api/testImgAnswer/userSubject_id',controller.POST_ANSWER_IMG)

router.get('/api/testImgLevel',controller.GET)
router.get('/api/testImg/all',controller.GET_TESTIMG)

router.delete("/api/delete-testImg/:testImgId",controller.DELETE)

export default router