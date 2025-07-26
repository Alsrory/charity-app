"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const session = useSession();
  //(session.data?.user.role)
  useEffect(() => {
    if (session.data?.user.role === "ADMIN") {
      setIsAdmin(true);
    }
  }, [session.data?.user.role]);
  return (
    <nav className="bg-primary shadow-lg fixed w-full z-50 py-1 md:py-2">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 py-9">
        <div className="flex items-center  justify-between">
            <Image
              src="/Chartiy_Aldohara.png"
              alt="صورة عن الجمعية"
              width={60}
              height={60}
              className=" mx-auto max-w-[60vh] max-h-[60vh] md:mx-0 object-cover rounded-full shadow-xl "
            />
          
          </div>
            <Link
              href="/"
              className="text-xl text-center md:text-2xl font-bold text-white"
            >
              جمعية التلاحم الخيرية
            </Link>
          

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 space-x-reverse md:justify-center items-center">
            <Link href="#about" className="navbar-desktop">
              عن الجمعية
            </Link>
            <Link href="#news" className="navbar-desktop">
              آخر الأخبار
            </Link>
            <Link href="#projects" className="navbar-desktop">
              المشاريع
            </Link>
            <Link href="#initiatives" className="navbar-desktop">
              المبادرات
            </Link>
            <Link href="#contact" className="navbar-desktop">
              تواصل معنا
            </Link>
            {isAdmin && (
              <Link href="/dashboard" className="navbar-desktop">
                لوحة التحكم
              </Link>
            )}
            {pathname !== "/login" && (
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
              {isMenuOpen ? <X size={28} /> : <Menu size={36} />}
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
              <span className="text-lg font-bold text-white px-4">القائمة</span>
              <div className="hover:bg-white rounded-lg px-1 pt-1 hover:text-gray-700">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white  hover:text-gray-700"
                >
                  <X size={36} className="px-1" />
                </button>
              </div>
            </div>
            <div className="px-4 py-6 space-y-4 text-white">
              <Link
                href="#about"
                className="navbar-dropmune"
                onClick={() => setIsMenuOpen(false)}
              >
                عن الجمعية
              </Link>
              <Link
                href="#news"
                className="navbar-dropmune"
                onClick={() => setIsMenuOpen(false)}
              >
                آخر الأخبار
              </Link>
              <Link
                href="#projects"
                className="navbar-dropmune"
                onClick={() => setIsMenuOpen(false)}
              >
                المشاريع
              </Link>
              <Link
                href="#initiatives"
                className="navbar-dropmune"
                onClick={() => setIsMenuOpen(false)}
              >
                المبادرات
              </Link>
              <Link
                href="#contact"
                className="navbar-dropmune"
                onClick={() => setIsMenuOpen(false)}
              >
                تواصل معنا
              </Link>
              {isAdmin && (
                <Link href="/dashboard" className="navbar-dropmune">
                  لوحة التحكم
                </Link>
              )}
              {pathname !== "/login" && (
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
  );
}
