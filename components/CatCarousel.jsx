'use client'
import { useEffect, useRef, useState } from 'react'

// ============================================================
//  CARA MENAMBAH FOTO KUCING (manual):
//  1. Taruh file foto di folder /public, contoh: public/Roni.jpg
//  2. Tulis nama filenya di daftar di bawah (diawali garis miring "/").
//     PERHATIKAN huruf besar/kecil harus SAMA PERSIS dengan nama file.
//     Contoh: const fotos = ['/Roni.jpg', '/Fuad.jpg']
//  3. Simpan, commit, lalu push.
// ============================================================
const fotos = [
  '/Roni.webp',
  '/Fuad.webp',
]

// Jeda auto-slide dalam milidetik (3000 = 3 detik)
const AUTO_MS = 3000

export default function CatCarousel() {
  const trackRef = useRef(null)
  const [idx, setIdx] = useState(0)

  // Geser ke slide tertentu
  const goTo = (i) => {
    const track = trackRef.current
    if (track) track.scrollTo({ left: track.clientWidth * i, behavior: 'smooth' })
    setIdx(i)
  }

  // Auto-slide (berhenti kalau hanya 1 foto)
  useEffect(() => {
    if (fotos.length <= 1) return
    const timer = setInterval(() => {
      setIdx((prev) => {
        const next = (prev + 1) % fotos.length
        const track = trackRef.current
        if (track) track.scrollTo({ left: track.clientWidth * next, behavior: 'smooth' })
        return next
      })
    }, AUTO_MS)
    return () => clearInterval(timer)
  }, [])

  // Sinkronkan titik saat digeser manual
  const onScroll = () => {
    const track = trackRef.current
    if (!track) return
    const i = Math.round(track.scrollLeft / track.clientWidth)
    setIdx((prev) => (prev === i ? prev : i))
  }

  if (!fotos.length) {
    return (
      <div className="carousel-wrap">
        <div className="carousel">
          <div className="slide slide-empty">
            <span>
              📷 Belum ada foto.<br />
              Tambahkan foto ke folder <b>/public</b> lalu tulis namanya di
              <b> components/CatCarousel.jsx</b>
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="carousel-wrap">
      <div className="carousel" ref={trackRef} onScroll={onScroll}>
        {fotos.map((src, i) => (
          <div className="slide" key={i}>
            <img src={src} alt={'Foto kucing ' + (i + 1)} />
          </div>
        ))}
      </div>
      {fotos.length > 1 && (
        <div className="dots">
          {fotos.map((_, i) => (
            <button
              key={i}
              type="button"
              className={'dot' + (i === idx ? ' dot-active' : '')}
              aria-label={'Ke foto ' + (i + 1)}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
