/**
 * Site copy in both languages. Components read it through `useContent()`
 * so switching language never needs a code change — only this file grows.
 *
 * Content stored in Firestore (game titles, news posts, team bios) is not
 * translated: it appears in whatever language it was written in.
 */

export const LOCALES = ["en", "tr"] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = "en"

/** Locale-independent facts. */
export const company = {
  name: "Shift Orbit",
  legalName: "Shift Orbit",
  founded: 2024,
  email: "hello@shiftorbit.com",
  steam: "https://store.steampowered.com/curator/45313222",
}

/** Hrefs are shared; only the labels differ per language. */
export const navHrefs = ["/#games", "/news", "/team", "/#contact"] as const

const en = {
  tagline: "Independent game studio",
  nav: ["Games", "News", "Team", "Contact"],
  common: {
    getInTouch: "Get in touch",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    loading: "Loading…",
    viewGame: "View game",
    learnMore: "Learn more",
    minRead: "min read",
    allPosts: "All posts",
    noCover: "No cover image",
    skipToContent: "Skip to content",
  },
  hero: {
    eyebrow: "Independent game studio",
    heading: "Games that take you beyond the stars.",
    body: "We are an independent studio building bold, universe-scale gaming experiences. Every orbit begins with a single shift.",
    primaryCta: "Explore our games",
    visitSteam: "Visit us on Steam",
    latestRelease: "Latest release",
    buyNow: "Buy now",
    wishlist: "Wishlist",
    prevSlide: "Previous game",
    nextSlide: "Next game",
    carouselLabel: "Our games",
    status: {
      released: "Out now on Steam",
      "coming-soon": "Coming soon",
      "in-development": "In development",
    },
  },
  games: {
    eyebrow: "Our universe",
    heading: "Games",
    body: "Each title is a new world. Explore what we have launched into orbit.",
    titleCount: (n: number) => `${n} ${n === 1 ? "title" : "titles"}`,
    filterLabel: "Filter games",
    filters: {
      all: "All",
      released: "Released",
      "coming-soon": "Coming soon",
      "in-development": "In development",
    },
    emptyTitle: "First launch coming soon",
    emptyBody:
      "We are heads-down on our first title. Follow the news for development updates as it comes together.",
    emptyCta: "Read development news",
    emptyFilter: "Nothing in this category yet.",
  },
  news: {
    sectionEyebrow: "From the studio",
    sectionHeading: "Latest news",
    eyebrow: "Latest updates",
    heading: "News & blog",
    body: "Development updates, announcements, and stories from the Shift Orbit team.",
    search: "Search posts",
    latest: "Latest",
    emptyTitle: "No posts yet",
    emptyBody: "Development updates will show up here as our games come together.",
    emptyCta: "See our games",
    noMatch: (q: string) => `No posts match “${q}”.`,
    back: "Back to news",
    notFound: "Post not found.",
    comments: "Comments",
    noComments: "No comments yet. Be the first to reply.",
    commentName: "Name",
    commentBody: "Comment",
    postComment: "Post comment",
    posting: "Posting…",
  },
  team: {
    eyebrow: "The crew",
    heading: "Team",
    body: "A small group of developers, artists, and designers building every world by hand.",
    pageHeading: "Team members",
    pageBody: "The people who design, build, and look after every world we ship.",
    all: "All",
    allMembers: "All team members",
    peopleCount: (n: number) => `${n} ${n === 1 ? "person" : "people"}`,
    filterLabel: "Filter by category",
    emptyTitle: "No team members yet",
    emptyBody:
      "Members added from the admin panel will appear here, grouped by category.",
    categories: {
      leadership: "Leadership",
      development: "Development",
      art: "Art",
      design: "Design",
      audio: "Audio & music",
      production: "Production",
      other: "Other",
    },
  },
  contact: {
    eyebrow: "Say hello",
    heading: "Contact us",
    body: "Questions, press enquiries, collaboration ideas, or something you want to share about our games — we read every message.",
    orEmail: "Or email us directly at",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send message",
    sending: "Sending…",
    sent: "Thank you — your message is on its way.",
    error: "Something went wrong sending the form. Please email us at",
  },
  footer: {
    description:
      "An independent game studio building bold, universe-scale gaming experiences. Every orbit begins with a single shift.",
    navigate: "Navigate",
    news: "News",
    admin: "Admin",
  },
}

const tr: typeof en = {
  tagline: "Bağımsız oyun stüdyosu",
  nav: ["Oyunlar", "Haberler", "Ekip", "İletişim"],
  common: {
    getInTouch: "İletişime geç",
    openMenu: "Menüyü aç",
    closeMenu: "Menüyü kapat",
    loading: "Yükleniyor…",
    viewGame: "Oyuna git",
    learnMore: "Detaylar",
    minRead: "dk okuma",
    allPosts: "Tüm yazılar",
    noCover: "Kapak görseli yok",
    skipToContent: "İçeriğe geç",
  },
  hero: {
    eyebrow: "Bağımsız oyun stüdyosu",
    heading: "Seni yıldızların ötesine götüren oyunlar.",
    body: "Evren ölçeğinde, iddialı oyun deneyimleri geliştiren bağımsız bir stüdyoyuz. Her yörünge tek bir kaymayla başlar.",
    primaryCta: "Oyunlarımızı keşfet",
    visitSteam: "Steam sayfamıza git",
    latestRelease: "Son çıkan",
    buyNow: "Satın al",
    wishlist: "İstek listesine ekle",
    prevSlide: "Önceki oyun",
    nextSlide: "Sonraki oyun",
    carouselLabel: "Oyunlarımız",
    status: {
      released: "Steam'de yayında",
      "coming-soon": "Çok yakında",
      "in-development": "Geliştiriliyor",
    },
  },
  games: {
    eyebrow: "Evrenimiz",
    heading: "Oyunlar",
    body: "Her oyun yeni bir dünya. Yörüngeye gönderdiklerimize göz at.",
    titleCount: (n: number) => `${n} oyun`,
    filterLabel: "Oyunları filtrele",
    filters: {
      all: "Tümü",
      released: "Yayında",
      "coming-soon": "Çok yakında",
      "in-development": "Geliştiriliyor",
    },
    emptyTitle: "İlk çıkış çok yakında",
    emptyBody:
      "İlk oyunumuz üzerinde çalışıyoruz. Gelişmeleri haberler bölümünden takip edebilirsin.",
    emptyCta: "Geliştirme haberlerini oku",
    emptyFilter: "Bu kategoride henüz oyun yok.",
  },
  news: {
    sectionEyebrow: "Stüdyodan",
    sectionHeading: "Son haberler",
    eyebrow: "Güncel",
    heading: "Haberler & blog",
    body: "Shift Orbit ekibinden geliştirme notları, duyurular ve hikâyeler.",
    search: "Yazılarda ara",
    latest: "Son yazı",
    emptyTitle: "Henüz yazı yok",
    emptyBody: "Oyunlarımız şekillendikçe geliştirme notları burada yayınlanacak.",
    emptyCta: "Oyunlarımıza bak",
    noMatch: (q: string) => `“${q}” ile eşleşen yazı yok.`,
    back: "Haberlere dön",
    notFound: "Yazı bulunamadı.",
    comments: "Yorumlar",
    noComments: "Henüz yorum yok. İlk yazan sen ol.",
    commentName: "Adın",
    commentBody: "Yorumun",
    postComment: "Yorumu gönder",
    posting: "Gönderiliyor…",
  },
  team: {
    eyebrow: "Ekibimiz",
    heading: "Ekip",
    body: "Her dünyayı elleriyle kuran küçük bir geliştirici, sanatçı ve tasarımcı ekibi.",
    pageHeading: "Ekip üyeleri",
    pageBody: "Yayınladığımız her dünyayı tasarlayan, geliştiren ve yaşatan insanlar.",
    all: "Tümü",
    allMembers: "Tüm ekip üyeleri",
    peopleCount: (n: number) => `${n} kişi`,
    filterLabel: "Kategoriye göre filtrele",
    emptyTitle: "Henüz ekip üyesi yok",
    emptyBody:
      "Admin panelinden eklenen üyeler burada kategorilerine göre listelenir.",
    categories: {
      leadership: "Yönetim",
      development: "Geliştirme",
      art: "Sanat",
      design: "Tasarım",
      audio: "Ses & müzik",
      production: "Prodüksiyon",
      other: "Diğer",
    },
  },
  contact: {
    eyebrow: "Merhaba de",
    heading: "İletişim",
    body: "Sorular, basın talepleri, iş birliği fikirleri ya da oyunlarımız hakkında paylaşmak istediğin bir şey — her mesajı okuyoruz.",
    orEmail: "Ya da doğrudan e-posta gönder:",
    name: "Adın",
    email: "E-posta",
    message: "Mesajın",
    send: "Mesajı gönder",
    sending: "Gönderiliyor…",
    sent: "Teşekkürler — mesajın yola çıktı.",
    error: "Form gönderilirken bir sorun oldu. Lütfen bize yazın:",
  },
  footer: {
    description:
      "Evren ölçeğinde, iddialı oyun deneyimleri geliştiren bağımsız bir oyun stüdyosu. Her yörünge tek bir kaymayla başlar.",
    navigate: "Menü",
    news: "Haberler",
    admin: "Yönetim",
  },
}

export const content = { en, tr }
export type Content = typeof en
