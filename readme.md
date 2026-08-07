# Learn Language — Nền tảng học từ vựng Fullstack

Ứng dụng web fullstack hỗ trợ học từ vựng cá nhân, luyện trắc nghiệm, theo dõi streak và diễn đàn cộng đồng.

---

## 🛠 Tech Stack

## Backend — NestJS 11 · TypeScript · PostgreSQL 16 · Prisma ORM 7

- **JWT Authentication** với Refresh Token Rotation — Access Token ngắn hạn, Refresh Token hash bằng Argon2 lưu PostgreSQL
- **Redis** lưu trữ OTP email (đăng ký, quên mật khẩu) với TTL tự hết hạn
- **Cloudinary** lưu trữ hình ảnh bài đăng
- **Resend** gửi email OTP

## Frontend — React 19 · TypeScript · Vite

- **Redux Toolkit** quản lý UI state phía client
- **TanStack React Query v5** quản lý server state — caching, background refetch, mutation

---

## ⚡ Chạy dự án

```bash
git clone <repository-url>
cd LEARNING_LANGUAGE

Thêm các biến môi trường

docker compose up 
```

| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |

```bash
docker compose stop
```

---

### Hướng phát triển thêm : 
- Thêm tính năng tạo đoạn văn, tạo đoạn hội thoại