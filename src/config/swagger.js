// src/config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path'); // Diperlukan untuk path.resolve

// Konfigurasi dasar untuk spesifikasi OpenAPI
const options = {
  definition: {
    openapi: '3.0.0', // Versi OpenAPI yang digunakan (disarankan 3.0.0 atau lebih baru)
    info: {
      title: 'API Aplikasi Pelaporan Gawat Darurat (SIGAP)', // Judul API Anda
      version: '1.0.0', // Versi API Anda
      description: 'Dokumentasi API untuk aplikasi pelaporan gawat darurat SIGAP. Mencakup endpoint untuk Pelapor, Responden (Institusi), Admin, dan fitur umum seperti upload.',
      contact: {
        name: 'Tim SIGAP', // Nama tim atau kontak
        url: 'https://github.com/Thobiq/pa_paa_api-sigap', // Ganti dengan URL repositori atau situs Anda
        email: 'support@sigapapp.com', // Ganti dengan email kontak
      },
    },
    // Definisi server tempat API Anda berjalan
    servers: [
      {
        // Gunakan variabel lingkungan PORT dari .env
        url: `http://localhost:${process.env.PORT || 3000}/api`, // URL dasar API Anda saat pengembangan
        description: 'Development Server (Localhost)',
      },
      // Anda bisa menambahkan server produksi nanti jika sudah di-deploy
      // {
      //   url: 'https://api.sigap.com/api',
      //   description: 'Production Server',
      // },
    ],
    // Definisi komponen keamanan (untuk JWT - Bearer Token)
    components: {
      securitySchemes: {
        bearerAuth: { // Nama skema keamanan ini akan digunakan di anotasi endpoint
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Menunjukkan ini adalah JSON Web Token
          description: 'Masukkan JWT Token Anda di sini (tanpa prefix "Bearer"). Misalnya: "eyJhbGciOiJIUzI1Ni..."',
        },
      },
    },
    // Opsi keamanan global (opsional, bisa juga per endpoint)
    // Jika didefinisikan di sini, semua endpoint defaultnya akan memerlukan otentikasi
    // security: [
    //   {
    //     bearerAuth: [],
    //   },
    // ],
  },
  // Path ke file-file yang berisi anotasi JSDoc untuk dokumentasi API
  // Path ini relatif terhadap direktori tempat Anda menjalankan `swaggerJsdoc(options)`
  // atau relatif terhadap file ini sendiri jika menggunakan path.resolve(__dirname, ...)
  apis: [
    path.resolve(__dirname, '../routes/*.js'),       // Cari anotasi di semua file route
    // path.resolve(__dirname, '../models/*.js'),      // Opsional: jika Anda ingin mendefinisikan skema model di sini
    // path.resolve(__dirname, '../controllers/*.js')  // Opsional: bisa juga anotasi di controller
  ],
};

const specs = swaggerJsdoc(options); // Buat spesifikasi OpenAPI dari opsi di atas

module.exports = specs; // Ekspor spesifikasi ini