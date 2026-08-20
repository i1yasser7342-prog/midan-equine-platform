import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, BadgeCheck, BarChart3, Bell, CalendarDays, Check, ChevronDown,
  Clock3, CreditCard, Dumbbell, Heart, Home, Hotel, LayoutDashboard, LockKeyhole,
  LogIn, MapPin, Menu, MessageCircle, PawPrint as Horse, Search, Settings, ShieldCheck,
  ShoppingBag, Star, TrendingUp, UserCheck, UserPlus, Users, WalletCards, X, Globe2
} from "lucide-react";
import { fallbackHorses, fallbackProducts, fallbackServices, fallbackStables, Horse as HorseType, Product, productCategoryLabels, Service, Stable } from "./data";
import { supabase, functionsBaseUrl } from "./lib/supabase";

type Route =
  | { page: "home" | "explore" | "stables" | "products" | "dashboard" | "clients" | "analytics" | "stable-site" | "integrations" | "login" | "payment-result" }
  | { page: "horse" | "book" | "stable"; slug: string };

const currentHash = () => typeof window === "undefined" ? "" : window.location.hash;

function routeFromHash(): Route {
  const raw = currentHash().replace(/^#\/?/, "");
  const value = raw.split("?")[0];
  const [page, slug] = value.split("/");
  if (page === "horse" && slug) return { page: "horse", slug };
  if (page === "book" && slug) return { page: "book", slug };
  if (page === "stable" && slug) return { page: "stable", slug };
  if (page === "explore" || page === "stables" || page === "products" || page === "dashboard" || page === "clients" || page === "analytics" || page === "stable-site" || page === "integrations" || page === "login" || page === "payment-result") return { page };
  return { page: "home" };
}

function go(path: string) {
  if (typeof window === "undefined") return;
  window.location.hash = path;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const serviceLabels: Record<string, string> = {
  training: "حصص تدريب",
  riding_experience: "ركوب وتجربة",
  monthly_subscription: "اشتراكات شهرية",
  boarding: "إيواء ورعاية"
};

const serviceIcons = {
  training: Dumbbell,
  riding_experience: Horse,
  monthly_subscription: CalendarDays,
  boarding: Hotel
};

function useMarketplaceData() {
  const [horses, setHorses] = useState<HorseType[]>(fallbackHorses);
  const [stables, setStables] = useState<Stable[]>(fallbackStables);
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      supabase.from("horses").select("*").eq("is_public", true),
      supabase.from("stables").select("*").eq("is_active", true),
      supabase.from("services").select("*").eq("is_active", true)
    ]).then(([h, s, v]) => {
      if (!mounted) return;
      if (h.error || s.error || v.error) { setOnline(false); return; }
      if (h.data?.length) setHorses(h.data as HorseType[]);
      if (s.data?.length) setStables(s.data as Stable[]);
      if (v.data?.length) setServices(v.data as Service[]);
      setOnline(true);
    }).catch(() => {
      if (mounted) setOnline(false);
    });
    return () => { mounted = false; };
  }, []);
  return { horses, stables, services, online };
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <button className="brand" onClick={() => go("/")}>صهوة<span className="brand-mark">⌁</span></button>
        <nav className={open ? "main-nav open" : "main-nav"} aria-label="التنقل الرئيسي">
          <button onClick={() => go("/explore")}>استكشف الخيل</button>
          <button onClick={() => go("/stables")}>الإسطبلات</button>
          <button onClick={() => go("/products")}>منتجات</button>
          <a href="#services">خدماتنا</a>
          <button className="mobile-login" onClick={() => go("/login")}>تسجيل الدخول</button>
        </nav>
        <div className="header-actions">
          <button className="text-button" onClick={() => go("/login")}><LogIn size={18} /> تسجيل الدخول</button>
          <button className="primary-button small" onClick={() => go("/login")}>سجّل إسطبلك</button>
          <button className="menu-button" aria-label="فتح القائمة" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
    </header>
  );
}

function StableCard({ stable, horses, services }: { stable: Stable; horses: HorseType[]; services: Service[] }) {
  const stableHorses = horses.filter((horse) => horse.stable_id === stable.id);
  const stableServices = services.filter((service) => service.stable_id === stable.id);
  return <article className="stable-card" onClick={() => go(`/stable/${stable.slug}`)}>
    <div className="stable-cover"><img src={stable.cover_url ?? ""} alt={stable.name} /><span><BadgeCheck /> موثق</span></div>
    <div className="stable-card-body">
      <div className="card-title-row"><h3>{stable.name}</h3><span><Star size={15} fill="currentColor" /> {stable.rating}</span></div>
      <p>{stable.description}</p>
      <div className="stable-meta"><span><MapPin /> {stable.district}، {stable.city}</span><span><Horse /> {stableHorses.length} خيل</span><span><Dumbbell /> {stableServices.length} خدمات</span></div>
      <button className="secondary-button full">زيارة صفحة الإسطبل <ArrowLeft /></button>
    </div>
  </article>;
}

function SearchBar({ compact = false }: { compact?: boolean }) {
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    go(`/explore?city=${encodeURIComponent(city)}&type=${encodeURIComponent(type)}`);
  };
  return (
    <form className={compact ? "search-bar compact" : "search-bar"} onSubmit={submit}>
      <label><MapPin size={21} /><span><small>المدينة</small>
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">جميع المدن</option><option>الرياض</option><option>الطائف</option><option>جدة</option>
        </select>
      </span><ChevronDown size={17} /></label>
      <label><Horse size={21} /><span><small>نوع الخدمة</small>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">جميع الخدمات</option>
          {Object.entries(serviceLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </span><ChevronDown size={17} /></label>
      <button className="primary-button search-submit"><Search size={20} /> بحث</button>
    </form>
  );
}

function HorseCard({ horse, stable, services }: { horse: HorseType; stable?: Stable; services: Service[] }) {
  const price = services.filter((s) => !s.horse_id || s.horse_id === horse.id).map((s) => Number(s.price_sar));
  return (
    <article className="horse-card" onClick={() => go(`/horse/${horse.slug}`)}>
      <div className="horse-image">
        <img src={horse.featured_image_url ?? ""} alt={`${horse.name} - ${horse.breed}`} />
        <button className="favorite" aria-label={`حفظ ${horse.name}`} onClick={(e) => e.stopPropagation()}><Heart size={19} /></button>
      </div>
      <div className="horse-card-body">
        <div className="card-title-row"><h3>{horse.name}</h3><span><Star size={15} fill="currentColor" /> {stable?.rating ?? 4.8}</span></div>
        <p>{horse.breed} · {horse.color}</p>
        <p className="location"><MapPin size={15} /> {stable?.name ?? horse.location_label}، {horse.city}</p>
        <div className="price-row"><span>ابتداءً من <strong>{price.length ? Math.min(...price) : 0} ر.س</strong></span><ArrowLeft size={18} /></div>
      </div>
    </article>
  );
}

function HomePage({ data }: { data: ReturnType<typeof useMarketplaceData> }) {
  return (
    <>
      <Header />
      <main>
        <section className="hero container">
          <div className="hero-copy">
            <h1>كل عالم الخيل،<br />في مكان واحد</h1>
            <p>اكتشف الخيل والإسطبلات والخدمات الموثوقة في أنحاء المملكة، واحجز بسهولة وأمان.</p>
            <SearchBar />
            <div className="hero-trust"><span><ShieldCheck /> إسطبلات موثقة</span><span><LockKeyhole /> دفع آمن عبر ميسر</span><span><MessageCircle /> تأكيد عبر واتساب</span></div>
          </div>
          <div className="hero-media">
            <img src={data.stables[0]?.cover_url ?? fallbackStables[0].cover_url ?? ""} alt="حصان عربي في إسطبل سعودي" />
            <div className="hero-caption"><BadgeCheck size={18} /> بيانات واضحة وحجز موثوق</div>
          </div>
        </section>

        <section className="section container">
          <div className="section-heading">
            <div><h2>خيل مميزة</h2><p>خيول متاحة للحجز من إسطبلات موثقة</p></div>
            <button className="link-button" onClick={() => go("/explore")}>عرض جميع الخيل <ArrowLeft size={18} /></button>
          </div>
          <div className="horse-grid">
            {data.horses.map((horse) => <HorseCard key={horse.id} horse={horse} stable={data.stables.find((s) => s.id === horse.stable_id)} services={data.services} />)}
          </div>
        </section>

        <section className="services-section" id="services">
          <div className="container">
            <div className="section-heading"><div><h2>اختر خدمتك</h2><p>من أول تجربة ركوب إلى الرعاية الشهرية المتكاملة</p></div></div>
            <div className="services-grid">
              {Object.entries(serviceLabels).map(([key, label]) => {
                const Icon = serviceIcons[key as keyof typeof serviceIcons];
                return <button className="service-tile" key={key} onClick={() => go(`/explore?type=${key}`)}>
                  <span className="service-icon"><Icon /></span><span><strong>{label}</strong><small>{key === "training" ? "طوّر مهارتك مع مدربين مختصين" : key === "riding_experience" ? "تجربة آمنة وممتعة" : key === "monthly_subscription" ? "باقات مرنة للالتزام والاستمرار" : "رعاية يومية لخيلك"}</small></span><ArrowLeft />
                </button>;
              })}
            </div>
          </div>
        </section>

        <section className="trust-strip container">
          <div><BadgeCheck /><strong>إسطبلات موثقة</strong><span>نتحقق من بيانات مقدم الخدمة</span></div>
          <div><LockKeyhole /><strong>حجز ودفع آمن</strong><span>التحقق يتم من الخادم قبل التأكيد</span></div>
          <div><MessageCircle /><strong>تحديثات واضحة</strong><span>تأكيد وتذكير عبر واتساب</span></div>
          <div><Users /><strong>إدارة متكاملة</strong><span>للعميل والإسطبل والمنصة</span></div>
        </section>

        <section className="management-section">
          <div className="container management-grid">
            <div className="management-copy"><span className="eyebrow">لأصحاب الإسطبلات</span><h2>شغّل مركزك من لوحة واحدة</h2><p>نظّم المواعيد والعملاء والباقات والمدفوعات، وتابع الأداء اليومي دون جداول متفرقة أو رسائل يدوية.</p>
              <div className="management-features">
                <span><CalendarDays /> جدول حجوزات موحّد</span><span><Users /> سجل عملاء واشتراكات</span><span><BarChart3 /> تقارير وإشغال وإيرادات</span><span><Globe2 /> صفحة حجز خاصة بإسطبلك</span>
              </div>
              <button className="primary-button" onClick={() => go("/login")}>ابدأ مع صهوة <ArrowLeft /></button>
            </div>
            <div className="dashboard-preview" aria-label="معاينة لوحة إدارة الإسطبل">
              <div className="preview-top"><span>أداء هذا الشهر</span><strong>إسطبل النخبة</strong></div>
              <div className="preview-kpis"><div><small>الحجوزات</small><strong>١٢٨</strong><em>+١٨٪</em></div><div><small>الإشغال</small><strong>٧٦٪</strong><em>+٩٪</em></div><div><small>الإيراد</small><strong>٣٨,٤٠٠</strong><em>ر.س</em></div></div>
              <div className="preview-chart">{[38,56,44,70,62,86,76].map((height, index) => <span key={index} style={{height: `${height}%`}} />)}</div>
              <div className="preview-caption"><span><i className="dot success" /> ٩ حجوزات مؤكدة اليوم</span><span><i className="dot pending" /> ٣ بانتظار الدفع</span></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function StablesPage({ data }: { data: ReturnType<typeof useMarketplaceData> }) {
  const [city, setCity] = useState("");
  const stables = data.stables.filter((stable) => !city || stable.city === city);
  return <><Header /><main className="stables-page container">
    <section className="directory-head"><span className="eyebrow">دليل صهوة</span><h1>إسطبلات ومراكز فروسية موثقة</h1><p>استكشف المركز المناسب، قارن خدماته، واحجز من صفحته مباشرة.</p>
      <label><MapPin /><select value={city} onChange={(event) => setCity(event.target.value)}><option value="">كل المدن</option><option>الرياض</option><option>الطائف</option><option>جدة</option></select></label>
    </section>
    <div className="stable-grid">{stables.map((stable) => <StableCard key={stable.id} stable={stable} horses={data.horses} services={data.services} />)}</div>
  </main><Footer /></>;
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.image_url ?? ""} alt={product.name} />
        {!product.in_stock && <span className="out-of-stock">غير متوفر حاليًا</span>}
      </div>
      <div className="product-card-body">
        <span className="product-category">{productCategoryLabels[product.category] ?? "منتجات"}</span>
        <div className="card-title-row"><h3>{product.name}</h3><span><Star size={15} fill="currentColor" /> {product.rating}</span></div>
        <p>{product.description}</p>
        <div className="price-row"><strong>{product.price_sar.toLocaleString("ar-SA")} ر.س</strong><button className="secondary-button small" disabled={!product.in_stock}>{product.in_stock ? "أضف للسلة" : "غير متوفر"}</button></div>
      </div>
    </article>
  );
}

function ProductsPage({ products }: { products: Product[] }) {
  const [category, setCategory] = useState("");
  const filtered = products.filter((product) => !category || product.category === category);
  return (
    <>
      <Header />
      <main className="products-page container">
        <div className="explore-top">
          <div><h1>منتجات الخيل</h1><p>عدة وسروج ومستلزمات عناية وأعلاف مختارة لخيلك.</p></div>
        </div>
        <div className="explore-layout">
          <aside className="filters">
            <div className="filter-title"><strong>تصفية حسب الفئة</strong><button onClick={() => setCategory("")}>مسح الكل</button></div>
            <label>الفئة
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">جميع الفئات</option>
                {Object.entries(productCategoryLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
              </select>
            </label>
          </aside>
          <section className="results">
            <div className="results-head"><strong>{filtered.length} منتج</strong></div>
            <div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div>
            {!filtered.length && <div className="empty-state"><ShoppingBag size={44} /><h3>لا توجد منتجات في هذه الفئة</h3><p>جرّب اختيار فئة أخرى.</p></div>}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function StablePage({ slug, data }: { slug: string; data: ReturnType<typeof useMarketplaceData> }) {
  const stable = data.stables.find((item) => item.slug === slug) ?? data.stables[0];
  const horses = data.horses.filter((horse) => horse.stable_id === stable.id);
  const services = data.services.filter((service) => service.stable_id === stable.id);
  return <><Header /><main className="stable-profile">
    <section className="stable-hero"><img src={stable.cover_url ?? ""} alt={stable.name} /><div className="stable-hero-overlay container"><span className="verified-pill"><BadgeCheck /> مركز موثق في صهوة</span><h1>{stable.name}</h1><p>{stable.description}</p><div><span><MapPin /> {stable.district}، {stable.city}</span><span><Star fill="currentColor" /> {stable.rating} تقييم العملاء</span></div></div></section>
    <div className="container stable-profile-grid">
      <section><div className="section-heading"><div><h2>الخدمات المتاحة</h2><p>أسعار ومواعيد واضحة مع تأكيد فوري بعد الدفع.</p></div></div>
        <div className="profile-service-list">{services.map((service) => <article key={service.id}><div><span>{serviceLabels[service.type] ?? "خدمة فروسية"}</span><h3>{service.name}</h3><p>{service.description}</p><small><Clock3 /> {service.duration_minutes ? `${service.duration_minutes} دقيقة` : "باقة شهرية"}</small></div><div><strong>{Number(service.price_sar).toLocaleString("ar-SA")} ر.س</strong><button className="primary-button" onClick={() => go(`/book/${horses.find((horse) => !service.horse_id || horse.id === service.horse_id)?.slug ?? horses[0]?.slug}?service=${service.id}`)}>احجز</button></div></article>)}</div>
      </section>
      <aside className="stable-contact"><BadgeCheck /><h3>حجز موثوق عبر صهوة</h3><p>الدفع عبر ميسر، تأكيد الحجز من الخادم، وتذكير الموعد عبر واتساب عند تفعيل الإسطبل للخدمة.</p><dl><div><dt>الخيل المتاحة</dt><dd>{horses.length}</dd></div><div><dt>الخدمات</dt><dd>{services.length}</dd></div><div><dt>حالة المركز</dt><dd>موثق</dd></div></dl></aside>
    </div>
    <section className="section container"><div className="section-heading"><div><h2>خيل المركز</h2><p>اختر الخيل الأنسب للخدمة ومستوى الفارس.</p></div></div><div className="horse-grid">{horses.map((horse) => <HorseCard key={horse.id} horse={horse} stable={stable} services={services} />)}</div></section>
  </main><Footer /></>;
}

function ExplorePage({ data }: { data: ReturnType<typeof useMarketplaceData> }) {
  const params = new URLSearchParams(currentHash().split("?")[1] ?? "");
  const [city, setCity] = useState(params.get("city") ?? "");
  const [type, setType] = useState(params.get("type") ?? "");
  const [breed, setBreed] = useState("");
  const filtered = useMemo(() => data.horses.filter((h) => {
    const serviceMatch = !type || data.services.some((s) => s.type === type && (!s.horse_id || s.horse_id === h.id) && s.stable_id === h.stable_id);
    return (!city || h.city === city) && (!breed || h.breed.includes(breed)) && serviceMatch;
  }), [data, city, type, breed]);
  return (
    <>
      <Header />
      <main className="explore-page container">
        <div className="explore-top"><div><h1>استكشف الخيل</h1><p>قارن الخيارات المتاحة واحجز الخدمة المناسبة لك.</p></div><SearchBar compact /></div>
        <div className="explore-layout">
          <aside className="filters">
            <div className="filter-title"><strong>تصفية النتائج</strong><button onClick={() => { setCity(""); setType(""); setBreed(""); }}>مسح الكل</button></div>
            <label>المدينة<select value={city} onChange={(e) => setCity(e.target.value)}><option value="">جميع المدن</option><option>الرياض</option><option>الطائف</option></select></label>
            <label>الخدمة<select value={type} onChange={(e) => setType(e.target.value)}><option value="">جميع الخدمات</option>{Object.entries(serviceLabels).map(([v, l]) => <option value={v} key={v}>{l}</option>)}</select></label>
            <label>السلالة<select value={breed} onChange={(e) => setBreed(e.target.value)}><option value="">جميع السلالات</option><option>عربي أصيل</option><option>عربي</option></select></label>
            <div className="filter-note"><ShieldCheck /> لا تظهر إلا الخيول والخدمات العامة والمتاحة.</div>
          </aside>
          <section className="results"><div className="results-head"><strong>{filtered.length} نتائج</strong><span>{data.online ? "بيانات مباشرة" : "عرض تجريبي"}</span></div>
            <div className="horse-grid two">{filtered.map((horse) => <HorseCard key={horse.id} horse={horse} stable={data.stables.find((s) => s.id === horse.stable_id)} services={data.services} />)}</div>
            {!filtered.length && <div className="empty-state"><Horse size={44} /><h3>لا توجد نتائج مطابقة</h3><p>جرّب تغيير المدينة أو نوع الخدمة.</p></div>}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function HorsePage({ slug, data }: { slug: string; data: ReturnType<typeof useMarketplaceData> }) {
  const horse = data.horses.find((h) => h.slug === slug) ?? data.horses[0];
  const stable = data.stables.find((s) => s.id === horse.stable_id);
  const services = data.services.filter((s) => s.stable_id === horse.stable_id && (!s.horse_id || s.horse_id === horse.id));
  return (
    <>
      <Header />
      <main className="detail-page container">
        <div className="breadcrumbs"><button onClick={() => go("/")}>الرئيسية</button><span>/</span><button onClick={() => go("/explore")}>الخيل</button><span>/</span><strong>{horse.name}</strong></div>
        <div className="detail-grid">
          <div className="detail-gallery"><img src={horse.featured_image_url ?? ""} alt={`${horse.name} ${horse.breed}`} /></div>
          <section className="detail-info">
            <div className="detail-title"><div><h1>{horse.name}</h1><p>{horse.breed} · {horse.lineage}</p></div><button className="favorite static"><Heart /></button></div>
            <div className="stable-line"><BadgeCheck size={19} /> {stable?.name}<span><Star size={15} fill="currentColor" /> {stable?.rating}</span></div>
            <p className="horse-description">{horse.description}</p>
            <dl className="horse-facts">
              <div><dt>النوع</dt><dd>{horse.horse_type}</dd></div><div><dt>السلالة</dt><dd>{horse.breed}</dd></div>
              <div><dt>الجنس</dt><dd>{horse.sex === "female" ? "أنثى" : "ذكر"}</dd></div><div><dt>اللون</dt><dd>{horse.color}</dd></div>
              <div><dt>المستوى</dt><dd>{horse.training_level}</dd></div><div><dt>الموقع</dt><dd>{horse.location_label}</dd></div>
            </dl>
            <div className="availability"><Check /> متاح للحجز الآن</div>
          </section>
        </div>
        <section className="booking-services">
          <div className="section-heading"><div><h2>الخدمات المتاحة</h2><p>اختر الخدمة ثم الموعد المناسب</p></div></div>
          <div className="service-list">
            {services.map((service) => <article key={service.id}>
              <div><h3>{service.name}</h3><p>{service.description}</p><span><Clock3 size={16} /> {service.duration_minutes ? `${service.duration_minutes} دقيقة` : "شهري"}</span></div>
              <div className="service-price"><strong>{Number(service.price_sar).toLocaleString("ar-SA")} ر.س</strong><button className="primary-button" onClick={() => go(`/book/${horse.slug}?service=${service.id}`)}>احجز الآن</button></div>
            </article>)}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

type BookingResponse = { booking_id: string; reference: string; amount_halalas: number; total_sar: number; message?: string };

function BookingPage({ slug, data }: { slug: string; data: ReturnType<typeof useMarketplaceData> }) {
  const horse = data.horses.find((h) => h.slug === slug) ?? data.horses[0];
  const available = data.services.filter((s) => s.stable_id === horse.stable_id && (!s.horse_id || s.horse_id === horse.id));
  const params = new URLSearchParams(currentHash().split("?")[1] ?? "");
  const [serviceId, setServiceId] = useState(params.get("service") ?? available[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [intent, setIntent] = useState<BookingResponse | null>(null);
  const service = available.find((s) => s.id === serviceId) ?? available[0];
  const publicKey = import.meta.env.VITE_MOYASAR_PUBLISHABLE_KEY;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(""); setLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      client_request_id: crypto.randomUUID(), service_id: service.id, horse_id: horse.id,
      customer_name: String(form.get("name")), customer_phone: String(form.get("phone")),
      customer_email: String(form.get("email") || ""), starts_at: String(form.get("starts_at")),
      notes: String(form.get("notes") || ""), website: String(form.get("website") || "")
    };
    try {
      const response = await fetch(`${functionsBaseUrl}/booking-intent`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "تعذر إنشاء الحجز");
      setIntent(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر إنشاء الحجز");
    } finally { setLoading(false); }
  }

  useEffect(() => {
    if (!intent || !publicKey) return;
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = "https://cdn.moyasar.com/mpf/1.14.0/moyasar.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://cdn.moyasar.com/mpf/1.14.0/moyasar.js";
    script.onload = () => {
      const Moyasar = (window as unknown as { Moyasar?: { init: (options: Record<string, unknown>) => void } }).Moyasar;
      Moyasar?.init({
        element: ".mysr-form", amount: intent.amount_halalas, currency: "SAR",
        description: `حجز صهوة ${intent.reference}`, publishable_api_key: publicKey,
        callback_url: `${window.location.origin}/#/payment-result?booking_id=${intent.booking_id}`,
        methods: ["creditcard", "applepay", "stcpay"],
        metadata: { booking_id: intent.booking_id, reference: intent.reference }
      });
    };
    document.body.appendChild(script);
    return () => { link.remove(); script.remove(); };
  }, [intent, publicKey]);

  return (
    <>
      <Header />
      <main className="checkout-page container">
        <div className="checkout-head"><h1>إتمام الحجز</h1><p>لن يتم تأكيد الحجز إلا بعد تحقق الخادم من عملية ميسر.</p></div>
        <div className="checkout-grid">
          <section className="checkout-form">
            {!intent ? <form onSubmit={submit}>
              <h2>بيانات الحجز</h2>
              <label>الخدمة<select value={serviceId} onChange={(e) => setServiceId(e.target.value)}>{available.map((s) => <option value={s.id} key={s.id}>{s.name} - {s.price_sar} ر.س</option>)}</select></label>
              <div className="form-row"><label>الاسم الكامل<input name="name" required minLength={2} maxLength={80} autoComplete="name" /></label><label>رقم الجوال<input name="phone" required inputMode="tel" autoComplete="tel" placeholder="05xxxxxxxx" pattern="(?:\+?966|0)?5\d{8}" /></label></div>
              <div className="form-row"><label>البريد الإلكتروني (اختياري)<input name="email" type="email" autoComplete="email" /></label><label>الموعد<input name="starts_at" type="datetime-local" required /></label></div>
              <label>ملاحظات (اختياري)<textarea name="notes" maxLength={500} /></label>
              <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              {error && <div className="error-message">{error}</div>}
              <button className="primary-button full" disabled={loading}>{loading ? "جارٍ تجهيز الحجز..." : "متابعة إلى الدفع"}</button>
              <p className="secure-note"><LockKeyhole /> بيانات البطاقة تذهب مباشرة إلى ميسر ولا تمر عبر خادم صهوة.</p>
            </form> : <div>
              <h2>الدفع الآمن</h2>
              <div className="intent-ok"><Check /> تم حجز الموعد مؤقتًا برقم {intent.reference}</div>
              {publicKey ? <div className="mysr-form" /> : <div className="integration-required"><LockKeyhole /><h3>ميسر في وضع الإعداد الآمن</h3><p>أضف المفتاح العام من إعدادات النشر، والمفتاح السري داخل Supabase Edge Function Secrets فقط، ثم اختبر بمفاتيح الاختبار قبل التفعيل.</p><button className="secondary-button" onClick={() => go("/integrations")}>فتح تعليمات الربط</button></div>}
            </div>}
          </section>
          <aside className="order-summary">
            <img src={horse.featured_image_url ?? ""} alt={horse.name} />
            <h3>{horse.name}</h3><p>{service?.name}</p>
            <div><span>قيمة الخدمة</span><strong>{Number(service?.price_sar ?? 0).toLocaleString("ar-SA")} ر.س</strong></div>
            <div><span>رسوم المنصة</span><span>تُخصم من تسوية الإسطبل</span></div>
            <div className="summary-total"><span>الإجمالي عليك</span><strong>{Number(service?.price_sar ?? 0).toLocaleString("ar-SA")} ر.س</strong></div>
            <small>تطبق سياسة الإلغاء الخاصة بالإسطبل قبل إتمام الدفع.</small>
          </aside>
        </div>
      </main>
    </>
  );
}

function PaymentResultPage() {
  const raw = window.location.hash.split("?")[1] ?? "";
  const params = new URLSearchParams(raw);
  const bookingId = params.get("booking_id");
  const paymentId = params.get("id");
  const hasPaymentReference = Boolean(bookingId && paymentId);
  const [state, setState] = useState<"loading" | "success" | "failed">(hasPaymentReference ? "loading" : "failed");
  const [message, setMessage] = useState(hasPaymentReference ? "نتحقق من العملية مباشرةً مع ميسر..." : "بيانات نتيجة الدفع غير مكتملة.");
  useEffect(() => {
    if (!bookingId || !paymentId) return;
    fetch(`${functionsBaseUrl}/verify-moyasar`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking_id: bookingId, payment_id: paymentId })
    }).then(async (response) => {
      const result = await response.json();
      if (!response.ok || !result.verified) throw new Error(result.error || "لم يتم تأكيد الدفع");
      setState("success"); setMessage(`تم تأكيد حجزك. رقم الحجز: ${result.reference}`);
    }).catch((err) => { setState("failed"); setMessage(err instanceof Error ? err.message : "تعذر التحقق من العملية"); });
  }, [bookingId, paymentId]);
  return <main className="result-page"><div className={`result-icon ${state}`}>{state === "loading" ? <Clock3 /> : state === "success" ? <Check /> : <X />}</div><h1>{state === "success" ? "تم تأكيد الحجز" : state === "failed" ? "لم يكتمل التأكيد" : "جارٍ التحقق"}</h1><p>{message}</p><button className="primary-button" onClick={() => go("/")}>العودة للرئيسية</button></main>;
}

const dashboardItems = [
  ["نظرة عامة", LayoutDashboard, "/dashboard"], ["الحجوزات", CalendarDays, "/dashboard"], ["الخيل", Horse, "/dashboard"], ["الخدمات والباقات", Dumbbell, "/dashboard"],
  ["العملاء", Users, "/clients"], ["الإيواء والرعاية", Hotel, "/dashboard"], ["التقارير", BarChart3, "/analytics"],
  ["صفحة الإسطبل", Globe2, "/stable-site"], ["التكاملات", Settings, "/integrations"]
] as const;

function DashboardShell({ active, children }: { active: string; children: React.ReactNode }) {
  return <div className="dashboard-shell"><aside className="dashboard-sidebar"><button className="brand light" onClick={() => go("/")}>صهوة<span className="brand-mark">⌁</span></button><nav>{dashboardItems.map(([label, Icon, path]) => <button className={active === label ? "active" : ""} key={label} onClick={() => go(path)}><Icon />{label}</button>)}</nav><button className="sidebar-exit" onClick={() => go("/")}><Home /> الموقع العام</button></aside><div className="dashboard-main">{children}</div></div>;
}

function DashboardPage() {
  return <DashboardShell active="نظرة عامة">
    <header className="dashboard-top"><div><h1>نظرة عامة</h1><p>آخر تحديث اليوم</p></div><div className="stable-switch"><Home /> إسطبل النخبة <ChevronDown /></div><button className="notification"><Bell /><span>3</span></button></header>
    <main className="dashboard-content">
      <div className="stats-row">
        {[["حجوزات اليوم", "12", CalendarDays], ["الخيل المتاحة", "23", Horse], ["الاشتراكات النشطة", "8", ShieldCheck], ["المستحق للصرف", "12,450 ر.س", WalletCards]].map(([label, value, Icon]) => <div className="stat" key={String(label)}><span><Icon /></span><div><p>{label as string}</p><strong>{value as string}</strong></div></div>)}
      </div>
      <div className="dashboard-columns">
        <section className="dashboard-panel bookings-panel"><div className="panel-head"><div><h2>جدول الحجوزات اليوم</h2><p>الحجوزات المؤكدة وقيد الدفع</p></div><button className="secondary-button">عرض جميع الحجوزات</button></div>
          <div className="table-wrap"><table><thead><tr><th>الوقت</th><th>العميل</th><th>الخيل</th><th>الخدمة</th><th>المبلغ</th><th>الحالة</th></tr></thead><tbody>
            {[["08:00 ص","فهد العتيبي","شاهين","تدريب","420 ر.س","مؤكد"],["09:30 ص","سعد المطيري","برق","ركوب","300 ر.س","بانتظار الدفع"],["11:00 ص","نورة الشهري","ريما","اشتراك","600 ر.س","مؤكد"],["01:00 م","منصور الحربي","نجم","تدريب","250 ر.س","بانتظار التأكيد"]].map((row) => <tr key={row[0]}>{row.map((cell, i) => <td key={cell}><span className={i === 5 ? (cell === "مؤكد" ? "status success" : "status pending") : ""}>{cell}</span></td>)}</tr>)}
          </tbody></table></div>
          <div className="quick-actions"><button className="primary-button"><CalendarDays /> إضافة حجز</button><button className="sand-button"><Horse /> إضافة خيل</button></div>
        </section>
        <aside className="dashboard-side">
          <section className="dashboard-panel"><div className="panel-head"><div><h2>تنبيهات الرعاية</h2><p>المهام القادمة للخيل</p></div></div><div className="care-list">
            {[["جرعة لقاح - إنفلونزا الخيل","شاهين","اليوم 10:00 ص"],["تقليم حوافر","برق","غدًا 09:00 ص"],["فحص بيطري دوري","ريما","2 أغسطس"]].map((item) => <div key={item[0]}><Bell /><span><strong>{item[0]}</strong><small>{item[1]}</small></span><time>{item[2]}</time></div>)}
          </div></section>
          <section className="dashboard-panel payout"><div className="panel-head"><div><h2>ملخص المستحق للصرف</h2><p>التسوية الحالية</p></div></div><dl><div><dt>إجمالي العمليات الناجحة</dt><dd>16,800 ر.س</dd></div><div><dt>رسوم المنصة (10 ر.س لكل عملية)</dt><dd>-120 ر.س</dd></div><div><dt>رسوم بوابة الدفع</dt><dd>-228 ر.س</dd></div><div className="payout-total"><dt>المستحق</dt><dd>12,450 ر.س</dd></div></dl><button className="secondary-button full">عرض تقرير التسوية</button></section>
        </aside>
      </div>
    </main>
  </DashboardShell>;
}

const demoClients = [
  { name: "فهد العتيبي", phone: "05••• 4120", plan: "8 حصص تدريب", visits: 14, value: "2,740 ر.س", status: "نشط" },
  { name: "نورة الشهري", phone: "05••• 8731", plan: "اشتراك شهري", visits: 9, value: "1,980 ر.س", status: "نشط" },
  { name: "سعد المطيري", phone: "05••• 2284", plan: "تجارب ركوب", visits: 3, value: "620 ر.س", status: "جديد" },
  { name: "منصور الحربي", phone: "05••• 9045", plan: "حصة فردية", visits: 7, value: "1,260 ر.س", status: "يحتاج تجديد" }
];

function ClientsPage() {
  const [query, setQuery] = useState("");
  const clients = demoClients.filter((client) => client.name.includes(query) || client.phone.includes(query));
  return <DashboardShell active="العملاء"><header className="dashboard-top"><div><h1>العملاء</h1><p>سجل موحّد للحجوزات والاشتراكات والتواصل</p></div><button className="primary-button"><UserPlus /> إضافة عميل</button></header><main className="dashboard-content">
    <div className="stats-row client-stats">{[["إجمالي العملاء","248",Users],["عملاء نشطون","186",UserCheck],["عملاء جدد","24",TrendingUp],["تجديدات قريبة","17",CalendarDays]].map(([label,value,Icon]) => <div className="stat" key={String(label)}><span><Icon /></span><div><p>{label as string}</p><strong>{value as string}</strong></div></div>)}</div>
    <section className="dashboard-panel clients-panel"><div className="panel-head"><div><h2>سجل العملاء</h2><p>تظهر بيانات التواصل مخفية جزئيًا وفق الصلاحية.</p></div><label className="table-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث بالاسم أو الجوال" /></label></div>
      <div className="table-wrap"><table><thead><tr><th>العميل</th><th>الجوال</th><th>الباقة الحالية</th><th>الزيارات</th><th>إجمالي القيمة</th><th>الحالة</th></tr></thead><tbody>{clients.map((client) => <tr key={client.name}><td><strong>{client.name}</strong></td><td>{client.phone}</td><td>{client.plan}</td><td>{client.visits}</td><td>{client.value}</td><td><span className={client.status === "نشط" ? "status success" : client.status === "جديد" ? "status neutral" : "status pending"}>{client.status}</span></td></tr>)}</tbody></table></div>
    </section>
  </main></DashboardShell>;
}

function AnalyticsPage() {
  const revenue = [48,61,55,72,68,84,92,78,95,88,100,94];
  return <DashboardShell active="التقارير"><header className="dashboard-top"><div><h1>التقارير والتحليلات</h1><p>قرارات أوضح من بيانات الحجز والإشغال والإيراد</p></div><button className="secondary-button">تصدير التقرير</button></header><main className="dashboard-content">
    <div className="stats-row">{[["الإيرادات","38,400 ر.س","+18%"],["نسبة الإشغال","76%","+9%"],["متوسط الحجز","300 ر.س","+4%"],["عدم الحضور","3.2%","-2%"]].map(([label,value,trend]) => <div className="metric-card" key={label}><p>{label}</p><strong>{value}</strong><span>{trend} عن الشهر السابق</span></div>)}</div>
    <div className="analytics-grid"><section className="dashboard-panel chart-panel"><div className="panel-head"><div><h2>الإيرادات الشهرية</h2><p>قيمة العمليات الناجحة بعد التحقق</p></div><span className="status success">نمو 18%</span></div><div className="revenue-chart">{revenue.map((height,index) => <div key={index}><span style={{height:`${height}%`}} /><small>{["ينا","فبر","مار","أبر","ماي","يون","يول","أغس","سبت","أكت","نوف","ديس"][index]}</small></div>)}</div></section>
      <section className="dashboard-panel occupancy-panel"><div className="panel-head"><div><h2>الإشغال حسب الخدمة</h2><p>الطاقة المحجوزة من المتاح</p></div></div>{[["التدريب الفردي",86],["تجارب الركوب",72],["الاشتراكات",64],["الإيواء",91]].map(([label,value]) => <div className="occupancy-row" key={String(label)}><div><span>{label}</span><strong>{value}%</strong></div><div><i style={{width:`${value}%`}} /></div></div>)}</section>
    </div>
    <section className="dashboard-panel insight-strip"><TrendingUp /><div><strong>فرصة نمو واضحة</strong><p>ترتفع طلبات تجارب الركوب مساء الخميس؛ إضافة موعدين قد ترفع إشغال الخدمة بنحو 12% وفق نمط الحجوزات المعروض.</p></div></section>
  </main></DashboardShell>;
}

function StableSitePage() {
  return <DashboardShell active="صفحة الإسطبل"><header className="dashboard-top"><div><h1>صفحة الإسطبل</h1><p>واجهة حجز احترافية قابلة للمشاركة مع عملائك</p></div><button className="primary-button" onClick={() => go("/stable/elite-stables")}><Globe2 /> فتح الصفحة</button></header><main className="dashboard-content site-settings">
    <section className="dashboard-panel site-preview-card"><div className="site-mini-browser"><div><i /><i /><i /><span>midan.sa/elite-stables</span></div><img src="https://placehold.co/1200x800/1a2f23/f5efe0?text=%D9%85%D9%8A%D8%AF%D8%A7%D9%86" alt="معاينة صفحة إسطبل النخبة" /><section><span><BadgeCheck /> مركز موثق</span><h2>إسطبل النخبة</h2><p>تدريب وركوب وإيواء احترافي للخيل العربية.</p><button>احجز الآن</button></section></div></section>
    <aside className="dashboard-panel settings-list"><div className="panel-head"><div><h2>جاهزية الصفحة</h2><p>حدّث بياناتك ليظهر المركز بأفضل صورة.</p></div></div>{[["هوية المركز ووصفه","مكتمل",Check],["الخدمات والأسعار","4 خدمات",Dumbbell],["الصور والخيل","3 خيول",Horse],["رابط الحجز","نشط",Globe2],["العربية والإنجليزية","العربية نشطة",Globe2]].map(([label,value,Icon]) => <div className="setting-row" key={String(label)}><span><Icon /></span><div><strong>{label as string}</strong><small>{value as string}</small></div><ArrowLeft /></div>)}</aside>
  </main></DashboardShell>;
}

function IntegrationsPage() {
  return <DashboardShell active="التكاملات"><header className="dashboard-top"><div><h1>التكاملات</h1><p>ربط الخدمات دون كشف المفاتيح داخل الواجهة أو المستودع</p></div></header><main className="dashboard-content integrations">
    <section className="integration-card"><div className="integration-logo moyasar"><CreditCard /></div><div className="integration-body"><div className="integration-title"><div><h2>ميسر للمدفوعات</h2><p>مدى، Apple Pay والبطاقات</p></div><span className="status pending">بانتظار المفاتيح</span></div><ul><li><Check /> المفتاح العام يوضع في متغير النشر فقط.</li><li><Check /> المفتاح السري وسر webhook داخل Supabase Edge Function Secrets فقط.</li><li><Check /> تأكيد الحجز يتطلب تحقق الحالة والمبلغ والعملة من الخادم.</li><li><Check /> منع التكرار وسجل webhook غير متاح للعملاء.</li></ul><div className="integration-actions"><a className="primary-button" href="https://dashboard.moyasar.com/" target="_blank" rel="noreferrer">فتح لوحة ميسر</a><button className="secondary-button">اختبار الاتصال</button></div></div></section>
    <section className="integration-card"><div className="integration-logo whatsapp"><MessageCircle /></div><div className="integration-body"><div className="integration-title"><div><h2>واتساب للأعمال</h2><p>تأكيد الحجز والتذكير والتجديد</p></div><span className="status neutral">غير متصل</span></div><ul><li><Check /> قوالب رسائل معتمدة فقط.</li><li><Check /> أقل قدر من بيانات العميل في الرسالة.</li><li><Check /> تسجيل الإرسال دون حفظ محتوى حساس.</li></ul><div className="integration-actions"><button className="secondary-button">إعداد الربط لاحقًا</button></div></div></section>
    <aside className="security-callout"><ShieldCheck /><div><h3>سياسة المفاتيح</h3><p>لا تُكتب مفاتيح ميسر أو واتساب في المحادثة أو ملفات البيئة المحلية أو GitHub. يتم إدخالها من لوحات المزود وSupabase Edge Function Secrets فقط مع تدويرها عند أي اشتباه.</p></div></aside>
  </main></DashboardShell>;
}

function useSession() {
  const [session, setSession] = useState<Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"] | null>(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setChecked(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => sub.subscription.unsubscribe();
  }, []);
  return { session, checked };
}

// Dashboard/clients/analytics/stable-site/integrations show operator-only
// data. This gate only hides the UI from signed-out visitors; once real
// per-stable data is wired in, every query must also be scoped server-side
// (RLS keyed on the owning stable, not just auth.uid() presence).
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, checked } = useSession();
  useEffect(() => {
    if (checked && !session) go("/login");
  }, [checked, session]);
  if (!checked) return <main className="auth-loading"><p>جارٍ التحقق من الجلسة...</p></main>;
  if (!session) return null;
  return <>{children}</>;
}

function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setMessage("");
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email")); const password = String(form.get("password"));
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) throw error;
        go("/dashboard");
      } else {
        const fullName = String(form.get("name") || "");
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: fullName ? { full_name: fullName } : undefined }
        });
        setLoading(false);
        if (error) throw error;
        setMessage("تم إنشاء الحساب. تحقق من بريدك لتأكيده.");
      }
    } catch (err) {
      setLoading(false);
      setMessage(err instanceof Error ? err.message : "تعذر التحقق من الحساب.");
    }
  }
  return <main className="auth-page"><button className="brand auth-brand" onClick={() => go("/")}>صهوة<span className="brand-mark">⌁</span></button><section className="auth-card"><div className="auth-icon"><Horse /></div><h1>{mode === "login" ? "مرحبًا بعودتك" : "إنشاء حساب"}</h1><p>{mode === "login" ? "ادخل لإدارة حجوزاتك أو إسطبلك" : "تابع حجوزاتك واشتراكاتك في مكان واحد"}</p><form onSubmit={submit}>{mode === "signup" && <label>الاسم الكامل<input name="name" required autoComplete="name" /></label>}<label>البريد الإلكتروني<input type="email" name="email" required autoComplete="email" /></label><label>كلمة المرور<input type="password" name="password" required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>{message && <div className={message.startsWith("تم") ? "success-message" : "error-message"}>{message}</div>}<button className="primary-button full" disabled={loading}>{loading ? "جارٍ التحقق..." : mode === "login" ? "تسجيل الدخول" : "إنشاء الحساب"}</button></form><button className="auth-switch" onClick={() => setMode(mode === "login" ? "signup" : "login")}>{mode === "login" ? "ليس لديك حساب؟ أنشئ حسابًا" : "لديك حساب؟ سجّل الدخول"}</button><small><LockKeyhole /> جلسة مشفرة وصلاحيات حسب الدور</small></section></main>;
}

function Footer() {
  return <footer className="footer"><div className="container footer-grid"><div><button className="brand light" onClick={() => go("/")}>صهوة<span className="brand-mark">⌁</span></button><p>منصة سعودية تربط عشاق الخيل بأفضل الإسطبلات والخدمات.</p></div><div><strong>صهوة</strong><a href="#/">عن المنصة</a><a href="#/explore">استكشف الخيل</a><a href="#/stables">دليل الإسطبلات</a><a href="#/login">سجّل إسطبلك</a></div><div><strong>الخدمات</strong><a href="#/explore?type=training">حصص تدريب</a><a href="#/explore?type=riding_experience">ركوب وتجربة</a><a href="#/explore?type=boarding">إيواء ورعاية</a></div><div><strong>الدعم</strong><a href="#/">الشروط والأحكام</a><a href="#/">سياسة الخصوصية</a><a href="#/">مركز المساعدة</a></div></div><div className="footer-bottom container"><span>© 2026 صهوة. جميع الحقوق محفوظة.</span><span>المملكة العربية السعودية · العربية</span></div></footer>;
}

export default function App() {
  const [route, setRoute] = useState<Route>(routeFromHash());
  const data = useMarketplaceData();
  useEffect(() => {
    const onHash = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  if (route.page === "home") return <HomePage data={data} />;
  if (route.page === "explore") return <ExplorePage data={data} />;
  if (route.page === "stables") return <StablesPage data={data} />;
  if (route.page === "products") return <ProductsPage products={fallbackProducts} />;
  if (route.page === "stable") return <StablePage slug={route.slug} data={data} />;
  if (route.page === "horse") return <HorsePage slug={route.slug} data={data} />;
  if (route.page === "book") return <BookingPage slug={route.slug} data={data} />;
  if (route.page === "dashboard") return <RequireAuth><DashboardPage /></RequireAuth>;
  if (route.page === "clients") return <RequireAuth><ClientsPage /></RequireAuth>;
  if (route.page === "analytics") return <RequireAuth><AnalyticsPage /></RequireAuth>;
  if (route.page === "stable-site") return <RequireAuth><StableSitePage /></RequireAuth>;
  if (route.page === "integrations") return <RequireAuth><IntegrationsPage /></RequireAuth>;
  if (route.page === "login") return <LoginPage />;
  return <PaymentResultPage />;
}
