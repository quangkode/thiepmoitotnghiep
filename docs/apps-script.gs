/**
 * NƠI NHẬN CÂU TRẢ LỜI + LỜI CHÚC CỦA KHÁCH
 *
 * Dán TOÀN BỘ file này vào Apps Script, thay cho MỌI thứ đang có sẵn.
 * Xoá luôn cả dòng `function myFunction() {` và dấu `}` cuối của nó —
 * code dưới đây phải nằm ở ngoài cùng, không được lồng trong hàm nào,
 * nếu không web app sẽ không tìm thấy doPost.
 *
 * Sau khi dán: Triển khai → Bản triển khai mới → Ứng dụng web,
 * "Thực thi bằng" = Tôi, "Ai có quyền truy cập" = Bất kỳ ai.
 * SỬA CODE XONG PHẢI TRIỂN KHAI LẠI (Quản lý bản triển khai → sửa → phiên bản Mới)
 * thì link .../exec mới chạy code mới.
 */

/** ID bảng tính nhận dữ liệu.
 *  - Mở Apps Script từ chính Google Sheet (Tiện ích mở rộng → Apps Script) thì để trống ''.
 *  - Dự án Apps Script riêng (mở từ script.google.com) thì BẮT BUỘC điền.
 *  Lấy ID trong link của Sheet:
 *  docs.google.com/spreadsheets/d/  ID_NẰM_Ở_ĐÂY  /edit
 */
const SHEET_ID = '';

/** Tên hai trang tính (tự tạo nếu chưa có). */
const SHEET_NAME = 'Trả lời';
const WISH_SHEET_NAME = 'Lời chúc';

/** Muốn nhận mail báo mỗi khi có người điền thì điền email vào đây.
 *  Để trống '' là tắt. */
const NOTIFY_EMAIL = '';

/* ==========================================================================
   NHẬN DỮ LIỆU GỬI LÊN
   ========================================================================== */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);              // tránh 2 người gửi cùng lúc ghi đè nhau

  try {
    const data = readPayload_(e);
    return data.action === 'wish' ? luuLoiChuc_(data) : luuTraLoi_(data);
  } catch (err) {
    return json_(e, { ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Câu trả lời của quiz (tên / có đến / giờ đến). */
function luuTraLoi_(data) {
  const attend = data.attend === 'co' ? 'Có' : 'Không';

  getSheet_().appendRow([
    new Date(),
    String(data.name || '').slice(0, 100),
    attend,
    String(data.time || ''),
    String(data.device || '').slice(0, 250),
  ]);

  notify_(data.name, attend, data.time);
  return json_(null, { ok: true });
}

/** Một lời chúc ở sổ lưu bút.
 *  Trang web gửi 2 lần khi trình duyệt không đọc được phản hồi (dự phòng no-cors),
 *  nên ở đây chặn trùng theo cột Mã: đã có mã đó thì ghi đè, không thêm dòng mới. */
function luuLoiChuc_(data) {
  const sheet = getWishSheet_();
  const id = String(data.id || '').slice(0, 40);

  const row = [
    new Date(),
    id,
    String(data.name || '').slice(0, 60),
    String(data.text || '').slice(0, 1000),
    String(data.font || 'tay').slice(0, 10),
    String(data.icon || '').slice(0, 40),
    String(data.hue || ''),
    String(data.stickers || '').slice(0, 200),
    '',                               // cột Ẩn: gõ x vào đây để ẩn lời chúc khỏi trang
  ];

  const dong = id ? timDongTheoMa_(sheet, id) : 0;

  if (dong) {
    row[0] = sheet.getRange(dong, 1).getValue() || row[0];   // giữ thời điểm gửi lần đầu
    row[8] = sheet.getRange(dong, 9).getValue() || '';       // giữ trạng thái Ẩn
    sheet.getRange(dong, 1, 1, row.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }

  return json_(null, { ok: true, updated: !!dong });
}

/** Số dòng có Mã = id (0 nếu chưa có). */
function timDongTheoMa_(sheet, id) {
  const last = sheet.getLastRow();
  if (last < 2) return 0;

  const ids = sheet.getRange(2, 2, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]).trim() === id) return i + 2;
  }
  return 0;
}

/* ==========================================================================
   TRẢ DỮ LIỆU CHO TRANG WEB
   .../exec?action=wishes            -> JSON danh sách lời chúc
   .../exec?action=wishes&callback=f -> dạng JSONP (trang web tự dùng khi cần)
   ========================================================================== */
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || '';

  if (action === 'wishes') {
    return json_(e, { ok: true, wishes: docLoiChuc_() });
  }

  return json_(e, { ok: true, message: 'Endpoint đang chạy (quiz + lời chúc)' });
}

/** Đọc cả trang tính lời chúc, bỏ qua dòng nào cột "Ẩn" có chữ. */
function docLoiChuc_() {
  const sheet = getWishSheet_();
  const rows = sheet.getDataRange().getValues();
  const out = [];

  for (let i = 1; i < rows.length; i++) {          // bỏ dòng tiêu đề
    const r = rows[i];
    if (!r[2] && !r[3]) continue;                  // dòng trống
    if (String(r[8] || '').trim()) continue;       // cột Ẩn -> không trả về

    const icon = String(r[5] || '');
    const cut = icon.indexOf(':');

    out.push({
      id: String(r[1] || 'row' + i),
      name: String(r[2] || ''),
      text: String(r[3] || ''),
      font: String(r[4] || 'tay'),
      icon: {
        type: cut > 0 ? icon.slice(0, cut) : 'emoji',
        value: cut > 0 ? icon.slice(cut + 1) : icon,
      },
      hue: Number(r[6]) || 212,
      stickers: String(r[7] || '').split(',').map(function (s) { return s.trim(); }).filter(String),
      at: r[0] ? new Date(r[0]).toISOString() : '',
    });
  }

  return out;
}

/**
 * Bấm Chạy hàm này một lần để kiểm tra trước khi triển khai.
 * Xem kết quả ở Nhật ký thực thi. Nó ghi một dòng thử vào mỗi bảng, nhớ xoá đi.
 */
function kiemTra() {
  const sheet = getSheet_();
  sheet.appendRow([new Date(), 'Thử kết nối', 'Có', '08:00', 'kiemTra()']);

  const wish = getWishSheet_();
  wish.appendRow([new Date(), 'test', 'Thử lời chúc', 'Chúc mừng!', 'tay', 'emoji:🎓', '212', '', '']);

  Logger.log('OK — bảng tính: ' + sheet.getParent().getName());
  Logger.log('Số lời chúc đang trả về: ' + docLoiChuc_().length);
}

/* -------------------------------------------------------------------------- */

/** Trang web gửi JSON, bản dự phòng gửi dạng form -> nhận cả hai. */
function readPayload_(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      // không phải JSON -> rơi xuống dùng e.parameter
    }
  }
  return (e && e.parameter) || {};
}

function getSpreadsheet_() {
  const ss = SHEET_ID
    ? SpreadsheetApp.openById(SHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {
    throw new Error(
      'Không tìm thấy bảng tính. Dự án Apps Script này không gắn với Sheet nào — ' +
      'điền ID bảng tính vào SHEET_ID ở đầu file.'
    );
  }

  return ss;
}

function getSheet_() {
  const ss = getSpreadsheet_();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Thời điểm gửi', 'Tên', 'Có đến?', 'Giờ đến', 'Thiết bị']);
    sheet.getRange('A1:E1').setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 200);
    sheet.setColumnWidth(5, 260);
  }

  return sheet;
}

function getWishSheet_() {
  const ss = getSpreadsheet_();
  let sheet = ss.getSheetByName(WISH_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(WISH_SHEET_NAME);
    sheet.appendRow([
      'Thời điểm gửi', 'Mã', 'Tên', 'Lời chúc', 'Kiểu chữ',
      'Icon con dấu', 'Màu (hue)', 'Sticker', 'Ẩn (gõ x)',
    ]);
    sheet.getRange('A1:I1').setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 150);
    sheet.setColumnWidth(3, 150);
    sheet.setColumnWidth(4, 420);
  }

  return sheet;
}

function notify_(name, attend, time) {
  if (!NOTIFY_EMAIL) return;
  try {
    MailApp.sendEmail(
      NOTIFY_EMAIL,
      'Thiệp tốt nghiệp: ' + (name || 'ai đó') + ' vừa trả lời',
      'Tên: ' + (name || '') + '\n' +
      'Có đến: ' + attend + '\n' +
      (time ? 'Giờ đến: ' + time + '\n' : '')
    );
  } catch (err) {
    // gửi mail hỏng thì kệ, dữ liệu đã ghi vào sheet rồi
  }
}

/** Trả JSON; có tham số callback thì trả JSONP để trang web đọc được kể cả khi bị CORS. */
function json_(e, obj) {
  const cb = e && e.parameter && e.parameter.callback;
  const body = JSON.stringify(obj);

  if (cb && /^[A-Za-z_$][\w$]*$/.test(cb)) {
    return ContentService
      .createTextOutput(cb + '(' + body + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(body)
    .setMimeType(ContentService.MimeType.JSON);
}
