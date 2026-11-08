# ĐỀ 4: CHATBOT FAQ & ĐẶT LỊCH TƯ VẤN (VIBE CODING 2026)

- **Đội thi:** ĐỘI_TENGI
- **Bảng thi:** Bảng A
- **Đề bài:** Đề 4 – Chatbot FAQ & đặt lịch tư vấn cho doanh nghiệp nhỏ hoạt động 24/7 (`Tengi SmartHome Care 24/7`)

---

## Bản giao diện xám – trắng – đen

- Icon SVG nằm trong `src/icons.js`, không cần mạng hoặc thư viện icon.
- Phông Inter hỗ trợ tiếng Việt được lưu trong `styles/fonts/` (kèm giấy phép OFL).
- Tailwind đã biên dịch sẵn vào `styles/utilities.css`; chỉnh màu và bố cục trong `styles/main.css`.
- Trên điện thoại, khung tư vấn hiển thị trước danh mục câu hỏi.
- Giải nén rồi mở `index.html`, hoặc dùng Live Server trong VS Code. Chế độ FAQ nội bộ hoạt động khi không có mạng; Gemini cần kết nối mạng và API key.

## 1. Công nghệ sử dụng (Tech Stack)

- **Frontend:** HTML5, Tailwind CSS (Responsive Desktop & Mobile), Vanilla JavaScript (ES6+ thiết kế phân tầng mô-đun).
- **Tích hợp AI thật (Real AI Integration):** Google Gemini API (tự chọn mô hình khả dụng từ API) thông qua REST API với cơ chế ép kiểu đầu ra **Structured JSON Schema** (`responseMimeType: "application/json"`).
- **Cơ chế dự phòng (Fallback Engine):** Chấm điểm từ khóa FAQ để tiếp tục trả lời theo kịch bản ngay cả khi chưa nhập API Key hoặc gặp sự cố mất mạng / hết hạn mức API.
- **Lưu trữ dữ liệu:** `localStorage` cho danh sách lịch hẹn (`tengi_appointments_v1`) và `sessionStorage` cho khóa API tạm thời (đảm bảo **không lộ khóa API trong mã nguồn** theo quy định của BTC).

---

## 2. Cấu trúc thư mục mã nguồn (Architecture)

```text
DOI_TENGI_De4_VibeCoding2026/
├── index.html                  # Giao diện chính (Khách hàng, Quản trị, Bảng 6 Ca Kiểm Thử)
├── config.example.js           # File cấu hình mẫu (Không chứa API Key thật)
├── .env.example                # Biến môi trường mẫu theo chuẩn bảo mật BTC
├── README.md                   # Tài liệu hướng dẫn đầy đủ theo quy định nộp bài
├── styles/
│   └── main.css                # CSS tùy chỉnh & hiệu ứng chuyển động
└── src/
    ├── data/
    │   └── faqData.js          # Bộ kiến thức 10 câu hỏi thường gặp (FAQ Knowledge Base)
    ├── utils/
    │   └── validator.js        # Kiểm tra đầu vào, chống XSS, chuẩn hóa JSON đầu ra từ AI
    ├── services/
    │   ├── storageService.js   # Quản lý localStorage an toàn kèm tự phục hồi (Self-healing)
    │   └── aiService.js        # Kết nối mô hình Gemini khả dụng + Kiểm soát đầu ra + Timeout/Fallback
    └── app.js                  # Điều phối luồng sự kiện UI và chạy tự động 6 ca kiểm thử
```

---

## 3. Năm (05) tính năng cốt lõi đã hoàn thành

1. **Trả lời 10 câu hỏi thường gặp (FAQ):** Xây dựng bộ kiến thức 10 câu FAQ thực tế của doanh nghiệp `Tengi SmartHome` (giờ làm việc, báo giá gói cơ bản, bảo hành 24 tháng, thời gian thi công, khảo sát miễn phí, hoạt động khi mất Internet, trả góp, ứng dụng điều khiển, lắp cho nhà đang ở, an ninh chống trộm).
2. **AI diễn đạt tự nhiên & Gợi ý 03 câu hỏi liên quan:** AI tổng hợp và diễn đạt lại câu trả lời mượt mà, đồng thời luôn sinh đúng 03 câu hỏi gợi ý dưới dạng nút bấm nhanh (Quick Reply Chips) sau mỗi lượt trả lời.
3. **Chủ động đề xuất đặt lịch khi không trả lời được:** Khi câu hỏi nằm ngoài phạm vi 10 câu FAQ (`can_answer: false`), Chatbot lịch sự thông báo và hiển thị nút **"Đặt lịch tư vấn với nhân viên"**, tự động điền nội dung câu hỏi tồn đọng vào ô ghi chú của Form.
4. **Form đặt lịch lưu `localStorage`:** Cho phép chọn ngày/giờ, nhập họ tên, số điện thoại (kiểm tra đúng 10 số chuẩn Việt Nam, chặn ngày quá khứ, chặn ngoài khung giờ 08:00–20:00, chặn trùng lịch) và lưu vào `localStorage`.
5. **Trang quản trị đơn giản (Admin Dashboard):** Xem danh sách lịch hẹn theo thời gian thực, thống kê tổng số lịch hẹn và xóa từng lịch hẹn hoặc xóa toàn bộ lịch đã xử lý.

---

## 4. Hướng dẫn cách chạy (How to Run)

### Cách 1: Chạy trực tiếp (Không cần cài đặt)
- Giải nén file `DOI_TENGI_De4_VibeCoding2026.zip`.
- Mở trực tiếp file `index.html` bằng trình duyệt (Chrome, Edge, Firefox, Safari).

### Cách 2: Chạy qua Local Web Server (Khuyến nghị)
```bash
# Sử dụng Python
python -m http.server 5500
# Hoặc sử dụng Node.js
npx serve .
```
Sau đó truy cập `http://localhost:5500`.

### Cách kích hoạt AI thật (Gemini API):
1. Dán khóa Gemini API vào ô **Nhập Gemini API Key...**, bấm **Kết nối** hoặc nhấn Enter.
2. Chờ hệ thống lấy danh sách mô hình rồi gửi một yêu cầu kiểm tra ngắn. Yêu cầu này sử dụng hạn mức API.
3. Chỉ khi AI trả lời thành công mới hiện **Đã kết nối được với Agent [tên mô hình] ([mã mô hình])**. Tên lấy từ `displayName` do Gemini trả về, không suy đoán từ chuỗi khóa.
4. Khóa sai hiện **API không hợp lệ**. Lỗi quyền, quota, mạng và timeout có thông báo riêng; không báo thành công khi chưa kiểm tra được.
5. Khóa đã xác thực được lưu tạm trong `sessionStorage`; khi tải lại trang, hệ thống kiểm tra lại. Bấm **Ngắt kết nối** để xóa khóa và dùng FAQ nội bộ.
6. Phiên bản này tích hợp Gemini; không nhận khóa OpenAI, Claude hoặc dịch vụ khác.

---

## 5. AI sử dụng & Kiểm soát đầu ra

- **Trong quá trình phát triển (Vibe Coding):** Sử dụng AI hỗ trợ phân rã kiến trúc 4 tầng (`Data` – `Validator` – `Service` – `UI`), thiết kế System Prompt ép kiểu JSON và xây dựng bộ kiểm thử biên.
- **Tích hợp trong sản phẩm:** Sử dụng mô hình được xác thực từ danh sách Gemini với `responseMimeType: "application/json"`.
- **Kiểm soát đầu ra (`Validator.validateAndNormalizeAIOutput`):**
  - Bắt buộc phản hồi từ AI phải có trường `answer` (chuỗi không rỗng) và `can_answer` (`boolean`).
  - Nếu AI trả về thiếu hoặc thừa số lượng câu hỏi gợi ý, hàm chuẩn hóa sẽ tự động bổ sung/cắt gọn để **luôn hiển thị đúng 03 câu hỏi gợi ý hợp lệ**.

---

## 6. Bảng 06 Ca Kiểm Tra Thực Tế (Yêu cầu Bảng A)

*(Có thể kiểm tra thủ công hoặc bấm chạy trực tiếp trong tab **"🧪 6 Ca Kiểm Thử (Bảng A)"** ngay trên giao diện)*

| Mã Ca | Phân loại | Đầu vào / Thao tác | Kết quả mong đợi | Kết quả thực tế |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | **Bình thường #1** | Hỏi câu trong FAQ: *"Giá gói lắp đặt nhà thông minh cơ bản là bao nhiêu?"* | AI diễn đạt tự nhiên báo giá 4.900.000đ + hiển thị đúng 03 câu hỏi gợi ý. | **ĐẠT (PASS):** Trả lời tự nhiên đúng dữ liệu mẫu, hiện đúng 03 câu hỏi liên quan bên dưới. |
| **TC-02** | **Bình thường #2** | Đặt lịch hợp lệ: Tên *"Phạm Nga Thế"*, SĐT *"0912345678"*, ngày hiện tại, giờ *"15:00"*. | Lưu thành công vào `localStorage`, hiển thị trên Trang quản trị và xóa được khi bấm *"Đã xử lý"*. | **ĐẠT (PASS):** Tạo mã `LH-xxxxxx`, lưu vào `localStorage`, hiển thị và xóa thành công ở trang Quản trị. |
| **TC-03** | **Không hợp lệ #1** | Nhập SĐT sai định dạng: `"12345abc"` hoặc chỉ nhập `"09123"` trong Form đặt lịch. | Chặn gửi form, hiển thị lỗi yêu cầu SĐT 10 chữ số chuẩn Việt Nam. | **ĐẠT (PASS):** Hệ thống chặn lưu, hiện thông báo lỗi màu đỏ rõ ràng và đặt con trỏ vào ô SĐT. |
| **TC-04** | **Không hợp lệ #2** | Chọn ngày hẹn trong quá khứ (`01/01/2020`) hoặc để trống tin nhắn chat (`"   "`). | Chặn đặt lịch quá khứ và chặn gửi tin nhắn rỗng. | **ĐẠT (PASS):** Hệ thống báo lỗi *"Không thể đặt lịch hẹn trong quá khứ!"* và không ghi vào `localStorage`. |
| **TC-05** | **Ca biên #1** | Hỏi câu ngoài bộ 10 FAQ: *"Thiết kế hệ thống BMS công nghiệp cho tòa nhà 25 tầng tại Hà Nội..."* | AI không bịa câu trả lời (`can_answer: false`), chủ động mời đặt lịch tư vấn với nhân viên. | **ĐẠT (PASS):** Chatbot đề xuất đặt lịch, hiển thị nút mở Form và tự điền câu hỏi vào mục Ghi chú. |
| **TC-06** | **Ca sự cố #2** | Giả lập mất kết nối Gemini API (Timeout/Network Error) & dữ liệu `localStorage` bị hỏng (`{corrupted_json`). | Ứng dụng không bị treo/trắng trang; tự phục hồi `localStorage` và chuyển sang Engine dự phòng. | **ĐẠT (PASS):** `StorageService` tự reset JSON hỏng về `[]`, `AIService` trả lời qua Fallback Recovery kèm thông báo rõ ràng. |

---

## 7. Giới hạn hiện tại & Hướng phát triển

- **Giới hạn:** Dữ liệu lịch hẹn hiện lưu trữ cục bộ trên trình duyệt (`localStorage`) theo đúng yêu cầu đề bài nên chưa đồng bộ giữa nhiều thiết bị khác nhau; khóa Gemini API được nhập từ phía Client để phục vụ chấm thi không cần Backend.
- **Hướng nâng cấp:** Tích hợp Backend FastAPI / Node.js để ẩn khóa API phía Server, lưu lịch hẹn vào cơ sở dữ liệu đám mây và gửi thông báo tự động qua Zalo OA / Telegram cho nhân viên trực.

---

## 8. Nguồn tham khảo

1. Tài liệu chính thức Google Gemini API (`generateContent` & Structured Outputs JSON): https://ai.google.dev/gemini-api/docs
2. Tài liệu Tailwind CSS v3: https://tailwindcss.com/docs
3. Tài liệu MDN Web Docs – `Window.localStorage`: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage


## Cập nhật v9 — Ảnh đại diện nhóm TENGI
- Thay chữ TG ở đầu trang, tin nhắn trợ lý và trạng thái đang phản hồi bằng ảnh nhóm.
- Thêm favicon cho tab trình duyệt và biểu tượng Apple Touch.
- Giải nén toàn bộ thư mục, giữ nguyên thư mục assets khi chạy hoặc đưa lên hosting. Nếu tab còn biểu tượng cũ, nhấn Ctrl + F5 hoặc mở lại tab.


## Cập nhật v10 — Xác thực API và responsive
- Trạng thái kết nối có thông báo ngay dưới thanh điều khiển, nút bị khóa khi đang kiểm tra.
- Khi đổi khóa, xóa bộ nhớ đệm mô hình cũ. Không lưu khóa kiểm tra thất bại.
- Phân biệt câu trả lời Gemini thật với lời chào theo kịch bản và phản hồi dự phòng khi API lỗi.
- Dùng ảnh TENGI_1.jpg mới nhất cho avatar và các biểu tượng.
- Bố cục theo độ rộng CSS pixel, không theo số inch: điện thoại dưới 768 px ưu tiên chat và chuyển bảng thành thẻ; tablet 768–1100 px dùng hai cột gọn; laptop/PC dùng bố cục rộng tối đa 1760 px.
- Tối ưu ô nhập cho bàn phím điện thoại; biểu mẫu đặt lịch cuộn được trên màn hình thấp.
- Giải nén toàn bộ thư mục, mở bằng Live Server hoặc `python -m http.server 5500`, truy cập http://localhost:5500. Nhấn Ctrl + F5 nếu còn bản giao diện cũ.

### Kiểm tra bản v10
- Kiểm tra cú pháp JavaScript của controller và AI service.
- Tự động kiểm tra với API mô phỏng: khóa trống/sai, tên mô hình trả về, gọi kiểm tra generateContent trước khi báo thành công, xác thực lại sau tải trang, lỗi quyền 403, quota 429, lỗi mạng, danh sách mô hình rỗng, AI không trả lời, trạng thái chờ và ngắt kết nối.
- Kiểm tra cả 3 trang và modal đặt lịch ở các khung 320×740, 360×800, 390×844, 768×1024, 1024×768, 1366×768, 1920×1080, 2560×1440; không có tràn ngang toàn trang.
- Chưa kiểm tra với khóa API thật trong phiên chỉnh sửa này. Chủ sở hữu cần nhập khóa của mình để kiểm tra quyền và hạn mức thực tế.

Tài liệu tham khảo cho xác thực: https://ai.google.dev/api/models và https://ai.google.dev/gemini-api/docs/generate-content/api-errors .

## Cập nhật v11 — Kiểm soát chia sẻ Calendar, Zalo và .ics

### Cách sử dụng
1. Tạo lịch hẹn, rồi chọn Google Calendar, Zalo hoặc tải .ics trên thẻ xác nhận (Calendar và Zalo cũng có trong trang quản lý).
2. Xem nội dung ở cửa sổ chia sẻ. Mặc định chỉ có mã hẹn và thời gian, không có tên, số điện thoại, ghi chú hoặc địa chỉ nhà.
3. Nếu cần, tự chọn **Thêm tên, số điện thoại và ghi chú tư vấn**. Mỗi lần đổi lựa chọn phải xác nhận lại nội dung.
4. Chọn **Tôi đã kiểm tra…**, sau đó tiếp tục.
5. Calendar: kiểm tra tài khoản/lịch đích và tự bấm Lưu tại Google. TENGI không biết chắc bạn đã lưu hay chưa.
6. Zalo: nút **Sao chép nội dung** và **Mở Zalo** riêng biệt. Không tự gửi; tự kiểm tra đúng người nhận rồi dán/gửi. Nếu clipboard bị chặn, chọn nội dung trong ô xem trước và sao chép thủ công.
7. .ics: trình duyệt tải file tạo cục bộ. File là văn bản, không mã hóa; hãy kiểm tra lịch nhập và người nhận khi chuyển tiếp.

### Thay đổi kỹ thuật
- `src/utils/wowHelper.js`: xác thực dữ liệu xuất (kể cả dữ liệu đọc lại từ bộ nhớ), URL chỉ tới đúng host/đường dẫn HTTPS cho phép, chia sẻ tối giản, .ics escape TEXT và gấp dòng tối đa 75 octet mà không cắt ký tự UTF-8.
- `.ics` có UID, DTSTAMP, CLASS:PRIVATE, giờ UTC chuyển từ múi giờ Việt Nam; thời lượng thống nhất 45 phút với Calendar. Không xuất ATTENDEE, ORGANIZER, ATTACH, VALARM hoặc METHOD tự động.
- `src/utils/secureSharing.js`: native dialog có bước xem trước/đồng ý, không dùng HTML để hiển thị dữ liệu, xóa nội dung xem trước khi đóng. Kiểm tra bản ghi chưa bị đổi/xóa ngay trước thao tác.
- `src/app.js`: thay các liên kết chia sẻ trực tiếp bằng nút mở preview; dùng data attribute thay cho chèn mã lịch vào inline JavaScript; sao chép thất bại không báo thành công.
- `src/services/storageService.js`: mã hẹn mới dùng ngẫu nhiên mật mã thay cho 6 chữ số. Mã hẹn không phải mật khẩu hoặc quyền truy cập. Vẫn đọc lịch hẹn cũ hợp lệ.
- Xóa lịch có bước xác nhận, dọn thẻ xác nhận tương ứng khỏi chat; chỉ báo thành công khi ghi bộ nhớ thành công.
- Referrer mặc định no-referrer; tab ngoài có noopener/noreferrer. Chúng không che dữ liệu đã chủ động đưa vào URL đích.
- Sửa việc trang tư vấn còn hiện khi chuyển trang khác ở giao diện điện thoại.

### Giới hạn cần hiểu
- Đây vẫn là ứng dụng frontend/demo, chưa có backend hoặc phân quyền đăng nhập. Người dùng chung trình duyệt có thể xem lịch trong localStorage. Không dùng như hệ thống quản lý khách hàng nhiều người dùng khi chưa có backend và kiểm tra quyền.
- Chọn chia sẻ thông tin cá nhân sẽ đưa dữ liệu đó tới Google, clipboard/tin nhắn Zalo hoặc file tùy thao tác. Đối với Calendar, dữ liệu đó nằm trong URL; mặc định không bật lựa chọn này.
- Số điện thoại đích Zalo nằm trong liên kết zalo.me và hiện trong preview để người dùng kiểm tra; không phải xác minh danh tính.
- CLASS:PRIVATE là chỉ dẫn cho phần mềm lịch, không phải mã hóa hay cam kết ẩn thông tin trên mọi phần mềm.
- Xóa tại TENGI không thu hồi file, clipboard, tin nhắn hoặc sự kiện đã lưu ở dịch vụ khác. Không có tính năng tự gửi, OAuth hay gửi thư mời trong bản này.
- Chưa triển khai tự xóa theo hạn lưu trữ; dùng xóa từng lịch hoặc xóa tất cả sau khi hết nhu cầu. Khóa Gemini tạm thời vẫn ở sessionStorage như bản v10.

### Kiểm tra bản v11
- Kiểm thử trình duyệt với đích Calendar/Zalo mô phỏng: cần đồng ý trước khi mở; không tự sao chép/gửi; clipboard thành công và thất bại; preview reset khi thay lựa chọn và khi đóng.
- Kiểm tra .ics tải xuống, thời gian UTC/thời lượng, tối giản dữ liệu, escaping xuống dòng giả ATTENDEE, độ dài từng dòng và UTF-8 tiếng Việt.
- Kiểm tra chặn dữ liệu xuất lỗi, URL giả mạo, bản ghi bị xóa khi đang xem trước và ID chứa ký tự chèn mã.
- Kiểm tra modal ở 320, 390, 768 và 1366 px. Không thử gửi tin nhắn hoặc lưu lịch vào tài khoản thật.

Tham khảo: https://www.rfc-editor.org/rfc/rfc5545.html ; https://community.owasp.org/vulnerabilities/Information_exposure_through_query_strings_in_url .
