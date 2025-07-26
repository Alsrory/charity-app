'use client'
import { Menu, Star, X, CreditCard,User2Icon ,Newspaper,Projector} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { href: '/dashboard', label: 'الرئيسية',icon:Menu },
    { href: '/dashboard/news', label: 'إدارة الأخبار',icon:Newspaper },
    { href: '/dashboard/members', label: 'إدارة الأعضاء',icon:User2Icon },
    { href: '/dashboard/admins', label: 'إدارة المديرين',icon:User2Icon },
    { href: '/dashboard/initiatives', label: 'إدارة المبادرات',icon:Projector },
    { href: '/dashboard/projects', label: 'إدارة المشاريع',icon:Projector },
    { href: '/dashboard/payments', label: 'دفع الاشتراكات', icon: CreditCard },
  ]

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white shadow-md">
        <div className="flex gap-x-3 items-center p-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
          <h2 className="text-xl font-bold text-primary">لوحة التحكم</h2>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } md:block w-80 md:w-64 bg-white shadow-lg fixed md:relative z-50 h-full`}
      >
        <div className="p-4 md:block flex justify-between items-center border-b-2 border-primary">
          <h2 className="text-xl font-bold text-primary">لوحة التحكم</h2>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <X /> : null}
          </button>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-primary/10 ${
                  pathname === item.href ? 'bg-primary/10 text-primary' : ''
                }`}
              >
                {Icon && <Icon size={20} />}
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  )
}

export default DashboardLayout 