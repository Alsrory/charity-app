import type { Metadata } from 'next'
import { Inter, Noto_Sans_Arabic,Cairo } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import DonateFloatingButton from "../components/DonateFloatingButton";
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] })
const notoSansArabic = Noto_Sans_Arabic({ subsets: ['arabic'] })
const cairo = Cairo({
  subsets: ['arabic'], // تضمين مجموعة الأحرف العربية فقط
  display: 'swap',     // سلوك العرض: تبديل
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'] // الأوزان التي تريد تضمينها
});
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
      <body className={`${cairo.className} ${inter.className} bg-gradient-to-b from-white to-primary/10 font-jannatLT `}>
        <Providers>
        <Navbar />
          {children}
          <DonateFloatingButton/>
        </Providers>
      </body>
    </html>
  )
}