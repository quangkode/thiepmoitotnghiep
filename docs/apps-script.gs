/**
 * NƠI NHẬN CÂU TRẢ LỜI CỦA KHÁCH — dán toàn bộ file này vào Apps Script
 * của một Google Sheet. Hướng dẫn từng bước: docs/huong-dan-google-sheet.md
 */

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
  const ss = SpreadsheetApp.getActiveSpreadsheet();
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
