# Xem ai đã điền — nối thiệp với Google Sheet

Mỗi người điền xong sẽ thành **một dòng** trong bảng tính: thời điểm gửi, tên, có đến hay không, giờ đến.
Làm một lần, mất ~5 phút. Miễn phí, không giới hạn số người.

---

## Bước 1 — Tạo bảng tính

Mở [sheets.new](https://sheets.new), đặt tên gì đó cho dễ nhớ, ví dụ **RSVP tốt nghiệp**.

## Bước 2 — Dán script

1. Trong bảng tính, vào menu **Tiện ích mở rộng → Apps Script** (Extensions → Apps Script).
2. Xoá sạch đoạn `function myFunction() {}` có sẵn.
3. Mở file [apps-script.gs](apps-script.gs) trong dự án này, copy **toàn bộ**, dán vào.
4. Muốn nhận mail báo mỗi lượt điền thì sửa dòng `const NOTIFY_EMAIL = '';` thành email của mình.
5. Bấm biểu tượng **đĩa mềm** (Lưu).

## Bước 3 — Xuất bản (deploy)

1. Góc trên bên phải bấm **Triển khai → Tạo bản triển khai mới** (Deploy → New deployment).
2. Bấm bánh răng cạnh "Chọn loại" → chọn **Ứng dụng web** (Web app).
3. Điền:
   - **Thực thi với tư cách** (Execute as): **Tôi** (Me)
   - **Ai có quyền truy cập** (Who has access): **Bất kỳ ai** (Anyone) ← **quan trọng**, chọn sai thì khách gửi sẽ lỗi
4. Bấm **Triển khai**.
5. Lần đầu Google sẽ hỏi quyền: **Cấp quyền truy cập** → chọn tài khoản → màn hình cảnh báo thì bấm
   **Nâng cao** (Advanced) → **Chuyển tới … (không an toàn)** → **Cho phép** (Allow).
   Cảnh báo này là bình thường, vì script do mình tự viết chứ không phải app đã được Google duyệt.
6. Copy **URL ứng dụng web**, dạng:

   ```
   https://script.google.com/macros/s/AKfycb....../exec
   ```

## Bước 4 — Dán link vào web

Mở [js/main.js](../js/main.js), tìm dòng:

```js
rsvpEndpoint: '',
```

Dán link vào giữa hai dấu nháy:

```js
rsvpEndpoint: 'https://script.google.com/macros/s/AKfycb....../exec',
```

Rồi đẩy lên GitHub, Vercel tự deploy lại:

```bash
git add -A
git commit -m "Noi quiz voi Google Sheet"
git push
```

## Bước 5 — Thử một phát

Vào web, điền tên "Test" rồi gửi. Quay lại bảng tính, thấy dòng mới hiện ra là xong.
Xoá dòng test đi rồi gửi thiệp cho mọi người.

---

## Vài thứ cần biết

- **Xem danh sách khách**: cứ mở bảng tính đó, trên điện thoại dùng app Google Sheets cũng được.
  Muốn đếm nhanh bao nhiêu người đến thì gõ vào một ô trống: `=COUNTIF(C:C;"Có")`
- **Một người điền 2 lần** sẽ ra 2 dòng. Cứ lấy dòng mới nhất của người đó là đúng.
- **Sửa script sau này**: sửa xong phải vào **Triển khai → Quản lý bản triển khai → biểu tượng bút chì →
  Phiên bản: Mới → Triển khai**. Nếu chỉ bấm Lưu thì bản chạy thật vẫn là bản cũ.
- **Link `/exec` bị lộ thì sao?** Người ta chỉ có thể gửi thêm dòng rác vào bảng, không đọc được
  danh sách khách của mình. Không cần giấu kỹ.
- **Khách không có mạng lúc gửi** thì sẽ báo lỗi và phải bấm gửi lại — dữ liệu không nằm lại đâu cả.
