# Nhạc nền

Bỏ **một** file nhạc vào đây, đặt tên `nhac.m4a`.

- Chạy được `.m4a` (AAC), `.mp3`, `.ogg`, `.wav` — dùng đuôi nào thì sửa
  `music` trong [js/main.js](../../js/main.js) cho khớp, ví dụ `'/assets/audio/nhac.mp3'`.
- Nên để file **dưới 4 MB** (khoảng 2–3 phút, 96–128 kbps) cho khách mạng yếu đỡ chờ.
  Nhạc chỉ tải khi khách bấm mở thiệp, không tải sẵn lúc vào trang.
- Chỉnh to nhỏ ở `musicVolume` (0 tới 1), mặc định `0.35`.
- Muốn tắt hẳn nhạc: để `music: ''`.

Thay file nhạc mới cùng tên thì nhớ tăng `assetVersion` trong `js/main.js`,
không thì trình duyệt khách vẫn phát bản cũ đã nhớ.

Nhạc **không tự phát** ngay khi mở trang — mọi trình duyệt đều cấm.
Nó bắt đầu từ lúc khách bấm "Ấn vào đây" ở màn cổng.
Góc trên bên phải có nút hình cái loa: ấn một cái là tắt tiếng (loa xám, gạch chéo),
ấn nữa là bật lại. Tắt rồi thì lần sau khách vào vẫn nhớ là tắt.
