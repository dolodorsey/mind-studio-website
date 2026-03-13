import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Mind Studio | Portal — Client · Therapist · Operations',
  description: 'Your private healing space. Complete intake, schedule sessions, track mood, access resources, and connect with your care team through The Mind Studio platform.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
