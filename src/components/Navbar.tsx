'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-primary shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 py-9">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-white">
              جمعيتي الخيرية
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 space-x-reverse py-7">
            <Link href="#about" className="text-white text-lg hover:text-white">
              عن الجمعية
            </Link>
            <Link href="#news" className="text-white/95 text-lg hover:text-white">
              آخر الأخبار
            </Link>
            <Link href="#projects" className="text-white/95 text-lg hover:text-white">
              المشاريع
            </Link>
            <Link href="#initiatives" className="text-white/95 text-lg hover:text-white">
              المبادرات
            </Link>
            <Link href="#contact" className="text-white/95 text-lg hover:text-white">
              تواصل معنا
            </Link>
            <Link href="/dashboard" className="text-white/95 text-lg hover:text-white">
              لوحة التحكم
            </Link>
            {pathname !== '/login' && (
              <Link 
                href="/login" 
                className="bg-white text-primary px-4 py-2 rounded-md hover:bg-white/90 transition-colors"
              >
                تسجيل الدخول
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-white/80"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <>
          {/* Dark overlay */}
          <div 
            className="fixed  inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Mobile menu */}
          <div className="md:hidden fixed top-0 right-0 w-64 bg-primary h-screen shadow-lg transform transition-transform duration-300 ease-in-out z-50">
            <div className="h-16 flex  items-center justify-between px-4 border-b border-gray-200">
              <span className="text-lg font-bold text-white">القائمة</span>
              <div className='hover:bg-white rounded-lg px-1 pt-1 hover:text-gray-700'>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-white  hover:text-gray-700"
              >
                <X size={24} />
              </button>
              </div>
            </div>
            <div className="px-4 py-6 space-y-4 text-white">
              <Link
                href="#about"
                className="block px-4 py-3 text-xl text-white  hover:text-gray-700 hover:bg-white/90   rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                عن الجمعية
              </Link>
              <Link
                href="#news"
                className="block px-4 py-3 text-white  hover:text-gray-700 hover:bg-white/90   rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                آخر الأخبار
              </Link>
              <Link
                href="#projects"
               className="block px-4 py-3 text-white  hover:text-gray-700 hover:bg-white/90   rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                المشاريع
              </Link>
              <Link
                href="#initiatives"
                className="block px-4 py-3 text-white  hover:text-gray-700 hover:bg-white/90   rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                المبادرات
              </Link>
              <Link
                href="#contact"
                className="block px-4 py-3 text-white  hover:text-gray-700 hover:bg-white/90   rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                تواصل معنا
              </Link>
              {pathname !== '/login' && (
                <Link
                  href="/login"
                  className="block px-4 py-3 bg-white text-primary rounded-lg hover:bg-white/90 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  تسجيل الدخول
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  )
} 