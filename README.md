# Birthday Tracker

Kişilerin doğum günlerini ve iletişim bilgilerini takip etmeyi sağlayan full-stack bir uygulama. Projenin backend, web ve mobil uygulamaları aynı REST API üzerinden çalışır.

Bu proje, Spring Boot tabanlı backend geliştirme deneyimini React web uygulaması ve Expo/React Native mobil uygulamasıyla birleştirmek amacıyla geliştirilmiştir. Kullanıcılar kendi hesaplarını oluşturabilir, doğum günü kaydı ekleyebilir, kişileri kategorilere ayırabilir ve yaklaşan doğum günlerini filtreleyerek takip edebilir.

## Proje Özellikleri

- E-posta ve şifre ile kullanıcı kaydı ve giriş
- JWT access token ile stateless kimlik doğrulama
- Refresh token rotation ile oturum yenileme
- Logout sırasında kullanıcının refresh token'larını iptal etme
- Kullanıcı bazlı veri izolasyonu
- Kişi (birthday contact) CRUD işlemleri
- Kategori CRUD işlemleri
- Kişileri kategoriye göre filtreleme
- Yaklaşan doğum günlerini gün aralığına göre filtreleme
- Sayfalı kişi listeleme
- Doğum yılı bilgisinin biliniyor/bilinmiyor olarak saklanması
- Kişi notu ve fotoğraf URL'si saklama
- Web arayüzünde dashboard, kişi detayları, kategori yönetimi ve pagination
- Mobil uygulamada aynı özelliklere yönelik Expo Router tab navigasyonu
- Bean Validation ile request doğrulama
- MapStruct ile entity/DTO dönüşümleri
- Flyway ile versiyonlanmış veritabanı migration'ları
- Swagger UI ve OpenAPI dokümantasyonu
- PostgreSQL'in Docker Compose ile yerel geliştirme ortamında çalıştırılması

## Uygulama Mimarisi

Repository, üç istemci/uygulama yüzeyinden oluşur:

```text
birthdayTracker/
├── backend/   # Spring Boot REST API
├── apps/
│   ├── web/   # React + TypeScript web uygulaması
│   └── mobile/ # Expo + React Native mobil uygulaması
└── README.md
```

### İstek akışı

```text
Web / Mobile
    │
    │  REST + JSON
    ▼
Spring Security + JWT Filter
    ▼
Controller
    ▼
Service
    ▼
Repository / JPA
    ▼
PostgreSQL
```

### Backend paket yapısı

```text
backend/src/main/java/com/gorkemuysal/birthdayTracker/
├── common/
│   ├── exception/       # Domain exception sınıfları
│   ├── BaseEntity.java  # Ortak audit alanları
│   ├── GlobalExceptionHandler.java
│   └── PagedResponse.java
├── config/
│   ├── JpaAuditingConfig.java
│   └── OpenApiConfig.java
├── contact/
│   ├── Category.java
│   ├── CategoryController.java
│   ├── CategoryService.java
│   ├── Person.java
│   ├── PersonController.java
│   ├── PersonService.java
│   ├── dto/
│   └── mapper/
└── identity/
    ├── AuthController.java
    ├── AuthService.java
    ├── User.java
    ├── RefreshToken.java
    ├── dto/
    └── security/
```

## Kullanılan Teknolojiler

### Backend

- Java 25
- Spring Boot 4.1.1
- Spring Web MVC
- Spring Data JPA / Hibernate
- Spring Security
- PostgreSQL 17
- Flyway
- JJWT 0.12.6
- MapStruct 1.5.5
- Bean Validation
- Springdoc OpenAPI
- Lombok
- Maven
- Docker Compose

### Web

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- Tailwind CSS
- shadcn/ui bileşenleri
- Lucide React
- Sonner
- date-fns
- Oxlint

### Mobil

- Expo 57
- React Native 0.86
- React 19
- TypeScript
- Expo Router
- TanStack Query
- Axios
- NativeWind
- AsyncStorage
- React Native DateTimePicker

## Veri Modeli

### User

Kullanıcı hesabını temsil eder. Kullanıcıya ait kategoriler, kişiler ve refresh token kayıtları ilişkilidir.

| Alan | Açıklama |
| --- | --- |
| `id` | Kullanıcı kimliği |
| `email` | Benzersiz e-posta adresi |
| `passwordHash` | BCrypt ile hash'lenmiş şifre |
| `fullName` | Kullanıcının adı |
| `roleName` | Kullanıcı rolü |
| `createdAt` / `updatedAt` | Audit bilgileri |

### Category

Kişileri gruplamak için kullanılır. Her kategori bir kullanıcıya aittir.

| Alan | Açıklama |
| --- | --- |
| `id` | Kategori kimliği |
| `name` | Kategori adı |
| `color` | Hex renk kodu, örneğin `#F4B183` |
| `ownerId` | Kategorinin sahibi |

### Person

Doğum günü takip edilecek kişiyi temsil eder.

| Alan | Açıklama |
| --- | --- |
| `id` | Kişi kimliği |
| `fullName` | Kişinin adı |
| `birthDate` | Doğum tarihi, `YYYY-MM-DD` formatında |
| `birthYearKnown` | Doğum yılının bilinip bilinmediği |
| `note` | Kişiye ait not |
| `photoUrl` | İsteğe bağlı fotoğraf adresi |
| `category` | İsteğe bağlı kategori |
| `ownerId` | Kaydın sahibi |

Kişi silindiğinde kategori silinmez; kişi-kategori ilişkisi kaldırılır. Kategori silindiğinde o kategoriye bağlı kişilerin `category` alanı boş hale gelir.

## Kimlik Doğrulama

Kayıt veya giriş işlemi sonucunda backend iki token döndürür:

```json
{
  "accessToken": "eyJ...",
  "refreshToken": "uuid..."
}
```

- Access token varsayılan olarak 15 dakika geçerlidir.
- Refresh token varsayılan olarak 7 gün geçerlidir.
- Refresh token yenilendiğinde mevcut token iptal edilir ve yeni bir refresh token oluşturulur.
- Korumalı endpoint'lerde access token aşağıdaki header ile gönderilir:

```http
Authorization: Bearer <access-token>
```

Web ve mobil istemciler access ve refresh token'ları saklar. API'den `401 Unauthorized` geldiğinde refresh token ile yeni token çifti alınır ve başarısız olan istek yeniden denenir.

## API Endpoint'leri

API base URL'i:

```text
http://localhost:8080/api/v1
```

Kayıt, giriş ve refresh token endpoint'leri dışındaki endpoint'ler kimlik doğrulama gerektirir. Her kullanıcı yalnızca kendi kişi ve kategori kayıtlarına erişebilir.

### Authentication — `/auth`

| Metot | Endpoint | Açıklama | Yetki |
| --- | --- | --- | --- |
| `POST` | `/register` | Yeni kullanıcı oluşturur ve token çifti döndürür | Herkese açık |
| `POST` | `/login` | E-posta ve şifre ile giriş yapar | Herkese açık |
| `POST` | `/refresh-token` | Refresh token rotation yaparak yeni token çifti döndürür | Herkese açık |
| `POST` | `/logout` | Giriş yapan kullanıcının refresh token'larını iptal eder | Giriş gerekli |

### People — `/people`

| Metot | Endpoint | Açıklama |
| --- | --- | --- |
| `POST` | `/people` | Yeni kişi oluşturur |
| `GET` | `/people` | Giriş yapan kullanıcının kişilerini sayfalı listeler |
| `GET` | `/people/{id}` | ID'ye göre kişi detayını getirir |
| `PUT` | `/people/{id}` | Kişi bilgilerini günceller |
| `DELETE` | `/people/{id}` | Kişiyi siler |

`GET /people` endpoint'i aşağıdaki query parametrelerini destekler:

| Parametre | Açıklama |
| --- | --- |
| `category` | Kategori ID'sine göre filtreler |
| `upcomingDays` | Bugünden itibaren belirtilen gün aralığındaki doğum günlerini getirir |
| `page` | Sayfa numarası, `0` tabanlı |
| `size` | Sayfa boyutu, varsayılan `8` |

Örnek:

```text
GET /api/v1/people?category=2&upcomingDays=30&page=0&size=8
```

Sayfalı response örneği:

```json
{
  "content": [
    {
      "id": 1,
      "fullName": "Ayşe Yılmaz",
      "birthDate": "1995-09-20",
      "birthYearKnown": true,
      "note": "Çiçek almayı sever",
      "photoUrl": null,
      "category": {
        "id": 2,
        "name": "Arkadaşlar",
        "color": "#F4B183"
      },
      "createdAt": "2026-09-01T10:00:00Z",
      "updatedAt": "2026-09-01T10:00:00Z"
    }
  ],
  "pageNumber": 0,
  "pageSize": 8,
  "totalElements": 1,
  "totalPages": 1,
  "last": true
}
```

### Categories — `/categories`

| Metot | Endpoint | Açıklama |
| --- | --- | --- |
| `POST` | `/categories` | Yeni kategori oluşturur |
| `GET` | `/categories` | Kullanıcının tüm kategorilerini listeler |
| `GET` | `/categories/{id}` | Kategori detayını getirir |
| `PUT` | `/categories/{id}` | Kategoriyi günceller |
| `DELETE` | `/categories/{id}` | Kategoriyi siler |

## Örnek API İstekleri

### Kullanıcı kaydı

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"gorkem@example.com","fullName":"Görkem Uysal","password":"sifre123"}'
```

### Giriş

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"gorkem@example.com","password":"sifre123"}'
```

### Kategori oluşturma

```bash
curl -X POST http://localhost:8080/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access-token>" \
  -d '{"name":"Arkadaşlar","color":"#F4B183"}'
```

### Kişi oluşturma

```bash
curl -X POST http://localhost:8080/api/v1/people \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access-token>" \
  -d '{"fullName":"Ayşe Yılmaz","birthDate":"1995-09-20","birthYearKnown":true,"note":"Çiçek almayı sever","categoryId":1}'
```

### Yaklaşan doğum günlerini listeleme

```bash
curl "http://localhost:8080/api/v1/people?upcomingDays=30&page=0&size=8" \
  -H "Authorization: Bearer <access-token>"
```

### Refresh token kullanma

```bash
curl -X POST http://localhost:8080/api/v1/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh-token>"}'
```

## Veritabanı ve Migration'lar

Backend PostgreSQL kullanır. Veritabanı şeması Flyway migration'ları ile oluşturulur:

```text
backend/src/main/resources/db/migration/
├── V1__create_users_table.sql
├── V2__create_refresh_tokens_table.sql
├── V3__create_categories_table.sql
└── V4__create_persons_table.sql
```

Hibernate `ddl-auto=validate` modunda çalışır. Böylece veritabanı şeması uygulama başlarken doğrulanır; tablo değişiklikleri migration dosyaları üzerinden takip edilir.

## Gereksinimler

- Java 25
- Maven veya Maven Wrapper
- Node.js ve npm
- Docker Desktop
- Android Studio/emülatörü (mobil Android çalıştırmak için)
- Xcode ve iOS Simulator (iOS geliştirme için)

## Kurulum

### 1. Projeyi klonlama

```bash
git clone https://github.com/grkmuysl/birthdayTracker.git
cd birthdayTracker
```

### 2. JWT ortam değişkenlerini tanımlama

Backend, JWT secret ve expiration değerlerini ortam değişkenlerinden okur. Backend'i başlatmadan önce bu değerleri tanımlayın.

PowerShell:

```powershell
$env:JWT_SECRET="change-this-to-a-long-random-secret-key"
$env:JWT_EXPIRATION="900000"
```

Linux/macOS:

```bash
export JWT_SECRET="change-this-to-a-long-random-secret-key"
export JWT_EXPIRATION="900000"
```

`JWT_EXPIRATION` milisaniye cinsindendir. Access token süresi uygulama ayarlarında 15 dakika, refresh token süresi 7 gün olarak tanımlıdır.

### 3. PostgreSQL'i başlatma

```bash
cd backend
docker compose up -d
```

Yerel PostgreSQL bağlantısı:

| Ayar | Değer |
| --- | --- |
| Host | `localhost` |
| Port | `5433` |
| Database | `birthdaytracker` |
| Kullanıcı | `postgres` |
| Şifre | `local_dev_only` |

### 4. Backend'i çalıştırma

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

Linux/macOS:

```bash
cd backend
./mvnw spring-boot:run
```

Backend varsayılan olarak `http://localhost:8080` adresinde çalışır. OpenAPI arayüzü:

```text
http://localhost:8080/swagger-ui.html
```

## Web Uygulamasını Çalıştırma

Web istemcisi Vite tarafından çalıştırılır. `apps/web` dizininde `.env` dosyası oluşturun:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Ardından:

```bash
cd apps/web
npm install
npm run dev
```

Web uygulaması Vite'ın gösterdiği yerel adreste, varsayılan olarak `http://localhost:5173` üzerinde açılır.

### Web sayfaları

| URL | Açıklama |
| --- | --- |
| `/login` | Giriş sayfası |
| `/register` | Kayıt sayfası |
| `/` | Yaklaşan doğum günleri dashboard'u |
| `/contacts` | Kişi listesi |
| `/contacts/:id` | Kişi detay sayfası |
| `/categories` | Kategori yönetimi |

Web uygulamasının production build'ini almak için:

```bash
npm run build
```

## Mobil Uygulamayı Çalıştırma

Mobil istemci Expo ile çalışır. `apps/mobile` dizininde `.env` dosyası oluşturun:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

Android emülatöründe host makinedeki backend'e erişmek için `localhost` yerine `10.0.2.2` kullanın:

```env
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8080/api/v1
```

Gerçek cihazda bilgisayarın yerel ağ IP adresini kullanın:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8080/api/v1
```

Ardından:

```bash
cd apps/mobile
npm install
npx expo start
```

Expo CLI menüsünden Android emülatörü, iOS Simulator veya Expo Go hedefi seçilebilir. Mobil uygulamada dosya tabanlı Expo Router kullanılır; kimlik doğrulama akışı, kişi/kategori ekranları ve ayarlar tab navigasyonu üzerinden sunulur.

## İstemci Tarafı Durum Yönetimi

Web ve mobil uygulamalar veri isteklerini TanStack Query ile yönetir:

- Listeleme sorguları cache'lenir.
- Kişi veya kategori oluşturma/güncelleme/silme sonrasında ilgili sorgular invalidate edilir.
- Yükleniyor, hata ve boş liste durumları arayüzde gösterilir.
- Axios interceptor access token'ı isteklere ekler.
- Access token süresi dolduğunda refresh token akışı otomatik çalışır.
- Yenileme sırasında gelen eşzamanlı istekler tek bir refresh işlemi tamamlanana kadar bekletilir.

## HTTP Durumları ve Hata Yönetimi

Backend, hata yanıtlarını Spring `ProblemDetail` yapısıyla döndürür. Yaygın durumlar:

| Durum | Kullanım |
| --- | --- |
| `201 Created` | Kayıt, kategori veya kişi oluşturma |
| `200 OK` | Başarılı okuma ve güncelleme |
| `204 No Content` | Silme ve logout |
| `400 Bad Request` | Geçersiz request veya validation hatası |
| `401 Unauthorized` | Geçersiz kimlik bilgisi veya token |
| `404 Not Found` | Bulunamayan kaynak |
| `409 Conflict` | Tekrarlanan e-posta veya kaynak |

## Test ve Kalite Kontrolleri

Backend testleri Maven Wrapper ile çalıştırılabilir:

```bash
cd backend
.\mvnw.cmd test
```

Web lint:

```bash
cd apps/web
npm run lint
```

Mobil lint:

```bash
cd apps/mobile
npm run lint
```

## Öğrenme Odağı

Bu projede backend, web ve mobil katmanlarını tek bir ürün akışı içinde geliştirerek aşağıdaki konular üzerinde pratik yapılmıştır:

- Full-stack proje organizasyonu
- REST API tasarımı ve istemci entegrasyonu
- Spring Security ile stateless authentication
- JWT access/refresh token yaşam döngüsü
- Kullanıcı bazlı yetkilendirme ve veri sahipliği
- JPA entity ilişkileri ve audit alanları
- Flyway ile migration yönetimi
- DTO, validation ve MapStruct kullanımı
- Pagination ve filtreleme
- React Query ile server-state yönetimi
- React Router ve Expo Router ile platforma uygun navigasyon
- Web ve mobil istemcilerde ortak API sözleşmesinin kullanılması

## Lisans

Bu proje kişisel gelişim ve öğrenme amacıyla geliştirilmiştir.
