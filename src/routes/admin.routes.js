const express = require('express')
const adminController = require('../controllers/admin.controller')
const authMiddleware = require('../middleware/auth.middleware')

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API untuk fungsi-fungsi administrasi sistem
 */

/**
 * @swagger
 * /admin/responders:
 *   post:
 *    summary: Menambah institusi responden baru (oleh Admin)
 *    tags: [Admin]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         required:
 *          - email
 *          - password
 *          - name
 *          - type
 *          - latitude
 *          - longitude
 *         properties:
 *          email:
 *           type: string
 *           format: email
 *           example: "puskesmas.jember@sigap.com"
 *          password:
 *           type: string
 *           format: password
 *           example: "passwordpuskesmas123"
 *          name:
 *           type: string
 *           example: "Puskesmas Jember Kota"
 *          type:
 *           type: string
 *           enum: [Rumah Sakit, Polisi, Pemadam Kebakaran, Lainnya, Admin]
 *           example: "Rumah Sakit"
 *          latitude:
 *           type: number
 *           format: float
 *           example: -8.175000
 *          longitude:
 *           type: number
 *           format: float
 *           example: 113.710000
 *          address:
 *           type: string
 *           nullable: true
 *           example: "Jl. Raya Jember No.100"
 *          phoneNumber:
 *           type: string
 *           nullable: true
 *           example: "+62331123456"
 *    responses:
 *     201:
 *      description: Institusi responden berhasil ditambahkan.
 *     400:
 *      description: Validasi input gagal.
 *     401:
 *      description: Tidak terautentikasi.
 *     403:
 *      description: Tidak memiliki izin (bukan admin).
 *     409:
 *      description: Email sudah terdaftar.
 *     500:
 *      description: Server error.
 */
router.post(
    '/responders',
    authMiddleware.authenticateToken, 
    authMiddleware.isAdmin,          
    adminController.addResponderInstitution
);


module.exports = router;