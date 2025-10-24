# Common Components

## EmojiText Component

Component untuk menampilkan emoji dengan style Apple (iOS) di semua platform (Windows, Android, dll) menggunakan `applemojis`.

### Cara Penggunaan

```tsx
import EmojiText from "@/components/common/EmojiText";

// Contoh 1: Simple text dengan emoji
<EmojiText>Hello World 👋</EmojiText>

// Contoh 2: Dengan custom tag (default: span)
<EmojiText tag="p">Pilih karakter favoritmu! 🎮</EmojiText>

// Contoh 3: Dengan className
<EmojiText
  tag="h1"
  className="text-2xl font-bold text-blue-500"
>
  Selamat Datang 🎉
</EmojiText>

// Contoh 4: Dengan custom size
<EmojiText tag="span" size={24}>
  Emoji besar! 🚀
</EmojiText>

// Contoh 5: Di dalam element lain
<h1 className="text-3xl">
  Pilih Teman Belajarmu
  <br />
  <EmojiText tag="span" size={32}>Mari Belajar! 📚</EmojiText>
</h1>
```

### Props

- `children` (string, required): Text yang mengandung emoji
- `tag` (string, optional): HTML tag yang akan digunakan (default: "span")
  - Contoh: "span", "p", "h1", "h2", "div", dll
- `className` (string, optional): Tailwind/CSS classes
- `size` (number, optional): Ukuran emoji dalam pixel (default: 20)

### Emoji yang Didukung

Emoji yang sudah dimapping di component:

| Emoji | Unicode Code | Keterangan |
|-------|--------------|------------|
| 🐾 | U+1F43E | Jejak kaki |
| 🍊 | U+1F34A | Jeruk |
| 👑 | U+1F451 | Mahkota |
| 🦝 | U+1F99D | Rakun |
| ✨ | U+2728 | Kilauan |
| 🐸 | U+1F438 | Katak |
| 💚 | U+1F49A | Hati hijau |
| 🐴 | U+1F434 | Kuda |
| 💪 | U+1F4AA | Otot |
| 🐷 | U+1F437 | Babi |
| 💰 | U+1F4B0 | Kantong uang |
| 🦉 | U+1F989 | Burung hantu |
| 📚 | U+1F4DA | Buku |
| 🐰 | U+1F430 | Kelinci |
| ⚡ | U+26A1 | Petir |

### Menambahkan Emoji Baru

Untuk menambahkan emoji baru, edit `emojiCodeMap` di `EmojiText.tsx`:

```tsx
const emojiCodeMap: Record<string, string> = {
  "🎉": "U+1F389",
  "🚀": "U+1F680",
  // tambahkan emoji lainnya...
};
```

Cari Unicode code emoji di [Unicode.org](https://unicode.org/emoji/charts/full-emoji-list.html) atau [Emojipedia](https://emojipedia.org/) (format: U+XXXXX).

### Catatan Teknis

- Menggunakan library `applemojis` untuk rendering Apple-style emoji
- Emoji di-render sebagai `<Image>` tag dengan base64 PNG data
- **TIDAK** memerlukan provider atau context setup
- Emoji yang tidak ada di mapping akan fallback ke native emoji
- Styling CSS global sudah ditambahkan di `globals.css`
- Emoji akan tetap tampil dengan style Apple di semua platform (Windows, Android, Web)
- Data emoji sudah embedded dalam library (offline-ready)

### Emoji di Project Ini

Berikut emoji yang sudah digunakan di project:

**Halaman Pilih Karakter:**
- 🐾 (Paw prints) - Judul halaman
- 🍊👑 (Tangerine & Crown) - Kocheng Oren
- 🦝✨ (Raccoon & Sparkles) - Bro Kerbuz
- 🐸💚 (Frog & Green Heart) - Mas Gwebek
- 🐴💪 (Horse & Muscle) - Mas Pace
- 🐷💰 (Pig & Money) - Mas Piggy
- 🦉📚 (Owl & Books) - Pak Bubu
- 🐰⚡ (Rabbit & Lightning) - Sin Bunbun
