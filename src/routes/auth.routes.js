const express = require('express')
const authController = require('../controllers/auth.controller')

const router = express.Router();

router.post('/pelapor-auth', authController.handlePelaporAuth)
router.post('/admin-login', authController.loginAdmin);

module.exports = router