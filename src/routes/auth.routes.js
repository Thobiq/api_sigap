const express = require('express')
const authController = require('../controllers/auth.controller')

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API untuk proses autentikasi (Pelapor dan Admin)
 */

/**
 * @swagger
 * /auth/pelapor-auth:
 *   post:
 *     summary: Login Pelapor
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login admin berhasil.
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
 *                   example: "Pelapor login successful"
 *                 token:
 *                   type: string
 *                   description: JWT kustom untuk pelapor.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     email:
 *                       type: string
 *                       example: "user@sigap.com"
 *                     name:
 *                       type: string
 *                       example: "Pengguna SIGAP"
 *                     phoneNumber:
 *                       type: string
 *                       example: "0812345678910"
 *                     avatarUrl:
 *                       type: string
 *                       example: "avatar.jpg"
 *                     role:
 *                       type: string
 *                       example: "pelapor"
 *       400:
 *         description: Permintaan tidak valid (email/password tidak disertakan).
 *       401:
 *         description: Kredensial atau peran admin tidak valid.
 *       500:
 *         description: Server error.
 */
router.post('/pelapor-auth', authController.handlePelaporAuth)

/**
 * @swagger
 * /auth/admin-login:
 *   post:
 *     summary: Login Admin
 *     tags: [Authentication]
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
 *                 example: "admin@sigap.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "adminpassword123"
 *     responses:
 *       200:
 *         description: Login admin berhasil.
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
 *                   example: "Admin login successful"
 *                 token:
 *                   type: string
 *                   description: JWT kustom untuk admin.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     email:
 *                       type: string
 *                       example: "admin@sigap.com"
 *                     name:
 *                       type: string
 *                       example: "Super Admin SIGAP"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *       400:
 *         description: Permintaan tidak valid (email/password tidak disertakan).
 *       401:
 *         description: Kredensial atau peran admin tidak valid.
 *       500:
 *         description: Server error.
 */
router.post('/admin-login', authController.loginAdmin);

module.exports = router