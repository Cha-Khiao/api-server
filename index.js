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
        url: `https://api-server-seven-zeta.vercel.app/`, // ✨ อัปเดต URL เป็นของ Vercel
        description: 'Production Server',
        urlLink: 'https://api-server-seven-zeta.vercel.app/', // สำหรับคัดลอก
      },
      {
        url: `http://localhost:${PORT}`,
        description: 'Development Server',
        urlLink: `http://localhost:${PORT}`, // สำหรับคัดลอก
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

// ✨✨✨ ส่วนที่แก้ไข ✨✨✨
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css",
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js"
  ],
  customfavIcon: "https://example.com/favicon.ico", // คุณสามารถเปลี่ยน favicon ได้ที่นี่
}));

// API Routes
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.use('/api/users', userRoutes);
app.use('/api/hairstyles', hairstyleRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// ปรับแต่งการคัดลอกลิงก์
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('ลิงก์ถูกคัดลอกแล้ว: ' + text);
  });
}

// เพิ่มปุ่มคัดลอกใน UI ของ Swagger
window.onload = function () {
  const serverElements = document.querySelectorAll('.server');
  serverElements.forEach((element) => {
    const url = element.querySelector('.url').innerText;
    const copyButton = document.createElement('button');
    copyButton.innerText = 'คัดลอก URL';
    copyButton.onclick = function () {
      copyToClipboard(url);
    };
    element.appendChild(copyButton);
  });
};

// เพิ่มลิงก์ดาวน์โหลดไฟล์ Swagger
const downloadLink = document.createElement('a');
downloadLink.innerText = 'ดาวน์โหลด Swagger Spec';
downloadLink.href = '/swagger-spec.json'; // ลิงก์ไปที่ไฟล์ .json ของ Swagger
downloadLink.download = 'swagger-spec.json';
document.body.appendChild(downloadLink);
