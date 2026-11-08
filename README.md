# Tengi SmartHome Care 24/7 — Cuộc thi Vibe Coding 2026

## 1. Thông tin chung

| Hạng mục | Nội dung |
|---|---|
| Tên đội thi | `댕이_Tengi (ĐỘI_TENGI)` |
| Bảng thi | `Bảng A - Công nghệ` |
| Đề bài bốc thăm | Đề số `04` — `Chatbot FAQ & đặt lịch tư vấn` |
| Demo online | `https://i1u29-gif.github.io/TENGI_VIBE_CHALLENGE/` |
| Video demo (≤ 02 phút) | `<Điền URL Google Drive / YouTube của Video Demo trước khi nộp>` |
| Source ZIP | `<Điền URL Google Drive chứa file DOI_TENGI_De4_VibeCoding2026.zip>` |
| Minh chứng dùng AI | `Kèm trong ZIP (Minh_Chung_AI_DOI_TENGI.pdf) và Mục 10 bên dưới` |
| Bảng kiểm thử | `Kèm trong ZIP, tích hợp trực tiếp trên Tab Giao diện và Mục 11 bên dưới` |

> Tiêu chí vòng loại: https://vibecoding.info.vn/tieu-chi-cham-thi
> Bảng A: ít nhất 6 ca kiểm thử; chỉ dùng Mock thì nhóm A3 tối đa 4/15 điểm.
> Không đưa khóa API hoặc mật khẩu vào bài nộp.

## 2. Tính năng chính

- **Tính năng 1 (Trả lời 10 câu hỏi thường gặp - FAQ):** Khung chat giải đáp tức thì 10 chủ đề FAQ của doanh nghiệp nhỏ *Tengi SmartHome* (giờ mở cửa, báo giá gói cơ bản, bảo hành 24 tháng, thời gian thi công, khảo sát miễn phí, vận hành khi mất Internet, trả góp, ứng dụng điều khiển, lắp cho nhà đang ở, an ninh chống trộm).
- **Tính năng 2 (AI diễn đạt tự nhiên & gợi ý 03 câu hỏi liên quan):** Tích hợp AI thật diễn đạt lại câu trả lời mượt mà, bám sát dữ liệu chuẩn (chống bịa đặt/lạc đề) và luôn hiển thị đúng 03 câu hỏi gợi ý liên quan (Quick Reply Chips) sau mỗi lượt trả lời.
- **Tính năng 3 (Chủ động đề xuất đặt lịch khi ngoài kịch bản):** Khi gặp câu hỏi chuyên sâu nằm ngoài 10 câu FAQ (`can_answer: false`), Chatbot lịch sự từ chối trả lời tự do, chủ động hiển thị nút mở Form đặt lịch và tự động điền câu hỏi tồn đọng vào mục Ghi chú.
- **Tính năng 4 (Form đặt lịch lưu `localStorage` & Điểm WOW xác nhận):** Cho phép chọn ngày/giờ (có nút tự điền thông minh ngày giờ hôm nay), nhập Họ tên + Số điện thoại (kiểm tra Regex 10 số chuẩn Việt Nam, chặn ngày quá khứ, chặn ngoài khung giờ 08:00–20:00, chặn trùng lịch), lưu vào `localStorage` và xuất thẻ xác nhận kèm **Link thêm vào Google Calendar**, **Tải tệp lịch `.ics`** và **Gửi phiếu xác nhận qua Zalo**.
- **Tính năng 5 (Trang quản trị lịch hẹn đơn giản):** Chuyển đổi nhanh ngay trên giao diện để xem danh sách lịch hẹn đã đặt từ `localStorage`, mở nhanh liên kết Lịch Google / Zalo của khách và xóa lịch hẹn đã xử lý.

## 3. Công nghệ sử dụng

| Lớp | Công nghệ (ghi đúng thứ đã dùng) |
|---|---|
| Giao diện | `HTML5 / CSS3 / JavaScript (ES6+ Modular Namespace)` + `Custom Utilities CSS & Editorial Light UI` |
| Thư viện | `Custom SVG Icons (src/icons.js), Inter Self-hosted WOFF2 Font, Web Audio API (âm báo tin nhắn không phụ thuộc thư viện ngoài)` |
| Lưu trữ | `localStorage` (lưu danh sách lịch hẹn `tengi_appointments_v1` kèm cơ chế tự phục hồi JSON hỏng) & `sessionStorage` (lưu tạm khóa API trong phiên) |
| Triển khai | `GitHub Pages (https://i1u29-gif.github.io/TENGI_VIBE_CHALLENGE/)` |

## 4. Tích hợp AI

- **Chế độ đang dùng**: `API thật` (tích hợp cơ chế Auto-Discovery tự động dò model và Fallback NLP nội bộ khi chưa nhập khóa hoặc đứt mạng)
  - API thật: `gemini-2.5-flash` (tự động tương thích đa model `gemini-2.0-flash`, `gemini-1.5-flash` qua Google Generative Language REST API `v1beta`)
  - Dự phòng (Fallback): khi chưa nhập khóa API trên thanh Header, giao diện hiển thị rõ trạng thái *"Chế độ Kịch bản (Local)"* để giám khảo vẫn kiểm thử được 100% luồng nghiệp vụ khi chạy offline.
- **Mục đích**: phân tích câu hỏi tự nhiên của khách hàng đối chiếu với bộ kiến thức 10 câu FAQ, ép kiểu đầu ra JSON (`answer`, `can_answer`, `suggested_questions`) để trả lời tự nhiên, sinh đúng 03 câu hỏi gợi ý và nhận diện câu hỏi ngoài phạm vi để điều hướng đặt lịch hẹn.
- **Bảo mật khoá API**: tuyệt đối không ghi khoá API thật trong mã nguồn. Chỉ cung cấp tệp cấu hình mẫu (`.env.example`, `config.example.js`); người chấm có thể dán khóa API trực tiếp trên giao diện (lưu tạm trong `sessionStorage`).

Biến môi trường mẫu (`.env.example`):

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
GEMINI_MODEL="gemini-2.5-flash"
AI_TIMEOUT_MS="8000"