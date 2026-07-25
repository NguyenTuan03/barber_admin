# T99 BarberShop - Portal Quản trị & Quản lý Lịch hẹn (Admin)

Hệ thống trang Quản trị (Admin Portal) dành riêng cho Chủ tiệm và Thợ cắt tóc của **T99 Barbershop**, được xây dựng trên nền tảng **Next.js App Router**, **TypeScript**, **Tailwind CSS** và hệ thống giao diện **Shadcn UI**.

---

## 🚀 Tính năng chính

### 1. Quản lý Lịch hẹn thời gian thực
- Hiển thị danh sách toàn bộ lịch hẹn trong ngày với mã đặt lịch, thông tin khách hàng, khung giờ và dịch vụ đã chọn.
- Lọc lịch hẹn thông minh theo **Trạng thái** (`Đã xác nhận`, `Đang thực hiện`, `Hoàn thành`, `Đã hủy`) và **Thợ phụ trách**.
- Cập nhật trạng thái trực tiếp bằng các nút thao tác nhanh (`Vào cắt`, `Hoàn thành`, `Hủy lịch`).

### 2. Quản lý Công suất & Trạng thái Thợ cắt tóc
- Theo dõi trạng thái làm việc của từng thợ (`Sẵn sàng`, `Đang cắt khách`, `Nghỉ ca`).
- Hiển thị khối lượng công việc, số lượng khách phục vụ trong ngày và tên khách hàng đang phục vụ.

### 3. Chỉ số Thống kê KPI
- Thẻ đo lường tổng số lịch hẹn trong ngày, doanh thu dự kiến, số lịch đã hoàn thành và số thợ đang trực ca.

### 4. Tạo Lịch hẹn Nhanh (Quick Booking)
- Hộp thoại Modal cho phép Admin/Quản lý tạo lịch hẹn trực tiếp cho khách walk-in hoặc khách đặt qua điện thoại.

### 5. Chuẩn hóa Codebase & Kiểm soát Chất lượng
- **Husky Git Hooks**: Tự động chạy `npm run lint` trước mỗi lần commit.
- **Strict TypeScript & Enum**: Tuyệt đối không dùng `any`, quản lý trạng thái bằng Enum chuẩn hóa (`AppointmentStatusEnum`, `BarberStatusEnum`, `ServiceCategoryEnum`).
- **Giao diện Tiếng Việt chuẩn hóa**: Tối ưu riêng cho công tác quản lý nội bộ.

---

## 📁 Cấu trúc Dự án

```text
barber_admin/
├── app/                        # Next.js App Router (Layout & Dashboard Page)
│   ├── layout.tsx              # Root Layout
│   ├── page.tsx                # Trang Dashboard Admin chính
│   └── globals.css             # Stylesheet toàn cục
├── components/                 # Hệ thống UI Component
│   ├── dashboard/              # Component chức năng Dashboard
│   │   ├── AppointmentTable.tsx   # Bảng danh sách lịch hẹn & bộ lọc
│   │   ├── BarberStatusList.tsx   # Danh sách & tải làm việc thợ
│   │   ├── QuickBookingModal.tsx  # Modal tạo lịch nhanh
│   │   └── StatCards.tsx          # Thẻ chỉ số thống kê KPI
│   ├── layout/                 # Layout Admin
│   │   ├── AdminHeader.tsx        # Top Header & ô tìm kiếm
│   │   └── AdminSidebar.tsx       # Sidebar điều hướng & thông tin tiệm
│   └── ui/                     # Reusable Component chuẩn Shadcn UI
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       └── table.tsx
├── enum/                       # Định nghĩa Enum quản lý logic (Rule 7)
│   └── AppEnum.ts              # AppointmentStatusEnum, BarberStatusEnum, v.v.
├── types/                      # TypeScript Interfaces không dùng 'any' (Rule 8)
│   ├── apiResponse.ts
│   ├── appointment.ts
│   ├── barber.ts
│   └── service.ts
├── lib/                        # Utility functions
│   └── utils.ts                # Hàm cn() bổ trợ Shadcn UI
├── services/                   # Kết nối API Backend
│   ├── service/
│   └── siteSettings/
└── .husky/                     # Git pre-commit hooks
    └── pre-commit
```

---

## 🛠️ Hướng dẫn Cài đặt & Chạy Ứng dụng

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Khởi chạy Server Phát triển (Development)
```bash
npm run dev
```
Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:3000`

### 3. Kiểm tra Syntax & Code Quality (Lint)
```bash
npm run lint
```

### 4. Build Production Bundle
```bash
npm run build
```

---

## ⚙️ Công nghệ Sử dụng

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Core Library:** [React 19](https://react.dev/) & [TypeScript 5](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Git Hook:** [Husky](https://typicode.github.io/husky/)
- **State & Utils:** `clsx`, `tailwind-merge`, `class-variance-authority`
