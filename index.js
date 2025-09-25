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
    // เพิ่ม JavaScript ของคุณที่นี่
    `
    window.onload = function () {
      const serverSection = document.createElement('div');
      serverSection.innerHTML = "<h2>Servers</h2>";

      const servers = [
        {
          url: "https://api-server-seven-zeta.vercel.app/",
          description: "Production Server"
        },
        {
          url: \`http://localhost:${window.location.port}\`,
          description: "Development Server"
        }
      ];

      // สร้าง HTML สำหรับแสดงเซิร์ฟเวอร์
      servers.forEach(server => {
        const serverDiv = document.createElement('div');
        const description = document.createElement('p');
        description.textContent = \`\${server.description}: \${server.url}\`;
        
        // ปุ่มคัดลอก URL
        const copyButton = document.createElement('button');
        copyButton.textContent = 'คัดลอกลิงก์';
        copyButton.onclick = function () {
          navigator.clipboard.writeText(server.url)
            .then(() => {
              alert('ลิงก์ถูกคัดลอกแล้ว');
            })
            .catch((error) => {
              alert('ไม่สามารถคัดลอกลิงก์ได้');
            });
        };

        serverDiv.appendChild(description);
        serverDiv.appendChild(copyButton);
        serverSection.appendChild(serverDiv);
      });

      // แสดงส่วนนี้บนหน้า UI ของ Swagger
      const apiDocs = document.querySelector('#swagger-ui');
      apiDocs.prepend(serverSection);

      // เพิ่มลิงก์ดาวน์โหลดไฟล์ Swagger Spec
      const downloadLink = document.createElement('a');
      downloadLink.innerText = 'ดาวน์โหลด Swagger Spec';
      downloadLink.href = '/swagger-spec.json'; // ลิงก์ดาวน์โหลดไฟล์ Swagger JSON
      downloadLink.download = 'swagger-spec.json';
      apiDocs.appendChild(downloadLink);
    };
    `
  ],
  customfavIcon: "/favicon/Node.png", // ไฟล์ Node.png ที่อยู่ในโฟลเดอร์ 'favicon'
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
