# Tengi SmartHome — Cuộc thi Vibe Coding 2026

Chatbot giải đáp câu hỏi thường gặp và hỗ trợ đặt lịch tư vấn cho doanh nghiệp nhà thông minh.

**Phiên bản tài liệu:** v12 — FAQ & Booking Fix.  
**Gói mã nguồn:** `DOI_TENGI_De4_VibeCoding2026.zip` (mã nguồn v12).  
**Ngày kiểm tra:** 08/11/2026.

Tài liệu gồm thông tin sản phẩm, bộ kiến thức FAQ, hướng dẫn chạy, cơ chế AI, kiểm thử và liên kết hồ sơ dự thi.

## 1. Thông tin chung

| Hạng mục | Nội dung |
| --- | --- |
| Tên sản phẩm | Tengi SmartHome — Hỗ trợ khách hàng & Đặt lịch hẹn |
| Tên đội thi | ĐỘI_TENGI |
| Bảng thi | Bảng A — Công nghệ |
| Đề bài | Đề 04 — Chatbot FAQ & đặt lịch tư vấn |
| Phiên bản mã nguồn | v12 — FAQ & Booking Fix |
| AI trong sản phẩm | **AI thật có Mock dự phòng**: Gemini API kết hợp bộ xử lý FAQ Local |
| Demo online | [Trải nghiệm Tengi SmartHome](https://i1u29-gif.github.io/TENGI_VIBE_CHALLENGE/) |
| Repository | [i1u29-gif/TENGI_VIBE_CHALLENGE](https://github.com/i1u29-gif/TENGI_VIBE_CHALLENGE) |
| Video demo/minh chứng | [Xem video trên YouTube](https://youtu.be/6y65p4fzllg) |
| Source ZIP | [Mở thư mục Drive để tải DOI_TENGI_De4_VibeCoding2026.zip](https://drive.google.com/drive/folders/1z9cXWIzwcMSHdbTJykwhTH-cEjE8lYb1?usp=sharing) |
| README và hồ sơ minh chứng | [Bộ hồ sơ trên Google Drive](https://drive.google.com/drive/folders/1z9cXWIzwcMSHdbTJykwhTH-cEjE8lYb1?usp=sharing) — nơi lưu ZIP, README và minh chứng theo thông tin đội cung cấp |
| Bảng kiểm thử online | [11.2. Sáu ca chính — Bảng A trên GitHub](https://github.com/i1u29-gif/TENGI_VIBE_CHALLENGE/blob/main/README.md#112-sáu-ca-chính--bảng-a) |
| Bảng kiểm thử trong ứng dụng | Tab **Kiểm thử (6 ca)**; có bản mô tả tại mục 11 của README này |

Đường dẫn Drive trỏ tới **thư mục hồ sơ**, không phải liên kết tải trực tiếp một tệp. Tệp mã nguồn dùng để đối chiếu tài liệu là ZIP đính kèm; các minh chứng bổ sung được đội cung cấp qua thư mục hồ sơ và video trên YouTube.

Không kèm khóa API, mật khẩu hoặc token trong gói source. Dữ liệu doanh nghiệp và lịch hẹn dùng trong demo là dữ liệu mẫu.

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
| Xử lý Local | Phân loại chủ đề bằng quy tắc/từ khóa và đối sánh câu FAQ; không phải mô hình embedding hoặc mô hình tự huấn luyện |
| Lưu trữ | `localStorage` cho lịch hẹn; `sessionStorage` cho khóa Gemini tạm thời |
| Tích hợp lịch/chia sẻ | Google Calendar template URL, liên kết `zalo.me`, file iCalendar `.ics` tạo bằng Blob |
| API trình duyệt | Web Audio, Clipboard, Web Crypto, native `<dialog>` và ResizeObserver khi trình duyệt hỗ trợ |
| Backend/CSDL | Chưa có backend, serverless proxy hoặc cơ sở dữ liệu dùng chung |
| Triển khai | [GitHub Pages](https://i1u29-gif.github.io/TENGI_VIBE_CHALLENGE/); có thể chạy local bằng máy chủ tĩnh |

Không cần `npm install` để chạy gói source hiện tại. Các API trình duyệt dùng phiên bản tích hợp trong trình duyệt, không có phiên bản thư viện npm riêng trong ZIP.

## 4. Tích hợp AI

### 4.1. Chế độ hoạt động

**Phân loại sản phẩm: AI thật có Mock dự phòng.** Mock/Local ở đây là dữ liệu FAQ và xử lý theo quy tắc; không phải một mô hình AI được đội huấn luyện riêng.

- **API thật đã được tích hợp:** Google Gemini, dùng khóa do người chạy nhập trên giao diện. Mô hình được lấy từ danh sách API hỗ trợ `generateContent`; không cố định một tên mô hình cho mọi khóa.
- **Mặc định khi chưa nhập khóa:** **Chế độ Kịch bản (Local)**. Phản hồi xuất phát từ dữ liệu FAQ và đối sánh từ khóa, không được coi là kết quả từ Gemini.
- **Khi API gặp lỗi:** phản hồi dự phòng hiển thị thông báo tương ứng; không gắn nhãn Gemini thật cho nội dung được tạo từ Local.
- **Minh chứng sản phẩm:** [video do đội cung cấp](https://youtu.be/6y65p4fzllg). Trong phiên rà soát README, các test tự động không sử dụng khóa Gemini thật; kết quả kiểm thử kỹ thuật được phân biệt với minh chứng vận hành tại mục 11.

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

### 4.3. Bảo mật khóa API

- Khóa do người chạy nhập vào ô Gemini API trên giao diện, lưu tạm trong `sessionStorage` và gửi trực tiếp tới Google bằng header `x-goog-api-key`.
- Không ghi khóa thật vào source, README, `config.example.js`, video hoặc repository công khai. Bấm **Ngắt kết nối** để xóa khóa phiên đã lưu.
- Đây là ứng dụng frontend chạy trên GitHub Pages, chưa có backend/proxy giữ khóa. Khóa nhập phía trình duyệt không được bảo vệ như bí mật phía máy chủ; người có quyền truy cập phiên hoặc JavaScript cùng nguồn có thể đọc được khóa.
- `config.example.js` là cấu hình mẫu. Source hiện không đọc `.env`, không có `.env.example` và không tự áp dụng đối tượng cấu hình mẫu vào luồng kết nối.
- Nếu nâng cấp để sử dụng thực tế, có thể chuyển việc gọi AI sang backend/serverless, giữ khóa trong biến môi trường phía máy chủ và bổ sung kiểm soát truy cập/hạn mức. Đây là hướng nâng cấp, không phải chức năng đã có trong gói này.

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

ZIP mã nguồn đính kèm chứa cấu trúc nêu trên; không có `package.json`, backend hoặc `.env.example`. Minh chứng bổ sung được cung cấp tại [thư mục hồ sơ Drive](https://drive.google.com/drive/folders/1z9cXWIzwcMSHdbTJykwhTH-cEjE8lYb1?usp=sharing) và [video YouTube](https://youtu.be/6y65p4fzllg); không giả định các tệp đó nằm trong cây source nếu chưa được đóng gói cùng.

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
2. Khóa Gemini nhập tại client và lưu tạm trong `sessionStorage`; chưa có proxy/backend giữ khóa. Không mô tả phiên bản hiện tại là đã giấu khóa ở máy chủ.
3. Kết quả test tự động trong tài liệu không thay thế kết quả gọi Gemini thật bằng khóa của đội. Các test kiểm tra lỗi API dùng phản hồi mô phỏng; ca ngoài FAQ bị chặn trước khi gọi mạng. Video minh chứng được liên kết riêng tại mục 1 và mục 10.
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
- Đề 04 “Chatbot FAQ & đặt lịch tư vấn” và mẫu README do đội cung cấp.
- Repository sản phẩm: [https://github.com/i1u29-gif/TENGI_VIBE_CHALLENGE](https://github.com/i1u29-gif/TENGI_VIBE_CHALLENGE).

## 10. Minh chứng dùng AI để xây dựng sản phẩm

- **Video demo/minh chứng:** [YouTube — Tengi SmartHome](https://youtu.be/6y65p4fzllg).
- **Tệp minh chứng và bộ hồ sơ:** [Google Drive](https://drive.google.com/drive/folders/1z9cXWIzwcMSHdbTJykwhTH-cEjE8lYb1?usp=sharing). Theo thông tin đội cung cấp, thư mục chứa ZIP mã nguồn, README và minh chứng liên quan.
- **Mã nguồn và lịch sử thay đổi công khai:** [GitHub repository](https://github.com/i1u29-gif/TENGI_VIBE_CHALLENGE).

Các vòng ứng dụng AI trong quá trình xây dựng sản phẩm:

| Vòng | Công việc | Kết quả trong source |
| --- | --- | --- |
| 1 | Xây dựng và điều chỉnh nhận diện thương hiệu | Avatar TENGI ở đầu trang/tin nhắn, favicon và nền khung chat trong suốt 56% |
| 2 | Hoàn thiện kết nối AI và giao diện | Xác thực khóa, dò mô hình, thông báo tên Agent, trạng thái lỗi và responsive |
| 3 | Thiết kế luồng FAQ/đặt lịch | Bộ kiến thức 10 câu, 03 gợi ý, xử lý ngoài phạm vi và điền sẵn câu hỏi vào form |
| 4 | Hạn chế dữ liệu chia sẻ ra ngoài | Preview/đồng ý, thông tin tối giản, tách sao chép Zalo và xử lý `.ics` đúng cấu trúc |
| 5 | Kiểm tra và sửa lỗi | Sửa TC-02/TC-05, tách đánh dấu xử lý với xóa, thêm test hồi quy và cập nhật README |

Bảng trên tóm tắt vai trò AI trong phát triển. Video và tệp minh chứng là các nguồn do đội cung cấp; phiên rà soát tài liệu không xác nhận nội dung, thời lượng video hoặc tên từng tệp trong thư mục Drive. Không suy diễn một tên mô hình cụ thể hoặc kết quả gọi API thật chỉ từ sự tồn tại của liên kết video.

## 11. Bảng kiểm thử

**Bản online tham chiếu:** [11.2. Sáu ca chính — Bảng A trên GitHub](https://github.com/i1u29-gif/TENGI_VIBE_CHALLENGE/blob/main/README.md#112-sáu-ca-chính--bảng-a). Bảng dưới đây giữ cùng sáu kịch bản và được đối chiếu với README trên nhánh `main`.

### 11.1. Điều kiện kiểm tra

Mã nguồn v12 đã có các kết quả kiểm tra Chromium/Local được ghi nhận trong quá trình hoàn thiện. Trong phiên rà soát README ngày 08/11/2026, chạy lại `node --test tests/regression.test.cjs`: **04 nhóm test đạt, 0 thất bại**. Phiên này không gọi Gemini bằng khóa thật, không gửi Zalo và không lưu sự kiện vào tài khoản Google. Các phản hồi API mô phỏng chỉ phục vụ kiểm tra luồng lỗi, không phải minh chứng AI thật.

TC-02 và TC-05 ban đầu hiện **Chưa chạy**. Bấm Chạy thử sẽ kiểm tra và ghi kết quả vào cột tương ứng; lỗi lưu trữ/đầu ra không đạt sẽ hiện **CHƯA ĐẠT**. TC-02 tạo một lịch mới mỗi lần thử, chọn khung giờ kế tiếp khi trùng SĐT/ngày/giờ.

### 11.2. Sáu ca chính — Bảng A

| Mã | Nhóm | Đầu vào / bước thử | Kỳ vọng | Kết quả kiểm tra v12 | Đánh giá |
| --- | --- | --- | --- | --- | --- |
| TC-01 | Bình thường 1 | Hỏi giá gói nhà thông minh cơ bản | Đúng giá FAQ, 03 gợi ý | Local trả 4.900.000đ và 03 nút gợi ý; Gemini thật trả lời gần giống Local theo kết quả đội đã kiểm tra | Đạt ở Local và Gemini thật |
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

| Thành phần | Vị trí truy cập |
| --- | --- |
| Website demo | [Tengi SmartHome trên GitHub Pages](https://i1u29-gif.github.io/TENGI_VIBE_CHALLENGE/) |
| Source ZIP | [Thư mục tải source](https://drive.google.com/drive/folders/1z9cXWIzwcMSHdbTJykwhTH-cEjE8lYb1?usp=sharing) — chọn `DOI_TENGI_De4_VibeCoding2026.zip` |
| README và tệp minh chứng | [Bộ hồ sơ Google Drive](https://drive.google.com/drive/folders/1z9cXWIzwcMSHdbTJykwhTH-cEjE8lYb1?usp=sharing) |
| Video demo/minh chứng | [Xem trên YouTube](https://youtu.be/6y65p4fzllg) |
| Repository mã nguồn | [TENGI_VIBE_CHALLENGE](https://github.com/i1u29-gif/TENGI_VIBE_CHALLENGE) |
| Bảng 06 ca kiểm thử | [Mục 11.2 trên GitHub](https://github.com/i1u29-gif/TENGI_VIBE_CHALLENGE/blob/main/README.md#112-sáu-ca-chính--bảng-a); có tại mục 11.2 của tài liệu này và trên giao diện ứng dụng |
| Kiểm tra hàm đi kèm | `tests/regression.test.cjs` trong source |
| Cấu hình mẫu | `config.example.js`, không chứa khóa API thật |

### Cách sử dụng hồ sơ

1. Xem video minh chứng hoặc mở website demo để xem sản phẩm.
2. Mở thư mục Drive, tải source ZIP và các minh chứng đội đã cung cấp.
3. Giải nén source; đặt `README.md` này tại thư mục gốc cùng `index.html`, thay bản cũ nếu cần.
4. Chạy theo mục 5; xem bảng kiểm thử ở mục 11 hoặc liên kết GitHub tương ứng.
5. Dùng dữ liệu mẫu để thử tính năng; TC-06 chủ động làm hỏng vùng lưu dữ liệu rồi phục hồi về danh sách rỗng.

### Kiểm tra cuối trước khi nộp

- Kiểm tra link Drive, video và GitHub bằng cửa sổ chưa đăng nhập để người chấm có thể truy cập.
- Nếu quy định yêu cầu video tối đa 02 phút, kiểm tra lại thời lượng video đã đăng; liên kết trong README không tự xác nhận điều kiện thời lượng.
- Đồng bộ README mới vào repository và gói ZIP trên Drive để các bản hồ sơ thống nhất. Giữ tiêu đề `11.2. Sáu ca chính — Bảng A` để bảo toàn liên kết đến bảng kiểm thử.
- Không kèm khóa API/token hoặc dữ liệu khách hàng thật. Phân biệt kết quả test Local/mô phỏng với minh chứng chạy API thật.
- Tuân thủ thời hạn và quy định thay đổi bài nộp của Ban tổ chức.

Tài liệu phản ánh mã nguồn trong ZIP đã cung cấp và các liên kết hồ sơ do đội xác nhận. Việc chỉnh README không thay đổi chức năng, quyền truy cập hoặc tự cập nhật nội dung trên GitHub/Drive.
