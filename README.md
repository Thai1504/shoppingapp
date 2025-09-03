# 🏨 Quản Lý Mua Sắm v2.0

Ứng dụng quản lý mua sắm dành cho 4 khách sạn với thiết kế mobile-first và giao diện thân thiện.

## 🌟 Tính Năng Chính

### ✨ Quy Trình Sử Dụng Đơn Giản
1. **📅 Chọn Ngày** - Chọn ngày mua sắm
2. **🏨 Chọn Khách Sạn** - Lựa chọn từ 4 khách sạn: 36LS, 16TX, 55HT, 49HG  
3. **📦 Chọn Danh Mục** - Thịt, Rau, hoặc Đồ khô
4. **➕ Thêm Sản Phẩm** - Nhập thông tin sản phẩm cần mua

### 🎯 Tính Năng Nổi Bật
- **📱 Mobile-First**: Thiết kế ưu tiên thiết bị di động với font chữ lớn, dễ đọc
- **✅ Quản Lý Trạng Thái**: Đánh dấu sản phẩm đã mua/chưa mua
- **💰 Dual Pricing**: Quản lý cả giá mua và giá bán
- **📊 Tính Toán Tự Động**: Tự động tính tổng tiền mua và bán
- **🔍 Tìm Kiếm & Lọc**: Tìm kiếm theo tên và lọc theo trạng thái
- **💾 Lưu Trữ Tự Động**: Dữ liệu được lưu tự động trên trình duyệt
- **📤 Xuất/Nhập Dữ Liệu**: Sao lưu và khôi phục dữ liệu dễ dàng

## 🚀 Demo Trực Tuyến

Ứng dụng được host trên GitHub Pages: [Link Demo](#)

## 📱 Giao Diện

### Màn Hình Chính - Quy Trình 3 Bước
- **Bước 1**: Chọn ngày mua sắm với date picker lớn, dễ sử dụng
- **Bước 2**: Chọn khách sạn từ 4 lựa chọn với biểu tượng rõ ràng
- **Bước 3**: Chọn danh mục sản phẩm (Thịt/Rau/Đồ khô)

### Form Thêm Sản Phẩm
- Tên sản phẩm (có thể nhập tự do hoặc chọn từ danh sách)
- Số lượng và đơn vị (kg, gram, lít, chai, gói, cái, thùng, hộp)
- Giá mua và giá bán (có thể để trống và nhập sau)

### Bảng Danh Sách Sản Phẩm
| Cột | Mô Tả |
|-----|-------|
| ✓ | Checkbox đánh dấu hoàn thành |
| Tên sản phẩm | Tên của sản phẩm |
| Đơn vị | Số lượng và đơn vị tính |
| Giá mua | Giá mua (có thể chỉnh sửa trực tiếp) |
| Giá bán | Giá bán (có thể chỉnh sửa trực tiếp) |
| Tổng mua | Tổng tiền mua (tự động tính) |
| Tổng bán | Tổng tiền bán (tự động tính) |
| Thao tác | Nút xóa sản phẩm |

### Tổng Kết
- Dòng cuối cùng hiển thị tổng tiền mua và tổng tiền bán
- Hiển thị số lượng sản phẩm

## 🛠️ Cài Đặt & Sử Dụng

### Yêu Cầu Hệ Thống
- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- Kích thước màn hình tối thiểu: 320px
- JavaScript được bật

### Cài Đặt Trên GitHub Pages

1. **Fork Repository**
   ```bash
   # Hoặc clone về máy
   git clone https://github.com/your-username/shopping-manager-v2.git
   cd shopping-manager-v2
   ```

2. **Bật GitHub Pages**
   - Vào Settings của repository
   - Cuộn xuống phần "Pages"
   - Chọn Source: "Deploy from a branch"
   - Chọn Branch: "main" và folder: "/ (root)"
   - Nhấn Save

3. **Truy Cập Ứng Dụng**
   - URL sẽ là: `https://your-username.github.io/shopping-manager-v2/`

### Cài Đặt Cục Bộ

```bash
# Clone repository
git clone https://github.com/your-username/shopping-manager-v2.git
cd shopping-manager-v2

# Mở file index.html bằng trình duyệt
# Hoặc sử dụng live server nếu có
```

## 📖 Hướng Dẫn Sử Dụng Chi Tiết

### 1. Bắt Đầu Sử Dụng
- Mở ứng dụng trên trình duyệt
- Chọn ngày mua sắm (mặc định là ngày hôm nay)
- Chọn khách sạn (36LS, 16TX, 55HT, hoặc 49HG)
- Chọn danh mục sản phẩm (Thịt, Rau, hoặc Đồ khô)

### 2. Thêm Sản Phẩm
- Nhập tên sản phẩm hoặc chọn từ danh sách có sẵn
- Nhập số lượng (bắt buộc)
- Chọn đơn vị (mặc định: kg)
- Nhập giá mua và giá bán (không bắt buộc, có thể nhập sau)
- Nhấn "➕ Thêm sản phẩm"

### 3. Quản Lý Danh Sách
- **Đánh dấu hoàn thành**: Tick vào checkbox
- **Chỉnh sửa giá**: Click trực tiếp vào ô giá để thay đổi
- **Tìm kiếm**: Sử dụng ô tìm kiếm phía trên danh sách
- **Lọc**: Chọn "Tất cả", "Chưa hoàn thành", hoặc "Đã hoàn thành"
- **Xóa sản phẩm**: Nhấn nút 🗑️

### 4. Tính Năng Nâng Cao
- **Đánh dấu tất cả**: Nút "✓ Đánh dấu tất cả" 
- **Xóa đã hoàn thành**: Nút "🗑️ Xóa đã hoàn thành"
- **Thay đổi lựa chọn**: Nút "Thay đổi" để chọn lại ngày/khách sạn/danh mục

### 5. Xuất/Nhập Dữ Liệu
- **Xuất dữ liệu**: Menu ☰ → "📥 Xuất dữ liệu" → Tải file JSON
- **Nhập dữ liệu**: Menu ☰ → "📤 Nhập dữ liệu" → Chọn file JSON
- **In báo cáo**: Menu ☰ → "🖨️ In báo cáo"

## 🏗️ Kiến Trúc Ứng Dụng

### Cấu Trúc Thư Mục
```
shopping-manager-v2/
├── index.html          # Trang chính
├── css/
│   └── styles.css      # Styles CSS
├── js/
│   ├── app.js         # Logic ứng dụng chính
│   ├── data.js        # Quản lý dữ liệu
│   └── utils.js       # Tiện ích hỗ trợ
├── README.md          # Tài liệu này
└── .gitignore         # Git ignore
```

### Cấu Trúc Dữ Liệu

```javascript
{
  "version": "2.0",
  "hotels": {
    "36LS": {
      "2024-01-15": {
        "thit": [
          {
            "id": "unique-id",
            "name": "Thịt bò",
            "quantity": 2,
            "unit": "kg",
            "buyPrice": 300000,
            "sellPrice": 350000,
            "isDone": false,
            "createdAt": "timestamp",
            "updatedAt": "timestamp"
          }
        ]
      }
    }
  },
  "itemPool": {
    "thit": [...],
    "rau": [...],
    "dokho": [...]
  }
}
```

## 🎨 Thiết Kế Mobile-First

### Nguyên Tắc Thiết Kế
- **Font size tối thiểu**: 18px cho dễ đọc
- **Touch targets**: Tối thiểu 44px × 44px
- **Contrast cao**: Đảm bảo dễ nhìn trong mọi điều kiện ánh sáng
- **Navigation đơn giản**: Ít bước thao tác, quy trình rõ ràng

### Responsive Design
- **Mobile**: < 768px (thiết kế chính)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ⚡ Performance & Tối Ưu

### LocalStorage
- Dữ liệu được lưu tự động trên trình duyệt
- Không cần kết nối internet sau lần đầu tải
- Dung lượng hiển thị trong phần "Thông tin ứng dụng"

### Lazy Loading
- Chỉ tải dữ liệu khi cần thiết
- UI cập nhật mượt mà với debounce

### PWA Ready
- Có thể cài đặt như ứng dụng trên điện thoại
- Hoạt động offline sau lần đầu tải

## 🔒 Bảo Mật

### Data Privacy
- Tất cả dữ liệu lưu trên thiết bị của người dùng
- Không có server backend
- Không thu thập thông tin cá nhân

### XSS Protection
- Tất cả input được sanitize trước khi hiển thị
- Validation data đầy đủ

## 🛠️ Phát Triển & Tùy Chỉnh

### Thêm Khách Sạn Mới
1. Sửa file `index.html` - thêm hotel card
2. Cập nhật `js/data.js` - thêm hotel code
3. Cập nhật `js/utils.js` - thêm hotel info

### Thêm Danh Mục Mới
1. Sửa file `index.html` - thêm section card
2. Cập nhật data structure trong `js/data.js`
3. Thêm default items trong `js/app.js`

### Tùy Chỉnh Giao Diện
- Sửa CSS variables trong `css/styles.css`
- Thay đổi màu sắc, font chữ, kích thước

## 📱 Tương Thích Trình Duyệt

| Trình Duyệt | Mobile | Desktop | Ghi Chú |
|-------------|---------|---------|---------|
| Chrome | ✅ | ✅ | Khuyến nghị |
| Safari | ✅ | ✅ | iOS 12+ |
| Firefox | ✅ | ✅ | |
| Edge | ✅ | ✅ | Chromium-based |
| Samsung Internet | ✅ | - | Android |

## 🆕 Changelog

### v2.0 (Current)
- ✨ **NEW**: Mobile-first design hoàn toàn mới
- ✨ **NEW**: Quy trình 3 bước đơn giản
- ✨ **NEW**: Dual pricing (giá mua/giá bán)
- ✨ **NEW**: Tên khách sạn thực (36LS, 16TX, 55HT, 49HG)
- ✨ **NEW**: Pool selection cho sản phẩm
- ✨ **NEW**: Sum row hiển thị tổng
- ✨ **NEW**: Touch-friendly interface
- 🔧 **IMPROVED**: Performance và UX
- 🔧 **IMPROVED**: Data structure mới

### v1.0 (Legacy)
- Phiên bản đầu tiên với giao diện desktop
- Chức năng cơ bản quản lý sản phẩm

## 🤝 Đóng Góp

### Báo Lỗi
- Tạo issue trên GitHub với mô tả chi tiết
- Bao gồm thông tin trình duyệt và thiết bị
- Screenshot nếu có thể

### Đề Xuất Tính Năng
- Tạo feature request trên GitHub
- Mô tả rõ ràng use case và lợi ích

### Pull Requests
- Fork repository
- Tạo branch từ `main`
- Commit với message rõ ràng
- Tạo PR với mô tả chi tiết

## 📧 Liên Hệ

- **GitHub Issues**: [Tạo issue mới](#)
- **Documentation**: File README.md này
- **Live Demo**: [GitHub Pages](#)

## 📄 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

---

**🏨 Quản Lý Mua Sắm v2.0** - Giải pháp quản lý mua sắm hiện đại cho khách sạn

*Được phát triển với ❤️ bởi Shopping Manager Team*