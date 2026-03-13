'use client'
import dynamic from 'next/dynamic'
const MindStudioSite = dynamic(() => import('@/components/MindStudioSite'), { ssr: false })
export default function Home() { return <MindStudioSite /> }
