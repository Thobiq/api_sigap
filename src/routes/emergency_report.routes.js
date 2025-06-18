const express = require('express');
const emergencyReportController = require('../controllers/emergency_report.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router()

router.post(
    '/',
    authMiddleware.authenticateToken,
    authMiddleware.isPelapor,
    emergencyReportController.createReport
)

router.get(
    '/my-reports',
    authMiddleware.authenticateToken,
    authMiddleware.isPelapor,
    emergencyReportController.getMyReports
)


router.get(
    '/:id', 
    authMiddleware.authenticateToken,
    authMiddleware.isPelapor,
    emergencyReportController.getReportDetail
)

module.exports = router;