'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

const rupiah = (n) => 'Rp' + Number(n || 0).toLocaleString('id-ID')

export default function HomePage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('donasi').select('*').single()
      setData(data)
    }
    load()

    const channel = supabase
      .channel('donasi-changes')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'donasi' },
        (payload) => setData(payload.new))
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  if (!data) {
    return (
      <main className="page">
        <div className="card"><p className="loading">Memuat data donasi…</p></div>
      </main>
    )
  }

  const persen = Math.min(100, Math.round((data.terkumpul / data.target) * 100))
  const sisa = Math.max(0, data.target - data.terkumpul)
  const barFill = { width: persen + '%' }

  return (
    <main className="page">
      <div className="card">
        <div className="badge">🐾 Open Donasi</div>
        <h1 className="title">{data.nama_campaign}</h1>
        <p className="subtitle">Bantu Roni &amp; Fuad sembuh dari flu 🐱</p>

        <div className="amount-box">
          <span className="label">Terkumpul</span>
          <span className="amount">{rupiah(data.terkumpul)}</span>
          <span className="target">dari target {rupiah(data.target)}</span>
        </div>

        <div className="progress">
          <div className="progress-fill" style={barFill} />
        </div>
        <div className="progress-meta">
          <span>{persen}% tercapai</span>
          <span>{rupiah(sisa)} lagi</span>
        </div>

        <p className="updated">Diperbarui: {new Date(data.updated_at).toLocaleString('id-ID')}</p>
      </div>
      <footer className="foot">Sekecil apapun donasimu, sangat berarti untuk mereka 💛</footer>
    </main>
  )
}
