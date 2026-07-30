# Thiệp mời lễ tốt nghiệp — Trần Minh Quang

Trang web thiệp mời, dạng **dọc, tối ưu cho điện thoại**. Static site thuần (HTML/CSS/JS), không cần build.

## Đang có gì

1. **Màn cổng** — tấm lịch "NGÀY GÌ VẬY", vòng tròn xanh vẽ dần quanh dòng chữ, chữ "ẤN VÀO ĐÂY" và các dấu chấm hỏi bay lên.
2. **Thiệp** — ấn vào vòng tròn thì màn cổng mờ đi, hiện tấm "Save the date" ở dạng trang cuộn.
3. **Màn xác nhận tham dự** — ngắm thiệp ~5 giây là **chuyển hẳn sang màn này**, một chiều, không quay lại.
   Gồm lời cảm ơn, "Bạn là ai?", tích **Có / Không**; tích Có mới hiện phần chọn giờ đến (8h–12h, mỗi 5 phút).
4. **Thư cảm ơn + cuộn phim** — gửi xong chuyển sang màn thư. Ai chọn *Có* và ai chọn *Không*
   đọc hai lá thư khác nhau. Bên phải là dải phim ảnh tự trôi lên không ngừng.
   Lần sau khách mở lại thì vào thẳng thư này (một chiều, không sửa lại câu trả lời được).
   Cuối thư có nút **Để lại lời chúc**.
5. **Màn lời chúc** — bấm nút ở cuối thư thì mở màn này (màn duy nhất cuộn được). *Đang làm tiếp.*

### Bỏ ảnh chữ ký vào thư

Lưu ảnh chữ ký (nền trắng hoặc PNG trong suốt) thành `assets/images/chu-ky.png`,
rồi trong [index.html](index.html) xoá 2 dòng `<!--` / `-->` bọc quanh khối chữ ký ở màn thư.

## Thay ảnh cho cuộn phim

Bỏ ảnh vào [assets/images/photos/](assets/images/photos/), đặt tên `1.jpg`, `2.jpg`, … `8.jpg`.
Khung nào chưa có ảnh thì để trống, không lỗi gì cả.

- Ảnh **dọc** hợp nhất (khung tỉ lệ 3:4), ảnh ngang sẽ bị cắt hai bên.
- Muốn nhiều/ít ảnh hơn hoặc đổi tên file: sửa mảng `photos` trong [js/main.js](js/main.js).
- Muốn phim chạy nhanh/chậm: sửa `48s` ở `animation: film-roll` trong [css/style.css](css/style.css).
- Muốn dải phim to/nhỏ hơn: sửa `flex: 0 0 clamp(104px, 35%, 160px)` ở `.film` trong [css/style.css](css/style.css).

## Sửa lời thư

Toàn bộ chữ nằm trong `LETTERS` ở đầu [js/main.js](js/main.js) — `co` là thư cho người đến được,
`khong` là thư cho người bận. Mỗi dòng trong mảng là một đoạn văn.
Viết `{ten}`, `{gio}`, `{ngay}`, `{diadiem}` thì tự thay bằng thông tin khách điền.

## Khi quiz báo "Chưa gửi được…"

Gần như luôn là do bản triển khai Apps Script để sai quyền. Kiểm tra: dán link `.../exec` vào trình duyệt.

- Hiện `{"ok":true,...}` → đúng rồi.
- Bị đá sang **trang đăng nhập Google** → sai quyền. Vào Apps Script →
  **Triển khai → Quản lý bản triển khai** → bấm **bút chì** → **Ai có quyền truy cập** đổi thành
  **Bất kỳ ai** (Anyone — *không* phải "Anyone with Google account") → **Triển khai**.
  Link `.../exec` giữ nguyên, khỏi sửa code.

Chọn "Bất kỳ ai" không có nghĩa là ai cũng xem được bảng tính — người ngoài chỉ gửi thêm dòng vào được,
không đọc được dữ liệu đã có.

Mẹo khi làm tiếp: vào `/#thiep` để mở thẳng thiệp, khỏi phải bấm lại mỗi lần tải trang.

## Cấu trúc

```
.
├── index.html          # trang duy nhất
├── css/style.css       # style (khung dọc, portrait-first)
├── js/main.js          # script + CONFIG thông tin sự kiện
├── assets/
│   ├── images/
│   │   ├── gate.jpg    # màn cổng — "ngày gì vậy"
│   │   ├── invite.jpg  # thiệp — "save the date"
│   │   └── favicon.svg
│   ├── fonts/          # font tự host (nếu dùng)
│   └── audio/          # nhạc nền (nếu dùng)
├── docs/
│   └── apps-script.gs  # code dán vào Apps Script của Google Sheet để nhận câu trả lời
├── vercel.json         # cấu hình deploy
└── .gitignore
```

Hai tấm ảnh lấy từ bản gốc 2941×5225, đã thu về 1080px và nén JPEG (91 KB + 159 KB) cho nhẹ 4G.
Nếu đổi ảnh khác **không cùng tỉ lệ 1080:1919**, nhớ sửa `--img-ratio` và `aspect-ratio` trong [css/style.css](css/style.css),
và chỉnh lại vị trí vòng tròn ở `.gate__hotspot` (`left` / `top` / `width` / `height` tính theo % của tấm ảnh).

## Chạy thử ở máy

Mở thẳng `index.html` bằng trình duyệt cũng được, nhưng nên chạy server tĩnh để đường dẫn `/css/...` hoạt động đúng:

```bash
npx serve .
```

Rồi mở http://localhost:3000

## Deploy lên Vercel

**Cách 1 — CLI (nhanh nhất):**

```bash
npm i -g vercel
vercel          # deploy bản xem trước
vercel --prod   # deploy bản chính thức
```

**Cách 2 — qua GitHub:**

1. Đẩy thư mục này lên một repo GitHub.
2. Vào vercel.com → **Add New → Project** → chọn repo.
3. Framework Preset: **Other**. Build Command: để trống. Output Directory: để trống (root).
4. **Deploy**.

## Sửa thông tin sự kiện

Sửa object `CONFIG` ở đầu [js/main.js](js/main.js):

| Khoá | Ý nghĩa |
| --- | --- |
| `startsAt` | Ngày giờ diễn ra (đang để `02/08/2026 08:00`, cần xác nhận lại) |
| `venue`, `address` | Địa điểm, hiện lên ở màn cảm ơn sau khi khách gửi |
| `rsvpEndpoint` | Link Google Apps Script nhận câu trả lời |
| `hourFrom`, `hourTo`, `minuteStep` | Khung giờ cho khách chọn (đang là 8–12h, mỗi 5 phút) |
| `quizDelay` | Ngắm thiệp bao lâu thì chuyển sang màn xác nhận (đang là 5000 = 5 giây) |
