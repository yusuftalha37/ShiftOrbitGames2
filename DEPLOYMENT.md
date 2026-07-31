# Yayınlama Rehberi (Vercel + Kendi Domainin)

Bu proje Next.js 16 (App Router) + Firebase (Auth & Firestore) kullanıyor. Sunucu
tarafında ek bir servise ihtiyaç yok, bu yüzden en pratik yol Vercel.

## 0. Kod GitHub'da olsun

Vercel kodu GitHub'dan okur. Depo boşsa önce dosyaları yükle:
github.com/<kullanici>/<depo> → **uploading an existing file** → proje klasörünün
**içindekileri** sürükle → **Commit changes**.

> Yüklemeden önce `.env.local` dosyasını sil. İçinde Firebase anahtarların var ve
> depo herkese açıksa anahtarlar da açığa çıkar. `.env.local.example` kalabilir,
> içi boştur.

## 1. Repoyu Vercel'e bağla

1. https://vercel.com adresine GitHub hesabınla giriş yap.
2. **Add New → Project** → bu repoyu seç → **Import**.
3. Framework otomatik olarak Next.js algılanır; build ayarlarına dokunma.

## 2. Ortam değişkenlerini gir

Vercel'de **Settings → Environment Variables** altına `.env.local.example`
içindeki tüm anahtarları ekle (Production, Preview ve Development için):

| Değişken | Nereden alınır |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Project settings → Your apps |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | aynı ekran |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | aynı ekran |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | aynı ekran |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | aynı ekran |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | aynı ekran |
| `NEXT_PUBLIC_SITE_URL` | Kendi domainin, örn. `https://shiftorbit.com` |

`NEXT_PUBLIC_SITE_URL` girilmezse OpenGraph/canonical adresleri
`http://localhost:3000` olarak kalır; sosyal medya paylaşımlarında görsel
görünmez.

## 3. Domaini bağla

1. Vercel'de proje → **Settings → Domains** → domainini yaz → **Add**.
2. Vercel sana DNS kaydı verir. Domain sağlayıcının panelinde ekle:
   - Kök domain (`example.com`) için: `A` kaydı → `76.76.21.21`
   - `www` için: `CNAME` → `cname.vercel-dns.com`
   (Vercel ekranda güncel değerleri gösterir; oradakini esas al.)
3. DNS yayılması genelde 10 dakika–1 saat sürer. SSL sertifikası Vercel
   tarafından otomatik oluşturulur.

## 4. Firebase tarafında domaini yetkilendir (atlanırsa admin girişi çalışmaz)

Firebase Console → **Authentication → Settings → Authorized domains** →
**Add domain** ile şunları ekle:

- `example.com` (kendi domainin)
- `www.example.com`
- `proje-adi.vercel.app` (Vercel'in verdiği adres)

Bu adım yapılmazsa `/admin/login` sayfasında giriş `auth/unauthorized-domain`
hatası verir.

## 5. Admin kullanıcısı

Admin paneli Firebase Authentication'daki e-posta/şifre kullanıcısıyla çalışır.
Kullanıcı yoksa Firebase Console → Authentication → Users → **Add user**.

Firestore kurallarının da yayında olduğundan emin ol: okuma herkese açık,
yazma sadece giriş yapmış kullanıcıya:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Alternatif: Firebase App Hosting

Zaten Firebase kullandığın için her şeyi tek çatı altında toplamak istersen
Firebase App Hosting da Next.js'i destekler:

```bash
npm install -g firebase-tools
firebase login
firebase init apphosting
firebase deploy
```

Ortam değişkenlerini `apphosting.yaml` içinde tanımlaman gerekir. Vercel'e göre
kurulumu biraz daha elle yapılıyor; Next.js'in yeni sürümlerinde destek de
Vercel'de daha hızlı güncelleniyor.

## Sık karşılaşılan hatalar

| Belirti | Sebep |
| --- | --- |
| `auth/unauthorized-domain` | Domain, Firebase'in Authorized domains listesinde yok (adım 4) |
| Oyun/haber listesi boş geliyor | Ortam değişkenlerinden biri eksik veya adı yanlış; hepsi `NEXT_PUBLIC_` ile başlamalı |
| Vercel domain için "Invalid Configuration" | DNS henüz yayılmamış ya da eski `A` kaydı silinmemiş |
| Sosyal paylaşımda kapak görseli çıkmıyor | `NEXT_PUBLIC_SITE_URL` tanımlı değil ya da tanımlandıktan sonra redeploy yapılmamış |
| Görsel yüklenmiyor | `next.config.ts` sadece `firebasestorage.googleapis.com` adresine izin veriyor |

## Yerelde çalıştırma

```bash
npm install
cp .env.local.example .env.local   # değerleri doldur
npm run dev
```

## Admin hesabı ve yetkilendirme

Panele giriş `/admin/login` adresinden yapılır. Sayfada iki sekme vardır:
**Sign in** (giriş) ve **Sign up** (kayıt).

Önemli: **kayıt olmak yönetici olmak değildir.** Hesap açan herkes giriş
yapabilir, ama siteyi düzenleyebilmek için hesabın ayrıca yetkilendirilmesi
gerekir. Yetkisi olmayan bir hesap panele girdiğinde editör yerine kendi
hesap kimliğini (uid) gösteren bir bilgi ekranı görür.

### İlk yöneticiyi tanımlama

1. `/admin/login` → **Sign up** ile hesabını oluştur.
2. Panel sana bir **account ID** (uid) gösterecek — kopyala.
3. Firebase Console → **Firestore Database** → `admins` adında bir koleksiyon
   oluştur.
4. Bu koleksiyonda **doküman kimliği (Document ID) uid olan** boş bir doküman
   ekle. İçeriğe alan koymana gerek yok.
5. Paneli yenile — editör açılacaktır.

Aynı adımlarla istediğin kadar yönetici ekleyebilir, dokümanı silerek yetkiyi
geri alabilirsin.

### Güvenlik kurallarını yükleme

`firestore.rules` dosyası, yazma yetkisini `admins` koleksiyonundaki
hesaplarla sınırlar. Bu kurallar yüklenmezse tarayıcı tarafındaki kontrol tek
başına yeterli olmaz — mutlaka yükle:

```bash
firebase deploy --only firestore:rules
```

Alternatif olarak Firebase Console → Firestore Database → **Rules** sekmesine
dosyanın içeriğini yapıştırıp **Publish** diyebilirsin.
