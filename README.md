# 💸 ExpenseTrackerApp - Task & Expense Manager

Ứng dụng quản lý chi tiêu cá nhân được xây dựng bằng **React Native (Expo)** và **.NET Web API 8**. Dự án tập trung vào trải nghiệm người dùng mượt mà, quản lý tài chính trực quan với biểu đồ và hệ thống xác thực bảo mật.

## 🚀 Tính năng chính

- **Xác thực bảo mật:** Đăng ký/Đăng nhập sử dụng **JWT (JSON Web Token)**.
- **Quản lý chi tiêu (CRUD):** Thêm, sửa, xóa và xem chi tiết các khoản chi tiêu.
- **Phân tích trực quan:** Biểu đồ tròn (Pie Chart) phân tích chi tiêu theo từng hạng mục (Ăn uống, Mua sắm, Hóa đơn...).
- **Bộ lọc thông minh:** Tìm kiếm giao dịch nhanh và lọc theo danh mục (Categories).
- **Giao diện hiện đại:** Thiết kế Clean UI với Lucide Icons và màu sắc hài hòa.

## 🛠 Công nghệ sử dụng

### Frontend (Mobile App)

- **React Native / Expo** (SDK 50+)
- **Expo Router:** Hệ thống điều hướng dựa trên File-based routing.
- **Context API:** Quản lý trạng thái đăng nhập toàn cục.
- **Axios:** Kết nối API với interceptors xử lý Token.
- **React Native Chart Kit:** Hiển thị biểu đồ phân tích.

### Backend (Web API)

- **ASP.NET Core 8 (.NET 8)**
- **Entity Framework Core:** Quản lý cơ sở dữ liệu.
- **SQL Server:** Lưu trữ dữ liệu giao dịch và người dùng.
- **Repository Pattern:** Đảm bảo code sạch, dễ bảo trì và mở rộng.

## 📸 Demo Giao diện

## ⚙️ Cài đặt

1.  **Backend:**

    - Mở project .NET trong Visual Studio.
    - Cập nhật `ConnectionString` trong `appsettings.json`.
    - Chạy lệnh `Update-Database` và nhấn F5.

2.  **Frontend:**
    ```bash
    cd ExpenseTrackerApp
    npm install
    npx expo start
    ```

## 👤 Tác giả

- **Trần Công Thành** - _Junior Software Developer_
