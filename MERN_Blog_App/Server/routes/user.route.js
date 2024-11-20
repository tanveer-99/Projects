import { Router } from 'express'
import { test, updateUser, deleteUser, signOut } from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js'
const router = Router()

router.get('/', test)
router.put('/update/:userId', verifyToken, updateUser)
router.delete('/delete/:userId', verifyToken, deleteUser)
router.post('/signout', signOut)

export default router