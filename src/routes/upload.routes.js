const express = require('express')
const uploadController = require('../controllers/upload.controller')
const upload = require('../utils/multer_conifg')
const authMiddleware = require('../middleware/auth.middleware')

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: File Upload
 *   description: API untuk mengunggah file (gambar)
 */

/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Unggah gambar untuk laporan
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []  # Membutuhkan JWT (autentikasi)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: File gambar yang akan diunggah. Nama field di form-data harus 'image'.
 *     responses:
 *       200:
 *         description: Gambar berhasil diunggah dan URL-nya dikembalikan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Gambar berhasil diunggah."
 *                 url:
 *                   type: string
 *                   example: "http://localhost:3000/uploads/image-1700000000000-12345.png"
 *       400:
 *         description: Tidak ada file diunggah atau jenis file tidak valid.
 *       401:
 *         description: Tidak terautentikasi (Tidak ada token atau token tidak valid).
 *       403:
 *         description: Tidak memiliki izin (bukan pelapor).
 *       500:
 *         description: Server error saat mengunggah.
 */
router.post('/image',
    authMiddleware.authenticateToken,
    authMiddleware.isPelapor,
    upload.single('image'),
    uploadController.uploadImage
)

module.exports = router