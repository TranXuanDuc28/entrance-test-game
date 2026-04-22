# 🎮 Let's Play - Number Clearing Game

Một trò chơi trí tuệ đơn giản nhưng đầy thử thách, yêu cầu bạn phải nhanh mắt và chính xác để xóa các điểm số theo đúng thứ tự.

## 🚀 Tính năng chính

Trò chơi bao gồm đầy đủ 6 yêu cầu kỹ thuật:
1.  **Chế độ Win**: Hiển thị thông báo "ALL CLEAREDS" khi bạn xóa hết các số theo đúng thứ tự (1, 2, 3...).
2.  **Chế độ Loss**: Hiển thị "GAME OVER" ngay lập tức nếu bạn click sai thứ tự.
3.  **Nút Restart**: Cho phép làm mới trò chơi, tạo lại các vị trí ngẫu nhiên bất cứ lúc nào.
4.  **Auto Play**: Chế độ tự động chơi, máy tính sẽ tự tìm và click theo đúng thứ tự giúp bạn.
5.  **Tùy chỉnh linh hoạt**:
    *   Nhập số lượng điểm (Points) tùy ý (hỗ trợ lên tới hàng nghìn điểm).
    *   Tùy chỉnh thời gian biến mất (Fade time) của mỗi điểm.
6.  **Hiệu ứng mờ dần (Fade-out)**: Mỗi điểm khi được chọn sẽ có bộ đếm ngược thời gian và mờ dần trước khi biến mất hoàn toàn.

## ✨ Điểm nổi bật về giao diện
- **Thiết kế hiện đại**: Phong cách Glassmorphism (hiệu ứng kính mờ) sang trọng.
- **Hiệu ứng mượt mà**: Sử dụng thư viện `framer-motion` cho các chuyển động scale và opacity.
- **Responsive**: Hiển thị tốt trên cả máy tính và điện thoại di động (Mobile-friendly).

## 🛠️ Công nghệ sử dụng
- **Core**: ReactJS + Vite
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (Custom CSS Variables)

## 📦 Hướng dẫn cài đặt và chạy thử

1.  **Cài đặt dependencies**:
    ```bash
    npm install
    ```
2.  **Chạy trên môi trường local**:
    ```bash
    npm run dev
    ```
    Mở trình duyệt và truy cập: `http://localhost:5173`

## 📖 Cách chơi
1. Nhập số lượng điểm mong muốn vào ô **Points**.
2. Nhấn nút **Play/Restart** để bắt đầu.
3. Click vào các hình tròn theo thứ tự từ nhỏ đến lớn (1 -> 2 -> 3...).
4. Trò chơi kết thúc khi bạn xóa hết tất cả các điểm hoặc click sai thứ tự.
