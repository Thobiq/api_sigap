const express = require('express');
const responderController = require('../controllers/responder.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Responders (Institutions)
 *   description: API untuk otentikasi dan pengelolaan Responden (Institusi)
 */

/**
 * @swagger
 * /responders/auth:
 *   post:
 *     summary: Login Responden (Institusi)
 *     tags: [Responders (Institutions)]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "polresjember@sigap.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *               fcmToken:
 *                 type: string
 *                 nullable: true
 *                 description: Firebase Cloud Messaging token perangkat responden (opsional).
 *     responses:
 *       200:
 *         description: Login responden berhasil.
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
 *                   example: "Login responden berhasil."
 *                 token:
 *                   type: string
 *                   description: JWT kustom untuk responden.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 responder:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     email:
 *                       type: string
 *                       example: "polresjember@sigap.com"
 *                     name:
 *                       type: string
 *                       example: "Kantor POLRES Jember"
 *                     type:
 *                       type: string
 *                       example: "Polisi"
 *                     address:
 *                       type: string
 *                       example: "Jl. R.A. Kartini No.17"
 *                     phoneNumber:
 *                       type: string
 *                       example: "+62331484285"
 *                     fcmToken:
 *                       type: string
 *                       nullable: true
 *                       example: "some_fcm_token_string"
 *                     role:
 *                       type: string
 *                       example: "responder"
 *       400:
 *         description: Permintaan tidak valid (email/password tidak disertakan).
 *       401:
 *         description: Kredensial tidak valid atau akun tidak aktif.
 *       500:
 *         description: Server error.
 */
router.post('/auth', responderController.handleResponderAuth)

/**
 * @swagger
 * /responders/fcm-token:
 *   put:
 *     summary: Memperbarui Firebase Cloud Messaging (FCM) token responden (institusi)
 *     tags: [Responders (Institutions)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fcmToken
 *             properties:
 *               fcmToken:
 *                 type: string
 *                 description: FCM token baru dari perangkat responden.
 *                 example: "eHwK7hJ...f0oBfQ"
 *     responses:
 *       200:
 *         description: FCM Token berhasil diperbarui.
 *       400:
 *         description: FCM Token tidak disertakan.
 *       401:
 *         description: Tidak terautentikasi.
 *       403:
 *         description: Tidak memiliki izin (bukan responden atau admin).
 *       404:
 *         description: Responden tidak ditemukan.
 *       500:
 *         description: Server error.
 */
router.put(
    '/fcm-token',
    authMiddleware.authenticateToken,
    authMiddleware.isResponder, 
    responderController.updateResponderFcmToken
)

/**
 * @swagger
 * /responders/availability:
 *   put:
 *     summary: Memperbarui status ketersediaan responden (institusi)
 *     description: Mengubah status 'is_active' dari institusi responden. Digunakan oleh responden itu sendiri atau admin.
 *     tags: [Responders (Institutions)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 description: Status ketersediaan institusi (true untuk aktif, false untuk tidak aktif).
 *                 example: true
 *     responses:
 *       200:
 *         description: Status ketersediaan berhasil diperbarui.
 *       400:
 *         description: Status ketersediaan tidak valid.
 *       401:
 *         description: Tidak terautentikasi.
 *       403:
 *         description: Tidak memiliki izin (bukan responden atau admin).
 *       404:
 *         description: Responden tidak ditemukan.
 *       500:
 *         description: Server error.
 */
router.put(
    '/availability',
    authMiddleware.authenticateToken,
    authMiddleware.isResponder, 
    responderController.updateResponderAvailability
)

module.exports = router;