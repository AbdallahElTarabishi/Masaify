// ==========================================
// 1. إدارة بيانات الشاليهات والأدمن في LocalStorage
// ==========================================

const defaultChalets = [
  {
    id: 1,
    title: "شاليه بورتو السخنة",
    location: "العين السخنة",
    price: 2500,
    rooms: 2,
    baths: 2,
    hasPool: true,
    description: "فيو مباشر على البحر مع إمكانية الوصول إلى حمام السباحة وشاطئ خاص.",
    type: "شاليه",
    rating: "4.9",
    image: ""
  }
];

// جلب قائمة الشاليهات
function getChalets() {
  const stored = localStorage.getItem('mosaify_chalets');
  if (!stored) {
    localStorage.setItem('mosaify_chalets', JSON.stringify(defaultChalets));
    return defaultChalets;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("خطأ في قراءة بيانات الشاليهات:", e);
    return defaultChalets;
  }
}

// حفظ الشاليهات
function saveChalets(chalets) {
  localStorage.setItem('mosaify_chalets', JSON.stringify(chalets));
}

// جلب شاليه محدد برقم الـ ID
function getChaletById(id) {
  const chalets = getChalets();
  return chalets.find(c => c.id == id) || null;
}

// جلب حسابات الأدمن
function getAdmins() {
  const stored = localStorage.getItem('mosaify_admins');
  if (!stored) {
    const defaultAdmins = [{ username: "admin", password: "123" }];
    localStorage.setItem('mosaify_admins', JSON.stringify(defaultAdmins));
    return defaultAdmins;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("خطأ في قراءة بيانات الأدمن:", e);
    return [{ username: "admin", password: "123" }];
  }
}

// حفظ حسابات الأدمن
function saveAdmins(admins) {
  localStorage.setItem('mosaify_admins', JSON.stringify(admins));
}


// ==========================================
// 2. عرض الشاليهات ديناميكياً في صفحات المستخدمين
// ==========================================

function renderUserChalets(filteredList = null) {
  const gridContainer = document.querySelector('.grid-dynamic');
  if (!gridContainer) return;

  const chalets = filteredList || getChalets();
  gridContainer.innerHTML = '';

  if (chalets.length === 0) {
    gridContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding:50px 20px; color:#666; background:#fff; border-radius:12px; box-shadow: var(--shadow-1);">
        <h3 style="margin-bottom:8px;">🏖️ لا توجد شاليهات متاحة حالياً</h3>
        <p style="font-size:14px; opacity:0.8;">جرّب التفتيش بتصفية أخرى أو عد لاحقاً.</p>
      </div>`;
    return;
  }

  chalets.forEach(item => {
    const mediaContent = item.image 
      ? `<img src="${item.image}" alt="${item.title}" loading="lazy" style="width:100%; height:100%; object-fit:cover;">`
      : `<div class="initial" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#e0f2f1; font-size:40px;">🏖️</div>`;

    const poolBadge = item.hasPool 
      ? `<span style="background:#e0f7fa; color:#006064; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:bold; margin-right:5px;">🏊 بسين</span>` 
      : '';

    const cardHtml = `
      <div class="card">
        <div class="card-media" style="position:relative; height:200px; overflow:hidden; border-radius:var(--radius-md) var(--radius-md) 0 0;">
          <span class="type-badge" style="position:absolute; top:12px; right:12px; background:rgba(0,0,0,0.6); color:#fff; padding:4px 10px; border-radius:6px; font-size:12px; z-index:2;">${item.type || 'شاليه'}</span>
          ${mediaContent}
        </div>
        <div class="card-body" style="padding:16px;">
          <div class="card-title-row" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <div class="card-title" style="font-weight:bold; font-size:16px; color:var(--sea-deep);">${item.title}</div>
            <div class="card-rating" style="color:#f39c12; font-weight:bold; font-size:14px;">★ ${item.rating || '5.0'}</div>
          </div>
          <div class="card-loc" style="font-size:13px; color:#555; margin-bottom:10px;">📍 ${item.location} ${poolBadge}</div>
          
          <div class="card-meta" style="display:flex; gap:12px; font-size:12px; color:#777; margin-bottom:10px;">
            <span>🛏️ ${item.rooms || 1} غرف</span>
            <span>🚿 ${item.baths || 1} حمام</span>
          </div>

          <p style="font-size:12px; color:#666; margin:8px 0 16px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; line-height:1.5;">
            ${item.description || 'لا يوجد وصف مضاف لهذا الشاليه.'}
          </p>

          <div class="card-foot" style="display:flex; justify-content:space-between; align-items:center; border-top:1px dashed #eee; padding-top:12px;">
            <div class="price" style="font-weight:bold; color:var(--sea-deep); font-size:16px;">${Number(item.price).toLocaleString()} ج.م <small style="font-size:11px; font-weight:normal; color:#888;">/ ليلة</small></div>
            <a href="property.html?id=${item.id}" class="card-btn" style="background:var(--sea-deep); color:#fff; padding:8px 16px; border-radius:6px; text-decoration:none; font-size:13px; font-weight:bold;">التفاصيل ↗</a>
          </div>
        </div>
      </div>
    `;
    gridContainer.insertAdjacentHTML('beforeend', cardHtml);
  });
}


// ==========================================
// 3. التفاعل مع عناصر الواجهة (DOM Setup)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. تشغيل عرض الشاليهات
  renderUserChalets();
  
  // 2. اختيار وسائل الدفع في صفحة checkout
  const paymentOptions = document.querySelectorAll('.payment-option');
  paymentOptions.forEach(option => {
    option.addEventListener('click', () => {
      paymentOptions.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      
      const radio = option.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });
});