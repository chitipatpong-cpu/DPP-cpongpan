/* ==========================================================
   Teyvat Guide — script.js
   ฟีเจอร์ทั้งหมดตอบสนองการกระทำของผู้ใช้ (คลิก / กดปุ่ม):
   1) สลับโหมดกลางวัน/กลางคืน   2) เมนู ☰ บนมือถือ
   3) ไฮไลต์เมนูตามส่วนที่กำลังดู 4) กรองชาติตามธาตุ
   5) หน้าต่างรายละเอียดชาติ     6) เครื่องคำนวณปฏิกิริยาธาตุ
   ========================================================== */
'use strict';

// ตัวช่วยสั้น ๆ สำหรับเลือก element
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));


/* ----------------------------------------------------------
   1) สลับธีม Day / Night
   เปลี่ยนค่า data-theme บน <html> แล้ว CSS จะเปลี่ยนสีทั้งหน้าเอง
   ---------------------------------------------------------- */
const root = document.documentElement;
const themeBtn = $('#theme-toggle');

function applyTheme(theme) {
  root.dataset.theme = theme;
  const isLight = theme === 'light';
  $('.theme-icon', themeBtn).textContent = isLight ? '☀️' : '🌙';
  $('.theme-label', themeBtn).textContent = isLight ? 'Celestia Dawn' : 'Day / Night';
  themeBtn.setAttribute('aria-pressed', String(isLight));
}

// จำธีมที่เลือกไว้ (ถ้าเบราว์เซอร์ไม่อนุญาต localStorage ก็ข้ามไป ไม่ error)
let savedTheme = null;
try { savedTheme = localStorage.getItem('teyvat-theme'); } catch (e) { /* ไม่เป็นไร */ }
applyTheme(savedTheme === 'light' ? 'light' : 'dark');

themeBtn.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('teyvat-theme', next); } catch (e) { /* ไม่เป็นไร */ }
});


/* ----------------------------------------------------------
   2) เมนู ☰ บนมือถือ
   ---------------------------------------------------------- */
const menuBtn = $('#menu-btn');
const drawer = $('#mobile-drawer');

function setMenu(open) {
  drawer.hidden = !open;
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.textContent = open ? '✕' : '☰';
  menuBtn.setAttribute('aria-label', open ? 'ปิดเมนูนำทาง' : 'เปิดเมนูนำทาง');
}

menuBtn.addEventListener('click', () => setMenu(drawer.hidden));
// กดลิงก์ในเมนูแล้วให้เมนูหุบเอง
$$('a', drawer).forEach(link => link.addEventListener('click', () => setMenu(false)));


/* ----------------------------------------------------------
   3) ไฮไลต์ลิงก์ในเมนูตาม section ที่กำลังอยู่บนหน้าจอ
   ---------------------------------------------------------- */
const navLinks = $$('[data-section]');

const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      const active = link.dataset.section === entry.target.id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });   // นับว่า "กำลังดู" เมื่อ section ผ่านกลางจอ

['home', 'world', 'elements'].forEach(id => spy.observe(document.getElementById(id)));


/* ----------------------------------------------------------
   4) กรองการ์ดชาติตามธาตุ
   การ์ดแต่ละใบมี data-element ปุ่มแต่ละปุ่มมี data-filter
   ถ้าตรงกัน (หรือเลือก "all") แสดง ไม่ตรงก็ซ่อน
   ---------------------------------------------------------- */
const filterButtons = $$('.filter-btn');
const nationCards = $$('.nation-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach(b => {
      const selected = b === button;
      b.classList.toggle('is-active', selected);
      b.setAttribute('aria-pressed', String(selected));
    });

    nationCards.forEach(card => {
      card.hidden = !(filter === 'all' || card.dataset.element === filter);
    });
  });
});


/* ----------------------------------------------------------
   5) หน้าต่างรายละเอียดชาติ (Modal)
   ข้อมูลเก็บเป็น object ตัวเดียว กดการ์ดแล้วเติมลงใน modal
   ---------------------------------------------------------- */
const nations = {
  mondstadt: {
    title: 'Mondstadt (มอนด์ชตัดท์)',
    element: 'Anemo (ลม)',
    archon: 'Barbatos (Venti — เทพแห่งสายลมและเสียงดนตรี)',
    concept: 'เมืองแห่งอิสรภาพ กังหันลม และบทกวี',
    lore: 'เมืองริมทะเลสาบ Cider Lake ที่หลุดพ้นจากการปกครองของจอมทรราช Decarabian จนกลายเป็นเมืองเสรี มีกองอัศวิน Knights of Favonius และกิลด์นักผจญภัยคอยดูแลความสงบ',
    landmarks: 'มหาวิหาร Favonius Cathedral, หน้าผา Starsnatch Cliff, ต้นไม้ศักดิ์สิทธิ์ Windrise',
    specialty: 'Dandelion Seed, Windwheel Aster, Philanemo Mushroom'
  },
  liyue: {
    title: 'Liyue (หลี่เยว่)',
    element: 'Geo (หิน)',
    archon: 'Morax / Rex Lapis (Zhongli — เทพแห่งหินผาและพันธสัญญา)',
    concept: 'เมืองท่าการค้า พันธสัญญา และภูผาตระหง่าน',
    lore: 'มหานครท่าเรือที่เติบโตขึ้นหลังสงคราม Archon War บริหารโดยกลุ่มผู้นำด้านการค้า Liyue Qixing และมีเหล่าเซียน Adepti คอยปกปักรักษาอยู่บนยอดเขา Jueyun Karst',
    landmarks: 'ท่าเรือ Liyue Harbor, วังลอยฟ้า Jade Chamber, เขาหินวังเซียน Jueyun Karst, เหมืองลึก The Chasm',
    specialty: 'Cor Lapis, Glaze Lily, Silk Flower, Noctilucous Jade'
  },
  inazuma: {
    title: 'Inazuma (อินาสึมะ)',
    element: 'Electro (สายฟ้า)',
    archon: 'Raiden Shogun (Ei — เทพแห่งสายฟ้านิรันดร์)',
    concept: 'หมู่เกาะแห่งนิรันดร์ ซากุระ และพายุอสุนีบาต',
    lore: 'หมู่เกาะที่เคยปิดประเทศด้วยกฎ Sakoku Decree และเรียกเก็บ Vision จากประชาชนด้วย Vision Hunt Decree ก่อนจะเปลี่ยนแปลงครั้งใหญ่ ปัจจุบันบริหารโดย Shogunate ผ่านองค์กรไตรกรรมาธิการ Tri-Commission',
    landmarks: 'พระราชวัง Tenshukaku, ศาลเจ้า Grand Narukami Shrine, ป่าศักดิ์สิทธิ์ Chinju Forest, เตาหลอม Tatarasuna',
    specialty: 'Naku Weed, Sakura Bloom, Sea Ganoderma, Onikabuto'
  },
  sumeru: {
    title: 'Sumeru (สุเมรุ)',
    element: 'Dendro (พืช)',
    archon: 'Lesser Lord Kusanali (Nahida — เทพแห่งปัญญา)',
    concept: 'ป่าฝนเขียวขจี สถาบันวิชาการ และทะเลทรายสีทอง',
    lore: 'ศูนย์กลางความรู้ที่เชื่อมป่าฝนเข้ากับทะเลทราย เป็นที่ตั้งของสถาบัน Sumeru Akademiya และผูกพันกับต้นไม้แห่งโลก Irminsul ผู้ปกครองคือ Nahida เทพแห่งปัญญา',
    landmarks: 'Sumeru City, สถาบัน Akademiya, ป่า Avidya Forest, สุสาน Mausoleum of King Deshret',
    specialty: 'Kalpalata Lotus, Nilotpala Lotus, Rukkhashava Mushrooms, Padisarah'
  },
  fontaine: {
    title: 'Fontaine (ฟอนเทน)',
    element: 'Hydro (น้ำ)',
    archon: 'Focalors (Furina) และ Neuvillette (ผู้พิพากษาสูงสุด)',
    concept: 'นครแห่งการตัดสิน โรงอุปรากร และเทคโนโลยีพลังงานน้ำ',
    lore: 'มหานครแห่งศิลปะและกฎหมาย ที่ผู้คนนิยมชมการพิจารณาคดีเหมือนชมละครเวที บ้านเมืองเต็มไปด้วยน้ำตกและเครื่องจักรกลที่ขับเคลื่อนด้วยพลังงานน้ำ',
    landmarks: 'โรงละคร Epiclese Opera House, เมือง Court of Fontaine, ป้อมปราการใต้น้ำ Fortress of Meropide',
    specialty: 'Lumidouce Bell, Rainbow Rose, Romaritime Flower, Beryl Conch'
  },
  natlan: {
    title: 'Natlan (นาตลัน)',
    element: 'Pyro (ไฟ)',
    archon: 'Mavuika (เทพแห่งสงคราม)',
    concept: 'แดนภูเขาไฟ ชนเผ่านักสู้ และการต่อสู้อันเร่าร้อน',
    lore: 'ดินแดนภูเขาไฟที่ผู้คนและ Saurians อาศัยเคียงข้างกัน แบ่งเป็น 6 ชนเผ่า ชาวนาตลันให้คุณค่ากับการประลองและความเข้มแข็ง และต้องสู้กับภัยคุกคามจาก Abyss',
    landmarks: 'ภูเขาไฟและที่ราบลาวา, ถิ่นที่อยู่ของแต่ละชนเผ่า, บ่อน้ำพุร้อน',
    specialty: 'Saurian Claw Succulent, Sprayfeather Gill, Quenepa Berry'
  },
  snezhnaya: {
    title: 'Snezhnaya (สเนซนายา)',
    element: 'Cryo (น้ำแข็ง)',
    archon: 'Tsaritsa (ราชินีแห่งน้ำแข็ง)',
    concept: 'จักรวรรดิหิมะอันหนาวเหน็บและกองกำลังฟาทุย (Fatui)',
    lore: 'มหาอำนาจทางเหนือที่ก้าวหน้าด้านเทคโนโลยีและการทหาร เป็นฐานของ Fatui และเหล่า Harbingers ผู้รวบรวม Gnosis ของเทพเจ้าต่าง ๆ เพื่อเป้าหมายที่ท้าทายสวรรค์ Celestia',
    landmarks: 'พระราชวัง Zapolyarny Palace และฐานที่มั่นของ Fatui',
    specialty: 'Cryo Crystal, Fatui Insignia (ของดรอปจากศัตรู Fatui)'
  }
};

const modal = $('#nation-modal');
const modalBox = $('.modal-box', modal);
let lastFocused = null;

function openModal(key) {
  const n = nations[key];
  if (!n) return;

  // ใช้ textContent (ไม่ใช่ innerHTML) เพื่อความปลอดภัยและเข้าใจง่าย
  $('#modal-title').textContent = n.title;
  $('#modal-concept').textContent = n.concept;
  $('#modal-element').textContent = n.element;
  $('#modal-archon').textContent = n.archon;
  $('#modal-lore').textContent = n.lore;
  $('#modal-landmarks').textContent = n.landmarks;
  $('#modal-specialty').textContent = n.specialty;

  lastFocused = document.activeElement;   // จำไว้ว่าเปิดมาจากปุ่มไหน
  modal.hidden = false;
  document.body.classList.add('modal-open');
  modalBox.focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.classList.remove('modal-open');
  if (lastFocused) lastFocused.focus();   // คืนโฟกัสให้ปุ่มเดิม
}

$$('.nation-more').forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.nation)));
$('#modal-close').addEventListener('click', closeModal);
$('#modal-close-x').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });   // คลิกพื้นหลังเพื่อปิด

document.addEventListener('keydown', e => {
  if (modal.hidden) return;
  if (e.key === 'Escape') { closeModal(); return; }

  // ให้ปุ่ม Tab วนอยู่แค่ในหน้าต่าง modal
  if (e.key === 'Tab') {
    const items = $$('button', modalBox);
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === modalBox)) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }
});


/* ----------------------------------------------------------
   6) เครื่องคำนวณปฏิกิริยาธาตุ
   เก็บปฏิกิริยาเป็นตาราง โดยใช้ "คู่ธาตุเรียงตามตัวอักษร" เป็นคีย์
   เช่น pyro+hydro และ hydro+pyro ได้คีย์เดียวกันคือ "hydro+pyro"
   ---------------------------------------------------------- */
const elementNames = {
  pyro: 'Pyro (ไฟ)', hydro: 'Hydro (น้ำ)', electro: 'Electro (สายฟ้า)', cryo: 'Cryo (น้ำแข็ง)',
  anemo: 'Anemo (ลม)', geo: 'Geo (หิน)', dendro: 'Dendro (พืช)'
};

const reactions = {
  'hydro+pyro': {
    name: 'Vaporize (ระเหย)', sub: 'Amplifying Reaction (คูณดาเมจ)',
    desc: 'ดาเมจทวีคูณทันที! Pyro โจมตีเป้าหมายที่ติด Hydro ได้ x1.5 แต่ Hydro โจมตีเป้าหมายที่ติด Pyro ได้สูงถึง x2.0',
    tier: 'Synergy: S Tier', tag: 'Multiplying DMG'
  },
  'cryo+pyro': {
    name: 'Melt (ละลาย)', sub: 'Amplifying Reaction (ดาเมจละลาย)',
    desc: 'ดาเมจเพิ่มแบบก้าวกระโดด! Pyro โจมตีเป้าหมายที่ติด Cryo ได้ x2.0 ส่วน Cryo โจมตีเป้าหมายที่ติด Pyro ได้ x1.5',
    tier: 'Synergy: S Tier', tag: 'Multiplying DMG'
  },
  'electro+pyro': {
    name: 'Overloaded (โหลดเกิน)', sub: 'Transformative Reaction (ระเบิดผลักกระเด็น)',
    desc: 'เกิดการระเบิดไฟเป็นวงกว้าง (AoE Pyro DMG) ผลักศัตรูตัวเล็กให้กระเด็น และช่วยทำลายโล่ของศัตรูได้เร็ว',
    tier: 'Synergy: A Tier', tag: 'AoE Knockback DMG'
  },
  'cryo+hydro': {
    name: 'Freeze (แช่แข็ง)', sub: 'Crowd Control (หยุดการเคลื่อนไหว)',
    desc: 'ศัตรูติดสถานะ Frozen ขยับและโจมตีไม่ได้ชั่วคราว หากโดนการโจมตีหนักหรือดาบใหญ่ทุบจะเกิด Shatter (แตกกระจาย) สร้างดาเมจกายภาพเพิ่ม',
    tier: 'Synergy: S Tier', tag: 'Crowd Control'
  },
  'electro+hydro': {
    name: 'Electro-Charged (ชาร์จไฟฟ้า)', sub: 'Damage Over Time (ช็อตต่อเนื่อง)',
    desc: 'สร้างดาเมจสายฟ้าเป็นจังหวะต่อเนื่อง และกระแสไฟจะกระโดดไปหาศัตรูรอบข้างที่เปียกน้ำ ทำให้ศัตรูชะงักบ่อย',
    tier: 'Synergy: A Tier', tag: 'Chain DoT DMG'
  },
  'cryo+electro': {
    name: 'Superconduct (ตัวนำยิ่งยวด)', sub: 'Debuff (ลดการต้านทานกายภาพ)',
    desc: 'เกิดระเบิดน้ำแข็งวงกว้าง และลดความต้านทานดาเมจกายภาพของศัตรูลง 40% นาน 12 วินาที เหมาะกับตัวละครสายกายภาพ',
    tier: 'Synergy: A Tier', tag: 'Physical RES Shred (-40%)'
  },
  'dendro+pyro': {
    name: 'Burning (เผาไหม้)', sub: 'Damage Over Time (ไฟลุกไหม้)',
    desc: 'จุดไฟเผาศัตรูต่อเนื่อง สร้างดาเมจ Pyro ทีละน้อยแต่ถี่ และคงสถานะ Pyro ไว้บนศัตรูเพื่อต่อคอมโบกับธาตุอื่น',
    tier: 'Synergy: B Tier', tag: 'Rapid Pyro DoT'
  },
  'dendro+hydro': {
    name: 'Bloom (ผลิบาน)', sub: 'Dendro Core Spawning (สร้างเมล็ดพืช)',
    desc: 'สร้าง Dendro Core ตกบนพื้น ซึ่งจะระเบิดเป็นดาเมจ Dendro วงกว้างเมื่อครบเวลา ถ้าโดน Pyro จะเป็น Burgeon และถ้าโดน Electro จะเป็น Hyperbloom (ยิงจรวดติดตามศัตรู)',
    tier: 'Synergy: S Tier', tag: 'Seed Core Spawn'
  },
  'dendro+electro': {
    name: 'Quicken (เร่งโต)', sub: 'Catalyze Reaction (เพิ่มดาเมจเสริม)',
    desc: 'ศัตรูติดสถานะ Quicken แล้วถ้าโจมตีด้วย Electro ซ้ำจะเกิด Aggravate ส่วนโจมตีด้วย Dendro ซ้ำจะเกิด Spread ซึ่งเพิ่มดาเมจให้สูงขึ้นมาก',
    tier: 'Synergy: S Tier', tag: 'Flat Bonus DMG'
  }
};

// ธาตุที่ Swirl และ Crystallize ใช้ได้
const swirlable = ['pyro', 'hydro', 'electro', 'cryo'];

// ฟังก์ชันหาผลลัพธ์จากธาตุสองตัว (คืนค่าเป็น object พร้อมชนิดป้าย)
function findReaction(a, b) {
  if (a === b) {
    return {
      name: 'ไม่เกิดปฏิกิริยา (No Reaction)', sub: 'ธาตุเดียวกันไม่ทำปฏิกิริยากัน',
      desc: 'ธาตุเดียวกันไม่เกิดปฏิกิริยา แต่ถ้าทีมมีตัวละครธาตุเดียวกัน 2 ตัว จะได้บัฟพิเศษที่เรียกว่า Elemental Resonance',
      tier: 'Synergy: Neutral', tag: 'Elemental Resonance', kind: 'none'
    };
  }

  const pair = [a, b].sort();

  if (pair.includes('anemo')) {
    const partner = a === 'anemo' ? b : a;
    if (swirlable.includes(partner)) {
      return {
        name: 'Swirl (การกระจายพลัง)', sub: 'Anemo + ' + partner.toUpperCase(),
        desc: 'สายลมดูดซับธาตุ ' + partner.toUpperCase() + ' แล้วกระจายออกเป็นวงกว้าง สร้างดาเมจเพิ่ม และเมื่อใช้ร่วมกับเซ็ต Viridescent Venerer จะลดการต้านทานธาตุนั้นของศัตรูลง 40%',
        tier: 'Synergy: S Tier', tag: 'RES Shred / AoE Spread', kind: 'swirl'
      };
    }
    return {
      name: 'ไม่เกิดปฏิกิริยา (No Swirl)', sub: 'Anemo + Geo / Dendro',
      desc: 'ธาตุลม (Anemo) ไม่สามารถกระจาย Geo หรือ Dendro ได้',
      tier: 'Synergy: None', tag: 'No Synergy', kind: 'none'
    };
  }

  if (pair.includes('geo')) {
    const partner = a === 'geo' ? b : a;
    if (swirlable.includes(partner)) {
      return {
        name: 'Crystallize (ตกผลึก)', sub: 'Geo + ' + partner.toUpperCase(),
        desc: 'สร้างผลึกธาตุ ' + partner.toUpperCase() + ' หล่นลงพื้น เมื่อเดินไปเก็บจะได้โล่ป้องกันธาตุนั้น ช่วยซับความเสียหาย',
        tier: 'Synergy: A Tier', tag: 'Elemental Shielding', kind: 'good'
      };
    }
    return {
      name: 'ไม่เกิดปฏิกิริยา (No Crystallize)', sub: 'Geo + Dendro / Anemo',
      desc: 'ธาตุหิน (Geo) ไม่ทำปฏิกิริยากับ Dendro หรือ Anemo',
      tier: 'Synergy: None', tag: 'No Synergy', kind: 'none'
    };
  }

  const found = reactions[pair.join('+')];
  if (found) return Object.assign({ kind: 'good' }, found);

  return {
    name: 'ไม่มีปฏิกิริยาโดยตรง', sub: 'คู่ธาตุนี้ยังไม่ผสานกัน',
    desc: 'คู่ธาตุนี้ไม่เกิดปฏิกิริยาในระบบพื้นฐานของ Genshin Impact ลองเปลี่ยนคู่ธาตุเพื่อหาคอมโบอื่น',
    tier: 'Synergy: None', tag: 'Inactive', kind: 'none'
  };
}

// เก็บธาตุที่เลือกอยู่ตอนนี้
const chosen = { a: 'pyro', b: 'hydro' };

function renderReaction() {
  const r = findReaction(chosen.a, chosen.b);
  $('#reaction-title').textContent = r.name;
  $('#reaction-sub').textContent = r.sub;
  $('#reaction-desc').textContent = r.desc;
  $('#reaction-tag').textContent = r.tag;

  const badge = $('#reaction-badge');
  badge.textContent = r.tier;
  badge.className = 'tier tier-' + r.kind;
}

// ผูกปุ่มเลือกธาตุของทั้งสองฝั่ง (data-picker="a" และ "b")
$$('.picker').forEach(picker => {
  const side = picker.dataset.picker;
  const buttons = $$('.el-btn', picker);

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      chosen[side] = btn.dataset.element;

      buttons.forEach(b => {
        const selected = b === btn;
        b.classList.toggle('is-selected', selected);
        b.setAttribute('aria-pressed', String(selected));
      });

      $('#label-' + side).textContent = elementNames[chosen[side]];
      renderReaction();
    });
  });
});

renderReaction();