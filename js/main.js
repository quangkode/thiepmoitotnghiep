/* ==========================================================================
   THIỆP MỜI TỐT NGHIỆP — TRẦN MINH QUANG
   ========================================================================== */

/** Thông tin sự kiện + cấu hình — sửa ở đây, các phần khác lấy theo. */
const CONFIG = {
  hostName: 'Trần Minh Quang',
  startsAt: '2026-08-02T08:00:00+07:00',   // giờ VN
  venue: 'Hội trường Nguyễn Văn Đạo, Đại học Quốc gia Hà Nội',
  address: '144 Xuân Thủy, Cầu Giấy, Hà Nội',
  dateText: 'Chủ nhật ngày 2 tháng 8',

  /* Nơi nhận câu trả lời — dán link Google Apps Script (dạng .../exec) vào đây.
     Cách lấy: xem README.md và docs/apps-script.gs */
  rsvpEndpoint: 'https://script.google.com/macros/s/AKfycbwf12iQH9UoNMvTRDDgJoZ_R2FjPfVsHwSC9DMRksgtl-bH20A6oqpadhK3S4ciAkqA/exec',

  /* Khách chọn giờ đến trong khoảng này */
  hourFrom: 8,
  hourTo: 12,
  minuteStep: 5,

  /* Xem thiệp bao lâu thì chuyển sang màn xác nhận (mili giây) */
  quizDelay: 5000,

  /* Ảnh chạy trên cuộn phim — bỏ file vào assets/images/photos/ đúng tên này.
     Chưa có file thì khung hiện chỗ trống, không lỗi gì cả. */
  photos: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg'],
  photoDir: '/assets/images/photos/',
};

/* ==========================================================================
   LỜI THƯ — SỬA THOẢI MÁI Ở ĐÂY
   Chỗ nào để {ten}, {gio}, {ngay}, {diadiem} thì tự thay bằng thông tin khách điền.
   Mỗi dòng trong mảng là một đoạn văn.
   ========================================================================== */
const LETTERS = {
  /* Khách chọn CÓ đến */
  co: {
    title: 'Hẹn gặp bạn ngày hôm đó',
    paragraphs: [
      'Gửi {ten},',
      'Cảm ơn bạn đã nhận lời tới dự buổi lễ tốt nghiệp của mình. Bốn năm trôi qua nhanh hơn mình tưởng, và tới ngày cầm được tấm bằng trên tay, mình mới thấy rõ một điều: chặng đường đó chưa bao giờ mình đi một mình.',
      'Cảm ơn vì những lần bạn chịu nghe mình than, những lần kéo mình dậy lúc mọi thứ rối tung, và cả những chuyện nhỏ xíu mà giờ nhớ lại vẫn thấy buồn cười.',
      'Hẹn gặp bạn lúc <strong>{gio}</strong>, {ngay} tại {diadiem}. Nhớ mặc đẹp vào để còn chụp ảnh nhé!',
    ],
  },

  /* Khách chọn KHÔNG đến được */
  khong: {
    title: 'Cảm ơn vì đã đồng hành',
    paragraphs: [
      'Gửi {ten},',
      'Không sao đâu, mình hiểu mà. Thật ra điều mình muốn nói không nằm ở chuyện hôm đó bạn có mặt hay không, mà là cảm ơn bạn đã đồng hành cùng mình suốt quãng đường vừa rồi.',
      'Cảm ơn vì đã ở đó những lúc mình chông chênh nhất, vì những lời động viên đúng lúc, và vì đã tin mình sẽ làm được — kể cả khi chính mình còn chưa tin.',
      'Tấm bằng này có một phần của bạn trong đó. Hẹn gặp bạn một ngày gần nhất, mình mời cà phê!',
    ],
  },
};

const STORAGE_KEY = 'rsvp:tran-minh-quang';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (sel) => document.querySelector(sel);

/** Câu trả lời đã lưu trong máy khách (null nếu chưa trả lời). */
function readSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return saved && saved.name ? saved : null;
  } catch (e) {
    return null;
  }
}

/* --------------------------------------------------------------------------
   1. Dấu chấm hỏi bay bay ở màn cổng
   -------------------------------------------------------------------------- */
function spawnQuestionMarks(layer, count = 16) {
  if (!layer || reduceMotion) return;

  const rand = (min, max) => min + Math.random() * (max - min);
  const frag = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const q = document.createElement('span');
    q.className = 'q';
    q.textContent = '?';

    const dur = rand(7, 14);

    q.style.left = rand(3, 92) + '%';
    q.style.fontSize = rand(14, 42).toFixed(0) + 'px';
    q.style.setProperty('--dur', dur.toFixed(2) + 's');
    // delay âm -> lúc mở trang đã có sẵn vài dấu hỏi lơ lửng giữa màn hình
    q.style.setProperty('--delay', (-rand(0, dur)).toFixed(2) + 's');
    q.style.setProperty('--op', rand(0.16, 0.5).toFixed(2));
    q.style.setProperty('--drift', rand(-60, 60).toFixed(0) + 'px');
    q.style.setProperty('--spin', rand(-40, 40).toFixed(0) + 'deg');

    frag.appendChild(q);
  }

  layer.appendChild(frag);
}

/* --------------------------------------------------------------------------
   2. Mở thiệp: ẩn màn cổng -> hiện tấm save the date
   -------------------------------------------------------------------------- */
function openInvite(gate, invite, btn) {
  if (!gate || gate.hidden) return;

  if (btn) btn.disabled = true;
  gate.classList.add('is-open');

  const reveal = () => {
    gate.hidden = true;
    invite.hidden = false;
    invite.classList.add('is-in');
    document.body.classList.remove('is-locked');
    window.scrollTo(0, 0);
    invite.focus({ preventScroll: true });

    // ngắm thiệp một lát rồi chuyển hẳn sang màn xác nhận
    setTimeout(() => showQuiz(invite), CONFIG.quizDelay);
  };

  if (reduceMotion) reveal();
  else setTimeout(reveal, 550);   // khớp với transition của .gate
}

/* --------------------------------------------------------------------------
   3. Chuyển màn (một chiều, không quay lại)
   -------------------------------------------------------------------------- */
/** Rời màn thiệp: ai trả lời rồi thì vào thẳng thư cảm ơn, chưa thì vào màn xác nhận. */
function showQuiz(invite) {
  const saved = readSaved();
  const target = saved ? $('#letter') : $('#quiz');
  if (saved) fillLetter(saved);

  invite.classList.add('is-out');

  const swap = () => {
    invite.hidden = true;
    openScreen(target);
  };

  if (reduceMotion) swap();
  else setTimeout(swap, 500);   // khớp với transition của .invite.is-out
}

function openScreen(el) {
  if (!el || !el.hidden) return;
  el.hidden = false;
  el.classList.add('is-in');
  window.scrollTo(0, 0);
  el.focus({ preventScroll: true });
}

function closeScreen(el) {
  if (!el) return;
  el.hidden = true;
  el.classList.remove('is-in');
}

/* --------------------------------------------------------------------------
   3b. Thư cảm ơn + cuộn phim
   -------------------------------------------------------------------------- */
function fillLetter(answer) {
  const tpl = LETTERS[answer.attend === 'co' ? 'co' : 'khong'];
  const fill = (s) => s
    .replaceAll('{ten}', answer.name || 'bạn')
    .replaceAll('{gio}', answer.time || '')
    .replaceAll('{ngay}', CONFIG.dateText)
    .replaceAll('{diadiem}', CONFIG.venue);

  $('#letterTitle').textContent = tpl.title;
  $('#letterBody').innerHTML = tpl.paragraphs.map((p) => `<p>${fill(p)}</p>`).join('');
  $('#letterSign').textContent = CONFIG.hostName;
}

/** Dựng cuộn phim: nhân đôi danh sách ảnh để chạy vòng lặp không thấy mối nối. */
function buildFilm() {
  const track = $('#filmTrack');
  if (!track) return;

  const frag = document.createDocumentFragment();

  for (let copy = 0; copy < 2; copy++) {
    CONFIG.photos.forEach((file, i) => {
      const frame = document.createElement('div');
      frame.className = 'film__frame is-empty';
      frame.dataset.label = String(i + 1);

      const img = document.createElement('img');
      img.loading = 'lazy';
      img.alt = '';
      img.addEventListener('load', () => frame.classList.remove('is-empty'));
      img.addEventListener('error', () => img.remove());   // chưa có ảnh -> để khung trống
      img.src = CONFIG.photoDir + file;

      frame.appendChild(img);
      frag.appendChild(frame);
    });
  }

  track.appendChild(frag);
}

/* --------------------------------------------------------------------------
   4. Quiz: chọn giờ
   -------------------------------------------------------------------------- */
const pad2 = (n) => String(n).padStart(2, '0');

function fillHours(select) {
  select.innerHTML = '';
  for (let h = CONFIG.hourFrom; h <= CONFIG.hourTo; h++) {
    const o = document.createElement('option');
    o.value = pad2(h);
    o.textContent = pad2(h) + ' giờ';
    select.appendChild(o);
  }
}

/** Giờ cuối cùng thì chỉ cho chọn phút 00, khỏi vượt quá khung giờ. */
function fillMinutes(select, hour, keep) {
  const isLastHour = Number(hour) >= CONFIG.hourTo;
  select.innerHTML = '';

  for (let m = 0; m < 60; m += CONFIG.minuteStep) {
    if (isLastHour && m !== 0) break;
    const o = document.createElement('option');
    o.value = pad2(m);
    o.textContent = pad2(m) + ' phút';
    select.appendChild(o);
  }

  if (keep && select.querySelector(`option[value="${keep}"]`)) select.value = keep;
}

/* --------------------------------------------------------------------------
   5. Quiz: gửi câu trả lời lên Google Sheet
   -------------------------------------------------------------------------- */
async function sendAnswer(payload) {
  const url = CONFIG.rsvpEndpoint;

  if (!url) {
    console.warn(
      '[RSVP] Chưa cấu hình CONFIG.rsvpEndpoint trong js/main.js.\n' +
      'Xem README.md để lấy link Google Apps Script.'
    );
    throw new Error('chưa cấu hình nơi nhận');
  }

  try {
    // text/plain -> trình duyệt gửi thẳng, không cần preflight CORS
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return true;
  } catch (err) {
    // Dự phòng: gửi "mù" (không đọc được kết quả nhưng dữ liệu vẫn tới nơi)
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      body: new URLSearchParams(payload),
    });
    return true;
  }
}

/* --------------------------------------------------------------------------
   6. Quiz: nối mọi thứ lại
   -------------------------------------------------------------------------- */
function setupQuiz() {
  const form = $('#rsvpForm');
  if (!form) return;

  const nameInput = $('#guestName');
  const timeField = $('#timeField');
  const hourSel = $('#hour');
  const minuteSel = $('#minute');
  const status = $('#formStatus');
  const submitBtn = $('#submitBtn');
  const intro = $('#quizIntro');
  const quiz = $('#quiz');
  const letter = $('#letter');
  const nameError = $('#nameError');
  const attendError = $('#attendError');

  fillHours(hourSel);
  fillMinutes(minuteSel, hourSel.value);

  hourSel.addEventListener('change', () => fillMinutes(minuteSel, hourSel.value, minuteSel.value));

  const attendInputs = [...form.querySelectorAll('input[name="attend"]')];
  const currentAttend = () => attendInputs.find((i) => i.checked)?.value || '';

  // Tích "Có" thì mới hỏi mấy giờ
  attendInputs.forEach((input) => {
    input.addEventListener('change', () => {
      attendError.hidden = true;
      timeField.hidden = input.value !== 'co';
    });
  });

  nameInput.addEventListener('input', () => { nameError.hidden = true; });

  /* --- gửi xong -> sang màn thư cảm ơn --- */
  function goToLetter(answer) {
    fillLetter(answer);
    closeScreen(quiz);
    letter.hidden = true;              // openScreen chỉ chạy khi đang ẩn
    openScreen(letter);
  }

  /* --- quay lại sửa câu trả lời --- */
  let saved = readSaved();

  $('#editBtn')?.addEventListener('click', () => {
    if (saved) {
      nameInput.value = saved.name || '';
      attendInputs.forEach((i) => { i.checked = i.value === saved.attend; });
      timeField.hidden = saved.attend !== 'co';
      if (saved.time) {
        const [h, m] = saved.time.split(':');
        hourSel.value = h;
        fillMinutes(minuteSel, h, m);
      }
    }

    status.textContent = '';
    status.className = 'form-status';
    intro.hidden = false;
    form.hidden = false;

    closeScreen(letter);
    quiz.hidden = true;
    openScreen(quiz);
    nameInput.focus();
  });

  /* --- gửi --- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const attend = currentAttend();

    nameError.hidden = !!name;
    attendError.hidden = !!attend;

    if (!name) { nameInput.focus(); return; }
    if (!attend) { return; }

    const answer = {
      name,
      attend,
      time: attend === 'co' ? `${hourSel.value}:${minuteSel.value}` : '',
    };

    submitBtn.disabled = true;
    status.className = 'form-status';
    status.textContent = 'Đang gửi…';

    try {
      await sendAnswer({ ...answer, device: navigator.userAgent });
      saved = { ...answer, at: new Date().toISOString() };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch (e) { /* bỏ qua */ }
      goToLetter(saved);
    } catch (err) {
      status.className = 'form-status is-error';
      status.textContent = 'Chưa gửi được. Bạn thử lại giúp mình, hoặc nhắn thẳng cho Quang nhé!';
      console.error('[RSVP]', err);
    } finally {
      submitBtn.disabled = false;
    }
  });
}

/* --------------------------------------------------------------------------
   7. Khởi động
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const gate = $('#gate');
  const invite = $('#invite');
  const btn = $('#openBtn');

  spawnQuestionMarks($('#questions'));
  buildFilm();
  setupQuiz();

  btn?.addEventListener('click', () => openInvite(gate, invite, btn));

  // Mở thẳng thiệp, bỏ qua màn cổng: thêm #thiep vào cuối đường dẫn
  if (location.hash === '#thiep') openInvite(gate, invite, btn);
});
