# 📱 Dự án Web Bán Điện Thoại

> Ứng dụng web quản lý và bán điện thoại, bao gồm hệ thống quản trị và giao diện người dùng. Dự án sử dụng **ReactJS** cho frontend và **Java Spring Boot** cho backend.

-------------------------------------------------------------------------------------
## 🌐 Demo 
👉 http://localhost:3000 

-------------------------------------------------------------------------------------
## 🧩 Công nghệ sử dụng

### 🔹 Frontend:
- ReactJS
- React Router DOM
- Bootstrap + Bootstrap Icons
- Axios

### 🔹 Backend:
- Java Spring Boot
- Spring Data JPA
- MySQL (hoặc PostgreSQL)
- Spring Security (nếu có)

-------------------------------------------------------------------------------------

## 📦 Tính năng

### 👨‍💻 Trang quản trị:
- Đăng nhập / Đăng xuất
- Quản lý người dùng
- Quản lý sản phẩm (điện thoại)
- Quản lý danh mục và thương hiệu
- Quản lý đơn hàng và thanh toán
- Thống kê tổng quan (số lượng người dùng, sản phẩm, doanh thu,...)

### 👤 Trang người dùng:
- Xem danh sách sản phẩm
- Lọc theo danh mục / thương hiệu
- Thêm sản phẩm vào giỏ hàng
- Thanh toán đơn hàng
- Xem lịch sử đơn hàng

-------------------------------------------------------------------------------------

## 🚀 Hướng dẫn cài đặt 

### 🔧 1. Tải về toàn bộ project từ GitHub

git clone https://github.com/your-username/phone-store.git
cd phone-store

### ⚙️ 2. Cài đặt và chạy Backend (Spring Boot)
✅ Yêu cầu:
Java 17+
Maven 3.6+
MySQL hoặc PostgreSQL

📍 Các bước:
Mở thư mục backend trong IntelliJ, Eclipse hoặc VS Code.
Cấu hình application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/example205
spring.datasource.username=root
spring.datasource.password=

Chạy project với Maven:

cd example205
mvn spring-boot:run
Ứng dụng backend sẽ chạy tại: http://localhost:8080

### 🖥️ 3. Cài đặt và chạy Frontend (ReactJS)
✅ Yêu cầu:
Node.js >= 16
npm hoặc yarn

📍 Các bước:
1. Mở terminal và di chuyển đến thư mục frontend:
cd frontend

2. Cài đặt các package cần thiết:
npm install

3. Chạy ứng dụng:
npm start
Ứng dụng frontend sẽ chạy tại: http://localhost:3000