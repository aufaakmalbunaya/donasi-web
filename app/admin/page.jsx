'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminPage() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [current, setCurrent] = useState(null)
  const [jumlah, setJumlah] = useState('')
  const [pesan, setPesan] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, ses) => setSession(ses))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    supabase.from('donasi').select('*').single().then(({ data }) => {
      setCurrent(data)
      if (data) setJumlah(String(data.terkumpul))
    })
  }, [session])

  const login = async (e) => {
    e.preventDefault()
    setPesan('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setPesan('❌ Login gagal: ' + error.message)
  }

  const updateDonasi = async (e) => {
    e.preventDefault()
    setLoading(true); setPesan('')
    const nilai = parseInt(jumlah, 10) || 0
    const { error } = await supabase.from('donasi')
      .update({ terkumpul: nilai, updated_at: new Date().toISOString() })
      .eq('id', 1)
    setLoading(false)
    setPesan(error ? '❌ Gagal: ' + error.message : '✅ Berhasil diperbarui!')
  }

  if (!session) {
    return (
      <main className="page">
        <form className="card" onSubmit={login}>
          <div className="badge">🔐 Admin</div>
          <h1 className="title">Login Admin</h1>
          <input className="input" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} />
          <button className="btn" type="submit">Masuk</button>
          {pesan && <p className="msg">{pesan}</p>}
        </form>
      </main>
    )
  }

  return (
    <main className="page">
      <form className="card" onSubmit={updateDonasi}>
        <div className="badge">🔐 Dashboard Admin</div>
        <h1 className="title">Perbarui Donasi</h1>
        {current && (
          <p className="subtitle">
            Saat ini: <b>Rp{Number(current.terkumpul).toLocaleString('id-ID')}</b>
          </p>
        )}
        <label className="field-label">Total terkumpul (Rp)</label>
        <input className="input" type="number" placeholder="cth: 45000" value={jumlah}
          onChange={(e) => setJumlah(e.target.value)} />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Menyimpan…' : 'Perbarui Donasi'}
        </button>
        <button className="btn btn-ghost" type="button" onClick={() => supabase.auth.signOut()}>
          Keluar
        </button>
        {pesan && <p className="msg">{pesan}</p>}
      </form>
    </main>
  )
}
