import './globals.css'

export const metadata = {
  title: 'Donasi Roni & Fuad',
  description: 'Bantu Roni & Fuad sembuh dari flu',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
