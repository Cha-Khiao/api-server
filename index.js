const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const userRoutes = require('./routes/userRoutes.js');
const hairstyleRoutes = require('./routes/hairstyleRoutes.js');

// Swagger Imports
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Serve static files (e.g., favicon and swagger-custom.js) from the 'public' directory
app.use(express.static('public')); // ให้บริการไฟล์ในโฟลเดอร์ 'public'

// เชื่อมต่อกับ MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected! ฐานข้อมูลเชื่อมต่อสำเร็จแล้ว');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// --- Swagger/OpenAPI Setup ---
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cut Match API',
      version: '1.0.0',
      description: 'API Documentation for Cut Match - Hairstyle Recommendation App',
    },
    servers: [
      {
        url: `https://api-server-seven-zeta.vercel.app/`,
        description: 'Production Server',
        urlLink: 'https://api-server-seven-zeta.vercel.app/',
      },
      {
        url: `http://localhost:${PORT}`,
        description: 'Development Server',
        urlLink: `http://localhost:${PORT}`,
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

// ✨✨✨ ปรับแต่ง Swagger UI ✨✨✨
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css",
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js",
    "/swagger-custom.js",  // โหลดไฟล์จาก public directory
  ],
  customfavIcon: "/favicon/Node.png",  // ไอคอนจาก public directory
}));

// API Routes
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.use('/api/users', userRoutes);
app.use('/api/hairstyles', hairstyleRoutes);

// ฟังเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
