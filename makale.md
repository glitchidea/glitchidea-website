# GlitchIdea.dev SEO Stratejisi ve Uygulama Planı

## Amaç
- Organik görünürlüğü artırmak, doğru anahtar kelimelerde sıralanmak, tıklama oranını yükseltmek ve dönüşüm (iletişim/form) oranını artırmak.
- Teknik, içerik, performans, erişilebilirlik ve izlenebilirlik (analytics) katmanlarını birlikte ele almak.

---

## 1) Mevcut Durum Özeti (Hızlı Denetim)
- Statik/SSR: `express + ejs` şablon yapısı ile SSR mevcut. İyi başlangıç.
- Meta: `title`, `description`, OG/Twitter etiketleri tanımlı. Kanonik eksik.
- Varlıklar: `og-image.jpg`, `favicon.ico`, `apple-touch-icon.png` dizinde yok (404 riski).
- Yapısal Veri: JSON-LD yok (Person/Organization, WebSite, Breadcrumb, BlogPosting önerilir).
- Site Haritası/robots: `sitemap.xml` ve `robots.txt` yok.
- Dahili linkleme: Navigasyon anchor (#) yapıda. SSR sayfa URL’leri yok (hakkımda, hizmetler vb.).
- API/Fetch: Frontend bazı yerlerde `./api/*.json` çağırıyor; sunucu `/api/...` endpoint sağlıyor. Tutarsızlık 404 ve renderde boş içerik riskine yol açabilir.
- Performans: Çoklu CSS/JS dosyası; kritik CSS ayrıştırması ve preconnect/preload iyi; AOS/FA/Fonts dış kaynaklı. Görsel optimizasyon ve lazy loading iyileştirilebilir.
- Güvenlik: `helmet` var. CSP var; analytics ve dış kaynaklar için kısıtlar gözden geçirilmeli.

---

## 2) Hedef Anahtar Kelimeler (TR odaklı)
- Birincil: "siber güvenlik uzmanı", "penetrasyon testi", "siber güvenlik danışmanı"
- İkincil: "Django güvenlik", "Flask güvenlik", "Python güvenlik", "OWASP Top 10 danışman"
- Niş/Uzun Kuyruk: "penetrasyon testi fiyat", "web uygulaması sızma testi", "kurumsal siber güvenlik danışmanlığı"

Not: Her sayfanın tek bir birincil odağı olmalı. Başlık (title), H1, açıklama, alt başlıklar ve gövde uyumlu olmalı.

---

## 3) Bilgi Mimarisi ve URL Stratejisi
- SSR sayfalar oluştur: `/hakkimda`, `/hizmetler`, `/projeler`, `/blog`, `/iletisim`.
- Her bileşen EJS parçası zaten mevcut; `views/components/*` içeriğini sayfa bazlı EJS dosyalarına (H1, benzersiz meta) dönüştür.
- Ana sayfa: özet + CTA. Detay için ilgili SSR sayfaya dahili link.
- Kanonik URL: Her sayfaya `<link rel="canonical" href="https://glitchidea.dev/..." />` ekle.

---

## 4) Teknik SEO Uygulamaları
- Head/meta standartları (tüm SSR sayfalarına):
  - Benzersiz `title` (55–60 karakter) ve `meta description` (150–160 karakter).
  - `rel=canonical`.
  - OG/Twitter etiketleri: başlık/açıklama/og:image sayfa özel.
  - `lang="tr"` zaten var; İngilizce sürüm planlanırsa `hreflang` ekle.
- Eksik varlıkları üret ve referansları düzelt:
  - `/public/images/og-image.jpg` (1200×630, <200 KB, konu/marka uyumlu)
  - `/public/images/favicon.ico`, `/public/images/apple-touch-icon.png`
  - Tüm referanslar `main.ejs` ve `index.html` için `/images/...` (kök) olarak konsolide edilmeli.
- Yapısal Veri (JSON-LD):
  - `WebSite` + `SearchAction`
  - `Organization` (ya da kişisel ise `Person`)
  - Hizmet sayfasında `Service`
  - Blog yazılarında `BlogPosting`
- Sitemap/robots:
  - `/public/sitemap.xml` dinamik ya da build-time üret; tüm önemli URL’leri listele.
  - `/public/robots.txt` ile `Sitemap: https://glitchidea.dev/sitemap.xml` ekle, gereksiz dizinler engellenebilir.
- 404/500 sayfaları: SSR mevcut; `noindex` ekleyin.
- Dahili linkleme:
  - Anchor (#) yerine SSR sayfa linkleri kullan; buton/CTA’lar ilgili sayfalara gitsin.
- Fetch/Endpoint tutarlılığı:
  - Frontend çağrılarını `/api/...` ile hizala (örn. `/api/social`), ya da static JSON’ları `public/api/*.json` olarak servis et.

---

## 5) Performans ve CWV (Core Web Vitals)
- CSS/JS birleştirme ve minification: `build-static.js` ile CSS/JS minify; kritik CSS inlining (above-the-fold) ekle.
- Görseller:
  - Tüm SVG/PNG/JPEG optimizasyonu (SVGO, imagemin, squoosh-cli).
  - `img` için `loading="lazy"`, `width/height` ve anlamlı `alt` zorunlu.
  - `og-image.jpg` optimize.
- Fonts:
  - `display=swap`, preload gerekiyorsa font dosyaları için preconnect zaten var.
- JS:
  - AOS/FontAwesome CDN yerine mümkünse self-host (CSP ve TTFB için). Defer/async kullanımı.
- HTTP:
  - `compression()` mevcut. Cache headers (immutable hash) ile uzun süreli cache.
- CWV ölçüm: Pagespeed Insights ve Web Vitals kitaplığı ile RUM.

---

## 6) İçerik Stratejisi
- Sayfa Bazlı:
  - Ana sayfa: Değer önermesi, temel hizmetler, güçlü CTA (projeye başla / danışmanlık al).
  - Hizmetler: Her hizmet için ayrı alt başlık, kapsam, teslimatlar, süreç, SSS (FAQ) ve mikro dönüşüm.
  - Hakkımda: Deneyim, sertifikalar (OWASP, CEH/OSCP vb.), referanslar.
  - Projeler: Kısa vaka çalışmaları, kullanılan teknolojiler, sonuç/etki metrikleri.
  - Blog: Uzun kuyruk anahtar kelimeler hedefli uzmanlık içerikleri.
  - İletişim: Form + “proje türü” alanı var, teyit mesajı ve dönüş SLA’sı ekleyin.
- Dil ve ton: Teknik doğruluk + iş odaklı fayda.
- İç linkleme: Hizmetlerden ilgili bloglara, bloglardan hizmetlere çapraz link.

---

## 7) Erişilebilirlik (A11y) ve UX
- Manşet hiyerarşisi: Her sayfada tek `h1`, mantıklı `h2/h3` hiyerarşisi.
- Kontrast ve odak halka (focus ring) görünür; klavye navigasyonu.
- `aria-label` ve buton/ikonlarda açıklayıcı metin.
- Form doğrulama ve hata mesajları erişilebilir olmalı.

---

## 8) Ölçümleme ve İzleme
- Google Analytics 4 veya Plausible/Umami: `script` CSP izinleri güncellenerek eklenmeli.
- Search Console & Bing Webmaster Tools kaydı.
- Loglama: 404 ve 5xx hata trendleri.

---

## 9) Güvenlik ve CSP
- `helmet` CSP direktiflerini güncelle:
  - Analytics ve self-host edilecek kaynaklar için izin ver.
  - `imgSrc`’ye `data:` ve CDN gerekiyorsa belirli domainler.
  - Inline script yerine mümkün olduğunca harici dosya + nonce.

---

## 10) Uygulama Adımları (Yapılacaklar)
1. SSR sayfalarını oluştur: `views/hakkimda.ejs`, `views/hizmetler.ejs`, `views/projeler.ejs`, `views/blog.ejs`, `views/iletisim.ejs` ve `server.js` route’ları.
2. `main.ejs` head bölümüne `canonical` ve JSON-LD yerleştirme altyapısı ekle (sayfa bazlı değişkenlerle).
3. Eksik varlıkları ekle: `/public/images/og-image.jpg`, `/public/images/favicon.ico`, `/public/images/apple-touch-icon.png`.
4. `robots.txt` ve `sitemap.xml` üret (build-time). `vercel.json` ile servis.
5. Fetch/endpoint tutarlılığı: Frontend `fetch` URL’lerini `/api/...` ile hizala veya `public/api`’den servis et. Tek bir tarz seç ve tüm çağrıları düzelt.
6. Görsel optimizasyon ve `loading="lazy"` + `alt` denetimi.
7. CSS/JS optimizasyonu: Minify, kritik CSS, `defer/async` ve CDN’leri self-host etme planı.
8. Yapısal veriler: Ana sayfa `WebSite/Organization/Person`, hizmet sayfası `Service`, blog yazısı `BlogPosting`.
9. 404/500 sayfalarına `noindex` meta ekle.
10. Analytics ve Search Console entegrasyonu; sitemap gönderimi.

---

## 11) Örnek Uygulama (Kısa Kod Parçaları)

Head içine kanonik ve JSON-LD (sayfa değişkenleriyle):

```html
<link rel="canonical" href="<%= canonicalUrl %>" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "GlitchIdea",
  "url": "https://glitchidea.dev",
  "logo": "https://glitchidea.dev/images/og-image.jpg",
  "sameAs": [
    "https://github.com/GlitchIdea"
  ]
}
</script>
```

`robots.txt` (öneri):

```txt
User-agent: *
Disallow: /api/
Allow: /
Sitemap: https://glitchidea.dev/sitemap.xml
```

Sitemap (özet):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://glitchidea.dev/</loc></url>
  <url><loc>https://glitchidea.dev/hakkimda</loc></url>
  <url><loc>https://glitchidea.dev/hizmetler</loc></url>
  <url><loc>https://glitchidea.dev/projeler</loc></url>
  <url><loc>https://glitchidea.dev/blog</loc></url>
  <url><loc>https://glitchidea.dev/iletisim</loc></url>
</urlset>
```

Blog gönderisi JSON-LD (`BlogPosting`) şablonu:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "<%= post.title %>",
  "datePublished": "<%= post.date %>",
  "author": {
    "@type": "Person",
    "name": "GlitchIdea"
  },
  "image": ["https://glitchidea.dev/images/og-image.jpg"],
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "<%= canonicalUrl %>"
  }
}
</script>
```

---

## 12) Dosya/Dizin Bazlı Yapılacak Düzenlemeler
- `views/layouts/main.ejs`
  - `canonical` desteği, `structuredData` slot’u, OG image değişkeni.
- `server.js`
  - Yeni SSR route’lar ve sayfa bazlı meta/canonical değişkenleri.
  - 404/500’lerde `noindex` meta.
  - CSP izinlerinin analytics ve self-host kaynaklara göre güncellenmesi.
- `public/`
  - `robots.txt`, `sitemap.xml`, `images/og-image.jpg`, `images/favicon.ico`, `images/apple-touch-icon.png`.
  - (Seçenek) `api/*.json` buradan servis edilecekse, fetch yollarını buna göre güncelle.
- `views/components/*`
  - `img` etiketleri: `loading="lazy"`, anlamlı `alt`, width/height.
  - Hiyerarşik başlık yapısı (tek H1, mantıklı H2/H3).

---

## 13) Test ve Yayın
- Yerel test: Lighthouse/Pagespeed (Mobil/CPU Throttling), Webhint, ESLint.
- Analytics ve Search Console doğrulama (property ekleme).
- Prod yayın sonrası: 404, 5xx ve zaman içinde CWV metriklerini takip.

---

## 14) Önceliklendirilmiş Yol Haritası (Sprint 1–2)
- P1 (Kritik):
  - Kanonik + meta standardizasyonu (tüm SSR sayfaları)
  - Eksik varlıklar (og-image, favicon, apple-touch)
  - robots.txt + sitemap.xml
  - Fetch/endpoint tutarlılığı
- P2 (Yüksek):
  - SSR sayfa URL’leri (hakkımda/hizmetler/projeler/blog/iletisim)
  - Yapısal veri (Organization/WebSite + BlogPosting/Service)
  - Görsel optimizasyon + lazy loading
- P3 (Orta):
  - CSS/JS optimizasyonları, self-host CDN kaynakları, CSP güncellemeleri
  - İçerik derinleştirme ve iç linkleme

---

## 15) Başarı KPI’ları
- İndekslenen sayfa sayısı, toplam gösterim ve tıklamalar
- Hedef sorgularda ortalama konum ve CTR
- Form gönderimleri ve dönüşüm oranı
- CWV: LCP < 2.5s, CLS < 0.1, INP < 200ms (90. persentil)

---

## Not Edilen Uyuşmazlıklar (Hızlı Düzeltme Listesi)
- `index.html` ve `main.ejs` arasında varlık yolları ve `fetch` çağrıları farklı. Tek kaynağı `views/layouts/main.ejs` + `public` olarak seçip, frontend çağrılarını `/api/...` ya da `public/api` ile tekilleştirin.
- `og:image`, `favicon`, `apple-touch` dosyaları eksik. Önce oluşturun.
- Anchor (#) navigasyon SEO için zayıf; SSR sayfa linklerine geçin.
