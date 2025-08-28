import type { Metadata } from 'next'
import { Inter, Noto_Sans_Arabic,Cairo } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import DonateFloatingButton from "../components/DonateFloatingButton";
import Navbar from '@/components/Navbar';

const cairo = Cairo({
  subsets: ['arabic', 'latin'], // أضف latin لو عندك نصوص إنجليزية
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800', '900']
})

export const metadata: Metadata = {
  title: 'جمعية التلاحم الخيرية المجتمعية',
  description: 'موقع جمعيةالتلاحم  الخيرية المجتمعية',
  icons:{
    icon:"/Chartiy_Aldohara.png"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" >
      <body className={`${cairo.className} `  }>
        <Providers>
        <Navbar />
          {children}
          <DonateFloatingButton/>
        </Providers>
      </body>
    </html>
  )
}