<div align="center">

# 🎬 BINGEBOX

### *A Modern Cinema Ticket Booking Platform*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)

BingeBox là nền tảng đặt vé xem phim trực tuyến được phát triển với mục tiêu mang đến trải nghiệm đặt vé nhanh chóng, tiện lợi và hiện đại cho người dùng. Ứng dụng tích hợp đầy đủ các chức năng từ tra cứu lịch chiếu, chọn ghế theo thời gian thực, đặt combo bỏng nước cho đến hệ thống quản trị nội dung toàn diện.

</div>

---

## 📋 Mục lục

- [✨ Tính năng](#-tính-năng)
- [🛠️ Công nghệ sử dụng](#️-công-nghệ-sử-dụng)
- [📁 Cấu trúc dự án](#-cấu-trúc-dự-án)
- [🚀 Cài đặt & Chạy dự án](#-cài-đặt--chạy-dự-án)
- [⚙️ Biến môi trường](#️-biến-môi-trường)
- [📄 Các trang chính](#-các-trang-chính)
- [🔐 Xác thực & Phân quyền](#-xác-thực--phân-quyền)

---

## ✨ Tính năng

- 🎬 **Tra cứu lịch chiếu** – Xem lịch chiếu theo phim hoặc theo rạp
- 💺 **Chọn ghế thời gian thực** – Giữ ghế qua WebSocket, cập nhật trạng thái tức thì
- 🍿 **Đặt combo bỏng nước** – Thêm đồ ăn, thức uống vào đơn hàng
- 🎟️ **Đặt vé trực tuyến** – Quy trình đặt vé 3 bước: Ghế → Đồ ăn → Voucher
- 🎫 **Vé điện tử** – Quản lý vé đã mua, mã QR vé
- 💎 **Voucher & Ưu đãi** – Áp dụng mã giảm giá, voucher
- ⭐ **Điểm thành viên** – Tích lũy và sử dụng điểm thưởng
- ❤️ **Phim yêu thích** – Danh sách phim yêu thích, phim đã xem
- 💬 **Bình luận phim** – Đánh giá và thảo luận về phim
- 🗺️ **Danh sách rạp** – Thông tin chi tiết các rạp chiếu
- 🌓 **Giao diện sáng/tối** – Chuyển đổi theme Dark/Light
- 🛡️ **Bảng quản trị (Admin)** – Quản lý toàn bộ nền tảng
- 📊 **Thống kê & Dashboard** – Biểu đồ doanh thu, vé bán, khách hàng

---

## 🛠️ Công nghệ sử dụng

| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16+ | Framework React với App Router |
| [React](https://reactjs.org/) | 19 | UI Library |
| [TypeScript](https://www.typescriptlang.org/) | 5+ | Type-safe JavaScript |
| [TailwindCSS](https://tailwindcss.com/) | 4 | Utility-first CSS framework |
| [TanStack Query](https://tanstack.com/query) | 5 | Server state & caching |
| [Zustand](https://zustand-demo.pmnd.rs/) | 5 | Lightweight state management |
| [Axios](https://axios-http.com/) | 1 | HTTP client với auto-refresh token |
| [Socket.IO Client](https://socket.io/) | 4 | Real-time seat selection |
| [React Hook Form](https://react-hook-form.com/) | 7 | Form management |
| [Zod](https://zod.dev/) | 4 | Schema validation |
| [Framer Motion](https://www.framer.com/motion/) | 12 | Animations |
| [Recharts](https://recharts.org/) | 2 | Data visualization |
| [TinyMCE React](https://www.tiny.cloud/) | 6 | Rich text editor |
| [Embla Carousel](https://www.embla-carousel.com/) | 8 | Touch slider / carousel |
| [date-fns](https://date-fns.org/) | 4 | Date utilities |
| [Sonner](https://sonner.emilkowal.ski/) | 2 | Toast notifications |
| [next-themes](https://github.com/pacocoursey/next-themes) | 0.4 | Dark/Light theme |
| [Radix UI](https://www.radix-ui.com/) | - | Accessible UI primitives |
| [TanStack Table](https://tanstack.com/table) | 8 | Data table |
| [Lucide React](https://lucide.dev/) | 0.56 | Icons |

---

## 📁 Cấu trúc dự án

```
bingebox_fe/
├── public/                    # Static assets (favicon, images)
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (client)/          # Layout nhóm cho client
│   │   │   ├── (home)/        # Trang chủ
│   │   │   ├── aboutUs/       # Giới thiệu
│   │   │   ├── actor/         # Diễn viên
│   │   │   ├── blog/          # Tin tức
│   │   │   ├── booking/       # Đặt vé (chọn ghế, đồ ăn, voucher)
│   │   │   ├── comment/       # Bình luận phim
│   │   │   ├── movie/         # Chi tiết phim
│   │   │   ├── payment/       # Thanh toán
│   │   │   ├── price/         # Giá vé
│   │   │   ├── profile/       # Hồ sơ cá nhân
│   │   │   ├── showtime/      # Lịch chiếu (theo phim / theo rạp)
│   │   │   ├── ticket/        # Vé của tôi
│   │   │   └── ticketPrice/   # Bảng giá vé
│   │   ├── admin/             # Bảng quản trị (25 modules)
│   │   │   ├── overview/      # Dashboard & thống kê
│   │   │   ├── movie/         # Quản lý phim
│   │   │   ├── actor/         # Quản lý diễn viên
│   │   │   ├── category/      # Quản lý thể loại
│   │   │   ├── cinema/        # Quản lý rạp chiếu
│   │   │   ├── room/          # Quản lý phòng chiếu
│   │   │   ├── seat/          # Quản lý sơ đồ ghế + Editor
│   │   │   ├── showtime/      # Quản lý suất chiếu
│   │   │   ├── booking/       # Quản lý đặt vé
│   │   │   ├── user/          # Quản lý người dùng
│   │   │   ├── voucher/       # Quản lý voucher
│   │   │   ├── food/          # Quản lý đồ ăn
│   │   │   ├── blog/          # Quản lý tin tức (TinyMCE)
│   │   │   ├── setting/       # Cấu hình website
│   │   │   └── ...            # Các module khác
│   │   ├── auth/              # Xác thực (login, register, ...)
│   │   ├── layout.tsx         # Root layout
│   │   ├── not-found.tsx      # Trang 404
│   │   └── globals.css        # Global styles & theme variables
│   ├── components/
│   │   ├── admin/             # Components cho admin
│   │   │   ├── header/        # Admin header
│   │   │   ├── pagination/    # Data pagination
│   │   │   ├── sidebar/       # Admin sidebar
│   │   │   └── table/         # Data table
│   │   ├── client/            # Components cho client
│   │   │   ├── actor/         # Actor card & list
│   │   │   ├── blog/          # Blog card & list
│   │   │   ├── carousel/      # Homepage carousel
│   │   │   ├── footer/        # Footer
│   │   │   ├── header/        # Header
│   │   │   └── movie/         # Movie card & lists
│   │   ├── common/            # Components dùng chung
│   │   │   ├── confirm/       # Confirm dialog
│   │   │   ├── imagePreview/  # Image preview
│   │   │   ├── loading/       # Loading screen
│   │   │   ├── skeleton/      # Skeleton loaders
│   │   │   └── title/         # Section title
│   │   ├── provider/          # Context / Provider (Auth, Query)
│   │   └── ui/                # Shadcn/ui components (35 files)
│   ├── constants/             # Enums, filter options, provinces
│   ├── hooks/                 # Custom React hooks (5 files)
│   ├── lib/                   # Utility functions (cn)
│   ├── queries/               # TanStack Query hooks (27 files)
│   ├── schemas/               # Zod validation schemas (22 files)
│   ├── services/              # API service classes (27 files)
│   ├── stores/                # Zustand store (auth)
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Utilities (axios, socket, token, date)
│   └── middleware.ts          # Next.js middleware (auth guard)
├── .env                       # Biến môi trường
├── next.config.ts             # Cấu hình Next.js
├── package.json
└── tsconfig.json
```

---

## 🚀 Cài đặt & Chạy dự án

### Yêu cầu hệ thống

- **Node.js** >= 18.x
- **npm** >= 9.x hoặc **yarn** >= 1.22.x

### Bước 1: Clone dự án

```bash
git clone https://github.com/henruysun2511/BingeBox_Project.git
cd bingebox_fe
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Cấu hình biến môi trường

Tạo file `.env` tại thư mục gốc (hoặc copy từ `.env.example` nếu có):

```bash
cp .env.example .env
```

Sau đó cập nhật các giá trị trong file `.env` (xem phần [Biến môi trường](#️-biến-môi-trường)).

### Bước 4: Chạy môi trường phát triển

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: **http://localhost:3000** (hoặc port khác nếu 3000 đã bị chiếm)

### Build cho Production

```bash
npm run build
npm run start
```

### Lint code

```bash
npm run lint
```

---

## ⚙️ Biến môi trường

Tạo file `.env` ở thư mục gốc dự án với nội dung sau:

```env
# URL API của backend
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# Secret key để xác thực JWT (dùng trong middleware)
ACCESS_TOKEN_SECRET=your_secret_key_here

# API Key của TinyMCE (rich text editor)
NEXT_PUBLIC_TINYMCE_KEY=your_tinymce_api_key_here
```

| Biến | Mô tả | Ví dụ |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL của REST API backend | `http://localhost:4000/api/v1` |
| `ACCESS_TOKEN_SECRET` | Secret key dùng để verify JWT trong middleware | `your_secret_key` |
| `NEXT_PUBLIC_TINYMCE_KEY` | API Key từ [TinyMCE Cloud](https://www.tiny.cloud/) | `rz50e29x...` |

> **Lưu ý:** Các biến có tiền tố `NEXT_PUBLIC_` sẽ được expose ra phía client. Không đặt thông tin nhạy cảm vào các biến này.

---

## 📄 Các trang chính

### Client

| Route | Mô tả | Yêu cầu đăng nhập |
|---|---|---|
| `/` | Trang chủ | ❌ |
| `/movie/[id]` | Chi tiết phim | ❌ |
| `/showtime/movie` | Lịch chiếu theo phim | ❌ |
| `/showtime/movie/[id]` | Lịch chiếu của một phim | ❌ |
| `/showtime/cinema` | Lịch chiếu theo rạp | ❌ |
| `/booking/[id]` | Đặt vé (chọn ghế, đồ ăn, voucher) | ✅ |
| `/payment` | Thanh toán | ✅ |
| `/ticket` | Vé đã mua | ✅ |
| `/ticket/[id]` | Chi tiết vé | ✅ |
| `/price` | Bảng giá vé | ❌ |
| `/actor` | Danh sách diễn viên | ❌ |
| `/actor/[id]` | Chi tiết diễn viên | ❌ |
| `/blog` | Tin tức | ❌ |
| `/comment` | Bình luận điện ảnh | ❌ |
| `/profile` | Hồ sơ cá nhân | ✅ |
| `/aboutUs` | Về chúng tôi | ❌ |

### Xác thực

| Route | Mô tả | Yêu cầu đăng nhập |
|---|---|---|
| `/auth/login` | Đăng nhập | ❌ |
| `/auth/register` | Đăng ký | ❌ |
| `/auth/forgotPassword` | Quên mật khẩu | ❌ |
| `/auth/resetPassword` | Đặt lại mật khẩu | ❌ |

### Admin

| Route | Mô tả | Yêu cầu |
|---|---|---|
| `/admin/overview` | Dashboard tổng quan | Admin |
| `/admin/movie` | Quản lý phim | Admin |
| `/admin/actor` | Quản lý diễn viên | Admin |
| `/admin/category` | Quản lý thể loại | Admin |
| `/admin/cinema` | Quản lý rạp chiếu | Admin |
| `/admin/room` | Quản lý phòng chiếu | Admin |
| `/admin/seat` | Sơ đồ ghế & Editor | Admin |
| `/admin/showtime` | Quản lý suất chiếu | Admin |
| `/admin/booking` | Quản lý đặt vé | Admin |
| `/admin/user` | Quản lý người dùng | Admin |
| `/admin/voucher` | Quản lý voucher | Admin |
| `/admin/food` | Quản lý đồ ăn | Admin |
| `/admin/blog` | Quản lý tin tức | Admin |
| `/admin/setting` | Cấu hình website | Admin |
| `/admin/profile` | Hồ sơ admin | Admin |

---

## 🔐 Xác thực & Phân quyền

Dự án sử dụng **JWT (JSON Web Token)** lưu trong cookie (`accessToken`) để xác thực người dùng.

### Luồng xác thực (Middleware)

```
Request đến
    │
    ├─ Trang Auth (Login/Register) + Có token hợp lệ → Redirect về "/"
    │
    ├─ Trang Public (/, /movie, /showtime, /blog, ...) → Cho qua
    │
    ├─ Trang cần đăng nhập (/profile, /booking, /payment, /ticket) + Không có token → Redirect về "/auth/login"
    │
    ├─ Trang Admin (/admin) + Không có token → Redirect về "/auth/login"
    │
    ├─ Trang Admin (/admin) + Có token nhưng không phải ADMIN → Redirect về "/"
    │
    └─ Có token nhưng hết hạn → Xóa cookie + Redirect về "/auth/login"
```

### Phân quyền

- **Guest** – Xem trang chủ, lịch chiếu, phim, tin tức, diễn viên, bình luận
- **User** – Tất cả tính năng Guest + đặt vé, thanh toán, quản lý vé, hồ sơ, điểm thưởng
- **Admin** – Toàn quyền + truy cập bảng quản trị `/admin` (25 modules)

---

## 🎬 Quy trình đặt vé

BingeBox cung cấp quy trình đặt vé trực tuyến 3 bước:

### Bước 1: Chọn ghế (`/booking/[id]`)

- Xem sơ đồ phòng chiếu theo thời gian thực
- Chọn ghế thường hoặc ghế đôi
- Ghế được giữ tạm thời qua WebSocket (ngăn xung đột)
- Trạng thái ghế: Có thể chọn (xám), Đang chọn (xanh), Đang giữ (vàng), Đã bán (đỏ)

### Bước 2: Chọn đồ ăn

- Thêm bỏng ngô, nước uống và các combo vào đơn hàng
- Điều chỉnh số lượng từng món

### Bước 3: Chọn voucher & điểm thưởng

- Áp dụng mã giảm giá / voucher
- Sử dụng điểm tích lũy để giảm giá
- Xem tổng quan đơn hàng và tiến hành thanh toán

---

## 💺 Chọn ghế thời gian thực (WebSocket)

Hệ thống sử dụng **Socket.IO** để đồng bộ trạng thái ghế theo thời gian thực:

- Khi người dùng chọn ghế, hệ thống gửi sự kiện `seat:hold`
- Ghế được giữ trong thời gian nhất định (ngăn người khác chọn cùng ghế)
- Khi người dùng bỏ chọn hoặc thoát trang, hệ thống gửi sự kiện `seat:release`
- Tất cả người dùng trong cùng suất chiếu nhận cập nhật trạng thái tức thì
- Khi component unmount, toàn bộ ghế đã chọn tự động release

---

## 🛡️ Bảng quản trị (Admin)

Hệ thống quản trị gồm 25 module với các chức năng chính:

- **Dashboard** – Thống kê doanh thu, vé bán, phim top, khách hàng thân thiết
- **Quản lý phim** – CRUD phim, upload poster, trailer, phân loại
- **Quản lý diễn viên** – Thông tin diễn viên tham gia phim
- **Quản lý rạp/phòng** – Thiết lập rạp chiếu, phòng chiếu, sơ đồ ghế
- **Quản lý suất chiếu** – Xếp lịch chiếu cho từng phòng
- **Quản lý đặt vé** – Xem chi tiết đơn hàng, xác nhận thanh toán
- **Quản lý người dùng** – Quản lý tài khoản, phân quyền
- **Quản lý nội dung** – Tin tức (TinyMCE editor), voucher, đồ ăn
- **Cấu hình website** – Logo, tiêu đề, mô tả, favicon

---

<div align="center">

Made by **NHAT HUY**

</div>
