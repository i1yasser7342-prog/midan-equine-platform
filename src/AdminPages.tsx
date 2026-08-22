// Split out of App.tsx and loaded via React.lazy (see the App component)
// so an anonymous visitor's browser never has to download the operator
// dashboard's code — only someone who actually reaches a signed-in
// /dashboard, /clients, /analytics, /stable-site, or /integrations route
// triggers this chunk (fixes PERF-01).
import { useState } from "react";
import {
  ArrowLeft, BadgeCheck, BarChart3, Bell, CalendarDays, Check, ChevronDown,
  CreditCard, Dumbbell, Globe2, Home, Hotel, LayoutDashboard, MessageCircle,
  PawPrint as Horse, Search, Settings, ShieldCheck, TrendingUp, UserCheck,
  UserPlus, Users, WalletCards
} from "lucide-react";

const go = (path: string) => {
  window.location.hash = path;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// The 4th value marks which items appear in the mobile bottom tab bar
// (fixes FE-02: it used to keep whichever 5 items came first positionally,
// which happened to be 4 duplicate links to /dashboard plus /clients —
// leaving /analytics, /stable-site and /integrations unreachable from a
// phone's nav entirely). These 5 flags cover all 5 distinct destinations.
const dashboardItems = [
  ["نظرة عامة", LayoutDashboard, "/dashboard", true], ["الحجوزات", CalendarDays, "/dashboard", false], ["الخيل", Horse, "/dashboard", false], ["الخدمات والباقات", Dumbbell, "/dashboard", false],
  ["العملاء", Users, "/clients", true], ["الإيواء والرعاية", Hotel, "/dashboard", false], ["التقارير", BarChart3, "/analytics", true],
  ["صفحة الإسطبل", Globe2, "/stable-site", true], ["التكاملات", Settings, "/integrations", true]
] as const;

function DashboardShell({ active, children }: { active: string; children: React.ReactNode }) {
  return <div className="dashboard-shell"><aside className="dashboard-sidebar"><button className="brand light" onClick={() => go("/")}>صهوة<span className="brand-mark">⌁</span></button><nav>{dashboardItems.map(([label, Icon, path, mobileTab]) => <button className={[active === label ? "active" : "", mobileTab ? "mobile-tab" : ""].filter(Boolean).join(" ")} key={label} onClick={() => go(path)}><Icon />{label}</button>)}</nav><button className="sidebar-exit" onClick={() => go("/")}><Home /> الموقع العام</button></aside><div className="dashboard-main">{children}</div></div>;
}

export function DashboardPage() {
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

export function ClientsPage() {
  const [query, setQuery] = useState("");
  const clients = demoClients.filter((client) => client.name.includes(query) || client.phone.includes(query));
  return <DashboardShell active="العملاء"><header className="dashboard-top"><div><h1>العملاء</h1><p>سجل موحّد للحجوزات والاشتراكات والتواصل</p></div><button className="primary-button"><UserPlus /> إضافة عميل</button></header><main className="dashboard-content">
    <div className="stats-row client-stats">{[["إجمالي العملاء","248",Users],["عملاء نشطون","186",UserCheck],["عملاء جدد","24",TrendingUp],["تجديدات قريبة","17",CalendarDays]].map(([label,value,Icon]) => <div className="stat" key={String(label)}><span><Icon /></span><div><p>{label as string}</p><strong>{value as string}</strong></div></div>)}</div>
    <section className="dashboard-panel clients-panel"><div className="panel-head"><div><h2>سجل العملاء</h2><p>تظهر بيانات التواصل مخفية جزئيًا وفق الصلاحية.</p></div><label className="table-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث بالاسم أو الجوال" /></label></div>
      <div className="table-wrap"><table><thead><tr><th>العميل</th><th>الجوال</th><th>الباقة الحالية</th><th>الزيارات</th><th>إجمالي القيمة</th><th>الحالة</th></tr></thead><tbody>{clients.map((client) => <tr key={client.name}><td><strong>{client.name}</strong></td><td>{client.phone}</td><td>{client.plan}</td><td>{client.visits}</td><td>{client.value}</td><td><span className={client.status === "نشط" ? "status success" : client.status === "جديد" ? "status neutral" : "status pending"}>{client.status}</span></td></tr>)}</tbody></table></div>
    </section>
  </main></DashboardShell>;
}

export function AnalyticsPage() {
  const revenue = [48,61,55,72,68,84,92,78,95,88,100,94];
  return <DashboardShell active="التقارير"><header className="dashboard-top"><div><h1>التقارير والتحليلات</h1><p>قرارات أوضح من بيانات الحجز والإشغال والإيراد</p></div><button className="secondary-button">تصدير التقرير</button></header><main className="dashboard-content">
    <div className="stats-row">{[["الإيرادات","38,400 ر.س","+18%"],["نسبة الإشغال","76%","+9%"],["متوسط الحجز","300 ر.س","+4%"],["عدم الحضور","3.2%","-2%"]].map(([label,value,trend]) => <div className="metric-card" key={label}><p>{label}</p><strong>{value}</strong><span>{trend} عن الشهر السابق</span></div>)}</div>
    <div className="analytics-grid"><section className="dashboard-panel chart-panel"><div className="panel-head"><div><h2>الإيرادات الشهرية</h2><p>قيمة العمليات الناجحة بعد التحقق</p></div><span className="status success">نمو 18%</span></div><div className="revenue-chart">{revenue.map((height,index) => <div key={index}><span style={{height:`${height}%`}} /><small>{["ينا","فبر","مار","أبر","ماي","يون","يول","أغس","سبت","أكت","نوف","ديس"][index]}</small></div>)}</div></section>
      <section className="dashboard-panel occupancy-panel"><div className="panel-head"><div><h2>الإشغال حسب الخدمة</h2><p>الطاقة المحجوزة من المتاح</p></div></div>{[["التدريب الفردي",86],["تجارب الركوب",72],["الاشتراكات",64],["الإيواء",91]].map(([label,value]) => <div className="occupancy-row" key={String(label)}><div><span>{label}</span><strong>{value}%</strong></div><div><i style={{width:`${value}%`}} /></div></div>)}</section>
    </div>
    <section className="dashboard-panel insight-strip"><TrendingUp /><div><strong>فرصة نمو واضحة</strong><p>ترتفع طلبات تجارب الركوب مساء الخميس؛ إضافة موعدين قد ترفع إشغال الخدمة بنحو 12% وفق نمط الحجوزات المعروض.</p></div></section>
  </main></DashboardShell>;
}

export function StableSitePage() {
  return <DashboardShell active="صفحة الإسطبل"><header className="dashboard-top"><div><h1>صفحة الإسطبل</h1><p>واجهة حجز احترافية قابلة للمشاركة مع عملائك</p></div><button className="primary-button" onClick={() => go("/stable/elite-stables")}><Globe2 /> فتح الصفحة</button></header><main className="dashboard-content site-settings">
    <section className="dashboard-panel site-preview-card"><div className="site-mini-browser"><div><i /><i /><i /><span>midan.sa/elite-stables</span></div><img src="https://placehold.co/1200x800/1a2f23/f5efe0?text=%D9%85%D9%8A%D8%AF%D8%A7%D9%86" alt="معاينة صفحة إسطبل النخبة" /><section><span><BadgeCheck /> مركز موثق</span><h2>إسطبل النخبة</h2><p>تدريب وركوب وإيواء احترافي للخيل العربية.</p><button>احجز الآن</button></section></div></section>
    <aside className="dashboard-panel settings-list"><div className="panel-head"><div><h2>جاهزية الصفحة</h2><p>حدّث بياناتك ليظهر المركز بأفضل صورة.</p></div></div>{[["هوية المركز ووصفه","مكتمل",Check],["الخدمات والأسعار","4 خدمات",Dumbbell],["الصور والخيل","3 خيول",Horse],["رابط الحجز","نشط",Globe2],["العربية والإنجليزية","العربية نشطة",Globe2]].map(([label,value,Icon]) => <div className="setting-row" key={String(label)}><span><Icon /></span><div><strong>{label as string}</strong><small>{value as string}</small></div><ArrowLeft /></div>)}</aside>
  </main></DashboardShell>;
}

export function IntegrationsPage() {
  return <DashboardShell active="التكاملات"><header className="dashboard-top"><div><h1>التكاملات</h1><p>ربط الخدمات دون كشف المفاتيح داخل الواجهة أو المستودع</p></div></header><main className="dashboard-content integrations">
    <section className="integration-card"><div className="integration-logo moyasar"><CreditCard /></div><div className="integration-body"><div className="integration-title"><div><h2>ميسر للمدفوعات</h2><p>مدى، Apple Pay والبطاقات</p></div><span className="status pending">بانتظار المفاتيح</span></div><ul><li><Check /> المفتاح العام يوضع في متغير النشر فقط.</li><li><Check /> المفتاح السري وسر webhook داخل Supabase Edge Function Secrets فقط.</li><li><Check /> تأكيد الحجز يتطلب تحقق الحالة والمبلغ والعملة من الخادم.</li><li><Check /> منع التكرار وسجل webhook غير متاح للعملاء.</li></ul><div className="integration-actions"><a className="primary-button" href="https://dashboard.moyasar.com/" target="_blank" rel="noreferrer">فتح لوحة ميسر</a><button className="secondary-button">اختبار الاتصال</button></div></div></section>
    <section className="integration-card"><div className="integration-logo whatsapp"><MessageCircle /></div><div className="integration-body"><div className="integration-title"><div><h2>واتساب للأعمال</h2><p>تأكيد الحجز والتذكير والتجديد</p></div><span className="status neutral">غير متصل</span></div><ul><li><Check /> قوالب رسائل معتمدة فقط.</li><li><Check /> أقل قدر من بيانات العميل في الرسالة.</li><li><Check /> تسجيل الإرسال دون حفظ محتوى حساس.</li></ul><div className="integration-actions"><button className="secondary-button">إعداد الربط لاحقًا</button></div></div></section>
    <aside className="security-callout"><ShieldCheck /><div><h3>سياسة المفاتيح</h3><p>لا تُكتب مفاتيح ميسر أو واتساب في المحادثة أو ملفات البيئة المحلية أو GitHub. يتم إدخالها من لوحات المزود وSupabase Edge Function Secrets فقط مع تدويرها عند أي اشتباه.</p></div></aside>
  </main></DashboardShell>;
}
