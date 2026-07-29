/**
 * NƠI NHẬN CÂU TRẢ LỜI CỦA KHÁCH
 *
 * Dán TOÀN BỘ file này vào Apps Script, thay cho MỌI thứ đang có sẵn.
 * Xoá luôn cả dòng `function myFunction() {` và dấu `}` cuối của nó —
 * code dưới đây phải nằm ở ngoài cùng, không được lồng trong hàm nào,
 * nếu không web app sẽ không tìm thấy doPost.
 */

/** ID bảng tính nhận câu trả lời.
 *  - Mở Apps Script từ chính Google Sheet (Tiện ích mở rộng → Apps Script) thì để trống ''.
 *  - Dự án Apps Script riêng (mở từ script.google.com) thì BẮT BUỘC điền.
 *  Lấy ID trong link của Sheet:
 *  docs.google.com/spreadsheets/d/  ID_NẰM_Ở_ĐÂY  /edit
 */
const SHEET_ID = '';

/** Tên trang tính chứa câu trả lời (tự tạo nếu chưa có). */
const SHEET_NAME = 'Trả lời';

/** Muốn nhận mail báo mỗi khi có người điền thì điền email vào đây.
 *  Để trống '' là tắt. */
const NOTIFY_EMAIL = '';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);              // tránh 2 người gửi cùng lúc ghi đè nhau

  try {
    const data = readPayload_(e);
    const attend = data.attend === 'co' ? 'Có' : 'Không';

    getSheet_().appendRow([
      new Date(),
      String(data.name || '').slice(0, 100),
      attend,
      String(data.time || ''),
      String(data.device || '').slice(0, 250),
    ]);

    notify_(data.name, attend, data.time);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Mở link .../exec bằng trình duyệt sẽ thấy dòng này -> biết là script đang sống. */
function doGet() {
  return json_({ ok: true, message: 'RSVP endpoint đang chạy' });
}

/**
 * Bấm Chạy hàm này một lần để kiểm tra trước khi triển khai.
 * Xem kết quả ở Nhật ký thực thi. Nó ghi một dòng thử vào bảng, nhớ xoá dòng đó đi.
 */
function kiemTra() {
  const sheet = getSheet_();
  sheet.appendRow([new Date(), 'Thử kết nối', 'Có', '08:00', 'kiemTra()']);
  Logger.log('OK — đã ghi vào bảng tính: ' + sheet.getParent().getName() + ' / ' + sheet.getName());
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

function getSheet_() {
  const ss = SHEET_ID
    ? SpreadsheetApp.openById(SHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {
    throw new Error(
      'Không tìm thấy bảng tính. Dự án Apps Script này không gắn với Sheet nào — ' +
      'điền ID bảng tính vào SHEET_ID ở đầu file.'
    );
  }

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

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
