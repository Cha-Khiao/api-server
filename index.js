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
        url: 'https://api-server-seven-pi.vercel.app', // UPDATED: ชี้ไปยัง URL ของ Vercel ที่ถูกต้อง
        description: 'Production Server (Vercel)',
      },
      {
        url: `http://localhost:${PORT}`,
        description: 'Development Server',
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css",
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js"
  ],
}));

// API Routes
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.use('/api/users', userRoutes);
app.use('/api/hairstyles', hairstyleRoutes);

// วางโค้ดนี้ใน index.js ก่อน app.listen(...)
app.get('/debug-db', async (req, res) => {
  console.log('--- Received request for /debug-db ---');
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return res.status(500).json({
      status: 'error',
      message: 'MONGODB_URI is not defined in environment variables.'
    });
  }

  console.log('Attempting to connect to MongoDB...');
  console.log('URI used (password masked):', uri.replace(/:([^:]+)@/, ':*****@'));

  try {
    const testConnection = await mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 10000, // รอสูงสุด 10 วินาที
    }).asPromise();

    if (testConnection.readyState === 1) {
      console.log('✅ MongoDB connection test successful!');
      await testConnection.close();
      res.status(200).json({
        status: 'success',
        message: 'MongoDB connection test successful!',
      });
    } else {
        throw new Error('Connection readyState is not 1');
    }

  } catch (error) {
    console.error('❌ MongoDB connection test FAILED!');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);

    res.status(500).json({
      status: 'error',
      message: 'MongoDB connection test FAILED!',
      errorName: error.name,
      errorMessage: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});