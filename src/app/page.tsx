'use client'
import dynamic from 'next/dynamic'
const MindStudioLanding = dynamic(() => import('@/components/MindStudioLanding'), { ssr: false })
export default function Home() { return <MindStudioLanding /> }
