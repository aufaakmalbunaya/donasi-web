'use client'

// ============================================================
//  CARA MENAMBAH FOTO KUCING (manual):
//  1. Taruh file foto di folder /public, contoh: public/roni.jpg
//  2. Tulis nama filenya di daftar di bawah (diawali garis miring "/").
//     Contoh: const fotos = ['/roni.jpg', '/fuad.jpg', '/roni2.jpg']
//  3. Simpan, commit, lalu push. Kartu otomatis bisa digeser.
// ============================================================
const fotos = [
  '/Roni.jpg',
  '/Fuad.jpg',
]

export default function CatCarousel() {
  if (!fotos.length) {
    return (
      <div className="carousel">
        <div className="slide slide-empty">
          <span>
            📷 Belum ada foto.<br />
            Tambahkan foto ke folder <b>/public</b> lalu tulis namanya di
            <b> components/CatCarousel.jsx</b>
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="carousel">
      {fotos.map((src, i) => (
        <div className="slide" key={i}>
          <img src={src} alt={'Foto kucing ' + (i + 1)} />
        </div>
      ))}
    </div>
  )
}
