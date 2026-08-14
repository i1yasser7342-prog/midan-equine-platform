export type Stable = {
  id: string; name: string; slug: string; description: string; city: string;
  district: string | null; cover_url: string | null; is_verified: boolean; rating: number;
};

export type Horse = {
  id: string; stable_id: string; name: string; slug: string; horse_type: string; breed: string;
  lineage: string | null; sex: string | null; color: string | null; training_level: string | null;
  description: string; city: string; location_label: string | null; status: string;
  featured_image_url: string | null;
};

export type Service = {
  id: string; stable_id: string; horse_id: string | null; type: string; name: string;
  description: string; duration_minutes: number | null; sessions_count: number | null;
  price_sar: number; capacity: number;
};

export const fallbackStables: Stable[] = [
  {
    id: "10000000-0000-0000-0000-000000000001", name: "إسطبل النخبة", slug: "elite-stables",
    description: "تدريب وركوب وإيواء احترافي للخيل العربية.", city: "الرياض", district: "الجنادرية",
    cover_url: "https://placehold.co/1200x800/1a2f23/f5efe0?text=%D9%85%D9%8A%D8%AF%D8%A7%D9%86",
    is_verified: true, rating: 4.9
  },
  {
    id: "10000000-0000-0000-0000-000000000002", name: "مربط الوادي", slug: "valley-stud",
    description: "تجارب فروسية هادئة ورعاية متخصصة.", city: "الطائف", district: "الهدا",
    cover_url: "https://placehold.co/1200x800/1a2f23/f5efe0?text=%D9%85%D9%8A%D8%AF%D8%A7%D9%86",
    is_verified: true, rating: 4.8
  }
];

export const fallbackHorses: Horse[] = [
  {
    id: "20000000-0000-0000-0000-000000000001", stable_id: fallbackStables[0].id, name: "شاهين",
    slug: "shaheen", horse_type: "خيل ركوب وتدريب", breed: "خيل عربي أصيل", lineage: "كحيلان",
    sex: "male", color: "أشهب", training_level: "متوسط ومتقدم",
    description: "حصان هادئ ومتزن مناسب لحصص التدريب وتجارب الركوب.", city: "الرياض",
    location_label: "إسطبل النخبة، الجنادرية", status: "available",
    featured_image_url: "https://placehold.co/900x900/2b1d12/f5efe0?text=%D8%B4%D8%A7%D9%87%D9%8A%D9%86"
  },
  {
    id: "20000000-0000-0000-0000-000000000002", stable_id: fallbackStables[0].id, name: "ريما",
    slug: "reema", horse_type: "فرس تدريب", breed: "خيل عربي أصيل", lineage: "صقلاوية",
    sex: "female", color: "كميت", training_level: "مبتدئ ومتوسط",
    description: "فرس لطيفة مناسبة للمبتدئين والأطفال تحت إشراف المدرب.", city: "الرياض",
    location_label: "إسطبل النخبة، الجنادرية", status: "available",
    featured_image_url: "https://placehold.co/900x900/33210f/f5efe0?text=%D8%B1%D9%8A%D9%85%D8%A7"
  },
  {
    id: "20000000-0000-0000-0000-000000000003", stable_id: fallbackStables[1].id, name: "برق",
    slug: "barq", horse_type: "خيل تجارب", breed: "خيل عربي", lineage: "عبيان",
    sex: "male", color: "أدهم", training_level: "متوسط",
    description: "حصان نشيط لتجارب الركوب الخارجية.", city: "الطائف",
    location_label: "مربط الوادي، الهدا", status: "available",
    featured_image_url: "https://placehold.co/1200x800/1a2f23/f5efe0?text=%D9%85%D9%8A%D8%AF%D8%A7%D9%86"
  }
];

export const fallbackServices: Service[] = [
  { id: "30000000-0000-0000-0000-000000000001", stable_id: fallbackStables[0].id, horse_id: fallbackHorses[0].id, type: "training", name: "حصة تدريب فردية", description: "تدريب فردي مع مدرب معتمد.", duration_minutes: 60, sessions_count: 1, price_sar: 180, capacity: 1 },
  { id: "30000000-0000-0000-0000-000000000002", stable_id: fallbackStables[0].id, horse_id: fallbackHorses[1].id, type: "riding_experience", name: "تجربة ركوب للمبتدئين", description: "تعريف وركوب آمن تحت الإشراف.", duration_minutes: 45, sessions_count: 1, price_sar: 140, capacity: 1 },
  { id: "30000000-0000-0000-0000-000000000003", stable_id: fallbackStables[0].id, horse_id: null, type: "monthly_subscription", name: "اشتراك 8 حصص", description: "ثماني حصص تدريبية خلال شهر.", duration_minutes: 60, sessions_count: 8, price_sar: 1100, capacity: 1 },
  { id: "30000000-0000-0000-0000-000000000004", stable_id: fallbackStables[1].id, horse_id: null, type: "boarding", name: "إيواء ورعاية شهرية", description: "سكن، تغذية، تنظيف ومتابعة يومية.", duration_minutes: null, sessions_count: null, price_sar: 2200, capacity: 1 },
  { id: "30000000-0000-0000-0000-000000000005", stable_id: fallbackStables[1].id, horse_id: fallbackHorses[2].id, type: "riding_experience", name: "تجربة ركوب في الهدا", description: "تجربة ركوب فردية بإشراف مدرب في أجواء الهدا.", duration_minutes: 60, sessions_count: 1, price_sar: 160, capacity: 1 }
];

export type Product = {
  id: string; name: string; slug: string; category: string; description: string;
  price_sar: number; image_url: string | null; in_stock: boolean; rating: number;
};

export const productCategoryLabels: Record<string, string> = {
  saddles: "سروج وعدة",
  grooming: "عناية وتنظيف",
  feed: "أعلاف ومكملات",
  apparel: "ملابس الفروسية",
  accessories: "إكسسوارات"
};

export const fallbackProducts: Product[] = [
  {
    id: "40000000-0000-0000-0000-000000000001", name: "سرج جلد طبيعي فاخر", slug: "leather-saddle",
    category: "saddles", description: "سرج جلد طبيعي مصنوع يدويًا، مريح للفارس والحصان في الرحلات الطويلة.",
    price_sar: 3200, image_url: "https://placehold.co/700x700/2b1d12/f5efe0?text=%D8%B3%D8%B1%D8%AC", in_stock: true, rating: 4.9
  },
  {
    id: "40000000-0000-0000-0000-000000000002", name: "لجام جلدي مزين", slug: "decorated-bridle",
    category: "saddles", description: "لجام جلدي بتطريز يدوي، مقاس قابل للتعديل يناسب معظم الخيول.",
    price_sar: 450, image_url: "https://placehold.co/700x700/3a2717/f5efe0?text=%D9%84%D8%AC%D8%A7%D9%85", in_stock: true, rating: 4.7
  },
  {
    id: "40000000-0000-0000-0000-000000000003", name: "طقم تنظيف وعناية شامل", slug: "grooming-kit",
    category: "grooming", description: "فرش ومشط ومقص حوافر ومستلزمات نظافة كاملة في حقيبة واحدة.",
    price_sar: 180, image_url: "https://placehold.co/700x700/1a2f23/f5efe0?text=%D8%B9%D9%86%D8%A7%D9%8A%D8%A9", in_stock: true, rating: 4.6
  },
  {
    id: "40000000-0000-0000-0000-000000000004", name: "شامبو ولمعان للخيل", slug: "horse-shampoo",
    category: "grooming", description: "شامبو مغذٍّ يمنح الفرو لمعانًا صحيًا ويحافظ على نظافة الجلد.",
    price_sar: 65, image_url: "https://placehold.co/700x700/0b5f45/f5efe0?text=%D8%B4%D8%A7%D9%85%D8%A8%D9%88", in_stock: true, rating: 4.4
  },
  {
    id: "40000000-0000-0000-0000-000000000005", name: "علف مركّز عالي الطاقة", slug: "premium-feed",
    category: "feed", description: "خليط علفي متوازن يدعم الطاقة والأداء للخيول الرياضية، كيس 25 كجم.",
    price_sar: 220, image_url: "https://placehold.co/700x700/49391f/f5efe0?text=%D8%B9%D9%84%D9%81", in_stock: true, rating: 4.8
  },
  {
    id: "40000000-0000-0000-0000-000000000006", name: "مكمل فيتامينات ومعادن", slug: "vitamin-supplement",
    category: "feed", description: "مكمل غذائي يومي يدعم المناعة وصحة المفاصل والحوافر.",
    price_sar: 140, image_url: "https://placehold.co/700x700/785d30/f5efe0?text=%D9%85%D9%83%D9%85%D9%84", in_stock: true, rating: 4.5
  },
  {
    id: "40000000-0000-0000-0000-000000000007", name: "خوذة ركوب احترافية", slug: "riding-helmet",
    category: "apparel", description: "خوذة معتمدة بمعايير السلامة الدولية مع تهوية ممتازة وتصميم خفيف.",
    price_sar: 390, image_url: "https://placehold.co/700x700/173b30/f5efe0?text=%D8%AE%D9%88%D8%B0%D8%A9", in_stock: true, rating: 4.9
  },
  {
    id: "40000000-0000-0000-0000-000000000008", name: "جزمة ركوب جلدية", slug: "riding-boots",
    category: "apparel", description: "جزمة ركوب جلدية مقاومة للماء بتصميم مريح لساعات الركوب الطويلة.",
    price_sar: 520, image_url: "https://placehold.co/700x700/062f25/f5efe0?text=%D8%AC%D8%B2%D9%85%D8%A9", in_stock: false, rating: 4.6
  },
  {
    id: "40000000-0000-0000-0000-000000000009", name: "غطاء واقٍ للحصان", slug: "horse-blanket",
    category: "accessories", description: "غطاء عازل يحمي الحصان من البرد والأمطار مع أشرطة تثبيت قوية.",
    price_sar: 310, image_url: "https://placehold.co/700x700/084c37/f5efe0?text=%D8%BA%D8%B7%D8%A7%D8%A1", in_stock: true, rating: 4.5
  },
  {
    id: "40000000-0000-0000-0000-000000000010", name: "حبل قيادة مضفر", slug: "lead-rope",
    category: "accessories", description: "حبل قيادة متين مضفر يدويًا بطول 3 أمتار مع مشبك معدني قوي.",
    price_sar: 55, image_url: "https://placehold.co/700x700/0b5f45/f5efe0?text=%D8%AD%D8%A8%D9%84", in_stock: true, rating: 4.3
  }
];
