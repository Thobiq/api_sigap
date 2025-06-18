const express = require('express');
const responderController = require('../controllers/responder.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router()

router.post('/auth', responderController.handleResponderAuth)

router.put(
    '/fcm-token',
    authMiddleware.authenticateToken,
    authMiddleware.isResponder, 
    responderController.updateResponderFcmToken
)

router.put(
    '/availability',
    authMiddleware.authenticateToken,
    authMiddleware.isResponder, 
    responderController.updateResponderAvailability
)

module.exports = router;