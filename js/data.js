/* =========================================================
   data.js — مصدر البيانات الموحد لمشروع مصيفي
   جميع الصفحات تقرأ وتكتب من هنا فقط
   ========================================================= */

const STORAGE_KEY = 'mosaify_chalets';
const BOOKINGS_KEY = 'mosaify_bookings';
const ADMINS_KEY   = 'mosaify_admins';

const DEFAULT_PROPERTIES = [
  {
    id: "p1",
    title: "شاليه لؤلؤة الساحل",
    type: "شاليه",
    location: "الساحل الشمالي",
    area: "الساحل الشمالي",
    resort: "مراسي",
    price: 3800,
    guests: 6,
    rooms: 2,
    bedrooms: 2,
    baths: 2,
    bathrooms: 2,
    rating: 4.8,
    reviews: 62,
    tag: "الأكثر حجزًا",
    hasPool: true,
    images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"],
    image:  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    video: "",
    amenities: ["إطلالة بحر مباشرة", "مسبح مشترك", "واي فاي", "تكييف", "موقف سيارات"],
    description: "شاليه هادئ على بعد خطوات من الشاطئ، تصميم داخلي بسيط ومريح، ومطبخ مجهز بالكامل."
  },
  {
    id: "p2",
    title: "فيلا أفق السخنة",
    type: "فيلا",
    location: "العين السخنة",
    area: "العين السخنة",
    resort: "لافيستا",
    price: 7200,
    guests: 10,
    rooms: 4,
    bedrooms: 4,
    baths: 3,
    bathrooms: 3,
    rating: 4.9,
    reviews: 41,
    tag: "مسبح خاص",
    hasPool: true,
    images: ["https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"],
    image:  "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
    video: "",
    amenities: ["مسبح خاص", "حديقة خاصة", "شواية خارجية", "غرفة ألعاب"],
    description: "فيلا واسعة تناسب التجمعات العائلية الكبيرة، مسبحها الخاص ومساحاتها الخارجية."
  },
  {
    id: "p3",
    title: "شاليه رأس الحكمة",
    type: "شاليه",
    location: "رأس الحكمة",
    area: "رأس الحكمة",
    resort: "جولدن بيتش",
    price: 4500,
    guests: 5,
    rooms: 2,
    bedrooms: 2,
    baths: 1,
    bathrooms: 1,
    rating: 4.7,
    reviews: 29,
    tag: "قريب من اللاجونا",
    hasPool: false,
    images: [],
    image: "",
    video: "",
    amenities: ["لاجونا خاصة", "واي فاي", "منطقة أطفال"],
    description: "استمتع بالمياه الفيروزية الهادئة في رأس الحكمة مع إقامة متميزة وخدمات متكاملة."
  }
];

// ==========================================
// العقارات (الشاليهات)
// ==========================================

/** جلب جميع العقارات من LocalStorage */
function getStoredProperties() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROPERTIES));
    return DEFAULT_PROPERTIES;
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PROPERTIES;
  } catch (e) {
    console.error("خطأ في قراءة بيانات العقارات:", e);
    return DEFAULT_PROPERTIES;
  }
}

/** alias مستخدم في admin.html و property.html */
function getChalets() {
  return getStoredProperties();
}

/** حفظ مصفوفة العقارات */
function saveProperties(propsArray) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(propsArray));
  } catch (e) {
    console.error("خطأ أثناء حفظ البيانات:", e);
  }
}

/** alias */
function saveChalets(arr) { saveProperties(arr); }

/** جلب عقار برقم ID */
function getPropertyById(id) {
  return getStoredProperties().find(p => String(p.id) === String(id)) || null;
}

/** alias */
function getChaletById(id) { return getPropertyById(id); }

/** إضافة أو تحديث عقار */
function upsertProperty(propertyData) {
  const props = getStoredProperties();
  const idx = props.findIndex(p => String(p.id) === String(propertyData.id));
  if (idx !== -1) {
    props[idx] = { ...props[idx], ...propertyData };
  } else {
    if (!propertyData.id) propertyData.id = "p_" + Date.now();
    props.unshift(propertyData);
  }
  saveProperties(props);
  return propertyData;
}

/** حذف عقار */
function deletePropertyById(id) {
  saveProperties(getStoredProperties().filter(p => String(p.id) !== String(id)));
}

// ==========================================
// الحجوزات
// ==========================================

/** جلب جميع الحجوزات */
function getBookings() {
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

/** حفظ الحجوزات */
function saveBookings(arr) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(arr));
}

/** إضافة حجز جديد */
function addBooking(bookingData) {
  const bookings = getBookings();
  bookings.unshift(bookingData);
  saveBookings(bookings);
}

/** تحديث حالة حجز */
function updateBookingStatus(bookingId, newStatus) {
  const bookings = getBookings();
  const idx = bookings.findIndex(b => String(b.id || b.bookingId) === String(bookingId));
  if (idx !== -1) {
    bookings[idx].status = newStatus;
    saveBookings(bookings);
  }
}

/** حذف حجز */
function deleteBookingById(bookingId) {
  saveBookings(getBookings().filter(b => String(b.id || b.bookingId) !== String(bookingId)));
}

// ==========================================
// حسابات الأدمن
// ==========================================

function getAdmins() {
  const stored = localStorage.getItem(ADMINS_KEY);
  if (!stored) {
    const defaultAdmins = [{ username: "admin", password: "123", role: "superadmin" }];
    localStorage.setItem(ADMINS_KEY, JSON.stringify(defaultAdmins));
    return defaultAdmins;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [{ username: "admin", password: "123", role: "superadmin" }];
  }
}

function saveAdmins(admins) {
  localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
}

// ==========================================
// عرض الشاليهات في صفحات المستخدمين (index.html)
// ==========================================

function renderUserChalets(filteredList) {
  const gridContainer = document.querySelector('.grid-dynamic');
  if (!gridContainer) return;

  const chalets = filteredList !== undefined ? filteredList : getStoredProperties();
  gridContainer.innerHTML = '';

  if (!chalets || chalets.length === 0) {
    gridContainer.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:50px 20px; color:rgba(255,255,255,0.5);">
        <div style="font-size:48px; margin-bottom:12px;">🏝️</div>
        <h3 style="margin-bottom:8px; color:#fff;">لا توجد شاليهات متاحة حالياً</h3>
        <p style="font-size:14px; opacity:0.8;">جرّب التفتيش بتصفية أخرى أو عد لاحقاً.</p>
      </div>`;
    return;
  }

  chalets.forEach(item => {
    const img = item.image || (item.images && item.images[0]) || '';
    const mediaContent = img
      ? `<img src="${img}" alt="${item.title}" loading="lazy" style="width:100%;height:100%;object-fit:cover;">`
      : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:rgba(0,180,216,0.1);font-size:50px;">🏖️</div>`;

    const poolBadge = item.hasPool
      ? `<span style="background:rgba(32,178,170,0.2);color:#20b2aa;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:bold;border:1px solid rgba(32,178,170,0.4);">🏊 بسين</span>`
      : '';

    gridContainer.insertAdjacentHTML('beforeend', `
      <div class="card">
        <div class="card-media">
          <span class="type-badge">${item.type || 'شاليه'}</span>
          ${mediaContent}
        </div>
        <div class="card-body">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div class="card-title">${item.title}</div>
            <div class="card-rating">★ ${item.rating || '5.0'}</div>
          </div>
          <div class="card-loc">📍 ${item.location || item.area || ''} ${poolBadge}</div>
          <div class="card-meta">
            <span>🛏️ ${item.rooms || item.bedrooms || 1} غرف</span>
            <span>🚿 ${item.baths || item.bathrooms || 1} حمام</span>
            <span>👥 ${item.guests || '—'} أفراد</span>
          </div>
          <p style="font-size:13px;color:rgba(255,255,255,0.55);margin:4px 0 12px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
            ${item.description || 'لا يوجد وصف.'}
          </p>
          <div class="card-foot">
            <div class="price">${Number(item.price).toLocaleString()} ج.م <small>/ ليلة</small></div>
            <a href="property.html?id=${item.id}" class="card-btn">التفاصيل ↗</a>
          </div>
        </div>
      </div>`);
  });
}

// ==========================================
// DOM Setup
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // تشغيل عرض الشاليهات في الصفحة الرئيسية إذا وُجد الـ container
  renderUserChalets();

  // اختيار وسائل الدفع في صفحة checkout
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
