/* ==========================================================================
   THIỆP MỜI TỐT NGHIỆP — TRẦN MINH QUANG
   ========================================================================== */

/** Thông tin sự kiện — sửa ở đây, các phần sau lấy theo. */
const CONFIG = {
  hostName: 'Trần Minh Quang',
  // Giờ bắt đầu (giờ VN, +07:00) — CHỜ XÁC NHẬN GIỜ CHÍNH XÁC
  startsAt: '2026-08-02T00:00:00+07:00',
  venue: 'Hội trường Nguyễn Văn Đạo, Đại học Quốc gia Hà Nội',
  address: '144 Xuân Thủy, Cầu Giấy, Hà Nội',
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  if (gate.classList.contains('is-open')) return;

  btn.disabled = true;
  gate.classList.add('is-open');

  const reveal = () => {
    gate.hidden = true;
    invite.hidden = false;
    invite.classList.add('is-in');
    document.body.classList.remove('is-locked');
    window.scrollTo(0, 0);
    invite.focus({ preventScroll: true });
  };

  if (reduceMotion) reveal();
  else setTimeout(reveal, 550);   // khớp với transition của .gate
}

/* --------------------------------------------------------------------------
   3. Khởi động
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const gate = document.getElementById('gate');
  const invite = document.getElementById('invite');
  const btn = document.getElementById('openBtn');

  spawnQuestionMarks(document.getElementById('questions'));

  btn?.addEventListener('click', () => openInvite(gate, invite, btn));

  // Mở thẳng thiệp, bỏ qua màn cổng: thêm #thiep vào cuối đường dẫn
  if (location.hash === '#thiep') openInvite(gate, invite, btn);
});
