# Tengi SmartHome — Cuộc thi Vibe Coding 2026

Chatbot giải đáp câu hỏi thường gặp và hỗ trợ đặt lịch tư vấn cho doanh nghiệp nhà thông minh.

**Phiên bản tài liệu:** v12 — FAQ & Booking Fix.  
**Mã nguồn đối chiếu:** `DOI_TENGI_De4_VibeCoding2026-v12-FAQ-Booking-Fix.zip`.  
**Ngày kiểm tra:** 08/11/2026.

Tài liệu được trình bày theo 12 mục của mẫu README do đội cung cấp, đồng thời phản ánh đúng chức năng hiện có trong mã nguồn. Những nội dung đánh dấu **Đội bổ sung** chưa có thông tin hoặc chưa có tệp tương ứng trong ZIP; không phải minh chứng đã hoàn thành.

## 1. Thông tin chung

| Hạng mục | Nội dung |
| --- | --- |
| Tên sản phẩm | Tengi SmartHome — Hỗ trợ khách hàng & Đặt lịch hẹn |
| Tên đội thi | ĐỘI_TENGI |
| Bảng thi | Bảng A — Công nghệ |
| Đề bài | Đề số 4 — Chatbot FAQ & đặt lịch tư vấn cho doanh nghiệp nhỏ |
| Phiên bản source | v12 — FAQ & Booking Fix |
| Demo online | https://i1u29-gif.github.io/TENGI_VIBE_CHALLENGE/ — GitHub Pages do đội cung cấp; cần tải source v12 lên để cập nhật bản online |
| Video demo ≤ 02 phút | **Đội bổ sung:** URL video thao tác thực tế |
| Source ZIP | `DOI_TENGI_De4_VibeCoding2026-v12-FAQ-Booking-Fix.zip`; **đội bổ sung URL tải** khi nộp hồ sơ |
| Minh chứng dùng AI | Tóm tắt ở mục 10; **chưa có PDF/ảnh hội thoại minh chứng riêng trong ZIP** |
| Bảng kiểm thử | Mục 11 của tài liệu này và tab **Kiểm thử (6 ca)** trong ứng dụng |

- Bộ tiêu chí được mẫu của đội dẫn chiếu: https://vibecoding.info.vn/tieu-chi-cham-thi . Đội cần kiểm tra thông báo chính thức mới nhất trước khi nộp.
- Theo mẫu README được cung cấp, Bảng A cần ít nhất 06 ca kiểm thử; chỉ dùng Mock bị giới hạn điểm ở nhóm A3. Bản này có tích hợp Gemini API thật và bộ xử lý Local, nhưng **chưa kiểm chứng bằng khóa Gemini thật trong phiên rà soát tài liệu**.
- Không đưa khóa API, mật khẩu, token hoặc thông tin khách hàng thật vào gói nộp và video minh chứng.

## 2. Tính năng chính

1. **Tư vấn FAQ:** nhập câu hỏi hoặc chọn nhanh 10 chủ đề: giờ làm việc, báo giá, bảo hành, thi công, khảo sát, Internet/Wi-Fi, thanh toán, ứng dụng điều khiển, cải tạo nhà và cảnh báo an ninh.
2. **Tích hợp Gemini:** kiểm tra khóa qua danh sách mô hình và yêu cầu sinh phản hồi ngắn; chỉ thông báo kết nối thành công sau khi nhận được câu trả lời kiểm tra. Tên Agent lấy từ thông tin mô hình do API trả về.
3. **Chế độ Local và dự phòng:** khi chưa kết nối API, dùng đối sánh từ khóa FAQ; khi gọi API lỗi, có thể trả lời bằng dữ liệu nội bộ kèm nhãn dự phòng. Câu chào/cảm ơn có thể được xử lý tại Local ngay cả khi đang kết nối API.
4. **Đặt lịch tư vấn:** nhập họ tên, số điện thoại, ngày giờ và ghi chú; kiểm tra đầu vào, thời điểm quá khứ, giờ 08:00–20:00 và trùng số điện thoại/ngày/giờ.
5. **Quản lý lịch hẹn:** xem số lịch đang chờ xử lý, danh sách và chi tiết. Mỗi lịch có menu chọn một thao tác: **Đánh dấu đã xử lý** (giữ bản ghi) hoặc **Xóa lịch hẹn** (xác nhận rồi xóa). Có thể xóa tất cả với bước xác nhận. Mã lịch hẹn mới sử dụng UUID hoặc chuỗi ngẫu nhiên mật mã tương đương.
6. **Chia sẻ có kiểm soát:** xem trước và xác nhận trước khi mở Google Calendar, Zalo hoặc tải `.ics`. Mặc định chỉ xuất mã hẹn và thời gian; thông tin cá nhân chỉ được thêm khi người dùng chủ động chọn.
7. **Trải nghiệm và kiểm thử:** avatar thương hiệu, favicon, nền vùng tin nhắn bằng ảnh `assets/tengi-avatar.jpg` với độ trong suốt 56% (ảnh hiển thị 44%, chữ/nút không bị giảm opacity), âm báo bật/tắt, câu hỏi gợi ý, báo đang phản hồi và ba màn hình responsive cho tư vấn, quản lý và kiểm thử.

**Lưu ý về câu trả lời:** ứng dụng hậu kiểm để hiển thị đủ 03 câu hỏi gợi ý. Việc đủ số lượng không bảo đảm mọi câu đều liên quan hoàn hảo. Trước khi gọi Gemini hoặc trả lời Local, hệ thống kiểm tra phạm vi FAQ; yêu cầu BMS/PLC/SCADA, công nghiệp hoặc thiết kế/báo giá riêng được mời đặt lịch. Bộ phân loại theo quy tắc vẫn có giới hạn với các cách diễn đạt chưa bao phủ.


### Bộ kiến thức 10 câu FAQ

Dữ liệu mẫu do đội xây dựng, dùng chung cho Local và prompt Gemini. Nội dung này không phải báo giá đã xác minh của một doanh nghiệp thực tế.

| Mã | Câu hỏi | Câu trả lời mẫu |
| --- | --- | --- |
| FAQ-01 | Giờ làm việc và địa chỉ showroom của Tengi ở đâu? | Showroom Tengi SmartHome mở cửa từ 08:00 đến 20:00 tất cả các ngày trong tuần (kể cả Thứ 7 và Chủ Nhật) tại địa chỉ: Số 12 Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp, TP.HCM. |
| FAQ-02 | Giá gói lắp đặt nhà thông minh cơ bản là bao nhiêu? | Gói SmartHome Cơ Bản cho căn hộ 1–2 phòng ngủ có giá trọn gói là 4.900.000đ, bao gồm: 01 Bộ điều khiển trung tâm Zigbee, 04 Công tắc cảm ứng thông minh và 02 Cảm biến chuyển động. |
| FAQ-03 | Chính sách bảo hành và đổi trả thiết bị như thế nào? | Toàn bộ thiết bị tại Tengi được bảo hành chính hãng 24 tháng, áp dụng 1 đổi 1 trong 30 ngày đầu nếu phát sinh lỗi phần cứng từ nhà sản xuất và miễn phí hỗ trợ kỹ thuật tại nhà 12 tháng đầu. |
| FAQ-04 | Thời gian thi công lắp đặt mất bao lâu? | Thời gian lắp đặt tiêu chuẩn chỉ từ 2 đến 4 giờ đối với căn hộ chung cư và từ 1 đến 2 ngày đối với nhà phố/biệt thự. Quá trình thi công sạch sẽ, không cần đục phá tường. |
| FAQ-05 | Cửa hàng có hỗ trợ khảo sát tận nơi miễn phí không? | Có! Đội ngũ kỹ thuật viên Tengi hỗ trợ khảo sát hạ tầng điện và mang vali thiết bị mẫu đến demo trực tiếp tại nhà khách hàng hoàn toàn miễn phí trong khu vực TP.HCM. |
| FAQ-06 | Khi mất mạng Internet hoặc Wi-Fi thì thiết bị có hoạt động không? | Hệ thống vẫn hoạt động bình thường! Các công tắc cảm ứng vẫn bật/tắt trực tiếp bằng tay và các kịch bản tự động nội bộ thông qua bộ trung tâm Zigbee vẫn vận hành độc lập không cần Internet. |
| FAQ-07 | Có hỗ trợ trả góp không và chấp nhận hình thức thanh toán nào? | Tengi hỗ trợ trả góp 0% lãi suất kỳ hạn 3–6 tháng qua thẻ tín dụng của 25 ngân hàng nội địa, đồng thời chấp nhận thanh toán tiền mặt, chuyển khoản VietQR và ví điện tử. |
| FAQ-08 | Thiết bị điều khiển qua điện thoại bằng ứng dụng gì? | Khách hàng điều khiển thiết bị qua ứng dụng tiếng Việt trên cả iOS và Android, hỗ trợ ra lệnh giọng nói tiếng Việt và tích hợp mượt mà với Apple HomeKit, Google Home và Alexa. |
| FAQ-09 | Nhà đang ở sẵn có lắp được không hay phải nhà mới xây? | Nhà đang ở lắp đặt rất dễ dàng! Thiết bị được thiết kế chuẩn đế âm tường chữ nhật và đế vuông thông dụng tại Việt Nam, kỹ thuật viên chỉ cần tháo công tắc cơ cũ và lắp công tắc thông minh vào. |
| FAQ-10 | Hệ thống camera và khóa vân tay có cảnh báo chống trộm tự động không? | Có! Khi phát hiện cạy cửa hoặc chuyển động trái phép vào ban đêm, hệ thống tự động bật sáng toàn bộ đèn, kích hoạt còi hú 110dB và gửi thông báo kèm hình ảnh tức thời về điện thoại. |

### Đối chiếu 05 yêu cầu Đề 04 trong ảnh đội cung cấp

| Yêu cầu | Phần thực hiện |
| --- | --- |
| Trả lời 08–10 câu hỏi từ bộ kiến thức có sẵn | 10 FAQ liệt kê ở trên và `src/data/faqData.js` |
| AI diễn đạt tự nhiên và gợi ý 03 câu liên quan | Gemini API khi đã kết nối; Local được gắn nhãn khi chưa dùng API, hậu kiểm đủ 03 gợi ý |
| Không trả lời được thì chủ động đề xuất đặt lịch | `can_answer=false`, nút đặt lịch trong tin nhắn và điền câu hỏi vào ghi chú |
| Form ngày/giờ, tên, SĐT; lưu localStorage | Biểu mẫu có kiểm tra đầu vào và `storageService.js` |
| Quản trị xem lịch, xóa lịch đã xử lý | Trang quản lý, menu xử lý/xóa tách biệt; không cần đăng nhập theo ảnh đề |

Ảnh đề cho phép Mock có chú thích ở vòng loại và không yêu cầu đăng nhập quản trị. Các tiêu chí chấm chi tiết khác vẫn cần đối chiếu thông báo chính thức; tài liệu không suy diễn thêm điều kiện từ ảnh.

## 3. Công nghệ sử dụng

| Lớp | Công nghệ thực tế |
| --- | --- |
| Giao diện | HTML5, CSS và JavaScript thuần; không dùng React/Vue |
| CSS | CSS tiện ích kiểu Tailwind đã biên dịch trong `styles/utilities.css`, kết hợp CSS riêng tại `styles/main.css`; ZIP không có manifest xác định phiên bản Tailwind |
| Biểu tượng | SVG nội bộ tại `src/icons.js`; không phụ thuộc CDN icon |
| Hình ảnh và phông | Avatar JPG, favicon ICO/PNG; có các tệp Inter WOFF2 và giấy phép OFL trong `styles/fonts/`. CSS `body` hiện ưu tiên Arial/Helvetica, không mặc định áp dụng Inter |
| AI | Gemini REST API `v1beta`, gọi bằng Fetch API; có timeout, dò mô hình và nhánh dự phòng |
| Xử lý Local | So khớp từ khóa có chấm điểm; không phải mô hình embedding hay mô hình ngữ nghĩa được huấn luyện riêng |
| Lưu trữ | `localStorage` cho lịch hẹn; `sessionStorage` cho khóa Gemini tạm thời |
| Tích hợp lịch/chia sẻ | Google Calendar template URL, liên kết `zalo.me`, file iCalendar `.ics` tạo bằng Blob |
| API trình duyệt | Web Audio, Clipboard, Web Crypto, native `<dialog>` và ResizeObserver khi trình duyệt hỗ trợ |
| Backend/CSDL | Chưa có backend, serverless proxy hoặc cơ sở dữ liệu dùng chung |
| Triển khai | GitHub Pages: https://i1u29-gif.github.io/TENGI_VIBE_CHALLENGE/ ; chạy local bằng máy chủ tĩnh |

Không cần `npm install` để chạy gói source hiện tại. Các API trình duyệt dùng phiên bản tích hợp trong trình duyệt, không có phiên bản thư viện npm riêng trong ZIP.

## 4. Tích hợp AI

### 4.1. Chế độ hoạt động

- **API thật đã được tích hợp:** Google Gemini, dùng khóa do người chạy nhập trên giao diện. Mô hình được lấy từ danh sách API hỗ trợ `generateContent`; không cố định một tên mô hình cho mọi khóa.
- **Mặc định khi chưa nhập khóa:** **Chế độ Kịch bản (Local)**. Phản hồi xuất phát từ dữ liệu FAQ và đối sánh từ khóa, không được coi là kết quả từ Gemini.
- **Khi API gặp lỗi:** phản hồi dự phòng hiển thị thông báo tương ứng; không gắn nhãn Gemini thật cho nội dung được tạo từ Local.
- **Trạng thái kiểm chứng:** luồng kết nối đã được kiểm tra bằng phản hồi API mô phỏng. Đội cần tự kiểm tra bằng khóa thật và quay lại tên mô hình hiển thị trước khi nộp minh chứng AI thật.

### 4.2. Luồng kết nối và trả lời

1. Người dùng nhập khóa Gemini và bấm **Kết nối** hoặc Enter.
2. Hệ thống làm sạch khóa, lấy danh sách mô hình và gửi yêu cầu kiểm tra ngắn. Yêu cầu này sử dụng hạn mức API.
3. Khi có phản hồi hợp lệ, hiển thị **Đã kết nối được với Agent [tên mô hình] ([mã mô hình])**.
4. Khóa sai, thiếu quyền, quota, timeout và lỗi mạng có thông báo riêng; kiểm tra thất bại không được báo kết nối thành công.
5. Với câu hỏi cần gọi Gemini, hệ thống gửi câu hỏi cùng bộ kiến thức FAQ và hướng dẫn phạm vi; yêu cầu kết quả JSON, sau đó chuẩn hóa dữ liệu trước khi hiển thị.
6. Câu hỏi chuyên sâu hoặc không khớp chủ đề FAQ được chuyển tới nhân viên trước khi gọi Gemini; không thay yêu cầu báo giá BMS bằng giá gói căn hộ.
7. Bấm **Ngắt kết nối** để xóa khóa đã lưu tạm và chuyển về chế độ Local. Tải lại trang sẽ kiểm tra lại khóa còn trong phiên.

JSON đầu ra dự kiến:

```json
{
  "answer": "Nội dung trả lời",
  "can_answer": true,
  "matched_faq_id": "FAQ-02",
  "suggested_questions": ["Câu hỏi 1", "Câu hỏi 2", "Câu hỏi 3"]
}
```

`responseMimeType: "application/json"` yêu cầu định dạng JSON, không đồng nghĩa đã khai báo JSON Schema chặt chẽ. Mã nguồn còn có nhánh xử lý văn bản hoặc JSON bọc Markdown.

### 4.3. Khóa API và đối chiếu yêu cầu bảo mật trong mẫu

**Cách v12 đang thực hiện:** khóa được nhập trên trình duyệt, lưu tạm trong `sessionStorage` và gửi trực tiếp tới Google bằng header `x-goog-api-key`. Không có khóa thật được khai báo trong gói cấu hình mẫu.

**Giới hạn:** khóa vẫn có thể được đọc bởi JavaScript cùng nguồn hoặc bởi người có quyền truy cập phiên trình duyệt. `sessionStorage` không phải kho bí mật phía máy chủ.

Mẫu README yêu cầu dùng biến môi trường và serverless function/proxy để giữ khóa ngoài phía client. **v12 chưa triển khai kiến trúc đó**; không thể khắc phục bằng cách chỉ sửa lời mô tả trong README. Nếu yêu cầu này là điều kiện bắt buộc của bài nộp, đội cần nâng cấp mã nguồn trước khi nộp.

Ví dụ biến môi trường dành cho **bản backend dự kiến**, không phải cấu hình đang hoạt động của v12:

```env
AI_API_KEY=<khoa_duoc_dat_tren_may_chu>
AI_MODEL=<ma_mo_hinh_da_kiem_tra>
```

ZIP v12 **không có `.env.example`**, không tự đọc `.env` và không có proxy/serverless function. `config.example.js` chỉ khai báo đối tượng cấu hình mẫu; controller hiện đọc khóa từ giao diện/sessionStorage, không tự áp dụng các giá trị trong đối tượng mẫu đó.

## 5. Cài đặt và chạy local

### Yêu cầu

- Trình duyệt hiện đại, ưu tiên bản mới của Chrome, Edge, Firefox hoặc Safari; cần hỗ trợ JavaScript và native dialog.
- Giữ đầy đủ cấu trúc thư mục sau khi giải nén.
- Có Internet và khóa Gemini phù hợp nếu muốn dùng AI thật. FAQ Local và tài nguyên tĩnh không cần gọi CDN.

### Chạy bằng Python — khuyến nghị

Mở terminal trong thư mục chứa `index.html`:

```bash
cd DOI_TENGI_De4_VibeCoding2026
python -m http.server 5500
```

Trên máy dùng lệnh Python 3 riêng:

```bash
python3 -m http.server 5500
```

Mở http://localhost:5500 . Hoặc dùng **Open with Live Server** trong VS Code.

Có thể mở trực tiếp `index.html` cho demo tĩnh, nhưng máy chủ local giúp hành vi lưu trữ/quyền trình duyệt nhất quán hơn. Clipboard có thể bị chặn khi mở file hoặc truy cập HTTP qua IP mạng LAN; khi đó dùng sao chép thủ công trong cửa sổ xem trước. Khi đưa lên hosting, dùng HTTPS.

### Kiểm tra nhanh

1. Kiểm tra avatar và ba tab hiển thị.
2. Khi chưa nhập khóa, kiểm tra nhãn **Chế độ Kịch bản (Local)**.
3. Hỏi một câu FAQ và kiểm tra 03 gợi ý.
4. Đặt lịch ở ngày/giờ tương lai trong khung 08:00–20:00.
5. Mở trang quản lý, kiểm tra bản ghi, thử cửa sổ chia sẻ và xóa dữ liệu mẫu sau khi kiểm tra.
6. Nếu kiểm tra Gemini thật, nhập khóa của người kiểm tra; không quay rõ khóa hoặc kèm khóa trong ZIP.

Nếu trình duyệt còn dùng tài nguyên cũ, nhấn **Ctrl + F5**. Thiết lập múi giờ thiết bị là Việt Nam khi demo; xuất Calendar/.ics hiện chuyển thời gian đã chọn theo múi giờ Việt Nam.

## 6. Cấu trúc thư mục

```text
DOI_TENGI_De4_VibeCoding2026/
├── README.md
├── index.html
├── config.example.js
├── assets/
│   ├── tengi-avatar.jpg
│   ├── apple-touch-icon.png
│   ├── favicon-48.png
│   └── favicon.ico
├── styles/
│   ├── main.css
│   ├── utilities.css
│   └── fonts/
│       ├── INTER-LICENSE.txt
│       ├── inter-latin-wght-normal.woff2
│       ├── inter-latin-ext-wght-normal.woff2
│       └── inter-vietnamese-wght-normal.woff2
├── tests/
│   └── regression.test.cjs
└── src/
    ├── app.js
    ├── icons.js
    ├── data/
    │   └── faqData.js
    ├── services/
    │   ├── aiService.js
    │   └── storageService.js
    └── utils/
        ├── validator.js
        ├── wowHelper.js
        └── secureSharing.js
```

| Tệp | Vai trò |
| --- | --- |
| `index.html` | Ba màn hình, biểu mẫu đặt lịch và dialog xem trước chia sẻ |
| `src/app.js` | Điều phối giao diện, chat, lịch hẹn; TC-02 và TC-05 cập nhật kết quả sau khi kiểm tra thực tế |
| `src/data/faqData.js` | 10 câu FAQ, từ khóa và quan hệ câu hỏi gợi ý |
| `src/services/aiService.js` | Xác thực kết nối, dò mô hình, tạo prompt, gọi Gemini, chuẩn hóa phản hồi và Local fallback |
| `src/services/storageService.js` | Lưu/đọc/xóa lịch, tạo mã hẹn và xử lý JSON lưu trữ hỏng |
| `src/utils/validator.js` | Kiểm tra chat/form, escape HTML và chuẩn hóa đầu ra AI |
| `src/utils/wowHelper.js` | Âm báo, ngày giờ gợi ý, dữ liệu xuất tối giản, URL cho phép và tạo `.ics` |
| `src/utils/secureSharing.js` | Xem trước, lựa chọn thông tin cá nhân, đồng ý chia sẻ, clipboard và mở ứng dụng đích |
| `tests/regression.test.cjs` | Kiểm tra hồi quy bằng Node.js, không cần cài thư viện bên ngoài |
| `styles/main.css` | Giao diện responsive và kiểu cửa sổ chia sẻ |
| `assets/tengi-avatar.jpg` | Avatar dùng chung trên đầu trang và tin nhắn; thay ảnh cùng tên để đổi avatar |

Không có `package.json`, backend, `.env.example`, PDF minh chứng hoặc video demo trong ZIP v12 đã đối chiếu.

## 7. Truy cập và phân quyền

- Không yêu cầu đăng nhập; người mở trang chuyển trực tiếp giữa **Tư vấn khách hàng**, **Quản lý lịch hẹn** và **Kiểm thử (6 ca)**.
- Trang quản lý không phải khu vực đã được xác thực hoặc phân quyền. Người dùng chung trình duyệt/profile có thể xem lịch đang lưu.
- Dữ liệu mỗi trình duyệt/profile được lưu cục bộ, chưa đồng bộ giữa các máy. Không dùng bản này để quản trị khách hàng thật nhiều người dùng nếu chưa bổ sung backend, đăng nhập và kiểm tra quyền.
- UUID của lịch hẹn giúp giảm khả năng trùng/đoán mã; **không phải mật khẩu, token hay cơ chế kiểm soát truy cập**.

### Quyền và dữ liệu khi chia sẻ

| Thao tác | Hành vi trong v12 | Người dùng cần làm |
| --- | --- | --- |
| Google Calendar | Mở trang tạo sự kiện điền sẵn sau bước xác nhận; không dùng OAuth và không đọc lịch cá nhân | Chọn đúng tài khoản/lịch, xem lại và bấm Lưu tại Google |
| Zalo | Mở liên kết theo số điện thoại; sao chép nội dung bằng nút riêng; không tự gửi | Kiểm tra đúng tài khoản nhận, tự dán và gửi |
| `.ics` | Tạo file văn bản cục bộ với dữ liệu đã chọn; không tự gửi lời mời | Tải/nhập vào lịch và kiểm tra trước khi chuyển tiếp |

Mặc định chỉ xuất mã hẹn và thời gian. Khi chọn thêm thông tin cá nhân, dữ liệu đó sẽ có trong URL Calendar, nội dung sao chép hoặc file tùy thao tác. `CLASS:PRIVATE` trong `.ics` là chỉ dẫn cho phần mềm lịch, **không mã hóa file**. Xóa trên TENGI không thu hồi bản sao đã chia sẻ.

## 8. Giới hạn hiện tại

1. Dữ liệu ở `localStorage` theo trình duyệt/profile; chưa có đồng bộ, sao lưu hoặc tự xóa theo thời hạn. Người dùng chung profile có thể mở quản lý. Không có đăng nhập theo phạm vi đề trong ảnh; nếu dùng dữ liệu khách hàng thật nhiều người dùng, cần thêm backend và kiểm tra quyền.
2. Khóa Gemini vẫn nhập tại client và lưu tạm trong `sessionStorage`; chưa có proxy/backend giữ khóa. Nếu mẫu bảo mật khóa API là điều kiện bắt buộc khi nộp, đội cần nâng cấp kiến trúc, không chỉ sửa README.
3. Chưa kiểm chứng bằng khóa Gemini thật trong phiên sửa này. Luồng lỗi API được kiểm tra bằng phản hồi mô phỏng; các ca ngoài FAQ được kiểm tra cả khi có/không có chuỗi khóa thử và không gọi mạng.
4. Bộ phân loại FAQ theo quy tắc và prompt vẫn có thể chưa bao phủ hết cách diễn đạt. Đã sửa lỗi BMS mẫu và kiểm tra các biến thể đã liệt kê; không cam kết loại bỏ mọi trường hợp hiểu nhầm.
5. TC-02 tạo dữ liệu mẫu thật vào danh sách: tự chọn giờ ít nhất khoảng 30 phút sau hiện tại trong khung 08:00–20:00, bỏ qua khung trùng cùng SĐT. Có thể thất bại khi bộ nhớ bị chặn/đầy; khi đó hiển thị CHƯA ĐẠT và không tạo thẻ xác nhận thành công.
6. TC-02 và TC-05 có kết quả cập nhật động; các dòng TC-01/03/04/06 trên giao diện vẫn có mô tả kết quả điền sẵn. Cần quan sát hành vi thực tế, không coi chữ ĐẠT điền sẵn là assertion tự động.
7. TC-06 ghi đè vùng dữ liệu lịch bằng JSON hỏng rồi phục hồi về mảng rỗng; lịch cũ trong vùng lưu đó bị mất. Chỉ chạy trên dữ liệu mẫu.
8. Đánh dấu **Đã xử lý** giữ lại bản ghi và loại khỏi số lịch đang chờ. Chọn **Xóa lịch hẹn** là thao tác khác, có xác nhận và không tự đánh dấu xử lý trước. Lịch đã xử lý vẫn có thể được xóa sau bằng lần chọn mới.
9. Không xác minh danh tính Zalo, không biết chắc Google đã lưu lịch, không thu hồi bản sao đã xuất. `.ics` là văn bản; `CLASS:PRIVATE` không mã hóa. Chọn thêm dữ liệu cá nhân làm dữ liệu đó có trong đích chia sẻ tương ứng.
10. Ngày/giờ biểu mẫu dựa trên giờ máy; Calendar/.ics xuất theo giờ Việt Nam. Nên đặt thiết bị demo ở múi giờ Việt Nam. Số liệu, hotline và địa chỉ FAQ là dữ liệu mẫu cần đội xác nhận trước khi công bố thực tế.

## 9. Nguồn tham khảo

- Google Gemini API: https://ai.google.dev/gemini-api/docs .
- Danh sách mô hình và metadata: https://ai.google.dev/api/models .
- Lỗi Gemini Generate Content API: https://ai.google.dev/gemini-api/docs/generate-content/api-errors .
- iCalendar RFC 5545: https://www.rfc-editor.org/rfc/rfc5545.html .
- OWASP — Thông tin nhạy cảm trong query string: https://community.owasp.org/vulnerabilities/Information_exposure_through_query_strings_in_url .
- MDN — Web Storage: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API .
- Giấy phép phông Inter đi kèm: `styles/fonts/INTER-LICENSE.txt`.
- Ảnh Đề 04 “Chatbot FAQ & đặt lịch tư vấn”, mẫu `README (1).md` và mã nguồn v12 do đội cung cấp là căn cứ trực tiếp của tài liệu này. Tên đề, bảng thi và các yêu cầu nộp phải được đội đối chiếu lại với thông báo chính thức.

## 10. Minh chứng dùng AI để xây dựng sản phẩm

Sản phẩm được hoàn thiện với hỗ trợ AI trong chỉnh mã, giải thích và kiểm tra. Các vòng hỗ trợ đã thể hiện trong quá trình làm việc gồm:

| Vòng | Yêu cầu/đầu vào của đội | Thay đổi hoặc kết quả |
| --- | --- | --- |
| 1 | Thay avatar chữ TG bằng hình đại diện nhóm và thêm biểu tượng tab | Dùng ảnh chung cho đầu trang, tin nhắn, trạng thái đang phản hồi và favicon |
| 2 | Báo khóa API sai, kết nối đúng tên Agent, responsive | Thêm kiểm tra kết nối thực tế, đọc tên mô hình và chỉnh ba màn hình theo độ rộng |
| 3 | Giải thích việc mở Calendar và quyền truy cập tài khoản | Xác định cơ chế template URL, phân biệt mở trang tạo sự kiện với quyền OAuth |
| 4 | Giảm rủi ro tại Calendar, Zalo và `.ics` | Thêm preview/đồng ý, tối giản dữ liệu, tách sao chép Zalo, escape/gấp dòng `.ics` và kiểm tra liên kết |
| 5 | Viết README theo mẫu từ source v12 | Rà soát cấu trúc thật; phát hiện và sửa lỗi TC-02/TC-05, tách xử lý/xóa; cập nhật kết quả và ghi rõ phần chưa có video/PDF |

Bảng này là **tóm tắt quá trình**, không phải bản chụp hoặc bản trích nguyên văn hội thoại. ZIP hiện chưa có `Minh_Chung_AI_DOI_TENGI.pdf`.

**Đội bổ sung trước khi nộp:** chọn ảnh/trích đoạn hội thoại thật thể hiện yêu cầu, kết quả, lỗi phát hiện và cách kiểm tra. Nếu mẫu nộp yêu cầu PDF 01 trang A4 gồm 05 đoạn chọn lọc, tạo và đính kèm tệp đó; che khóa API và dữ liệu cá nhân trước khi xuất.

## 11. Bảng kiểm thử

### 11.1. Điều kiện kiểm tra

Kiểm tra source v12 ngày 08/11/2026 bằng Chromium tự động hóa và kiểm tra hàm bằng Node.js. Chưa dùng khóa Gemini thật và chưa gửi tin nhắn Zalo hoặc lưu vào Google Calendar thật. Các phản hồi API dùng cho kiểm tra trạng thái là mô phỏng, không được dùng làm minh chứng AI thật.

TC-02 và TC-05 ban đầu hiện **Chưa chạy**. Bấm Chạy thử sẽ kiểm tra và ghi kết quả vào cột tương ứng; lỗi lưu trữ/đầu ra không đạt sẽ hiện **CHƯA ĐẠT**. TC-02 tạo một lịch mới mỗi lần thử, chọn khung giờ kế tiếp khi trùng SĐT/ngày/giờ.

### 11.2. Sáu ca chính — Bảng A

| Mã | Nhóm | Đầu vào / bước thử | Kỳ vọng | Kết quả kiểm tra v12 | Đánh giá |
| --- | --- | --- | --- | --- | --- |
| TC-01 | Bình thường 1 | Hỏi giá gói nhà thông minh cơ bản | Đúng giá FAQ, 03 gợi ý | Local trả 4.900.000đ; 03 nút gợi ý | Đạt ở Local; chưa thử Gemini thật |
| TC-02 | Bình thường 2 | Chạy ca 2; tên Phạm Nga Thế, SĐT 0912345678, khung giờ tương lai tự chọn | Lưu được rồi mới thông báo; có thẻ xác nhận và danh sách quản lý | Qua kiểm tra 15:30, sau giờ đóng cửa, sáng sớm và cuối năm; chạy 03 lần liên tiếp tạo 03 khung không trùng. Bộ nhớ bị chặn thì CHƯA ĐẠT, không thêm thẻ thành công | Đạt trong các trường hợp đã thử |
| TC-03 | Không hợp lệ 1 | SĐT `12345abc` | Không lưu, báo lỗi | Hiện lỗi số điện thoại | Đạt |
| TC-04 | Không hợp lệ 2 | Ngày `2020-01-01` | Không lưu lịch quá khứ | Hiện cảnh báo quá khứ | Đạt |
| TC-05 | Ca biên 1 | Báo giá thiết kế riêng BMS công nghiệp cho tòa nhà 25 tầng | Không lấy giá gói căn hộ thay báo giá riêng; mời đặt lịch và đủ 03 gợi ý | `can_answer=false`, không có giá 4.900.000đ; nút đặt lịch mở form và điền sẵn câu BMS. Chặn trước API ở cả hai trạng thái có/không có chuỗi khóa thử | Đạt cho câu mẫu và các biến thể đã thử; không gọi Gemini thật ở ca này |
| TC-06 | Ca sự cố 2 | JSON lịch bị hỏng và giả lập lỗi AI | Không treo, chuyển dự phòng | Đọc lại danh sách rỗng; có nhãn Fallback | Đạt; dữ liệu cũ bị xóa trong phép thử này |

### 11.3. Kiểm tra hồi quy và thao tác quản lý

- 10 câu FAQ nguyên bản và 04 cách hỏi lại vẫn được trả lời ở Local với đủ 03 gợi ý.
- 07 đầu vào ngoài phạm vi gồm BMS, PLC/SCADA, nhà máy, khách sạn, thiết kế riêng camera nhà xưởng, toán học và giá vàng được kiểm tra ở cả trạng thái có/không có chuỗi khóa thử. Không gọi mạng cho các yêu cầu này.
- **Đánh dấu đã xử lý:** giữ bản ghi, hiện trạng thái, số lịch đang chờ giảm và trạng thái còn sau tải lại trang.
- **Xóa lịch hẹn:** hủy xác nhận thì giữ nguyên; xác nhận thì chỉ xóa bản ghi đã chọn. Mỗi lần chọn menu chỉ thực hiện một thao tác.
- Bộ nhớ lỗi khi đánh dấu xử lý: không đổi trạng thái và hiển thị lỗi.
- Giữ cơ chế preview/đồng ý Calendar, Zalo, `.ics`; kiểm tra chia sẻ và các khung responsive khi thay mã. Không thử hành động trên tài khoản thật.

### 11.4. Tự chạy kiểm tra hàm

Có thể chạy bằng Node.js hiện đại, không cần `npm install`, tại thư mục gốc source:

```bash
node --test tests/regression.test.cjs
```

Bộ test đi kèm kiểm tra phân loại ngoài FAQ, 10 FAQ chuẩn, chọn giờ tương lai/tránh trùng/qua ngày và trạng thái xử lý/xóa. Test hàm không thay thế kiểm tra trình duyệt, API thật hoặc minh chứng video. Script Chromium dùng trong phiên kiểm tra không nằm trong gói source.

## 12. Hồ sơ bàn giao

| Thành phần | Tình trạng |
| --- | --- |
| Source HTML/CSS/JS, avatar, favicon và phông nội bộ | Có trong ZIP v12 |
| `README.md` theo 12 mục | Tài liệu này; đặt vào thư mục gốc chứa `index.html`, thay README cũ khi đóng gói |
| Cấu hình mẫu | Có `config.example.js`; chưa có `.env.example` hoặc backend đọc biến môi trường |
| Bảng 06 ca kiểm thử | Có trên giao diện, mục 11 và test hàm trong `tests/`; TC-02 và TC-05 đã sửa và kiểm tra lại |
| Demo online | Đã có URL GitHub Pages ở mục 1; đội cần tải bản v12 lên và kiểm tra lại |
| Video ≤ 02 phút | Đội bổ sung URL/tệp; thể hiện ít nhất 05 chức năng theo mẫu |
| Minh chứng dùng AI | Đội bổ sung PDF/ảnh hội thoại thật; chưa có tệp riêng trong ZIP |
| Minh chứng gọi AI thật | Đội bổ sung lần chạy với khóa thật và tên mô hình; che khóa trong ảnh/video |
| Kiến trúc bảo vệ khóa theo mẫu | Chưa có proxy/backend; cần xử lý nếu là yêu cầu bắt buộc khi nộp |

### Thao tác hoàn thiện trước khi nộp

1. Chạy lại TC-02, TC-05 và menu xử lý/xóa trên thiết bị demo. Chỉ dùng dữ liệu mẫu khi chạy TC-06.
2. Đối chiếu yêu cầu bảo mật khóa API với quy định chính thức; triển khai proxy/serverless nếu bắt buộc. Không ghi là đã có `.env`/backend khi chưa thực hiện.
3. Kiểm tra API thật, quay video ngắn với dữ liệu mẫu và che mọi khóa/token.
4. Bổ sung minh chứng AI, URL demo, URL source và video vào mục 1; cập nhật kết quả kiểm thử sau khi thay đổi mã nguồn.
5. Gói v12 đã kèm README này. Giải nén, tải các tệp trong thư mục gốc lên repository GitHub Pages hiện tại; giữ nguyên `assets/`, `src/`, `styles/`. Đặt `index.html` tại vị trí GitHub Pages đang phục vụ. Không kèm khóa, mật khẩu hoặc dữ liệu khách hàng thật.
6. Nộp đúng thời hạn theo thông báo chính thức và tuân thủ quy định về thay đổi bài sau hạn nộp.

README này mô tả trung thực source v12 đã đối chiếu; việc bổ sung tài liệu không tự sửa các giới hạn chức năng hoặc bảo mật của mã nguồn.

**Trạng thái cập nhật website:** việc tạo ZIP này chưa thay đổi repository hoặc bản GitHub Pages đang chạy. Đội cần tự đưa source v12 lên repository để áp dụng thay đổi online.
