# Personnel Evaluation System — Backend API

Node.js + Express + MySQL backend สำหรับระบบประเมินบุคลากรด้วยระบบเทคโนโลยีสารสนเทศ
รองรับครบ 3 บทบาท: **admin** (ฝ่ายบริหารบุคลากร), **evaluatee** (ผู้รับการประเมิน), **committee** (กรรมการผู้ประเมิน)

---

## 1. ติดตั้งและรันบน localhost

### สิ่งที่ต้องมีก่อน
- Node.js เวอร์ชัน 18 ขึ้นไป
- MySQL หรือ MariaDB (รันอยู่บนเครื่อง localhost)

### ขั้นตอน

```bash
# 1) ติดตั้ง dependencies
cd backend
npm install

# 2) สร้างฐานข้อมูล
mysql -u root -p -e "CREATE DATABASE personnel_evaluation CHARACTER SET utf8mb4;"

# 3) สร้างตารางจาก schema
mysql -u root -p personnel_evaluation < database/schema.sql

# 4) คัดลอกไฟล์ env แล้วแก้ค่าให้ตรงกับเครื่องตัวเอง
cp .env.example .env
# แก้ DB_USER / DB_PASSWORD / DB_NAME / JWT_SECRET ตามจริง

# 5) สร้างบัญชีแอดมินเริ่มต้น (email: admin@school.ac.th / password: Admin@1234)
node src/scripts/seedAdmin.js

# 6) รันเซิร์ฟเวอร์ (โหมดพัฒนา จะ auto-reload เมื่อแก้โค้ด)
npm run dev
```

เซิร์ฟเวอร์จะรันที่ **http://localhost:4000** (แก้พอร์ตได้ที่ `.env` → `PORT`)

ทดสอบว่าเชื่อมต่อสำเร็จ:
```bash
curl http://localhost:4000/api/health
```

---

## 2. โครงสร้างโปรเจกต์

```
backend/
├── database/
│   └── schema.sql              # โครงสร้างตาราง (ตามไฟล์ final_.sql ที่ให้มา)
├── src/
│   ├── config/db.js            # MySQL connection pool
│   ├── middleware/
│   │   ├── auth.js             # ตรวจสอบ JWT + ตรวจสอบสิทธิ์ตาม role
│   │   ├── errorHandler.js     # จัดการ error รวมศูนย์ ตอบกลับ JSON รูปแบบเดียวกันทุก endpoint
│   │   └── upload.js           # multer สำหรับอัปโหลดหลักฐาน (PDF/รูปภาพ)
│   ├── controllers/            # ตรรกะของแต่ละ resource
│   ├── routes/                 # เส้นทาง API แยกตาม resource + จำกัดสิทธิ์ตาม role
│   ├── scripts/seedAdmin.js    # สร้าง/รีเซ็ตรหัสผ่านบัญชีแอดมินเริ่มต้น
│   ├── app.js                  # ตั้งค่า Express app + middleware
│   └── server.js               # จุดเริ่มรันเซิร์ฟเวอร์
├── uploads/                    # ไฟล์หลักฐานที่อัปโหลด (เสิร์ฟผ่าน /uploads/...)
├── .env.example
└── package.json
```

รูปแบบ Response มาตรฐานทุก endpoint:
```json
{ "status": "success", "message": "...", "data": { } }
```
เมื่อเกิด error:
```json
{ "status": "fail", "message": "คำอธิบาย error", "data": null }
```

---

## 3. Authentication

ทุก endpoint (ยกเว้น `/api/auth/register`, `/api/auth/login`, `/api/health`) ต้องแนบ JWT:
```
Authorization: Bearer <token>
```
ได้ `token` จากการเรียก `/api/auth/login` หรือ `/api/auth/register`

---

## 4. API Reference (ครบตามเกณฑ์การแข่งขัน)

### Auth
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| POST | `/api/auth/register` | ลงทะเบียนผู้รับการประเมิน (5.2.1) |
| POST | `/api/auth/login` | เข้าสู่ระบบ รับ JWT |
| GET | `/api/auth/me` | ข้อมูลผู้ใช้ปัจจุบัน |

### Users (admin only)
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| POST | `/api/users` | สร้างบัญชีกรรมการ/แอดมิน (5.1.7) |
| GET | `/api/users?role=evaluatee` | รายชื่อผู้ใช้ตาม role |
| PUT | `/api/users/:id` | จัดการข้อมูลผู้รับการประเมิน (5.1.6) |

### Topics — หัวข้อการประเมิน (admin เขียน / ทุก role อ่านได้)
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| POST | `/api/topics` | เพิ่มหัวข้อ (5.1.1) |
| PATCH | `/api/topics/:id/status` | เปิด/ปิดการประเมิน (5.1.2) |
| GET | `/api/topics` | รายการหัวข้อ |

### Indicators — ตัวชี้วัด (admin เขียน / ทุก role อ่านได้)
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| POST | `/api/indicators` | เพิ่มตัวชี้วัด พร้อม `levels` (สเกล 1-4) และ `evidence_types` (5.1.3-5.1.5) |
| GET | `/api/indicators?topic_id=1` | รายการตัวชี้วัดในหัวข้อ |

ตัวอย่าง body สำหรับสร้างตัวชี้วัดแบบสเกล:
```json
{
  "topic_id": 1,
  "name": "ความสำเร็จของงาน",
  "description": "วัดผลสำเร็จของงานตามที่ได้รับมอบหมาย",
  "weight": 10,
  "format": "scale",
  "levels": ["ต่ำกว่าที่คาดหวังมาก", "ต่ำกว่าที่คาดหวัง", "ตามที่คาดหวัง", "สูงกว่าที่คาดหวัง"],
  "evidence_types": ["pdf", "url"]
}
```

### Self-assessments (evaluatee only) — ข้อ 5.2.2 - 5.2.8
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| GET | `/api/self-assessments/me` | ตัวชี้วัดทั้งหมด + สถานะ/คะแนนของตนเอง |
| POST | `/api/self-assessments` | บันทึกคะแนนตนเอง `{ indicator_id, self_score }` |
| POST | `/api/self-assessments/:indicatorId/evidence` | แนบหลักฐาน (multipart `file` หรือ body `{ url }`) |
| GET | `/api/self-assessments/progress` | ความคืบหน้ารายหัวข้อ |
| GET | `/api/self-assessments/feedback` | ความเห็นจากกรรมการ |
| POST | `/api/self-assessments/:indicatorId/reevaluate` | ขอรับการประเมินใหม่ |
| GET | `/api/self-assessments/export` | ส่งออกไฟล์ CSV |

### Assignments (admin only) — ข้อ 5.1.8
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| POST | `/api/assignments` | มอบหมายกรรมการ `{ committee_id, evaluatee_id }` |
| GET | `/api/assignments` | รายการมอบหมายทั้งหมด + สถานะลงนาม |

### Committee (committee / admin) — ข้อ 5.3.1 - 5.3.8
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| GET | `/api/committee/my-assignments` | ผู้รับการประเมินที่ได้รับมอบหมาย (5.3.1) |
| GET | `/api/committee/assignments/:id` | รายละเอียด + คะแนนตนเองของผู้ถูกประเมิน (5.3.2-5.3.3) |
| POST | `/api/committee/assignments/:id/scores` | ให้คะแนน+ความเห็น `{ indicator_id, score, comment }` (5.3.4-5.3.5) |
| GET | `/api/committee/assignments/:id/result` | ผลลัพธ์คะแนนเฉลี่ยถ่วงน้ำหนัก (5.3.6) |
| POST | `/api/committee/assignments/:id/sign` | ลงนาม (ต้องให้คะแนนครบทุกตัวชี้วัดก่อน) (5.3.7) |
| DELETE | `/api/committee/assignments/:id/sign` | ยกเลิกการลงนาม (5.3.8) |

### Reports (admin only) — ข้อ 5.1.10, 5.1.11, 5.1.12, 5.1.13
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| GET | `/api/reports/committee-summary` | สรุปผล+สถานะรายกรรมการ (5.1.10-5.1.11) |
| GET | `/api/reports/evaluatees-status` | สถานะการประเมินของผู้รับการประเมิน (5.1.12) |
| GET | `/api/reports/evaluatee/:id` | รายงานผลรายบุคคล (5.1.13) |

---

## 5. หมายเหตุสำคัญเกี่ยวกับ schema

- `signatures.signed_by` เป็น `INT` อ้างอิง `users.id` (ตาม `final_.sql`) ไม่ใช่ชื่อแบบ text — ตอนลงนามระบบจะบันทึก `req.user.id` ของกรรมการที่ login อยู่โดยอัตโนมัติ
- `committee_role` (`chair`/`member`) เป็นฟิลด์ nullable ไม่บังคับต้องมีประธานเสมอ
- คะแนนกรรมการจะ**ล็อกแก้ไขไม่ได้**เมื่อมีการลงนาม (`is_active = 1`) ต้องยกเลิกลงนามก่อนจึงจะแก้คะแนนได้ — ตรงกับ flow ที่ demo ไว้ในหน้าเว็บ
