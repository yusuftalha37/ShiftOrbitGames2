import { initializeTestEnvironment, assertFails, assertSucceeds } from "@firebase/rules-unit-testing"
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, addDoc } from "firebase/firestore"
import { readFileSync } from "node:fs"
import { serverTimestamp } from "firebase/firestore"
const SERVER = serverTimestamp()

const env = await initializeTestEnvironment({
  projectId: "sec-test",
  firestore: { rules: readFileSync("firestore.rules", "utf8"), host: "127.0.0.1", port: 8080 },
})

// Her testten önce aynı temiz duruma dön: testler birbirini etkilemesin
async function reset() {
  await env.clearFirestore()
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore()
    await setDoc(doc(db, "admins/admin1"), { grantedAt: 1 })
    await setDoc(doc(db, "users/admin1"), { email: "admin@x.com" })
    await setDoc(doc(db, "users/user1"), { email: "user@x.com" })
    await setDoc(doc(db, "users/blocked1"), { email: "spam@x.com", blocked: true })
    await setDoc(doc(db, "admins/blockedadmin"), { grantedAt: 1 })
    await setDoc(doc(db, "users/blockedadmin"), { email: "ba@x.com", blocked: true })
    await setDoc(doc(db, "games/g1"), { title: "Game" })
    await setDoc(doc(db, "posts/p1"), { title: "Post" })
    await setDoc(doc(db, "posts/p1/comments/c1"), { name: "A", message: "B" })
    await setDoc(doc(db, "team/t1"), { name: "Member" })
    await setDoc(doc(db, "settings/social"), { steam: "x" })
  })
}

const as = (uid) => (uid ? env.authenticatedContext(uid).firestore() : env.unauthenticatedContext().firestore())

let pass = 0, fail = 0
async function check(name, uid, op, shouldFail = true) {
  await reset()
  try {
    await (shouldFail ? assertFails(op(as(uid))) : assertSucceeds(op(as(uid))))
    console.log(`  ✓ ${name}`); pass++
  } catch (e) {
    console.log(`  ✗ AÇIK: ${name}`)
    console.log(`      → ${String(e.message).split("\n")[0].slice(0, 130)}`)
    fail++
  }
}

console.log("\n── Yetki yükseltme ──")
await check("normal kullanıcı kendini admin yapamaz", "user1", d => setDoc(doc(d,"admins/user1"),{x:1}))
await check("yeni hesap kendini admin yapamaz", "newbie", d => setDoc(doc(d,"admins/newbie"),{x:1}))
await check("normal kullanıcı başkasını admin yapamaz", "user1", d => setDoc(doc(d,"admins/user2"),{x:1}))
await check("anonim admin yazamaz", null, d => setDoc(doc(d,"admins/x"),{x:1}))
await check("normal kullanıcı admin kaydı silemez", "user1", d => deleteDoc(doc(d,"admins/admin1")))
await check("ADMİN başkasını admin yapabilir", "admin1", d => setDoc(doc(d,"admins/user1"),{g:1}), false)

console.log("\n── Engelleme atlatma ──")
await check("engelli kendi engelini kaldıramaz", "blocked1", d => updateDoc(doc(d,"users/blocked1"),{blocked:false}))
await check("engelli dokümanını silemez", "blocked1", d => deleteDoc(doc(d,"users/blocked1")))
await check("engelli dokümanını sıfırlayamaz", "blocked1", d => setDoc(doc(d,"users/blocked1"),{email:"spam@x.com"}))
await check("engelli yorum yazamaz", "blocked1", d => addDoc(collection(d,"posts/p1/comments"),{name:"x",message:"y"}))
await check("engelli ADMİN oyun düzenleyemez", "blockedadmin", d => updateDoc(doc(d,"games/g1"),{title:"hacked"}))
await check("engelli ADMİN admin atayamaz", "blockedadmin", d => setDoc(doc(d,"admins/evil"),{x:1}))
await check("normal kullanıcı başkasını engelleyemez", "user1", d => updateDoc(doc(d,"users/admin1"),{blocked:true}))
await check("normal kullanıcı kendine blocked alanı ekleyemez", "user1", d => updateDoc(doc(d,"users/user1"),{blocked:false}))

console.log("\n── İçerik yazma ──")
await check("anonim oyun ekleyemez", null, d => setDoc(doc(d,"games/evil"),{title:"x"}))
await check("normal kullanıcı oyun düzenleyemez", "user1", d => updateDoc(doc(d,"games/g1"),{title:"x"}))
await check("normal kullanıcı haber silemez", "user1", d => deleteDoc(doc(d,"posts/p1")))
await check("normal kullanıcı ekip üyesi ekleyemez", "user1", d => setDoc(doc(d,"team/evil"),{name:"x"}))
await check("normal kullanıcı sosyal linkleri değiştiremez", "user1", d => setDoc(doc(d,"settings/social"),{steam:"evil"}))
await check("ADMİN oyun düzenleyebilir", "admin1", d => updateDoc(doc(d,"games/g1"),{title:"ok"}), false)
await check("ADMİN haber silebilir", "admin1", d => deleteDoc(doc(d,"posts/p1")), false)
await check("ADMİN yorum silebilir (moderasyon)", "admin1", d => deleteDoc(doc(d,"posts/p1/comments/c1")), false)

console.log("\n── Veri sızıntısı ──")
await check("anonim kullanıcı listesini okuyamaz", null, d => getDocs(collection(d,"users")))
await check("normal kullanıcı kullanıcı listesini okuyamaz", "user1", d => getDocs(collection(d,"users")))
await check("normal kullanıcı başkasının profilini okuyamaz", "user1", d => getDoc(doc(d,"users/admin1")))
await check("normal kullanıcı admin listesini okuyamaz", "user1", d => getDocs(collection(d,"admins")))
await check("ADMİN kullanıcı listesini okuyabilir", "admin1", d => getDocs(collection(d,"users")), false)
await check("kullanıcı kendi profilini okuyabilir", "user1", d => getDoc(doc(d,"users/user1")), false)
await check("kullanıcı kendi admin durumunu okuyabilir", "user1", d => getDoc(doc(d,"admins/user1")), false)
await check("herkes oyunları okuyabilir", null, d => getDoc(doc(d,"games/g1")), false)

console.log("\n── Yorum kötüye kullanımı ──")
await check("boş isimle yorum yazılamaz", null, d => addDoc(collection(d,"posts/p1/comments"),{name:"",message:"x"}))
await check("çok uzun yorum yazılamaz", null, d => addDoc(collection(d,"posts/p1/comments"),{name:"a",message:"x".repeat(1001)}))
await check("tip dışı yorum yazılamaz", null, d => addDoc(collection(d,"posts/p1/comments"),{name:123,message:"x"}))
await check("ziyaretçi yorum yazabilir", null, d => addDoc(collection(d,"posts/p1/comments"),{name:"Ali",message:"Merhaba"}), false)
await check("ziyaretçi yorum silemez", null, d => deleteDoc(doc(d,"posts/p1/comments/c1")))

console.log("\n── Mesaj sınırı ──")
const DAY = Math.floor(Date.now() / 86400000)
const msg = (extra={}) => ({ uid:"user1", name:"Ali", email:"a@x.com", message:"Merhaba", createdAt: SERVER, ...extra })
await check("giriş yapan günde 1 mesaj gönderebilir", "user1", d => setDoc(doc(d,`messages/user1_${DAY}`), msg()), false)
await check("anonim mesaj gönderemez", null, d => setDoc(doc(d,`messages/anon_${DAY}`), msg({uid:"anon"})))
await check("engelli mesaj gönderemez", "blocked1", d => setDoc(doc(d,`messages/blocked1_${DAY}`), msg({uid:"blocked1"})))
await check("başkasının adına mesaj gönderilemez", "user1", d => setDoc(doc(d,`messages/admin1_${DAY}`), msg({uid:"admin1"})))
await check("sahte gelecek gün ile ikinci mesaj atılamaz", "user1", d => setDoc(doc(d,`messages/user1_${DAY+1}`), msg()))
await check("sahte geçmiş gün ile ikinci mesaj atılamaz", "user1", d => setDoc(doc(d,`messages/user1_${DAY-1}`), msg()))
await check("rastgele kimlikle mesaj atılamaz", "user1", d => setDoc(doc(d,"messages/serbest"), msg()))
await check("uid alanı sahtelenemez", "user1", d => setDoc(doc(d,`messages/user1_${DAY}`), msg({uid:"admin1"})))
await check("2000 karakterden uzun mesaj atılamaz", "user1", d => setDoc(doc(d,`messages/user1_${DAY}`), msg({message:"x".repeat(2001)})))
await check("boş mesaj atılamaz", "user1", d => setDoc(doc(d,`messages/user1_${DAY}`), msg({message:""})))
await check("createdAt sahtelenemez", "user1", d => setDoc(doc(d,`messages/user1_${DAY}`), msg({createdAt:new Date(2000,0,1)})))
await check("normal kullanıcı mesajları listeleyemez", "user1", d => getDocs(collection(d,"messages")))
await check("anonim mesajları okuyamaz", null, d => getDocs(collection(d,"messages")))
await check("ADMİN mesajları listeleyebilir", "admin1", d => getDocs(collection(d,"messages")), false)
await check("kullanıcı mesajını silemez", "user1", d => deleteDoc(doc(d,`messages/user1_${DAY}`)))

console.log("\n── Kapsam dışı ──")
await check("rastgele koleksiyona yazılamaz", "user1", d => setDoc(doc(d,"secrets/x"),{a:1}))
await check("rastgele koleksiyon okunamaz", null, d => getDoc(doc(d,"secrets/x")))


// Aynı gün ikinci mesaj — reset atlanarak arka arkaya iki yazma
await reset()
{
  const d = as("user1")
  const id = `messages/user1_${DAY}`
  await setDoc(doc(d, id), msg())
  try {
    await assertFails(setDoc(doc(d, id), msg({ message: "ikinci" })))
    console.log("  \u2713 aynı gün ikinci mesaj REDDEDİLDİ"); pass++
  } catch {
    console.log("  \u2717 AÇIK: aynı gün ikinci mesaj gönderilebildi"); fail++
  }
}

console.log(`\nSONUÇ: ${pass} geçti, ${fail} açık`)
await env.cleanup()
process.exit(fail > 0 ? 1 : 0)
