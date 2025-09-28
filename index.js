const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import Routes
const userRoutes = require('./routes/userRoutes.js');
const hairstyleRoutes = require('./routes/hairstyleRoutes.js');
const postRoutes = require('./routes/postRoutes.js');
const commentRoutes = require('./routes/commentRoutes.js');

// Import Middleware
const { errorHandler } = require('./middleware/errorMiddleware.js');

// Swagger Imports
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

const app = express();

// --- 🚀 เพิ่มบรรทัดนี้เข้ามาครับ! ---
// บอกให้ Express เชื่อถือ Proxy Header จาก Vercel
app.set('trust proxy', 1);
// ------------------------------------

// --- Security Middlewares ---
app.use(helmet()); 

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter); 

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
        url: 'https://api-server-seven-pi.vercel.app',
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
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// --- Centralized Error Handler ---
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});