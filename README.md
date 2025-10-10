# 🖥️ Frontend (FE) — Twitter Clone

## ⚙️ Công nghệ chính

- ⚡ **Vite + React 19 (TypeScript)**
- 🎨 **Tailwind CSS + shadcn/ui + Radix UI**
- 🧠 **Zustand** – Quản lý state toàn cục.
- 🔁 **TanStack React Query** – Fetching & caching API hiệu quả.
- 📡 **Socket.IO Client** – Real-time tweets, messages, notifications.
- 🧩 **Zod** – Validate form và dữ liệu từ API.
- 🧭 **React Router v7** – Routing client-side.
- 📅 **date-fns** – Xử lý định dạng thời gian.
- 🎥 **HLS.js + React Player + @vidstack/react** – Stream video HLS (.m3u8).

---

## 🧠 Tính năng chính

### 🔐 1. Authentication

- Đăng ký / đăng nhập bằng email & mật khẩu.
- Lưu token (`access`, `refresh`) trong localStorage.
- Middleware bảo vệ route private.
- Tự động refresh token khi hết hạn.
- Giao diện form đăng ký / đăng nhập với **React Hook Form + Zod**.

---

### 🏠 2. Home Feed

- Hiển thị danh sách tweet từ người theo dõi hoặc trending.
- Hỗ trợ **infinite scroll** bằng React Query.
- Cập nhật tweet mới real-time qua **Socket.IO**.
- Hỗ trợ xem ảnh, video, link preview (metadata).

---

### 🧵 3. Tweet & Interaction

- CRUD tweet:
  - 📝 Tạo tweet mới (text + ảnh/video).
  - 🗑️ Xoá / chỉnh sửa tweet cá nhân.
- **Reply / Retweet / Quote Tweet**.
- Hiển thị **conversation thread** (chuỗi tweet).
- Like / Unlike tweet real-time.

---

### 🔖 4. Bookmarks

- Lưu tweet yêu thích cá nhân.
- Xem danh sách tweet đã lưu.
- Hỗ trợ phân trang & sắp xếp theo thời gian.

---

### 💬 5. Messages (Chat Real-time)

- Chat 1-1 hoặc nhóm.
- Real-time bằng **Socket.IO**.
- Gửi emoji, ảnh, video, file đính kèm.
- Hiển thị “đã xem” và trạng thái online.

---

### 🔔 6. Notifications

- Nhận thông báo real-time (like, follow, mention, reply).
- Hiển thị danh sách chưa đọc.
- Đánh dấu đã đọc / tất cả.
- Popup real-time (toasts).

---

### 🧭 7. Search

- Tìm kiếm người dùng, tweet, hashtag theo từ khóa.
- Gợi ý kết quả real-time.
- Tabs riêng: **Tweets / Users / Hashtags**.

---

### 📺 8. Video & Media Viewer

- Phát video qua **HLS.js / @vidstack/react**.
- Tự động chọn chất lượng (adaptive bitrate).
- Modal xem ảnh / video full screen.

---

### 🏷️ 9. Hashtags & Trending

- Hiển thị top hashtag trending.
- Nhấn hashtag để xem tweet liên quan.
- Cập nhật trending real-time.

---

### 👤 10. Profile

- Hiển thị avatar, banner, bio, followers.
- Tabs: **Tweets / Replies / Likes / Media**.
- Sửa thông tin cá nhân (upload + preview).
- Follow / Unfollow người khác.

---

### 🧩 11. UI Components

- **shadcn/ui + Radix UI**:
  - Dialog, Dropdown, Tooltip, Tabs, ScrollArea, Popover, Separator...
- Theme **Dark / Light mode** (next-themes).
- Animation mượt với **tw-animate-css**.

---

### 🧰 12. Helpers & Utils

- Format thời gian (`timeAgo`, `dateFormat`).
- Parse hashtag / mention trong tweet.
- Convert URL → metadata preview.
- Preview media trước khi upload.

---

### ⚡ 13. State & API Handling

- **Zustand**:
  - Lưu thông tin user, token, socket, theme.
- **React Query**:
  - Cache và refetch dữ liệu tự động.
  - Infinite scroll & optimistic update (like, retweet...).

---

### 📡 14. Socket.IO Integration

- Channel real-time cho tweets, likes, messages, notifications.
- Cập nhật UI khi có event mới từ server.

---

Script:

## 🔄 Chạy ứng dụng (dev)

Script:

```bash
npm run dev:dev
```

## 🔄 Chạy ứng dụng (prod)

Script:

```bash
npm run build
npm run start:prod
```
