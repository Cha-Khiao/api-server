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

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

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
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Cut Match API',
    version: '1.0.0',
    description: 'API Documentation for Cut Match - Hairstyle Recommendation App',
  },
  servers: [
    {
      url: `https://api-server-seven-zeta.vercel.app/`,
      description: 'Production Server'
    },
    {
      url: `http://localhost:${PORT}`,
      description: 'Development Server'
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
};

const options = {
  definition: swaggerDefinition,
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

// --- Custom JS สำหรับปุ่ม Copy ---
const fs = require('fs');
const customJsPath = path.join(__dirname, 'swagger-custom.js');
fs.writeFileSync(customJsPath, `
window.onload = function() {
  const observer = new MutationObserver(() => {
    const target = document.querySelectorAll('.servers > label > span');

    target.forEach(el => {
      if (!el.parentNode.querySelector('.copy-btn')) {
        const url = el.innerText;
        const button = document.createElement('button');
        button.innerText = '📋 Copy';
        button.className = 'copy-btn';
        button.style.marginLeft = '10px';
        button.style.cursor = 'pointer';
        button.onclick = () => {
          navigator.clipboard.writeText(url).then(() => {
            alert(\`Copied: \${url}\`);
          });
        };
        el.parentNode.appendChild(button);
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
};
`);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css",
  customJs: ["/swagger-custom.js"],
}));

// ให้ express เสิร์ฟไฟล์ custom js
app.use('/swagger-custom.js', express.static(customJsPath));

// API Routes
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.use('/api/users', userRoutes);
app.use('/api/hairstyles', hairstyleRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
