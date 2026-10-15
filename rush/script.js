// ตารางปฏิกิริยา: คีย์คือชื่อธาตุ 2 ตัว "เรียงตามตัวอักษร" คั่นด้วย +
// ค่าคือ [ชื่อปฏิกิริยา, คำอธิบาย]
const swirl = ['Swirl (กระจายพลัง)', 'สายลมดูดซับธาตุแล้วกระจายออกเป็นวงกว้าง สร้างดาเมจเพิ่ม และถ้าใช้เซ็ต Viridescent Venerer จะลดการต้านทานธาตุนั้นของศัตรูลง 40%'];
const crystallize = ['Crystallize (ตกผลึก)', 'สร้างผลึกหล่นลงพื้น เดินไปเก็บแล้วจะได้โล่ป้องกันธาตุนั้น ช่วยซับความเสียหาย'];

const reactions = {
  'hydro+pyro':    ['Vaporize (ระเหย)', 'ดาเมจทวีคูณ! Pyro โจมตีเป้าหมายที่ติด Hydro ได้ x1.5 แต่ Hydro โจมตีเป้าหมายที่ติด Pyro ได้สูงถึง x2.0'],
  'cryo+pyro':     ['Melt (ละลาย)', 'ดาเมจทวีคูณ! Pyro โจมตีเป้าหมายที่ติด Cryo ได้ x2.0 ส่วน Cryo โจมตีเป้าหมายที่ติด Pyro ได้ x1.5'],
  'electro+pyro':  ['Overloaded (โหลดเกิน)', 'เกิดการระเบิดไฟเป็นวงกว้าง ผลักศัตรูตัวเล็กให้กระเด็น และช่วยทำลายโล่ของศัตรูได้เร็ว'],
  'cryo+hydro':    ['Freeze (แช่แข็ง)', 'ศัตรูขยับและโจมตีไม่ได้ชั่วคราว ถ้าโดนการโจมตีหนักจะเกิด Shatter สร้างดาเมจกายภาพเพิ่ม'],
  'electro+hydro': ['Electro-Charged (ชาร์จไฟฟ้า)', 'สายฟ้าช็อตเป็นจังหวะต่อเนื่อง และกระโดดไปหาศัตรูรอบข้างที่เปียกน้ำ'],
  'cryo+electro':  ['Superconduct (ตัวนำยิ่งยวด)', 'เกิดระเบิดน้ำแข็งวงกว้าง และลดความต้านทานดาเมจกายภาพของศัตรูลง 40% นาน 12 วินาที'],
  'dendro+pyro':   ['Burning (เผาไหม้)', 'จุดไฟเผาศัตรูต่อเนื่อง สร้างดาเมจ Pyro ทีละน้อยแต่ถี่'],
  'dendro+hydro':  ['Bloom (ผลิบาน)', 'สร้างเมล็ดพืชตกบนพื้น ซึ่งระเบิดเป็นดาเมจ Dendro วงกว้างเมื่อครบเวลา ถ้าโดน Electro จะกลายเป็น Hyperbloom'],
  'dendro+electro': ['Quicken (เร่งโต)', 'ศัตรูติดสถานะ Quicken แล้วโจมตีซ้ำด้วย Electro หรือ Dendro เพื่อเพิ่มดาเมจให้สูงขึ้นมาก'],

  'anemo+pyro': swirl,    'anemo+hydro': swirl,    'anemo+electro': swirl,    'anemo+cryo': swirl,
  'geo+pyro': crystallize, 'geo+hydro': crystallize, 'electro+geo': crystallize, 'cryo+geo': crystallize
};

// หา element ที่ต้องใช้
const select1 = document.getElementById('element1');
const select2 = document.getElementById('element2');
const title = document.getElementById('result-title');
const text = document.getElementById('result-text');

// อ่านธาตุที่เลือก แล้วแสดงผลลัพธ์
function showReaction() {
  const key = [select1.value, select2.value].sort().join('+');
  const reaction = reactions[key];

  if (reaction) {
    title.textContent = reaction[0];
    text.textContent = reaction[1];
  } else {
    title.textContent = 'ไม่เกิดปฏิกิริยา';
    text.textContent = 'ธาตุคู่นี้ไม่ทำปฏิกิริยากัน ลองเปลี่ยนคู่ธาตุดู';
  }
}

// เปลี่ยนตัวเลือกเมื่อไหร่ ให้คำนวณใหม่
select1.addEventListener('change', showReaction);
select2.addEventListener('change', showReaction);

showReaction();   // แสดงผลเริ่มต้นตอนเปิดหน้า

// ===== ปุ่มสลับธีม กลางวัน/กลางคืน (JS แค่เปลี่ยน data-theme ส่วนสี CSS จัดการ) =====
const themeButton = document.getElementById('theme-toggle');

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButton.textContent = theme === 'dark' ? '🌙' : '☀️';
  themeButton.setAttribute('aria-label', theme === 'dark' ? 'เปลี่ยนเป็นธีมกลางวัน' : 'เปลี่ยนเป็นธีมกลางคืน');
  try { localStorage.setItem('theme', theme); } catch (e) {}   // บางเบราว์เซอร์ไม่ให้ใช้ localStorage
}

themeButton.addEventListener('click', function () {
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});

let savedTheme = 'dark';
try { savedTheme = localStorage.getItem('theme') || 'dark'; } catch (e) {}
setTheme(savedTheme);
