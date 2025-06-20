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
 *     summary: Autentikasi atau Daftar Pelapor (via Google atau Email/Password Firebase)
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
 *                 description: Firebase ID Token yang diperoleh dari proses autentikasi Google atau Email/Password di aplikasi Flutter.
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Autentikasi berhasil. Mengembalikan JWT kustom dari backend dan data pengguna.
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
 *                   example: "Authentication successful"
 *                 token:
 *                   type: string
 *                   description: JWT kustom dari backend untuk otorisasi selanjutnya.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "user@mail.com"
 *                     name:
 *                       type: string
 *                       nullable: true
 *                       example: "Nama Pengguna"
 *                     phoneNumber:
 *                       type: string
 *                       nullable: true
 *                       example: "081234567890"
 *                     avatarUrl:
 *                       type: string
 *                       nullable: true
 *                       example: "https://example.com/avatar.jpg"
 *                     role:
 *                       type: string
 *                       example: "pelapor"
 *       400:
 *         description: Permintaan tidak valid (misal: idToken tidak disertakan).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "ID Token is required."
 *       401:
 *         description: Autentikasi gagal (misal: ID Token kadaluarsa atau tidak valid).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Authentication failed"
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