# Cryptography Toolkit

Project demo các thuật toán mã hóa xây dựng với React + Vite.

## Yêu cầu

- Node.js 18+ (khuyến nghị dùng bản LTS)
- npm

## Cài đặt và chạy

```bash
git clone <LINK_REPO>
cd cryptography-toolkit
npm install
npm run dev
```

Sau khi chạy, mở địa chỉ local Vite hiển thị trong terminal (thường là `http://localhost:5173`).

## 🛠 Quy trình làm việc nhóm (Git Workflow)

### Quy tắc đặt tên nhánh

- Bắt buộc đặt tên nhánh theo tên cá nhân (viết liền, không dấu, ngăn cách bằng dấu `-`).
- Ví dụ: `le-thanh-dat`, `le-kim-buu`.

### Workflow 5 bước chuẩn

1. **Trước khi code, luôn cập nhật `main` mới nhất:**

```bash
git checkout main
git pull origin main
```

2. **Tạo nhánh cá nhân theo đúng quy tắc tên:**

```bash
git checkout -b le-thanh-dat
```

3. **Code tính năng, sau đó add và commit rõ ràng:**

```bash
git add .
git commit -m "feat: mo ta ngan gon thay doi"
```

4. **Đẩy nhánh cá nhân lên GitHub:**

```bash
git push origin le-thanh-dat
```

5. **Tạo Pull Request (PR) để Leader review và merge vào `main`.**

### Lưu ý quan trọng

- Không bao giờ push trực tiếp lên `main`.
- Luôn kiểm tra và xử lý conflict trước khi merge PR.
