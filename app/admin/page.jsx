'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminPage() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [jumlah, setJumlah] = useState('')
  const [pesan, setPesan] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const login = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setPesan('Login gagal: ' + error.message)
  }

  const updateDonasi = async (e) => {
    e.preventDefault()
    const nilai = parseInt(jumlah, 10)
    const { error } = await supabase.from('donasi')
      .update({ terkumpul: nilai, updated_at: new Date().toISOString() })
      .eq('id', 1)
    setPesan(error ? 'Gagal: ' + error.message : 'Berhasil diperbarui!')
  }

  if (!session) {
    return (
      <form onSubmit={login} style=maxWidth:360, margin:'40px auto', fontFamily:'sans-serif', display:'grid', gap:8>
        <h1>Login Admin</h1>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Masuk</button>
        <p>{pesan}</p>
      </form>
    )
  }

  return (
    <form onSubmit={updateDonasi} style=maxWidth:360, margin:'40px auto', fontFamily:'sans-serif', display:'grid', gap:8>
      <h1>Dashboard Admin</h1>
      <input type="number" placeholder="Total terkumpul (Rp)" value={jumlah} onChange={e=>setJumlah(e.target.value)} />
      <button type="submit">Perbarui Donasi</button>
      <button type="button" onClick={()=>supabase.auth.signOut()}>Keluar</button>
      <p>{pesan}</p>
    </form>
  )
}