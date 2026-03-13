import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Mind Studio | Healing the World — One Brain at a Time',
  description: 'National mental health organization delivering compassionate, convenient, and confidential therapy across all 50 states. Virtual, in-home, and in-office.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
