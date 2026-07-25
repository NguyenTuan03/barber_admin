# **TÀI LIỆU ĐẶC TẢ HỆ THỐNG BARBERSHOP BOOKING (SRS)**

*Phiên bản: 1.1 (Cập nhật Hỗ trợ Đa ngôn ngữ)*

## **1\. TỔNG QUAN HỆ THỐNG**

Hệ thống là một nền tảng Web Application phục vụ cho tiệm Barbershop, bao gồm trang Landing Page giới thiệu và luồng đặt lịch hẹn (Booking). Hệ thống hỗ trợ đa ngôn ngữ (Tiếng Việt / Tiếng Anh), giúp tiếp cận cả khách hàng nội địa và khách nước ngoài (đặc biệt tại các khu vực du lịch). Hệ thống thông báo đa kênh qua Email/Zalo cho khách hàng và nhân sự.

## **2\. KIẾN TRÚC & TRIỂN KHAI**

Hệ thống được thiết kế theo mô hình **Headless Architecture**:

* **Frontend (Next.js):**  
  * Sử dụng Next.js (App Router), Tailwind CSS.  
  * **i18n (Internationalization):** Sử dụng thư viện `next-intl` hoặc `react-i18next` để xử lý routing đa ngôn ngữ (ví dụ: `[domain.com/vi/](https://domain.com/vi/)...` và `[domain.com/en/](https://domain.com/en/)...`).  
  * **Deploy:** Vercel (Tận dụng ISR và Edge Middleware để nhận diện ngôn ngữ của trình duyệt khách hàng).  
* **Backend (Ruby on Rails):**  
  * Rails API-only. Sử dụng Active Record, Devise/JWT cho Auth.  
  * **i18n:** Sử dụng gem `mobility` hoặc `globalize` để lưu trữ dữ liệu đa ngôn ngữ trong Database.  
  * **Deploy:** Railway.  
* **Database (PostgreSQL):** Supabase.  
* **Background Jobs:** Sidekiq \+ Redis (trên Railway) để gửi Email/Zalo.

## **3\. PHÂN QUYỀN NGƯỜI DÙNG**

1. **Guest (Khách hàng):** Xem thông tin (bằng ngôn ngữ tùy chọn), đặt lịch.  
2. **Barber (Thợ cắt tóc):** Đăng nhập Admin Dashboard, xem/quản lý lịch cá nhân.  
3. **Admin (Chủ tiệm):** Quản lý toàn bộ nội dung (đa ngôn ngữ), Booking, Thợ, Dịch vụ.

## **4\. YÊU CẦU CHỨC NĂNG (CẬP NHẬT i18n)**

### **4.1. Khối Frontend: Landing Page & Booking (Public)**

* **F1. Landing Page Đa ngôn ngữ:**  
  * Người dùng có thể chuyển đổi ngôn ngữ (VI/EN) qua một nút (Language Switcher) trên Header.  
  * Nội dung tĩnh (Nút bấm, Menu) thay đổi theo file locale (JSON).  
  * Nội dung động (Tên dịch vụ, Mô tả thợ, Giới thiệu tiệm) fetch từ API của Rails dựa trên ngôn ngữ đang chọn.  
* **F2. Luồng Booking:**  
  * *Step 1-5:* Toàn bộ giao diện lịch, thông báo lỗi (ví dụ: "Vui lòng chọn giờ / Please select a time") được dịch tương ứng.

### **4.2. Khối Quản trị: Admin / Barber Dashboard**

* **F3. Quản lý CMS Đa ngôn ngữ (Chỉ Admin):**  
  * Khi tạo/sửa Dịch vụ (Services) hoặc Thông tin trang (Site Settings), form sẽ có các tab/field nhập liệu cho cả Tiếng Việt và Tiếng Anh.  
* **F4. Quản lý Booking:**  
  * Admin/Barber quản lý lịch hẹn (Giao diện Admin có thể set mặc định là Tiếng Việt).

### **4.3. Khối Thông báo**

* Hệ thống Backend (Rails) cần lưu lại `locale` (ngôn ngữ) của khách hàng lúc đặt lịch.  
* Khi gửi Email/Zalo xác nhận, nội dung tin nhắn sẽ sử dụng đúng ngôn ngữ mà khách hàng đã dùng khi booking.

## **5\. THIẾT KẾ CƠ SỞ DỮ LIỆU (CẬP NHẬT CHO i18n)**

Để hỗ trợ đa ngôn ngữ ở tầng Database với Rails, chúng ta sử dụng phương pháp tạo bảng dịch (Translation Tables) thông qua gem `mobility`.

**1\. Table `users` (Admin & Barbers)**

* `id`, `email`, `encrypted_password`, `role`, `avatar_url`  
* *Table `user_translations`:* `name`, `biography` (Giới thiệu thợ đa ngôn ngữ).

**2\. Table `services`**

* `id`, `price`, `duration_minutes`, `image_url`  
* *Table `service_translations`:* `name` (Tên dịch vụ), `description` (Mô tả dịch vụ).

**3\. Table `appointments` (Booking)**

* `id`, `customer_name`, `customer_phone`, `user_id`, `start_time`, `end_time`, `status`, `total_price`  
* `locale` (String) \- *Ví dụ: "vi" hoặc "en", lưu lại để gửi thông báo đúng ngôn ngữ.*

**4\. Table `site_settings`**

* `id`, `key`  
* *Table `site_setting_translations`:* `value` (Nội dung động đa ngôn ngữ).

## **6\. LUỒNG XỬ LÝ API QUAN TRỌNG**

**Luồng Fetch Dữ liệu Đa ngôn ngữ**

1. Next.js Client đang ở locale `en`.  
2. Gửi request: `GET /api/v1/services` kèm header `Accept-Language: en` (hoặc pass qua query params `?locale=en`).  
3. Rails Controller nhận diện `locale`, ORM tự động query các trường từ bảng translation.  
4. Trả về JSON: `[{"id": 1, "name": "Classic Haircut"}]` (Thay vì "Cắt tóc cổ điển").

Để tài liệu "SRS \- T99 Barbershop" trở nên chuyên nghiệp, rõ ràng và dễ tiếp nhận hơn, tôi đã tái cấu trúc nội dung dưới đây. Bạn có thể sao chép và áp dụng cấu trúc này vào tài liệu Google Docs của mình.-----TÀI LIỆU ĐẶC TẢ HỆ THỐNG BARBERSHOP BOOKING (SRS)

**Phiên bản:** 1.1 | **Trạng thái:** Cập nhật Hỗ trợ Đa ngôn ngữ (i18n)-----1. TỔNG QUAN HỆ THỐNG

Hệ thống là nền tảng Web Application chuyên dụng cho Barbershop, bao gồm trang Landing Page giới thiệu dịch vụ và hệ thống đặt lịch hẹn (Booking) trực tuyến.

* **Mục tiêu chính:** Tiếp cận khách hàng nội địa và quốc tế thông qua hỗ trợ đa ngôn ngữ (VI/EN).  
* **Thông báo:** Đa kênh tích hợp (Email/Zalo) cho cả khách hàng và nhân sự.

\-----2. KIẾN TRÚC & TRIỂN KHAI

Hệ thống áp dụng mô hình **Headless Architecture** để tối ưu hiệu suất và khả năng mở rộng.

| Thành phần | Công nghệ | Ghi chú |
| ----- | ----- | ----- |
| **Frontend** | Next.js, Tailwind CSS | Deploy trên Vercel (ISR \+ Edge Middleware). |
| **Backend** | Ruby on Rails | API-only, Devise/JWT cho xác thực. |
| **Database** | PostgreSQL | Hosted trên Supabase. |
| **Background Jobs** | Sidekiq \+ Redis | Xử lý thông báo Email/Zalo. |

* **Chiến lược i18n:**  
  * **Frontend:** Sử dụng `next-intl` hoặc `react-i18next` để xử lý routing đa ngữ.  
  * **Backend:** Sử dụng gem `mobility` hoặc `globalize` để lưu trữ dữ liệu đa ngôn ngữ.

\-----3. PHÂN QUYỀN NGƯỜI DÙNG

1. **Guest (Khách hàng):** Xem thông tin & đặt lịch (theo ngôn ngữ tùy chọn).  
2. **Barber (Thợ):** Truy cập Dashboard cá nhân để quản lý lịch hẹn.  
3. **Admin (Chủ tiệm):** Quyền cao nhất; quản trị nội dung CMS, Booking, Nhân sự & Dịch vụ.

\-----4. YÊU CẦU CHỨC NĂNG (i18n)4.1. Khối Frontend (Public)

* **F1. Landing Page:** Hỗ trợ nút chuyển đổi ngôn ngữ (Switcher). Nội dung tĩnh tải từ file JSON; nội dung động (dịch vụ, thợ) fetch trực tiếp từ API theo locale.  
* **F2. Luồng Booking:** Đồng bộ hóa ngôn ngữ trong toàn bộ 5 bước đặt lịch và thông báo lỗi.

4.2. Khối Quản trị (Dashboard)

* **F3. Quản lý CMS:** Form nhập liệu dịch vụ/cấu hình trang hỗ trợ các tab/field nhập liệu song ngữ (VI/EN).  
* **F4. Quản lý Booking:** Giao diện quản trị ưu tiên Tiếng Việt.

4.3. Khối Thông báo

Hệ thống lưu lại `locale` của khách hàng tại thời điểm đặt lịch để đảm bảo Email/Zalo gửi đi đúng ngôn ngữ khách hàng đã sử dụng.-----5. THIẾT KẾ CƠ SỞ DỮ LIỆU

Sử dụng phương pháp bảng dịch (*Translation Tables*) thông qua gem `mobility`.

| Bảng chính | Các trường dữ liệu chính | Bảng Translation (Đa ngữ) |
| ----- | ----- | ----- |
| **Users** | id, email, role, avatar\_url | `user_translations` (name, bio) |
| **Services** | id, price, duration, image\_url | `service_translations` (name, desc) |
| **Appointments** | customer\_name, phone, start\_time, locale | \- |
| **Site Settings** | id, key | `setting_translations` (value) |

*Lưu ý: Trường `locale` trong bảng `Appointments` là bắt buộc để xác định ngôn ngữ gửi thông báo.*\-----6. LUỒNG XỬ LÝ API (FETCH DỮ LIỆU)

Luồng yêu cầu dữ liệu đa ngôn ngữ được tối ưu như sau:

1. **Request:** Client gửi `GET /api/v1/services` kèm `Accept-Language: en` (hoặc query param `?locale=en`).  
2. **Controller:** Rails nhận diện tham số ngôn ngữ.  
3. **Query:** ORM tự động truy vấn dữ liệu từ bảng `translation` tương ứng.  
4. **Response:** Trả về JSON với nội dung đã được dịch (`"name": "Classic Haircut"`).

\-----Mẹo nhỏ để tài liệu của bạn chuyên nghiệp hơn nữa:

1. **Chèn sơ đồ:** Bạn nên vẽ thêm sơ đồ kiến trúc (Architecture Diagram) bằng công cụ như [Draw.io](https://app.diagrams.net/) và dán vào mục 2\.  
2. **Mục lục tự động:** Nếu bạn đang dùng Google Docs, hãy đặt các tiêu đề mục là *Heading 1, Heading 2*, sau đó vào `Chèn > Mục lục` để tạo một danh sách click-được cho người đọc.  
3. **Sử dụng Code Block:** Với các đoạn API/Code, hãy dùng font chữ *Monospace* (như Courier New) và để nền xám để làm nổi bật so với văn bản thường.