'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

const s = {
  wrap: { maxWidth: 480, margin: '40px auto', fontFamily: 'sans-serif', padding: 20 },
  amount: { color: '#2f8f83' },
  barBg: { background: '#eee', borderRadius: 8, overflow: 'hidden', height: 20 },
  center: { textAlign: 'center' },
}

export default function DonasiPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('donasi').select('*').single()
      setData(data)
    }
    load()

    // Realtime: update otomatis saat admin mengubah data
    const channel = supabase
      .channel('donasi-changes')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'donasi' },
        (payload) => setData(payload.new))
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  if (!data) return <p style={s.center}>Memuat...</p>

  const persen = Math.min(100, Math.round((data.terkumpul / data.target) * 100))
  const barFill = { width: `${persen}%`, background: '#2f8f83', height: '100%', transition: 'width .4s' }

  return (
    <main style={s.wrap}>
      <h1>{data.nama_campaign}</h1>
      <p>Terkumpul</p>
      <h2 style={s.amount}>Rp{data.terkumpul.toLocaleString('id-ID')}</h2>
      <p>dari target Rp{data.target.toLocaleString('id-ID')}</p>
      <div style={s.barBg}>
        <div style={barFill} />
      </div>
      <p><b>{persen}%</b></p>
      <small>Diperbarui: {new Date(data.updated_at).toLocaleString('id-ID')}</small>
    </main>
  )
}
