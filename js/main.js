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
    '13.png', '14.png', '15.png', '16.png', '17.png',
  ],
  stickerDir: '/assets/images/sticker/',

  /* Nơi lưu lời chúc chung cho mọi người — CÙNG một link .../exec với rsvpEndpoint ở trên.
     Muốn dùng được thì phải dán docs/apps-script.gs vào Apps Script và Triển khai bản Mới;
     script còn bản cũ thì trang tự biết, chỉ lưu trong máy chứ không gửi lên (khỏi ghi rác).
     Để trống '' là tắt hẳn, lời chúc chỉ nằm trong máy người viết. */
  wishEndpoint: 'https://script.google.com/macros/s/AKfycbwf12iQH9UoNMvTRDDgJoZ_R2FjPfVsHwSC9DMRksgtl-bH20A6oqpadhK3S4ciAkqA/exec',

  /* Mỗi lời chúc dán được nhiều nhất mấy sticker */
  maxStickers: 5,

  /* Ảnh polaroid trôi ngang qua trang sổ lưu bút.
     Bỏ ảnh (nên là ảnh NGANG) vào assets/images/bay/ đúng tên dưới đây.
     Ảnh để nguyên khung, không bị cắt như cuộn phim.
     Thư mục còn trống thì tự lấy tạm ảnh của cuộn phim, không lỗi gì cả.
     floatGap: cách nhau bao lâu thì thả một tấm (mili giây, ngẫu nhiên trong khoảng).
     floatMax: nhiều nhất mấy tấm cùng trôi một lúc. Để floatMax: 0 là tắt hẳn. */
  floatPhotos: ['1.jpg', '2.jpg', '3.jpg'],
  floatDir: '/assets/images/bay/',
  floatGap: [4500, 9500],
  floatMax: 3,

  /* Tăng số này mỗi khi thay ảnh trong assets/images/ (sticker, cuộn phim, chữ ký).
     Ảnh được gắn thêm ?v=<số> nên trình duyệt buộc phải tải bản mới thay vì dùng bản cũ. */
  assetVersion: 4,
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

/** Đường dẫn ảnh có kèm ?v= để trình duyệt không dùng bản đã nhớ từ trước. */
function assetUrl(path) {
  return path + (path.includes('?') ? '&' : '?') + 'v=' + CONFIG.assetVersion;
}

/**
 * Thẻ <img> cho ảnh trong assets/.
 * Lỗi lần đầu thì thử lại một lần với đường dẫn khác hẳn, vì trình duyệt có thể
 * đang giữ một phản hồi 404 cũ (hồi ảnh chưa được đẩy lên) và không chịu xin lại.
 * Thử lại vẫn lỗi -> gọi onFail để chỗ gọi tự dọn, khách không thấy ô trống hay lỗi gì.
 */
function assetImg(path, onFail) {
  const img = document.createElement('img');
  img.alt = '';
  let daThuLai = false;

  img.addEventListener('error', () => {
    if (!daThuLai) {
      daThuLai = true;
      img.src = path + '?r=' + Math.random().toString(36).slice(2, 9);
      return;
    }
    if (onFail) onFail(img);
  });

  img.src = assetUrl(path);
  return img;
}

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

  // tới được thư là coi như xong phần bắt buộc -> cho hiện nút menu
  if (el.id === 'letter' || el.id === 'wish') {
    const menu = $('#menu');
    if (menu) menu.hidden = false;
  }
}

function closeScreen(el) {
  if (!el) return;
  el.hidden = true;
  el.classList.remove('is-in');
}

/* --------------------------------------------------------------------------
   3a0. Pháo giấy — bắn lúc gửi câu trả lời và lúc gửi lời chúc
   -------------------------------------------------------------------------- */
function phaoGiay(soManh = 26) {
  if (reduceMotion) return;

  const lop = document.createElement('div');
  lop.className = 'confetti';
  lop.setAttribute('aria-hidden', 'true');

  for (let i = 0; i < soManh; i++) {
    const manh = document.createElement('i');
    manh.style.setProperty('--x', rand(2, 98).toFixed(1) + '%');
    manh.style.setProperty('--hue', Math.round(rand(0, 360)));
    manh.style.setProperty('--delay', rand(0, 0.5).toFixed(2) + 's');
    manh.style.setProperty('--dur', rand(1.9, 3.3).toFixed(2) + 's');
    manh.style.setProperty('--drift', rand(-70, 70).toFixed(0) + 'px');
    manh.style.setProperty('--spin', rand(200, 900).toFixed(0) + 'deg');
    manh.style.setProperty('--w', rand(6, 11).toFixed(0) + 'px');
    manh.style.setProperty('--h', rand(9, 16).toFixed(0) + 'px');
    lop.appendChild(manh);
  }

  document.body.appendChild(lop);
  setTimeout(() => lop.remove(), 4500);
}

/* --------------------------------------------------------------------------
   3a. Nút menu tròn: nhảy qua lại giữa các trang
   -------------------------------------------------------------------------- */
const MENU_SCREENS = { invite: '#invite', letter: '#letter', wish: '#wish' };

function goToScreen(key) {
  const target = $(MENU_SCREENS[key]);
  if (!target) return;

  ['#invite', '#quiz', '#letter', '#wish'].forEach((sel) => {
    const el = $(sel);
    if (el && el !== target) closeScreen(el);
  });

  document.body.classList.remove('is-locked');
  target.classList.remove('is-out');     // thiệp từng mờ đi lúc chuyển màn
  target.hidden = true;                  // openScreen chỉ chạy khi đang ẩn
  openScreen(target);

  if (key === 'wish') {
    showWishView('wishHome');
    refreshWishes();
  } else {
    stopFloaties();
  }
}

function setupMenu() {
  const menu = $('#menu');
  const btn = $('#menuBtn');
  if (!menu || !btn) return;

  const dong = () => {
    menu.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  };

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const mo = !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', mo);
    btn.setAttribute('aria-expanded', String(mo));
  });

  menu.querySelectorAll('[data-go]').forEach((item) => {
    item.addEventListener('click', () => {
      dong();
      goToScreen(item.dataset.go);
    });
  });

  // chạm ra ngoài hoặc bấm Esc thì đóng lại
  document.addEventListener('click', (e) => { if (!menu.contains(e.target)) dong(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') dong(); });
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

      // chưa có ảnh -> để khung trống, không lỗi gì cả
      const img = assetImg(CONFIG.photoDir + file, (el) => el.remove());
      img.loading = 'lazy';
      img.addEventListener('load', () => frame.classList.remove('is-empty'));

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
let stickerFiles = CONFIG.stickers.slice();   // file nào không có thì tự bị loại khi tải
let picked = null;        // sticker đang được chọn ở khung dán
const draft = { icon: null, hue: WISH_HUES[0], font: 'tay', stickers: [] };

const clampNum = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/* --------------------------------------------------------------------------
   Sticker đã dán: mỗi cái là { file, x, y, rot, size }
   x, y, size tính theo % khung giấy -> điện thoại hay máy tính đều đúng chỗ.
   Ghi vào Google Sheet thành một ô: "file:x:y:góc:cỡ" cách nhau bằng dấu phẩy,
   ví dụ: 3.png:38:24:-8:22,5.png:72:61:6:18
   -------------------------------------------------------------------------- */
function normSticker(s, i = 0) {
  const num = (v, fallback) => {
    const n = Number(v);
    return v === '' || v === null || v === undefined || !Number.isFinite(n) ? fallback : n;
  };

  return {
    file: String(s.file || ''),
    x: clampNum(num(s.x, 26 + (i % 3) * 24), 0, 100),
    y: clampNum(num(s.y, 66 + (i % 2) * 14), 0, 100),
    rot: clampNum(num(s.rot, [-8, 7, -4, 10, 0][i % 5]), -180, 180),
    size: clampNum(num(s.size, 22), 8, 60),
  };
}

function parseStickers(value) {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : String(value).split(',');

  return raw
    .map((one, i) => {
      if (one && typeof one === 'object') return normSticker(one, i);

      const p = String(one).trim().split(':');
      if (!p[0]) return null;
      return normSticker({ file: p[0], x: p[1], y: p[2], rot: p[3], size: p[4] }, i);
    })
    .filter((s) => s && s.file);
}

function serializeStickers(items) {
  return (items || [])
    .map((s) => [s.file, Math.round(s.x), Math.round(s.y), Math.round(s.rot), Math.round(s.size)].join(':'))
    .join(',');
}

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

/* null = chưa hỏi, true = Apps Script đã có phần lời chúc, false = còn bản cũ.
   false thì KHÔNG gửi gì lên, khỏi ghi rác vào sheet "Trả lời" của quiz. */
let wishEndpointReady = null;

/** Bóc mảng lời chúc; trả null nếu endpoint trả về thứ khác (tức là script bản cũ). */
function readWishData(data) {
  const arr = Array.isArray(data) ? data : data && data.wishes;
  return Array.isArray(arr) ? arr : null;
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
  let data = null;

  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    data = await res.json();
  } catch (err) {
    console.warn('[WISH] fetch không đọc được, thử JSONP:', err);
    try {
      data = await jsonpGet(url);
    } catch (err2) {
      console.error('[WISH] không lấy được danh sách, tạm dùng dữ liệu trong máy:', err2);
    }
  }

  const arr = readWishData(data);
  if (arr) {
    wishEndpointReady = true;
    return pickWishes(arr);
  }

  if (data) {
    wishEndpointReady = false;
    console.error(
      '[WISH] Link wishEndpoint sống nhưng Apps Script còn là bản cũ (chưa có phần lời chúc).\n' +
      'Dán lại docs/apps-script.gs vào Apps Script rồi Triển khai → Quản lý bản triển khai → ✏️ → Phiên bản: Mới.'
    );
  }

  return pickWishes(readLocalWishes());
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
    stickers: serializeStickers(wish.stickers),
    at: wish.at,
  };
}

/** Lưu một lời chúc: luôn giữ trong máy, có endpoint thì gửi lên chỗ chung. */
async function sendWish(wish) {
  const all = [...readLocalWishes().filter((w) => w.id !== wish.id), wish];
  try { localStorage.setItem(WISH_KEY, JSON.stringify(all)); } catch (e) { /* bỏ qua */ }

  /* CHỈ gửi khi đã chắc chắn endpoint biết nhận lời chúc.
     Với Apps Script bản cũ, trình duyệt không đọc được phản hồi (CORS) nên ta không
     tài nào phân biệt được "script cũ" hay "mạng lỗi" -> mặc định là KHÔNG gửi,
     khỏi đẻ ra dòng rác trong sheet Trả lời của quiz. Lời chúc vẫn nằm trong máy và
     sẽ được gửi bù ở syncLocalWishes() ngay khi endpoint chạy đúng. */
  if (wishEndpointReady !== true) return;
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

/** Ảnh sticker, tải kiểu lazy (chỉ tải khi thật sự hiện ra màn hình).
    File không có thì gọi onFail để chỗ gọi tự dọn, không báo lỗi gì cho khách. */
function stickerImg(file, onFail) {
  const img = assetImg(CONFIG.stickerDir + file, onFail);
  img.loading = 'lazy';
  img.draggable = false;
  return img;
}

/* --- Chuyển qua lại giữa 3 trang con của sổ lưu bút --- */
function showWishView(id) {
  ['wishHome', 'wishOne', 'wishForm'].forEach((v) => {
    const el = $('#' + v);
    if (el) el.hidden = v !== id;
  });
  window.scrollTo(0, 0);

  // ảnh chỉ trôi ở trang chủ, lúc đang viết thì tắt cho đỡ rối mắt
  if (id === 'wishHome') startFloaties();
  else stopFloaties();
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
  const chuCai = () => {
    const span = document.createElement('span');
    span.className = 'seal__emoji';
    span.textContent = icon.value || (wish.name || '?').trim().charAt(0).toUpperCase();
    return span;
  };

  // sticker mất file (bị xoá sau khi có người dùng nó) -> hiện chữ cái đầu của tên
  if (icon.type === 'sticker' && icon.value) {
    return stickerImg(icon.value, (img) => img.replaceWith(chuCai()));
  }

  return chuCai();
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
    li.style.setProperty('--i', Math.min(i, 12));   // đóng dấu lần lượt, nhiều quá thì thôi

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
  // hiện ngay những gì có sẵn trong máy để trang không đứng chờ mạng
  wishList = pickWishes(readLocalWishes());
  renderStamps();

  wishList = await loadWishes();
  renderStamps();

  syncLocalWishes();
}

/** Gửi bù lời chúc còn kẹt trong máy (lúc viết thì endpoint chưa nhận được). */
async function syncLocalWishes() {
  if (wishEndpointReady !== true) return;

  const daCo = new Set(wishList.map((w) => w.id));
  const ket = readLocalWishes().filter((w) => w.id && !daCo.has(w.id));
  if (!ket.length) return;

  for (const wish of ket) {
    try {
      await sendWish(wish);
    } catch (err) {
      console.warn('[WISH] gửi bù chưa được:', err);
      return;
    }
  }

  console.info('[WISH] đã gửi bù ' + ket.length + ' lời chúc lưu trong máy.');
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

  box.appendChild(head);
  box.appendChild(paperBox(wish.text, wish.font, parseStickers(wish.stickers)));

  showWishView('wishOne');
}

/** Khung giấy: chữ lời chúc + lớp sticker đã dán đúng vị trí. */
function paperBox(text, font, items) {
  const box = document.createElement('div');
  box.className = 'paperbox';

  const body = document.createElement('div');
  body.className = 'paperbox__text font--' + (font || 'tay');
  body.textContent = text || '';

  const layer = document.createElement('div');
  layer.className = 'paperbox__layer';
  items.forEach((item) => layer.appendChild(stickerNode(item)));

  box.appendChild(body);
  box.appendChild(layer);
  return box;
}

function applySticker(el, item) {
  el.style.setProperty('--x', item.x + '%');
  el.style.setProperty('--y', item.y + '%');
  el.style.setProperty('--w', item.size + '%');
  el.style.setProperty('--r', item.rot + 'deg');
}

function stickerNode(item) {
  const img = stickerImg(item.file, (el) => el.remove());
  img.className = 'sticker';
  applySticker(img, item);
  return img;
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
    const btn = pickButton({
      className: 'pick',
      label: icon.type === 'sticker' ? 'Con dấu ' + icon.value : icon.value,
      onPick: (b) => { draft.icon = icon; setPressed(grid, b); renderSealPreview(); },
    });

    if (icon.type === 'sticker') btn.appendChild(stickerImg(icon.value, () => dropPick(btn)));
    else btn.textContent = icon.value;

    grid.appendChild(btn);
    if (i === 0) { draft.icon = icon; btn.setAttribute('aria-pressed', 'true'); }
  });

  renderSealPreview();
}

/** Thiếu file sticker -> bỏ ô chọn đó đi; đang chọn nó thì tự nhảy sang ô đầu còn lại. */
function dropPick(btn) {
  const grid = btn.parentElement;
  const dangChon = btn.getAttribute('aria-pressed') === 'true';

  btn.remove();
  if (dangChon && grid && grid.firstElementChild) grid.firstElementChild.click();
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
        renderPadText();
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
  if (!field || !grid) return;

  field.hidden = stickerFiles.length === 0;   // chưa có ảnh thì ẩn hẳn phần này
  grid.textContent = '';

  stickerFiles.forEach((file) => {
    const btn = pickButton({
      className: 'pick',
      label: 'Dán sticker ' + file,
      onPick: () => addSticker(file),
    });
    btn.removeAttribute('aria-pressed');       // nút "dán thêm", không phải ô tích

    btn.appendChild(stickerImg(file, () => {
      btn.remove();
      if (!grid.children.length) field.hidden = true;   // không có ảnh nào -> ẩn cả phần này
    }));

    grid.appendChild(btn);
  });

  renderPad();
}

let countTimer = 0;

function updateStickerCount(msg) {
  const el = $('#stickerCount');
  if (!el) return;
  clearTimeout(countTimer);
  el.textContent = msg || `${draft.stickers.length}/${CONFIG.maxStickers}`;
  if (msg) countTimer = setTimeout(() => updateStickerCount(), 1800);
}

function addSticker(file) {
  if (draft.stickers.length >= CONFIG.maxStickers) {
    updateStickerCount(`đủ ${CONFIG.maxStickers} cái rồi`);
    return;
  }

  const item = normSticker({ file }, draft.stickers.length);
  draft.stickers.push(item);
  picked = item;
  renderPad();
}

/** Đánh dấu sticker đang chọn — KHÔNG vẽ lại cả lớp, để không đứt tay kéo. */
function pickSticker(item) {
  picked = item;

  const layer = $('#padLayer');
  if (layer) {
    [...layer.children].forEach((el, i) => el.classList.toggle('is-picked', draft.stickers[i] === item));
  }

  const tools = $('#padTools');
  if (tools) tools.hidden = !item;
}

/** Kéo sticker bằng chuột hoặc ngón tay (pointer event dùng được cả hai). */
function dragSticker(el, item) {
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    pickSticker(item);

    const pad = $('#stickerPad').getBoundingClientRect();
    const fromX = e.clientX;
    const fromY = e.clientY;
    const atX = item.x;
    const atY = item.y;

    const move = (ev) => {
      item.x = clampNum(atX + ((ev.clientX - fromX) / pad.width) * 100, 2, 98);
      item.y = clampNum(atY + ((ev.clientY - fromY) / pad.height) * 100, 3, 97);
      applySticker(el, item);
    };

    const done = () => {
      el.removeEventListener('pointermove', move);
      try { el.releasePointerCapture(e.pointerId); } catch (err) { /* bỏ qua */ }
    };

    try { el.setPointerCapture(e.pointerId); } catch (err) { /* bỏ qua */ }
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', done, { once: true });
    el.addEventListener('pointercancel', done, { once: true });
  });
}

/** Chữ xem trước trong khung dán — gõ tới đâu thấy tới đó. */
function renderPadText() {
  const box = $('#padText');
  if (!box) return;

  const text = $('#wishText')?.value || '';
  box.className = 'paperbox__text font--' + draft.font + (text ? '' : ' is-faded');
  box.textContent = text || 'Lời chúc của bạn sẽ hiện ở đây…';
}

/** Vẽ lại khung dán: chữ + toàn bộ sticker đã dán. */
function renderPad() {
  const layer = $('#padLayer');
  if (!layer) return;

  renderPadText();
  layer.textContent = '';

  draft.stickers.forEach((item) => {
    const el = stickerNode(item);
    if (item === picked) el.classList.add('is-picked');
    dragSticker(el, item);
    layer.appendChild(el);
  });

  const tools = $('#padTools');
  if (tools) tools.hidden = !picked;
  updateStickerCount();
}

/** Nút to hơn / nhỏ đi / quay / bỏ ra cho sticker đang chọn. */
function setupPadTools() {
  $('#padTools')?.addEventListener('click', (e) => {
    const act = e.target.closest('.padtool')?.dataset.act;
    if (!act || !picked) return;

    if (act === 'bigger') picked.size = clampNum(picked.size + 4, 8, 60);
    if (act === 'smaller') picked.size = clampNum(picked.size - 4, 8, 60);
    if (act === 'rotate') picked.rot = ((picked.rot + 15 + 180) % 360) - 180;
    if (act === 'remove') {
      draft.stickers = draft.stickers.filter((s) => s !== picked);
      picked = null;
    }

    renderPad();
  });

  // bấm ra chỗ trống trong khung thì bỏ chọn
  $('#stickerPad')?.addEventListener('pointerdown', (e) => {
    if (e.target.classList.contains('sticker')) return;
    pickSticker(null);
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
  setupPadTools();

  textArea.className = 'field__area font--' + draft.font;

  nameInput.addEventListener('input', () => { nameError.hidden = true; renderSealPreview(); });
  textArea.addEventListener('input', () => { textError.hidden = true; renderPadText(); });

  $('#wishNewBtn')?.addEventListener('click', () => {
    status.textContent = '';
    status.className = 'form-status';
    showWishView('wishForm');
    renderPad();
    nameInput.focus({ preventScroll: true });
  });

  // quay về trang chủ thì tải lại danh sách: thấy lời chúc mới của người khác,
  // đồng thời là dịp gửi bù mấy lời chúc còn kẹt trong máy
  const veTrangChu = () => {
    showWishView('wishHome');
    refreshWishes();
  };

  $('#wishBackBtn')?.addEventListener('click', veTrangChu);
  $('#formBackBtn')?.addEventListener('click', veTrangChu);

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
      stickers: draft.stickers.map((s) => ({ ...s })),
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
      picked = null;
      renderPad();

      showOneWish(wish);
      phaoGiay(20);
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
   3f. Ảnh polaroid trôi ngang qua sổ lưu bút (chỉ để trang trí)
   -------------------------------------------------------------------------- */
const rand = (min, max) => min + Math.random() * (max - min);
let floatTimer = 0;
let floatFiles = null;        // danh sách ảnh đang dùng, tự rút bớt nếu thiếu file

/** Ảnh trong assets/images/bay/; chưa có tấm nào thì tạm mượn ảnh cuộn phim. */
function anhCuonPhim() {
  return CONFIG.photos.map((f) => CONFIG.photoDir + f);
}

function floatList() {
  if (!floatFiles) {
    floatFiles = (CONFIG.floatPhotos || []).map((f) => CONFIG.floatDir + f);
    if (!floatFiles.length) floatFiles = anhCuonPhim();
  }
  return floatFiles;
}

function spawnFloatie(layer) {
  if (layer.children.length >= CONFIG.floatMax) return;

  const ds = floatList();
  if (!ds.length) return;

  const rong = layer.clientWidth;
  const co = Math.round(rand(112, 168));
  const sangPhai = Math.random() < 0.5;

  const el = document.createElement('div');
  el.className = 'floatie';
  el.style.setProperty('--w', co + 'px');
  el.style.setProperty('--top', rand(6, 74).toFixed(1) + '%');
  el.style.setProperty('--dur', rand(17, 27).toFixed(1) + 's');
  el.style.setProperty('--tilt', rand(-9, 9).toFixed(1) + 'deg');
  // trôi hết bề ngang khung rồi mới biến mất, lúc sang phải lúc sang trái
  el.style.setProperty('--from', (sangPhai ? -co - 30 : rong + 30) + 'px');
  el.style.setProperty('--to', (sangPhai ? rong + 30 : -co - 30) + 'px');

  const path = ds[Math.floor(Math.random() * ds.length)];
  el.appendChild(assetImg(path, () => {
    // thiếu file -> bỏ khỏi danh sách; hết sạch thì quay về mượn ảnh cuộn phim
    floatFiles = ds.filter((p) => p !== path);
    if (!floatFiles.length) floatFiles = anhCuonPhim();
    el.remove();
    spawnFloatie(layer);        // thay ngay bằng tấm khác, khỏi để trống
  }));
  el.addEventListener('animationend', () => el.remove());

  layer.appendChild(el);
}

function startFloaties() {
  const layer = $('#floaties');
  if (!layer || reduceMotion || !CONFIG.floatMax || !CONFIG.photos.length) return;
  if (floatTimer) return;                       // đang chạy rồi thì thôi

  const henTiep = () => {
    floatTimer = setTimeout(() => {
      spawnFloatie(layer);
      henTiep();
    }, rand(CONFIG.floatGap[0], CONFIG.floatGap[1]));
  };

  spawnFloatie(layer);                          // thả một tấm ngay cho đỡ trống
  henTiep();
}

function stopFloaties() {
  clearTimeout(floatTimer);
  floatTimer = 0;
  const layer = $('#floaties');
  if (layer) layer.textContent = '';
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
    phaoGiay();                        // ăn mừng vì bạn ấy vừa trả lời
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
  setupMenu();

  btn?.addEventListener('click', () => openInvite(gate, invite, btn));
  $('#wishBtn')?.addEventListener('click', openWish);

  // Mở thẳng thiệp, bỏ qua màn cổng: thêm #thiep vào cuối đường dẫn
  if (location.hash === '#thiep') openInvite(gate, invite, btn);
});
