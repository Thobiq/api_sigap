const express = require('express')
const adminController = require('../controllers/admin.controller')
const authMiddleware = require('../middleware/auth.middleware')

const router = express.Router()

router.post(
    '/responders',
    authMiddleware.authenticateToken, 
    authMiddleware.isAdmin,          
    adminController.addResponderInstitution
);


module.exports = router;