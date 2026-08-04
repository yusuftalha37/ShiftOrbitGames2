# Yayınlama Rehberi (Vercel + Kendi Domainin)

Bu proje Next.js 16 (App Router) + Firebase (Auth & Firestore) kullanıyor. Sunucu
tarafında ek bir servise ihtiyaç yok, bu yüzden en pratik yol Vercel.

## Sırayla yapılacaklar

Aşağıdaki altı adım tamamlandığında site kendi domaininde yayında olur.
Sıra önemli: 4 ve 5'i atlarsan site açılır ama giriş ve panel çalışmaz.

---

## 1. Vercel'e bağla

Kod zaten GitHub'da: **github.com/yusuftalha37/ShiftOrbitGames2** (`main` dalı).

1. https://vercel.com adresine **GitHub hesabınla** giriş yap.
2. **Add New → Project** → `ShiftOrbitGames2` deposunu seç → **Import**.
   (Depo gizli; Vercel GitHub hesabın üzerinden erişir, ek bir ayar gerekmez.)
3. Framework otomatik **Next.js** algılanır — build ayarlarına dokunma.
4. Henüz **Deploy'a basma**, önce sonraki adımdaki değişkenleri gir.

## 2. Ortam değişkenlerini gir

Vercel'de **Settings → Environment Variables**. Değerleri Firebase Console →
**Project settings → Your apps → SDK setup and configuration** ekranından
kopyala. Hepsini Production, Preview ve Development için ekle:

| Değişken | Değer |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase config'ten |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase config'ten |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase config'ten |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase config'ten |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase config'ten |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase config'ten |
| `NEXT_PUBLIC_SITE_URL` | Kendi domainin, örn. `https://shiftorbit.com` |

`NEXT_PUBLIC_SITE_URL` girilmezse paylaşım kartları ve canonical adresler
`localhost` kalır. Sonra eklersen **yeniden deploy** etmen gerekir.

Bunlar tarayıcıya gönderilen açık anahtarlardır (`NEXT_PUBLIC_` ön eki bunu
belirtir); gizli olmaları beklenmez. Projeyi asıl koruyan şey Firestore
kurallarıdır — adım 5.

Şimdi **Deploy**'a bas.

## 3. Domaini bağla

1. Vercel'de proje → **Settings → Domains** → domainini yaz → **Add**.
2. Vercel sana DNS kayıtlarını verir. Domain sağlayıcının panelinde ekle:
   - Kök domain (`example.com`): `A` kaydı → `76.76.21.21`
   - `www`: `CNAME` → `cname.vercel-dns.com`

   Vercel ekranda güncel değerleri gösterir; **oradakini esas al**, buradaki
   değerler değişebilir.
3. DNS yayılması 10 dakika ile birkaç saat arasında sürer. SSL sertifikasını
   Vercel otomatik üretir, bir şey yapman gerekmez.

## 4. Firebase: girişi aç ve domaini yetkilendir

Firebase Console → **Authentication**:

1. **Sign-in method** sekmesi → **Email/Password** → etkinleştir.
2. Aynı sekme → **Google** → etkinleştir (destek e-postasını seç).
   Bu yapılmazsa "Google ile devam et" düğmesi hata verir.
3. **Settings → Authorized domains** → **Add domain** ile üçünü de ekle:
   - `example.com` (kendi domainin)
   - `www.example.com`
   - `proje-adi.vercel.app` (Vercel'in verdiği adres)

Bu adım atlanırsa giriş `auth/unauthorized-domain` hatası verir.

## 5. Güvenlik kurallarını yükle (zorunlu)

Firestore varsayılan kuralları ya her şeyi kapalı tutar ya da bir süre sonra
her şeyi açar. Projenin kuralları depodaki `firestore.rules` dosyasındadır ve
yüklenmeden **panel çalışmaz, mesaj gönderilemez**.

En kolay yol — Firebase Console → **Firestore Database → Rules** sekmesi →
`firestore.rules` dosyasının **tüm içeriğini** yapıştır → **Publish**.

Ya da komut satırından:

```bash
npm i -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

Bu kurallar emülatörde 53 saldırı senaryosuna karşı test edilmiştir
(`tests/firestore-rules.test.mjs`).

## 6. İlk yöneticiyi tanımla

1. Yayındaki sitede `/admin/login` → **Kayıt ol** ile hesabını aç.
2. Panel sana bir **hesap kimliği (uid)** gösterecek — kopyala.
3. Firebase Console → **Firestore Database** → `admins` adında koleksiyon
   oluştur → **doküman kimliği (Document ID) o uid olan** boş bir doküman ekle.
4. Paneli yenile; editör açılır.

Bundan sonra diğer yöneticileri panelin **Users** sekmesinden ekleyebilirsin;
Console'a bir daha girmen gerekmez.

---

## Yayın sonrası kontrol listesi

- [ ] Ana sayfa domainde açılıyor, kilit simgesi (HTTPS) var
- [ ] `/admin/login` açılıyor, e-posta ve Google ile giriş çalışıyor
- [ ] Panelde Games / News / Team sekmelerinden kayıt eklenip siliniyor
- [ ] Panel → **Settings**'ten sosyal linkler girildi (girilmeyen ikon çıkmaz)
- [ ] Çıkış yapıp iletişim formundan bir test mesajı gönderildi, panelin
      **Messages** sekmesinde göründü
- [ ] Aynı gün ikinci mesaj denendi, engellendiği görüldü

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
| Panelde "Could not load / Could not save" | `firestore.rules` yüklenmemiş (adım 5) |
| Girişte `auth/operation-not-allowed` | Authentication → Sign-in method'da sağlayıcı kapalı (adım 4) |
| Google düğmesi hata veriyor | Google sağlayıcısı kapalı ya da domain Authorized domains'te yok |
| Panel açılıyor ama editör yerine uid gösteriyor | Hesap `admins` koleksiyonunda değil (adım 6) |
| Mesaj gönderilemiyor | Kurallar yüklenmemiş ya da gün hakkı dolmuş (hesap başına günde 1) |

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

## Ekip üyeleri

Ekip üyeleri admin panelindeki **Team** sekmesinden yönetilir ve Firestore'daki
`team` koleksiyonunda tutulur. Her üyenin bir **kategorisi** vardır:

`Leadership · Development · Art · Design · Audio & music · Production · Other`

Üyeler `/team` sayfasında bu kategorilere göre gruplanır; ziyaretçi üstteki
filtre düğmeleriyle tek bir kategoriye odaklanabilir. Ana sayfadaki ekip
bölümünde ilk 6 üye görünür, 6'dan fazlaysa "All team members" linki çıkar.

### Başlangıç listesi hakkında

`team` koleksiyonu boşken site, `lib/data.ts` içindeki sabit listeyi gösterir.
Bu, panele ilk üye eklenene kadar ekip bölümünün boş görünmemesi içindir.
**Panelden ilk üyeyi eklediğin anda sabit liste tamamen devre dışı kalır** ve
site yalnızca Firestore'daki veriyi kullanır.

Kategorilerin anahtarları (`leadership`, `art` gibi) Firestore'a yazıldığı için
`lib/team.ts` içindeki mevcut anahtarları yeniden adlandırma — yeni kategori
gerekiyorsa listeye ekle.

## Sosyal medya linkleri

Steam, Discord, YouTube, Instagram ve TikTok adresleri admin panelindeki
**Settings** sekmesinden düzenlenir; Firestore'da `settings/social` dokümanında
tutulur. Kaydettiğin adresler sitenin üst menüsünde (ikon olarak) ve footer'da
görünür.

- Bir alanı **boş bırakırsan** o platform siteden tamamen kaybolur.
- Adres `https://` ile başlamalı; başlamıyorsa kaydetmeden önce uyarı çıkar.
- `settings/social` dokümanı henüz yokken yalnızca `lib/site-content.ts`
  içindeki Steam adresi gösterilir. Panelden ilk kaydı yaptığın anda
  Firestore'daki değerler geçerli olur.

Bu koleksiyon da `firestore.rules` içinde tanımlı (herkes okur, yalnızca
adminler yazar), dolayısıyla kuralları yeniden yüklemen gerekir:

```bash
firebase deploy --only firestore:rules
```

## Kullanıcı yönetimi

Panelde **Users** sekmesi, siteye giriş yapmış hesapları listeler. Her satırda:

- **Make admin / Remove admin** — hesabın düzenleme yetkisini verir veya alır
- **Block / Unblock** — hesabı engeller veya engeli kaldırır

Kendi hesabın üzerinde bu düğmeler kapalıdır; yanlışlıkla kendi yetkini alıp
panelden kilitlenmeni önlemek için.

### Listenin kapsamı

Firebase'in tarayıcı SDK'sı hesapları listeleyemez. Bu yüzden site, her girişte
hesabı Firestore'daki `users` koleksiyonuna kaydeder ve panel bu dizini
gösterir. Sonuç: **bu özellik eklenmeden önce açılmış ama o tarihten beri hiç
giriş yapmamış hesaplar listede görünmez** — bir kez giriş yaptıklarında
otomatik eklenirler.

### Engellemenin anlamı

Engellenen hesap:

- Girişte anında oturumdan atılır ve kendisine açıklama gösterilir
- Firestore kuralları tarafından reddedilir; hiçbir şey yazamaz (yorum dahil)

Ancak hesap Firebase Authentication tarafında hâlâ vardır. Hesabı gerçekten
devre dışı bırakmak (Firebase Auth seviyesinde) sunucu tarafı **Admin SDK**
gerektirir; bu da bir servis hesabı anahtarı ve sunucu tarafı kod demektir.
Uygulama seviyesindeki engelleme çoğu durumda yeterlidir.

### Kurallar

Bu özellik `firestore.rules` dosyasını değiştirdi: `users` koleksiyonu eklendi,
`admins` koleksiyonuna yazma yetkisi adminlere açıldı ve tüm yazma kuralları
"engelli değilse" koşuluyla güçlendirildi. **Kuralları yeniden yüklemen
gerekiyor**, yoksa Users sekmesi listeyi yükleyemez:

```bash
firebase deploy --only firestore:rules
```

## İletişim mesajları

İletişim formu artık **giriş yapmış hesaplara** açık ve her hesap **günde bir
mesaj** gönderebilir. Gelen mesajlar panelde **Messages** sekmesinde görünür;
oradan yanıtlayabilir (e-posta istemcisi açılır) veya silebilirsin.

### Günlük sınır nasıl zorlanıyor

Mesaj dokümanının kimliği `<uid>_<günNumarası>` biçimindedir ve kurallar başka
hiçbir kimliği kabul etmez. Gün numarası `request.time`'dan hesaplandığı için
sahte bir tarih yazıp ikinci mesaj atmak mümkün değildir; aynı gün ikinci yazma
denemesi de zaten var olan dokümanla çakışır. Sınır tarayıcıda değil, sunucuda
uygulanır.

Gün **UTC** üzerinden sayılır: hak 00:00 UTC'de yenilenir (Türkiye saatiyle
03:00).

### Google ile giriş

Hem giriş sayfasında hem iletişim formunda **"Google ile devam et"** düğmesi
vardır. Çalışması için Firebase Console → **Authentication → Sign-in method**
altında **Google** sağlayıcısını etkinleştirmen gerekir. Ayrıca yayına
aldığın alan adını **Authorized domains** listesine eklemeyi unutma.

E-posta/şifre ile kayıt da aynı yerde durmaya devam ediyor.

### Kurallar

`messages` koleksiyonu `firestore.rules` dosyasına eklendi. Yüklemezsen mesaj
gönderilemez:

```bash
firebase deploy --only firestore:rules
```
