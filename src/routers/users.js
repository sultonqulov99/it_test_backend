import validation from "../midllewares/validation.js";
import controller from '../controllers/users.js'
import { Router } from "express";

const router = Router()

router.post('/api/register',validation,controller.POST)
router.post('/api/login',validation,controller.POST_LOGIN)
router.get('/api/users',controller.GET_USERS)
router.get('/api/user/:u_id',controller.GET_USER)
router.get('/api/users/token',controller.TOKEN_VERIFY)

router.get('/api/users/status/all',controller.STATUS) //postman
router.get('/api/users/statusId/:token',controller.GET_STATUS)
router.get('/api/users/:statusId',controller.get_STATUS)
router.post('/api/statusAdd',validation,controller.POST_STATUS) //postman
router.delete("/api/status-delete/:statusId",controller.DELETE_STATUS) //postman
router.put("/api/status-update/:statusId",controller.UPDATE_STATUS) //postman

router.post('/api/subjectAdd',validation,controller.POST_SUBJECT) //postman
router.get('/api/users/subjects/all',controller.SUBJECT_ALL) //postman
router.get('/api/subject/:subjectName',controller.SUBJECT)
router.get('/api/users/subject/:subject_id',controller.get_SUBJECT)
router.get('/api/users/subjects/:subject_id',controller.get_SUBJECTS)
router.put('/api/users/subject',controller.SUBJECT_UPDATE)
router.put('/api/subject-update/:subjectId',controller.UPDATE_SUBJECT)
router.delete("/api/subject-delete/:subjectId",controller.DELETE_SUBJECT)

router.get('/api/users/keyBall/userSubject_id',controller.KEY_BALL)
router.get('/api/users/keyBall/:id',controller.KEYS_BALLS)
router.get('/api/levelOne',controller.GET_LEVEL)

router.put('/api/users/keyBall/userSubject_id',controller.KEY_UPDATE)
router.put('/api/users/keyBall/attempts',controller.ATTEMPTS_UPDATE)
router.put('/api/users/level',controller.LEVEL_UPDATE)
router.put('/api/users/update/info',controller.USER_UPDATE)

router.post('/api/contact',validation,controller.CONTACT)
router.get('/api/contacts',controller.CONTACTS)
router.delete('/api/delete-contact/:contactId',controller.CONTACT_DELETE)


export default router