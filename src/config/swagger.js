const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path'); 


const options = {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: 'API Aplikasi Pelaporan Gawat Darurat (SIGAP)', // Judul API Anda
      version: '1.0.0', 
      description: 'Dokumentasi API untuk aplikasi pelaporan gawat darurat SIGAP',
      
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}/api`, 
        description: 'Development Server (Localhost)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { 
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', 
          description: 'Masukkan JWT Token Anda di sini (tanpa prefix "Bearer"). Misalnya: "eyJhbGciOiJIUzI1Ni..."',
        },
      },
    },
  },
  apis: [
    path.resolve(__dirname, '../routes/*.js'),       
    // path.resolve(__dirname, '../models/*.js'),      
    // path.resolve(__dirname, '../controllers/*.js')  
  ],
};

const specs = swaggerJsdoc(options)

module.exports = specs