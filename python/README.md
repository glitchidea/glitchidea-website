# JSON Admin Panel

JSON verilerini düzenlemek için Flask tabanlı web arayüzü.

## 🚀 Özellikler

- **JSON Veri Yönetimi**: Hizmetler, projeler, sosyal medya ve blog verilerini düzenleme
- **CRUD İşlemleri**: Ekleme, düzenleme, silme ve görüntüleme
- **Ayarlanabilir Yollar**: JSON dosyalarının yollarını ayarlayabilme
- **Modern Arayüz**: Bootstrap 5 ile responsive tasarım
- **Güvenlik**: Veri doğrulama ve hata yönetimi
- **Modüler Yapı**: Her JSON türü için ayrı modül

## 📁 Proje Yapısı

```
python/
├── app.py                 # Ana Flask uygulaması
├── requirements.txt       # Python bağımlılıkları
├── config.ini            # Yapılandırma dosyası (otomatik oluşturulur)
├── templates/            # HTML şablonları
│   ├── base.html         # Ana şablon
│   ├── index.html        # Ana sayfa
│   ├── settings.html     # Ayarlar sayfası
│   ├── services.html     # Hizmetler sayfası
│   ├── projects.html     # Projeler sayfası
│   ├── social.html       # Sosyal medya sayfası
│   └── blog.html         # Blog sayfası
└── static/               # Statik dosyalar
    ├── css/
    │   └── style.css     # Ana CSS dosyası
    └── js/
        └── main.js       # Ana JavaScript dosyası
```

## 🛠️ Kurulum

### 1. Python Sanal Ortamı Oluşturun

```bash
# Python klasörüne gidin
cd python

# Sanal ortam oluşturun
python -m venv venv

# Sanal ortamı aktifleştirin
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

### 2. Bağımlılıkları Yükleyin

```bash
pip install -r requirements.txt
```

### 3. Uygulamayı Çalıştırın

```bash
python app.py
```

Uygulama `http://localhost:5000` adresinde çalışacaktır.

## 📋 Kullanım

### Ana Sayfa
- Dashboard görünümü
- Hızlı erişim kartları
- Sistem bilgileri

### Ayarlar
- JSON dosya yollarını ayarlama
- Güvenlik ayarları
- Yedekleme konfigürasyonu

### Hizmetler
- Hizmet ekleme/düzenleme/silme
- Kategori yönetimi
- Özellik ve teslim edilecekler listesi

### Projeler
- Proje ekleme/düzenleme/silme
- Teknoloji ve kategori filtreleme
- Repository linkleri

### Sosyal Medya
- Sosyal medya linkleri yönetimi
- Platform bazlı düzenleme

### Blog
- Blog yazıları ekleme/düzenleme/silme
- Tarih otomatik ekleme
- İçerik yönetimi

## ⚙️ Yapılandırma

### Varsayılan Ayarlar

Uygulama ilk çalıştırıldığında `config.ini` dosyası otomatik oluşturulur:

```ini
[PATHS]
data_path = ../data
services_file = services.json
projects_file = projects.json
social_file = social.json
blog_file = blog.json
featured_work_file = featured-work.json
work_file = work.json
```

### JSON Dosya Yapısı

#### services.json
```json
{
  "services": [
    {
      "id": 1,
      "title": "Hizmet Adı",
      "description": "Hizmet açıklaması",
      "category": "kategori",
      "icon": "fas fa-icon",
      "features": ["Özellik 1", "Özellik 2"],
      "deliverables": ["Teslim 1", "Teslim 2"]
    }
  ]
}
```

#### projects.json
```json
{
  "projects": [
    {
      "id": 1,
      "title": "Proje Adı",
      "description": "Proje açıklaması",
      "repository": "https://github.com/user/repo",
      "tech": "Python, Flask",
      "category": "Web",
      "status": "Tamamlandı"
    }
  ]
}
```

## 🎯 Özellikler

### Güvenlik
- ✅ Veri doğrulama
- ✅ Hata yönetimi
- ✅ Güvenli kaydetme
- ✅ Silme onayı

### Kullanıcı Deneyimi
- ✅ Responsive tasarım
- ✅ Klavye kısayolları
- ✅ Otomatik kaydetme
- ✅ Gerçek zamanlı güncelleme

### Geliştirici Özellikleri
- ✅ Modüler kod yapısı
- ✅ API endpoints
- ✅ Hata logları
- ✅ Yedekleme desteği

## 🔧 API Endpoints

### Hizmetler
- `GET /api/services` - Tüm hizmetleri getir
- `POST /api/services` - Yeni hizmet ekle
- `PUT /api/services` - Hizmet güncelle
- `DELETE /api/services?id=1` - Hizmet sil

### Projeler
- `GET /api/projects` - Tüm projeleri getir
- `POST /api/projects` - Yeni proje ekle
- `PUT /api/projects` - Proje güncelle
- `DELETE /api/projects?id=1` - Proje sil

### Sosyal Medya
- `GET /api/social` - Tüm sosyal medya linklerini getir
- `POST /api/social` - Yeni sosyal medya ekle
- `PUT /api/social` - Sosyal medya güncelle
- `DELETE /api/social?id=1` - Sosyal medya sil

### Blog
- `GET /api/blog` - Tüm blog yazılarını getir
- `POST /api/blog` - Yeni blog yazısı ekle
- `PUT /api/blog` - Blog yazısı güncelle
- `DELETE /api/blog?id=1` - Blog yazısı sil

### Ayarlar
- `POST /api/save_config` - Ayarları kaydet

## ⌨️ Klavye Kısayolları

- `Ctrl/Cmd + S` - Kaydet
- `Ctrl/Cmd + N` - Yeni ekle
- `Escape` - Modal kapat

## 🚀 Geliştirme

### Yeni Modül Ekleme

1. `app.py` dosyasına yeni route'lar ekleyin
2. Template dosyası oluşturun
3. API endpoint'leri ekleyin
4. CSS ve JavaScript dosyalarını güncelleyin

### Özelleştirme

- `static/css/style.css` - Stil özelleştirmeleri
- `static/js/main.js` - JavaScript fonksiyonları
- `templates/` - HTML şablonları

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Sorularınız için issue açabilir veya iletişime geçebilirsiniz.
