const express = require('express');
const emergencyReportController = require('../controllers/emergency_report.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Emergency Reports (Pelapor)
 *   description: Operasi terkait Laporan Gawat Darurat yang dibuat oleh Pelapor
 */

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: Membuat laporan gawat darurat baru
 *     tags: [Emergency Reports (Pelapor)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - latitude
 *               - longitude
 *               - reportType
 *             properties:
 *               latitude:
 *                 type: number
 *                 format: float
 *                 example: -8.151234
 *                 description: Latitude lokasi kejadian.
 *               longitude:
 *                 type: number
 *                 format: float
 *                 example: 113.725678
 *                 description: Longitude lokasi kejadian.
 *               reportType:
 *                 type: string
 *                 enum: [Kebakaran, Kecelakaan, Medis, Kriminalitas, Bencana Alam, Lainnya]
 *                 example: "Kecelakaan"
 *                 description: Tipe insiden darurat.
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Terjadi kecelakaan motor dan mobil di persimpangan jalan."
 *                 description: Deskripsi singkat tentang insiden (opsional).
 *               imageUrl:
 *                 type: string
 *                 nullable: true
 *                 example: "http://localhost:3000/uploads/image-1700000000000-12345.png"
 *                 description: URL gambar yang diunggah terkait laporan (opsional).
 *     responses:
 *       201:
 *         description: Laporan darurat berhasil dibuat dan responden terdekat telah dinotifikasi.
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
 *                   example: "Laporan darurat berhasil dibuat dan responden terdekat telah dinotifikasi."
 *                 report:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 101
 *                     latitude:
 *                       type: number
 *                       format: float
 *                       example: -8.151234
 *                     longitude:
 *                       type: number
 *                       format: float
 *                       example: 113.725678
 *                     report_type:
 *                       type: string
 *                       example: "Kecelakaan"
 *                     description:
 *                       type: string
 *                       nullable: true
 *                       example: "Terjadi kecelakaan motor dan mobil di persimpangan jalan."
 *                     image_url:
 *                       type: string
 *                       nullable: true
 *                       example: "http://localhost:3000/uploads/image.png"
 *                     status:
 *                       type: string
 *                       example: "Pending"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validasi input gagal.
 *       401:
 *         description: Tidak terautentikasi.
 *       403:
 *         description: Tidak memiliki izin (bukan pelapor).
 *       500:
 *         description: Server error.
 */
router.post(
    '/',
    authMiddleware.authenticateToken,
    authMiddleware.isPelapor,
    emergencyReportController.createReport
)

/**
 * @swagger
 * /reports/my-reports:
 *   get:
 *     summary: Mendapatkan semua laporan yang dibuat oleh pelapor yang sedang login
 *     tags: [Emergency Reports (Pelapor)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar laporan berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 reports:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       user_id:
 *                         type: integer
 *                         example: 101
 *                       latitude:
 *                         type: number
 *                         format: float
 *                         example: -8.151234
 *                       longitude:
 *                         type: number
 *                         format: float
 *                         example: 113.725678
 *                       report_type:
 *                         type: string
 *                         example: "Kecelakaan"
 *                       description:
 *                         type: string
 *                         nullable: true
 *                         example: "Terjadi kecelakaan lalu lintas di perempatan."
 *                       image_url:
 *                         type: string
 *                         nullable: true
 *                         example: "http://localhost:3000/uploads/image.png"
 *                       status:
 *                         type: string
 *                         example: "Pending"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Tidak terautentikasi.
 *       403:
 *         description: Tidak memiliki izin (bukan pelapor).
 *       500:
 *         description: Server error.
 */

router.get(
    '/my-reports',
    authMiddleware.authenticateToken,
    authMiddleware.isPelapor,
    emergencyReportController.getMyReports
)

/**
 * @swagger
 * /reports/{id}:
 *   get:
 *     summary: Mendapatkan detail laporan darurat berdasarkan ID (hanya laporan milik pelapor)
 *     tags: [Emergency Reports (Pelapor)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID dari laporan darurat.
 *     responses:
 *       200:
 *         description: Detail laporan berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 report:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 101
 *                     latitude:
 *                       type: number
 *                       format: float
 *                       example: -8.151234
 *                     longitude:
 *                       type: number
 *                       format: float
 *                       example: 113.725678
 *                     report_type:
 *                       type: string
 *                       example: "Kecelakaan"
 *                     description:
 *                       type: string
 *                       nullable: true
 *                       example: "Motor dan mobil bertabrakan di persimpangan."
 *                     image_url:
 *                       type: string
 *                       nullable: true
 *                       example: "http://localhost:3000/uploads/image.png"
 *                     status:
 *                       type: string
 *                       example: "Pending"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Tidak terautentikasi.
 *       403:
 *         description: Tidak memiliki izin (bukan pelapor atau bukan pemilik laporan).
 *       404:
 *         description: Laporan tidak ditemukan.
 *       500:
 *         description: Server error.
 */

router.get(
    '/:id', 
    authMiddleware.authenticateToken,
    authMiddleware.isPelapor,
    emergencyReportController.getReportDetail
)

module.exports = router;