/* ==========================================================================
   THIỆP MỜI TỐT NGHIỆP — TRẦN MINH QUANG
   ========================================================================== */

/** Thông tin sự kiện + cấu hình — sửa ở đây, các phần khác lấy theo. */
const CONFIG = {
  hostName: 'Trần Minh Quang',
  startsAt: '2026-08-02T08:00:00+07:00',   // giờ VN
  venue: 'Hội trường Nguyễn Văn Đạo, Đại học Quốc gia Hà Nội',
  venueShort: 'Hội trường Nguyễn Văn Đạo',   // dùng trong thư cho gọn dòng
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

  /* Sticker cho sổ lưu bút — bỏ ảnh vào assets/images/sticker/ đúng tên này
     (nên dùng .png nền trong suốt, vuông, cỡ 240–512px).
     File nào chưa có thì tự bỏ qua, muốn thêm thì viết thêm tên vào mảng. */
  stickers: [
    '1.png', '2.png', '3.png', '4.png', '5.png', '6.png',
    '7.png', '8.png', '9.png', '10.png', '11.png', '12.png',
  ],
  stickerDir: '/assets/images/sticker/',

  /* Nơi lưu lời chúc chung cho mọi người.
     Để trống '' thì lời chúc chỉ nằm trong máy của người viết (chưa ai thấy được).
     Nối xong Google Apps Script (hoặc chỗ khác) thì dán link .../exec vào đây. */
  wishEndpoint: '',
  maxStickers: 3,
};

/* ==========================================================================
   LỜI THƯ — SỬA THOẢI MÁI Ở ĐÂY
   Chỗ nào để {ten}, {gio}, {ngay}, {diadiem} thì tự thay bằng thông tin khách điền.
   Mỗi dòng trong mảng là một đoạn văn.
   ========================================================================== */
const LETTERS = {
  /* Khách chọn CÓ đến */
  co: {
    title: 'Hẹn gặp bạn hôm đó',
    paragraphs: [
      'Gửi {ten},',
      'Cảm ơn bạn đã nhận lời tới dự lễ tốt nghiệp của mình. Bốn năm trôi qua nhanh hơn mình tưởng, và tới ngày cầm tấm bằng trên tay, mình mới thấy rõ một điều: chặng đường đó chưa bao giờ mình đi một mình.',
      'Hẹn gặp bạn lúc <strong>{gio}</strong>, {ngay} tại {diadiem}. Nhớ mặc đẹp vào để còn chụp ảnh nhé!',
    ],
  },

  /* Khách chọn KHÔNG đến được */
  khong: {
    title: 'Cảm ơn vì đã đồng hành',
    paragraphs: [
      'Gửi {ten},',
      'Không sao đâu, mình hiểu mà. Điều mình muốn nói không nằm ở chuyện hôm đó bạn có mặt hay không, mà là cảm ơn bạn đã đi cùng mình suốt quãng đường vừa rồi.',
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
    .replaceAll('{diadiem}', CONFIG.venueShort || CONFIG.venue);

  $('#letterTitle').textContent = tpl.title;
  $('#letterBody').innerHTML = tpl.paragraphs.map((p) => `<p>${fill(p)}</p>`).join('');
}

/** Sang màn sổ lưu bút (màn này cuộn được, không quay lại thư nữa). */
async function openWish() {
  const wish = $('#wish');
  if (!wish) return;

  closeScreen($('#letter'));
  document.body.classList.remove('is-locked');
  openScreen(wish);
  showWishView('wishHome');
  await refreshWishes();
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

/* ==========================================================================
   3d. SỔ LƯU BÚT — lời chúc của mọi người
   ========================================================================== */
const WISH_KEY = 'wishes:tran-minh-quang';

/* Kiểu chữ cho khách chọn (khớp với .font--* trong style.css) */
const WISH_FONTS = [
  { id: 'gon', label: 'Gọn gàng' },
  { id: 'tay', label: 'Viết tay' },
  { id: 'bay', label: 'Bay bổng' },
];

/* Icon dùng khi thư mục sticker chưa có ảnh nào */
const WISH_EMOJIS = ['🎓', '🌻', '⭐', '🍀', '🎈', '☕', '🐧', '🌙', '🍉', '🧸', '🌊', '🐣'];

/* Màu mực con dấu (giá trị hue của hsl) */
const WISH_HUES = [212, 344, 26, 142, 268, 46];

let wishList = [];        // danh sách đang hiện trên trang chủ
let stickerFiles = [];    // sticker thật sự có trong assets/images/sticker/
const draft = { icon: null, hue: WISH_HUES[0], font: 'tay', stickers: [] };

/** Lời chúc lưu trong máy khách — dùng khi chưa nối nơi lưu chung. */
function readLocalWishes() {
  try {
    const arr = JSON.parse(localStorage.getItem(WISH_KEY) || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

/** Gọi endpoint kiểu JSONP — dùng khi fetch bị CORS chặn (hay gặp với Apps Script). */
function jsonpGet(url, timeout = 9000) {
  return new Promise((resolve, reject) => {
    const name = 'wishCb' + Math.random().toString(36).slice(2, 9);
    const script = document.createElement('script');

    const clean = () => {
      clearTimeout(timer);
      delete window[name];
      script.remove();
    };
    const timer = setTimeout(() => { clean(); reject(new Error('JSONP hết giờ')); }, timeout);

    window[name] = (data) => { clean(); resolve(data); };
    script.onerror = () => { clean(); reject(new Error('JSONP lỗi')); };
    script.src = url + (url.includes('?') ? '&' : '?') + 'callback=' + name;
    document.head.appendChild(script);
  });
}

/** Danh sách lời chúc gửi về từ Google Sheet: bỏ trùng mã, mới nhất lên trước. */
function pickWishes(data) {
  const arr = Array.isArray(data) ? data : data && data.wishes;
  if (!Array.isArray(arr)) return [];

  const seen = new Set();
  const out = [];

  arr.forEach((w) => {
    if (!w || !w.name || seen.has(w.id)) return;
    seen.add(w.id);
    out.push(w);
  });

  return out.sort((a, b) => String(b.at || '').localeCompare(String(a.at || '')));
}

/** Lấy danh sách lời chúc để hiện lên trang chủ.
    Chưa có CONFIG.wishEndpoint thì chỉ đọc trong máy khách. */
async function loadWishes() {
  if (!CONFIG.wishEndpoint) return pickWishes(readLocalWishes());

  const url = CONFIG.wishEndpoint + '?action=wishes';

  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return pickWishes(await res.json());
  } catch (err) {
    console.warn('[WISH] fetch không đọc được, thử JSONP:', err);
  }

  try {
    return pickWishes(await jsonpGet(url));
  } catch (err) {
    console.error('[WISH] không lấy được danh sách, tạm dùng dữ liệu trong máy:', err);
    return pickWishes(readLocalWishes());
  }
}

/** Gói lời chúc thành dữ liệu phẳng cho Google Sheet (mỗi ô một cột). */
function wishPayload(wish) {
  const icon = wish.icon || {};
  return {
    action: 'wish',
    id: wish.id,
    name: wish.name,
    text: wish.text,
    font: wish.font,
    hue: String(wish.hue),
    icon: (icon.type || 'emoji') + ':' + (icon.value || ''),
    stickers: (wish.stickers || []).join(','),
    at: wish.at,
  };
}

/** Lưu một lời chúc: luôn giữ trong máy, có endpoint thì gửi lên chỗ chung. */
async function sendWish(wish) {
  const all = [...readLocalWishes().filter((w) => w.id !== wish.id), wish];
  try { localStorage.setItem(WISH_KEY, JSON.stringify(all)); } catch (e) { /* bỏ qua */ }

  if (!CONFIG.wishEndpoint) return;
  const payload = wishPayload(wish);

  try {
    // text/plain -> trình duyệt gửi thẳng, không cần preflight CORS
    const res = await fetch(CONFIG.wishEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
  } catch (err) {
    // Dự phòng: gửi "mù" (không đọc được kết quả nhưng dữ liệu vẫn tới nơi)
    await fetch(CONFIG.wishEndpoint, {
      method: 'POST',
      mode: 'no-cors',
      body: new URLSearchParams(payload),
    });
  }
}

/** Tìm xem sticker nào đã có ảnh thật (file thiếu thì bỏ khỏi danh sách). */
function findStickers() {
  return Promise.all(CONFIG.stickers.map((file) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(file);
    img.onerror = () => resolve(null);
    img.src = CONFIG.stickerDir + file;
  }))).then((list) => list.filter(Boolean));
}

/* --- Chuyển qua lại giữa 3 trang con của sổ lưu bút --- */
function showWishView(id) {
  ['wishHome', 'wishOne', 'wishForm'].forEach((v) => {
    const el = $('#' + v);
    if (el) el.hidden = v !== id;
  });
  window.scrollTo(0, 0);
}

/** Màu mực mặc định suy ra từ tên -> mỗi người một màu, không cần lưu thêm. */
function hueFromName(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return WISH_HUES[h % WISH_HUES.length];
}

/** Ruột của vòng tròn con dấu: ảnh sticker, emoji, hoặc chữ cái đầu của tên. */
function sealContent(wish) {
  const icon = wish.icon || {};

  if (icon.type === 'sticker' && icon.value) {
    const img = document.createElement('img');
    img.src = CONFIG.stickerDir + icon.value;
    img.alt = '';
    return img;
  }

  const span = document.createElement('span');
  span.className = 'seal__emoji';
  span.textContent = icon.value || (wish.name || '?').trim().charAt(0).toUpperCase();
  return span;
}

function sealNode(wish, tilt = -3) {
  const seal = document.createElement('span');
  seal.className = 'stamp__seal';
  seal.style.setProperty('--hue', wish.hue ?? hueFromName(wish.name));
  seal.style.setProperty('--tilt', tilt + 'deg');
  seal.appendChild(sealContent(wish));
  return seal;
}

/** Vẽ lưới con dấu ở trang chủ — 3 người một dòng (grid trong style.css). */
function renderStamps() {
  const list = $('#stampList');
  const empty = $('#wishEmpty');
  if (!list) return;

  list.textContent = '';
  if (empty) empty.hidden = wishList.length > 0;

  wishList.forEach((wish, i) => {
    const li = document.createElement('li');
    li.className = 'stamp';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'stamp__btn';

    const name = document.createElement('span');
    name.className = 'stamp__name';
    name.textContent = wish.name || 'Ẩn danh';

    btn.appendChild(sealNode(wish, ((i % 5) - 2) * 2.6));
    btn.appendChild(name);
    btn.addEventListener('click', () => showOneWish(wish));

    li.appendChild(btn);
    list.appendChild(li);
  });
}

async function refreshWishes() {
  wishList = await loadWishes();
  renderStamps();
}

/** Mở trang lời chúc của một người. */
function showOneWish(wish) {
  const box = $('#noteBox');
  if (!box) return;
  box.textContent = '';

  const head = document.createElement('div');
  head.className = 'note__head';

  const seal = sealNode(wish, -4);
  seal.classList.add('note__seal');

  const who = document.createElement('div');
  who.className = 'note__who';

  const name = document.createElement('p');
  name.className = 'note__name';
  name.textContent = wish.name || 'Ẩn danh';
  who.appendChild(name);

  if (wish.at) {
    const date = document.createElement('p');
    date.className = 'note__date';
    const d = new Date(wish.at);
    if (!isNaN(d)) date.textContent = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    who.appendChild(date);
  }

  head.appendChild(seal);
  head.appendChild(who);

  const text = document.createElement('div');
  text.className = 'note__text font--' + (wish.font || 'tay');
  text.textContent = wish.text || '';

  box.appendChild(head);
  box.appendChild(text);

  const files = (wish.stickers || []).filter(Boolean);
  if (files.length) {
    const row = document.createElement('div');
    row.className = 'note__stickers';
    files.forEach((file) => {
      const img = document.createElement('img');
      img.src = CONFIG.stickerDir + file;
      img.alt = '';
      img.addEventListener('error', () => img.remove());
      row.appendChild(img);
    });
    box.appendChild(row);
  }

  showWishView('wishOne');
}

/* --------------------------------------------------------------------------
   3e. Trang viết lời chúc
   -------------------------------------------------------------------------- */
/** Nút chọn (icon / sticker / màu / kiểu chữ) — kiểu bấm là tích, bấm lại là bỏ. */
function pickButton({ className, label, onPick, content }) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = className;
  btn.setAttribute('aria-pressed', 'false');
  if (label) btn.setAttribute('aria-label', label);
  if (content) btn.appendChild(content);
  btn.addEventListener('click', () => onPick(btn));
  return btn;
}

function setPressed(group, chosen) {
  [...group.children].forEach((b) => b.setAttribute('aria-pressed', String(b === chosen)));
}

/** Vòng tròn xem trước con dấu ở trang viết — đổi theo icon / màu / tên đang chọn. */
function renderSealPreview() {
  const box = $('#sealPrev');
  if (!box) return;
  box.textContent = '';
  box.appendChild(sealNode({
    name: $('#wishName')?.value || '',
    icon: draft.icon,
    hue: draft.hue,
  }, -4));
}

function buildIconPicker() {
  const grid = $('#iconGrid');
  if (!grid) return;
  grid.textContent = '';

  const items = [
    ...stickerFiles.map((file) => ({ type: 'sticker', value: file })),
    ...WISH_EMOJIS.map((e) => ({ type: 'emoji', value: e })),
  ];

  items.forEach((icon, i) => {
    let content;
    if (icon.type === 'sticker') {
      content = document.createElement('img');
      content.src = CONFIG.stickerDir + icon.value;
      content.alt = '';
    } else {
      content = document.createTextNode(icon.value);
    }

    const btn = pickButton({
      className: 'pick',
      label: icon.type === 'sticker' ? 'Sticker ' + icon.value : icon.value,
      content: icon.type === 'sticker' ? content : undefined,
      onPick: (b) => { draft.icon = icon; setPressed(grid, b); renderSealPreview(); },
    });

    if (icon.type === 'emoji') btn.textContent = icon.value;
    grid.appendChild(btn);

    if (i === 0) { draft.icon = icon; btn.setAttribute('aria-pressed', 'true'); }
  });

  renderSealPreview();
}

function buildHuePicker() {
  const row = $('#hueRow');
  if (!row) return;
  row.textContent = '';

  WISH_HUES.forEach((hue, i) => {
    const btn = pickButton({
      className: 'hue',
      label: 'Màu mực ' + (i + 1),
      onPick: (b) => { draft.hue = hue; setPressed(row, b); renderSealPreview(); },
    });
    btn.style.setProperty('--hue', hue);
    if (i === 0) btn.setAttribute('aria-pressed', 'true');
    row.appendChild(btn);
  });
}

function buildFontPicker() {
  const row = $('#fontRow');
  const area = $('#wishText');
  if (!row) return;
  row.textContent = '';

  WISH_FONTS.forEach((font) => {
    const btn = pickButton({
      className: 'fontpick fontpick--' + font.id,
      onPick: (b) => {
        draft.font = font.id;
        setPressed(row, b);
        if (area) area.className = 'field__area font--' + font.id;
      },
    });
    btn.textContent = font.label;
    if (font.id === draft.font) btn.setAttribute('aria-pressed', 'true');
    row.appendChild(btn);
  });
}

function buildStickerPicker() {
  const field = $('#stickerField');
  const grid = $('#stickerGrid');
  const count = $('#stickerCount');
  if (!field || !grid) return;

  field.hidden = stickerFiles.length === 0;   // chưa có ảnh thì ẩn hẳn phần này
  grid.textContent = '';
  if (count) count.textContent = `chọn tối đa ${CONFIG.maxStickers}`;

  stickerFiles.forEach((file) => {
    const img = document.createElement('img');
    img.src = CONFIG.stickerDir + file;
    img.alt = '';

    const btn = pickButton({
      className: 'pick',
      label: 'Sticker ' + file,
      content: img,
      onPick: (b) => {
        const i = draft.stickers.indexOf(file);
        if (i >= 0) draft.stickers.splice(i, 1);
        else if (draft.stickers.length < CONFIG.maxStickers) draft.stickers.push(file);
        b.setAttribute('aria-pressed', String(draft.stickers.includes(file)));
        if (count) count.textContent = `${draft.stickers.length}/${CONFIG.maxStickers}`;
      },
    });

    grid.appendChild(btn);
  });
}

function setupWishForm() {
  const form = $('#wishFormEl');
  if (!form) return;

  const nameInput = $('#wishName');
  const textArea = $('#wishText');
  const nameError = $('#wishNameError');
  const textError = $('#wishTextError');
  const status = $('#wishStatus');
  const submitBtn = $('#wishSubmit');

  buildIconPicker();
  buildHuePicker();
  buildFontPicker();
  buildStickerPicker();

  textArea.className = 'field__area font--' + draft.font;

  nameInput.addEventListener('input', () => { nameError.hidden = true; renderSealPreview(); });
  textArea.addEventListener('input', () => { textError.hidden = true; });

  $('#wishNewBtn')?.addEventListener('click', () => {
    status.textContent = '';
    status.className = 'form-status';
    showWishView('wishForm');
    nameInput.focus({ preventScroll: true });
  });

  $('#wishBackBtn')?.addEventListener('click', () => showWishView('wishHome'));
  $('#formBackBtn')?.addEventListener('click', () => showWishView('wishHome'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const text = textArea.value.trim();

    nameError.hidden = !!name;
    textError.hidden = !!text;
    if (!name) { nameInput.focus(); return; }
    if (!text) { textArea.focus(); return; }

    const wish = {
      id: 'w' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name,
      text,
      font: draft.font,
      hue: draft.hue,
      icon: draft.icon,
      stickers: [...draft.stickers],
      at: new Date().toISOString(),
    };

    submitBtn.disabled = true;
    status.className = 'form-status';
    status.textContent = 'Đang gửi…';

    try {
      await sendWish(wish);
      wishList = [wish, ...wishList.filter((w) => w.id !== wish.id)];
      renderStamps();

      form.reset();
      textArea.className = 'field__area font--' + draft.font;
      draft.stickers = [];
      buildStickerPicker();

      showOneWish(wish);
    } catch (err) {
      status.className = 'form-status is-error';
      status.textContent = 'Chưa gửi được. Bạn thử lại giúp mình nhé!';
      console.error('[WISH]', err);
    } finally {
      submitBtn.disabled = false;
    }
  });
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
      const saved = { ...answer, at: new Date().toISOString() };
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
  setupWishForm();

  // tìm sticker có sẵn rồi dựng lại phần chọn icon / sticker
  findStickers().then((files) => {
    stickerFiles = files;
    buildIconPicker();
    buildStickerPicker();
  });

  btn?.addEventListener('click', () => openInvite(gate, invite, btn));
  $('#wishBtn')?.addEventListener('click', openWish);

  // Mở thẳng thiệp, bỏ qua màn cổng: thêm #thiep vào cuối đường dẫn
  if (location.hash === '#thiep') openInvite(gate, invite, btn);
});
