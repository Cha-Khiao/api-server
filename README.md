# 💈 Cut Match API

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Authentication-d63aff?style=for-the-badge&logo=jsonwebtokens)

API Backend สำหรับแอปพลิเคชันแนะนำทรงผม "Cut Match" สร้างด้วย Node.js, Express, และ MongoDB พร้อมระบบสมาชิก, ระบบจัดการทรงผม, และการยืนยันตัวตนด้วย JWT

---

## 📚 API Documentation

เอกสาร API ฉบับสมบูรณ์และสามารถทดลองใช้งานได้ทันที (Live Interactive Documentation) ถูกสร้างด้วย Swagger/OpenAPI

**เมื่อรันเซิร์ฟเวอร์แล้ว สามารถเข้าถึงได้ที่: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

---

## ✨ คุณสมบัติหลัก (Features)

-   **👤 ระบบสมาชิก (User Management):**
    -   สมัครสมาชิก (Register) พร้อมเข้ารหัสรหัสผ่านด้วย `bcryptjs`
    -   เข้าสู่ระบบ (Login) และรับ `JSON Web Token (JWT)`
    -   ดูข้อมูลโปรไฟล์ส่วนตัว (Get Profile)
    -   แก้ไขข้อมูลโปรไฟล์ (Update Profile)
    -   อัปโหลดและแก้ไขรูปโปรไฟล์ (Profile Picture Upload)
    -   ลบบัญชีผู้ใช้ (Delete Account)

-   **🔐 ระบบสิทธิ์ (Role-based Access Control):**
    -   แบ่งบทบาทระหว่าง `user` (ผู้ใช้ทั่วไป) และ `admin` (ผู้ดูแลระบบ)
    -   Middleware สำหรับป้องกันเส้นทาง (Protected Routes) สำหรับผู้ที่ล็อกอินแล้วเท่านั้น
    -   Middleware สำหรับป้องกันเส้นทางสำหรับ `admin` เท่านั้น

-   **✂️ ระบบจัดการทรงผม (Hairstyle Management - Admin Only):**
    -   เพิ่มทรงผมใหม่ (Create)
    -   ดูข้อมูลทรงผมทั้งหมด (Read All)
    -   ดูข้อมูลทรงผมตาม ID (Read One)
    -   แก้ไขข้อมูลทรงผม (Update)
    -   ลบทรงผม (Delete)

-   **🚀 อื่นๆ:**
    -   จัดเก็บไฟล์รูปภาพที่อัปโหลดด้วย `Multer`
    -   จัดการ Environment Variables อย่างปลอดภัยด้วย `dotenv`

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB (with Mongoose)
-   **Authentication:** JSON Web Tokens (JWT)
-   **Password Hashing:** bcryptjs
-   **File Uploads:** Multer
-   **API Documentation:** Swagger (swagger-jsdoc, swagger-ui-express)
-   **Development:** Nodemon

---

## 🚀 การติดตั้งและเริ่มต้นใช้งาน (Getting Started)

ทำตามขั้นตอนต่อไปนี้เพื่อติดตั้งและรันโปรเจกต์บนเครื่องของคุณ

### สิ่งที่ต้องมี (Prerequisites)

-   [Node.js](https://nodejs.org/) (แนะนำเวอร์ชัน 18.x LTS หรือสูงกว่า)
-   [Git](https://git-scm.com/)
-   บัญชี [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (สำหรับ Database)

### ขั้นตอนการติดตั้ง (Installation)

1.  **Clone a repository**
    ```bash
    git clone [https://github.com/your-username/cut-match-api.git](https://github.com/your-username/cut-match-api.git)
    ```

2.  **เข้าไปที่โฟลเดอร์โปรเจกต์**
    ```bash
    cd cut-match-api
    ```

3.  **ติดตั้ง dependencies ทั้งหมด**
    ```bash
    npm install
    ```

4.  **ตั้งค่า Environment Variables**
    สร้างไฟล์ชื่อ `.env` ในระดับนอกสุดของโปรเจกต์ แล้วคัดลอกเนื้อหาจากด้านล่างไปวาง จากนั้นแก้ค่าต่างๆ ให้ถูกต้อง

    ```env
    # .env.example

    # Port for the server to run on
    PORT=5000

    # MongoDB Atlas Connection String
    MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<database>?retryWrites=true&w=majority

    # JWT Secret Key for signing tokens
    JWT_SECRET=yourverylongandsupersecretkey
    ```
    -   **`MONGODB_URI`**: คือ Connection String ที่ได้มาจาก MongoDB Atlas
    -   **`JWT_SECRET`**: คือข้อความลับยาวๆ ที่คุณตั้งขึ้นเองสำหรับสร้าง Token

### การรันเซิร์ฟเวอร์ (Running the Server)

-   **รันในโหมด Development (พร้อม auto-reload โดย Nodemon):**
    ```bash
    npm start
    ```
-   เมื่อเซิร์ฟเวอร์ทำงานสำเร็จ คุณจะเห็นข้อความใน Terminal และสามารถเข้าใช้งาน API ได้ที่ `http://localhost:5000`

---

##  API Endpoints Overview

นี่คือภาพรวมของ API Endpoints ทั้งหมด (ดูรายละเอียดฉบับเต็มได้ที่ `/api-docs`)

| Method | Endpoint                    | Description                     | Access      |
| :----- | :-------------------------- | :------------------------------ | :---------- |
| `POST` | `/api/users/register`       | สมัครสมาชิกใหม่                 | Public      |
| `POST` | `/api/users/login`          | เข้าสู่ระบบและรับ Token         | Public      |
| `GET`  | `/api/users/profile`        | ดูข้อมูลโปรไฟล์ส่วนตัว          | User        |
| `PUT`  | `/api/users/profile`        | แก้ไขโปรไฟล์และรูปภาพ           | User        |
| `DELETE`| `/api/users/profile`        | ลบบัญชีผู้ใช้                   | User        |
| `GET`  | `/api/hairstyles`           | ดูทรงผมทั้งหมด                   | Public      |
| `GET`  | `/api/hairstyles/:id`       | ดูทรงผมตาม ID                   | Public      |
| `POST` | `/api/hairstyles`           | เพิ่มทรงผมใหม่                  | **Admin** |
| `PUT`  | `/api/hairstyles/:id`       | แก้ไขทรงผม                      | **Admin** |
| `DELETE`| `/api/hairstyles/:id`       | ลบทรงผม                         | **Admin** |

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```
api-server/
├── controllers/      # (สมอง) เก็บ Logic การทำงานทั้งหมด
├── middleware/       # (ยาม) เก็บฟังก์ชันตรวจสอบสิทธิ์ต่างๆ
├── models/           # (พิมพ์เขียว) เก็บ Schema ของฐานข้อมูล
├── routes/           # (ป้ายบอกทาง) กำหนดเส้นทาง API และเอกสาร
├── uploads/          # (โกดัง) เก็บไฟล์ที่ผู้ใช้อัปโหลด
├── .env              # (ตู้เซฟ) เก็บข้อมูลลับและค่า config
├── index.js          # (ประตูบ้าน) ไฟล์เริ่มต้นของเซิร์ฟเวอร์
├── package.json      # (บัตรประชาชน) ข้อมูลโปรเจกต์และ dependencies
└── README.md         # (คู่มือ) เอกสารแนะนำโปรเจกต์
```