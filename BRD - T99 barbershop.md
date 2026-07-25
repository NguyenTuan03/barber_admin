# **TÀI LIỆU ĐỀ XUẤT HỆ THỐNG QUẢN LÝ & ĐẶT LỊCH BARBERSHOP**

*Phiên bản: 1.0 | Ngày: 06/07/2026*

# **1\. MỤC TIÊU DỰ ÁN**

Xây dựng một hệ thống website chuyên nghiệp dành riêng cho tiệm Barbershop, giúp tiệm nâng cao hình ảnh thương hiệu, thu hút khách hàng mới và tối ưu hóa quy trình quản lý lịch hẹn hàng ngày. Hệ thống loại bỏ hoàn toàn việc ghi chép sổ sách thủ công, giảm thiểu tình trạng quên lịch hoặc trùng lịch.

# **2\. TRẢI NGHIỆM CỦA KHÁCH HÀNG**

Mục tiêu là giúp khách hàng đặt lịch nhanh chóng nhất, chỉ qua vài thao tác lướt trên điện thoại, không cần tải App, không bắt buộc tạo tài khoản phức tạp.

**Luồng trải nghiệm (Booking Flow):**

1. **Vào trang chủ:** Khách hàng xem hình ảnh không gian tiệm, bảng giá dịch vụ và thông tin các thợ cắt tóc. (Có thể chuyển đổi Tiếng Việt / Tiếng Anh).  
2. **Bấm "Đặt lịch ngay":**  
   * *Bước 1:* Chọn Dịch vụ (Ví dụ: Cắt tạo kiểu \+ Gội đầu). Hệ thống tự tính tổng tiền và tổng thời gian dự kiến.  
   * *Bước 2:* Chọn Thợ yêu thích (hoặc chọn "Sắp xếp thợ bất kỳ").  
   * *Bước 3:* Chọn Ngày và Giờ. (Hệ thống tự động ẩn các khung giờ mà thợ đã kẹt lịch).  
   * *Bước 4:* Điền thông tin cơ bản: Tên, Số điện thoại (Bắt buộc) và Ghi chú thêm.  
3. **Hoàn tất:** Khách hàng nhận được thông báo "Đặt lịch thành công" trên màn hình.

*(Lưu ý: Khách hàng thanh toán trực tiếp tại tiệm sau khi sử dụng dịch vụ, không cần thanh toán online trước).*

# **3\. TRẢI NGHIỆM CỦA NHÂN SỰ TIỆM**

Hệ thống cung cấp một trang Quản trị (Dashboard) riêng biệt, an toàn, có thể truy cập bằng điện thoại, iPad hoặc máy tính.

## **A. Dành cho Chủ tiệm / Quản lý**

* Xem danh sách toàn bộ lịch hẹn trong ngày của tất cả các thợ. Dễ dàng sắp xếp, đổi giờ hoặc chuyển khách từ thợ này sang thợ khác nếu có phát sinh.  
* Đánh dấu khách "Đã hoàn thành", "Khách không đến" (No-show) hoặc "Đã hủy".  
* Thay đổi nội dung Web (Không cần nhờ IT)**:** Chủ tiệm có thể tự mình:  
  * Thay đổi các dòng chữ giới thiệu, Slogan trên trang chủ.  
  * Thêm/Sửa/Xóa các Dịch vụ (Đổi tên, Cập nhật giá, Đổi hình ảnh minh họa).  
  * Thêm/Sửa thông tin Thợ cắt tóc mới.  
  * *Tất cả thông tin đều hỗ trợ nhập 2 ngôn ngữ (Việt \- Anh).*

## **B. Dành cho Thợ cắt tóc (Barber)**

* **Sự chủ động:** Mỗi thợ có một tài khoản đăng nhập riêng.  
* **Tập trung công việc:** Thợ chỉ nhìn thấy lịch hẹn khách hàng **của riêng mình** (Không xem được lịch của thợ khác để đảm bảo sự tập trung và tính riêng tư).  
* **Cập nhật tiến độ:** Thợ có thể tự đánh dấu "Đã xong" khi hoàn thành dịch vụ cho khách.

# **4\. HỆ THỐNG THÔNG BÁO TỰ ĐỘNG**

Để đảm bảo thông tin luôn thông suốt và không bị lỡ khách:

**1\. Đối với Khách hàng:**

* (Tùy chọn) Gửi Email xác nhận tự động nếu khách có nhập email khi đặt lịch.  
* *(Gợi ý nâng cấp sau này: Tích hợp Zalo ZNS để gửi tin nhắn xác nhận lịch vào Zalo của khách).*

**2\. Đối với Tiệm / Thợ:**

* Ngay khi có khách đặt lịch thành công trên web, hệ thống lập tức tự động gửi một tin nhắn thông báo vào **Group Zalo / Telegram nội bộ** của tiệm.  
* *Nội dung tin nhắn báo:* `[CÓ LỊCH MỚI] - Khách: Anh Tuấn (09xx) - Cắt với thợ: Huy - Lúc: 15:30 Hôm nay.`  
* Giúp cả Chủ tiệm và Thợ nắm bắt lịch ngay lập tức mà không cần phải lúc nào cũng mở web để kiểm tra.

# **5\. LỢI ÍCH MANG LẠI CHO DOANH NGHIỆP**

1. **Chuyên nghiệp hóa hình ảnh:** Có website đặt lịch như các chuỗi Barbershop lớn.  
2. **Phục vụ khách Tây/Du lịch:** Nhờ tính năng Đa ngôn ngữ (Anh/Việt) tự động.  
3. **Tối đa hóa công suất thợ:** Tránh tình trạng giờ cao điểm khách ngồi chờ quá lâu, giờ thấp điểm thợ ngồi chơi.  
4. **Chủ động vận hành:** Thay đổi giá, dịch vụ ngay lập tức mà không phụ thuộc vào bên thiết kế web.  
5. **Tối ưu chi phí:** Vận hành hệ thống thông báo nội bộ qua Zalo/Telegram hoàn toàn miễn phí.

