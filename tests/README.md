# Güvenlik kuralları testleri

`firestore-rules.test.mjs`, `firestore.rules` dosyasını Firebase emülatöründe
gerçek saldırı senaryolarıyla dener: yetki yükseltme, engelleme atlatma,
izinsiz içerik yazma, veri sızıntısı ve yorum kötüye kullanımı.

## Çalıştırma

Java kurulu olmalı (emülatörün gereği).

```bash
npm i -D firebase-tools @firebase/rules-unit-testing
npx firebase emulators:exec --only firestore --project sec-test \
  "node tests/firestore-rules.test.mjs"
```

Çıkış kodu 0 ise tüm senaryolar beklendiği gibi sonuçlanmıştır. Kuralları her
değiştirdiğinde bunu çalıştır — sessizce açılan bir kapıyı en hızlı böyle
yakalarsın.

Her test kendi başlangıç durumunu kurar; testler birbirini etkilemez.
