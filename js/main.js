/* ==========================================================================
   THIỆP MỜI TỐT NGHIỆP — TRẦN MINH QUANG
   ========================================================================== */

/** Thông tin sự kiện + cấu hình — sửa ở đây, các phần khác lấy theo. */
const CONFIG = {
  hostName: 'Trần Minh Quang',
  startsAt: '2026-08-02T08:00:00+07:00',   // giờ VN
  venue: 'Hội trường Nguyễn Văn Đạo, Đại học Quốc gia Hà Nội',
  address: '144 Xuân Thủy, Cầu Giấy, Hà Nội',

  /* Nơi nhận câu trả lời — dán link Google Apps Script (dạng .../exec) vào đây.
     Cách lấy: xem docs/huong-dan-google-sheet.md */
  rsvpEndpoint: 'https://script.google.com/macros/s/AKfycbwf12iQH9UoNMvTRDDgJoZ_R2FjPfVsHwSC9DMRksgtl-bH20A6oqpadhK3S4ciAkqA/exec',

  /* Khách chọn giờ đến trong khoảng này */
  hourFrom: 8,
  hourTo: 12,
  minuteStep: 5,

  /* Xem thiệp bao lâu thì tự trôi xuống phần quiz (mili giây) */
  autoScrollDelay: 5000,
};

const STORAGE_KEY = 'rsvp:tran-minh-quang';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (sel) => document.querySelector(sel);

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
   2. Mở thiệp: ẩn màn cổng -> hiện trang cuộn
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
    scheduleAutoScroll($('#quiz'));
  };

  if (reduceMotion) reveal();
  else setTimeout(reveal, 550);   // khớp với transition của .gate
}

/** Ngắm thiệp ~5 giây rồi tự trôi xuống phần quiz.
    Nếu khách tự cuộn/chạm trước thì thôi, để họ tự đi. */
function scheduleAutoScroll(target) {
  if (!target) return;

  let cancelled = false;
  const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
  const cancel = () => { cancelled = true; off(); };
  const off = () => events.forEach((ev) => window.removeEventListener(ev, cancel));

  events.forEach((ev) => window.addEventListener(ev, cancel, { passive: true }));

  setTimeout(() => {
    off();
    if (cancelled) return;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }, CONFIG.autoScrollDelay);
}

/* --------------------------------------------------------------------------
   3. Quiz: chọn giờ
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
   4. Quiz: gửi câu trả lời lên Google Sheet
   -------------------------------------------------------------------------- */
async function sendAnswer(payload) {
  const url = CONFIG.rsvpEndpoint;

  if (!url) {
    console.warn(
      '[RSVP] Chưa cấu hình CONFIG.rsvpEndpoint trong js/main.js.\n' +
      'Xem hướng dẫn ở docs/huong-dan-google-sheet.md để lấy link Google Apps Script.'
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
   5. Quiz: nối mọi thứ lại
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
  const done = $('#quizDone');
  const doneTitle = $('#doneTitle');
  const doneLead = $('#doneLead');
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

  /* --- màn hình "đã gửi" --- */
  function showDone(answer) {
    const time = answer.time ? ` lúc ${answer.time}` : '';
    doneTitle.textContent = answer.attend === 'co' ? 'Hẹn gặp bạn nhé!' : 'Cảm ơn bạn đã trả lời';
    doneLead.textContent =
      answer.attend === 'co'
        ? `${answer.name} ơi, mình chờ bạn${time} ngày 2/8 tại ${CONFIG.venue} nhé.`
        : `Tiếc thật, nhưng không sao đâu ${answer.name}. Hẹn gặp bạn dịp khác nhé!`;

    intro.hidden = true;
    form.hidden = true;
    done.hidden = false;
  }

  function showForm(answer) {
    if (answer) {
      nameInput.value = answer.name || '';
      attendInputs.forEach((i) => { i.checked = i.value === answer.attend; });
      timeField.hidden = answer.attend !== 'co';
      if (answer.time) {
        const [h, m] = answer.time.split(':');
        hourSel.value = h;
        fillMinutes(minuteSel, h, m);
      }
    }
    done.hidden = true;
    intro.hidden = false;
    form.hidden = false;
    status.textContent = '';
    status.className = 'form-status';
  }

  // Đã trả lời từ lần trước -> hiện luôn màn hình cảm ơn
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (e) { saved = null; }
  if (saved && saved.name) showDone(saved);

  $('#editBtn')?.addEventListener('click', () => {
    showForm(saved);
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
      showDone(saved);
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
   6. Khởi động
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const gate = $('#gate');
  const invite = $('#invite');
  const btn = $('#openBtn');

  spawnQuestionMarks($('#questions'));
  setupQuiz();

  btn?.addEventListener('click', () => openInvite(gate, invite, btn));

  // Mở thẳng thiệp, bỏ qua màn cổng: thêm #thiep vào cuối đường dẫn
  if (location.hash === '#thiep') openInvite(gate, invite, btn);
});
