import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Mind Studio | Client Portal — Telemed Platform',
  description: 'Your private space for healing. Complete intake, schedule sessions, track mood, and access wellness resources through The Mind Studio telehealth platform.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
