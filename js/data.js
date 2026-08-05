/* =========================================================
   data.js — قراءة وحفظ البيانات الموحدة لمشروع مصيفي
   ========================================================= */

const DEFAULT_PROPERTIES = [
  {
    id: "p1",
    title: "شاليه لؤلؤة الساحل",
    type: "شاليه",
    area: "الساحل الشمالي",
    resort: "مراسي",
    price: 3800,
    guests: 6,
    bedrooms: 2,
    bathrooms: 2,
    rating: 4.8,
    reviews: 62,
    tag: "الأكثر حجزًا",
    images: [],
    palette: ["#1F8A8C", "#0B3D3E"],
    amenities: ["إطلالة بحر مباشرة", "مسبح مشترك", "واي فاي", "تكييف", "موقف سيارات"],
    description: "شاليه هادئ على بعد خطوات من الشاطئ، تصميم داخلي بسيط ومريح، ومطبخ مجهز بالكامل."
  },
  {
    id: "p2",
    title: "فيلا أفق السخنة",
    type: "فيلا",
    area: "العين السخنة",
    resort: "لافيستا",
    price: 7200,
    guests: 10,
    bedrooms: 4,
    bathrooms: 3,
    rating: 4.9,
    reviews: 41,
    tag: "مسبح خاص",
    images: [],
    palette: ["#E96D46", "#0B3D3E"],
    amenities: ["مسبح خاص", "حديقة خاصة", "شواية خارجية", "غرفة ألعاب"],
    description: "فيلا واسعة تناسب التجمعات العائلية الكبيرة، مسبحها الخاص ومساحاتها الخارجية بتخليها اختيار مثالي."
  },
  {
    id: "p3",
    title: "شاليه رأس الحكمة",
    type: "شاليه",
    area: "رأس الحكمة",
    resort: "جولدن بيتش",
    price: 4500,
    guests: 5,
    bedrooms: 2,
    bathrooms: 1,
    rating: 4.7,
    reviews: 29,
    tag: "قريب من اللاجونا",
    images: [],
    palette: ["#1F8A8C", "#E96D46"],
    amenities: ["لاجونا خاصة", "واي فاي", "منطقة أطفال"],
    description: "استمتع بالمياه الفيروزية الهادئة في رأس الحكمة مع إقامة متميزة وخدمات متكاملة."
  }
];

/**
 * جلب جميع العقارات المتاحة من التخزين المحلي LocalStorage
 */
function getStoredProperties() {
  const stored = localStorage.getItem('mosaify_properties') || localStorage.getItem('mosaify_chalets');
  if (!stored) {
    localStorage.setItem('mosaify_properties', JSON.stringify(DEFAULT_PROPERTIES));
    return DEFAULT_PROPERTIES;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("خطأ في قراءة بيانات العقارات من LocalStorage:", e);
    return DEFAULT_PROPERTIES;
  }
}

/**
 * حفظ مصفوفة العقارات في التخزين المحلي LocalStorage
 */
function saveProperties(propsArray) {
  try {
    const dataString = JSON.stringify(propsArray);
    localStorage.setItem('mosaify_properties', dataString);
    localStorage.setItem('mosaify_chalets', dataString); // للمزامنة مع الكود القديم
  } catch (e) {
    console.error("خطأ أثناء حفظ البيانات:", e);
  }
}

/**
 * جلب بيانات عقار محدد برقم الـ ID
 */
function getPropertyById(id) {
  const props = getStoredProperties();
  return props.find((p) => String(p.id) === String(id)) || null;
}

/**
 * إضافة أو تحديث عقار
 */
function upsertProperty(propertyData) {
  const props = getStoredProperties();
  const existingIndex = props.findIndex(p => String(p.id) === String(propertyData.id));

  if (existingIndex !== -1) {
    props[existingIndex] = { ...props[existingIndex], ...propertyData };
  } else {
    if (!propertyData.id) {
      propertyData.id = "p_" + Date.now();
    }
    props.push(propertyData);
  }

  saveProperties(props);
  return propertyData;
}

/**
 * حذف عقار برقم الـ ID
 */
function deletePropertyById(id) {
  let props = getStoredProperties();
  props = props.filter(p => String(p.id) !== String(id));
  saveProperties(props);
}