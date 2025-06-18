const express = require('express')
const uploadController = require('../controllers/upload.controller')
const upload = require('../utils/multer_conifg')
const authMiddleware = require('../middleware/auth.middleware')

const router = express.Router()

router.post('/image',
    authMiddleware.authenticateToken,
    authMiddleware.isPelapor,
    upload.single('image'),
    uploadController.uploadImage
)

module.exports = router