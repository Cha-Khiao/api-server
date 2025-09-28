const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import Routes
const userRoutes = require('./routes/userRoutes.js');
const hairstyleRoutes = require('./routes/hairstyleRoutes.js');
const postRoutes = require('./routes/postRoutes.js');
const commentRoutes = require('./routes/commentRoutes.js');
const reviewRoutes = require('./routes/reviewRoutes.js');

// Import Middleware & Swagger
const { errorHandler } = require('./middleware/errorMiddleware.js');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

dotenv.config();
const app = express();
app.set('trust proxy', 1);

// Middlewares
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);
app.use(express.json());

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected!');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};
connectDB();

// Swagger Setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cut Match API',
      version: '1.0.0',
      description: 'API Documentation for Cut Match',
    },
    servers: [
      { url: 'https://api-server-seven-pi.vercel.app' }, // URL Production
      { url: 'http://localhost:5000' } // URL Development
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./routes/*.js'],
};
const specs = swaggerJsdoc(options);

// --- ✨ แก้ไขส่วนนี้ให้เรียบง่าย ✨ ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// API Routes
app.get('/', (req, res) => res.redirect('/api-docs'));
app.use('/api/users', userRoutes);
app.use('/api/hairstyles', hairstyleRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes); 
// Review routes are nested inside hairstyleRoutes

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));