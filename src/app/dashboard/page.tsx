import { LucideNewspaper, PinIcon, Projector, UserPlus } from 'lucide-react'
import Link from 'next/link'

const DashboardHome = () => {
  const stats = [
    { label: 'إجمالي الأعضاء', value: '150' },
    { label: 'المشاريع النشطة', value: '8' },
    { label: 'المبادرات الجارية', value: '5' },
    { label: 'الأخبار المنشورة', value: '12' },
  ]

  const quickActions = [
    { href: '/dashboard/news/add', label: 'إضافة خبر جديد', icon: LucideNewspaper },
    { href: '/dashboard/members/add', label: 'إضافة عضو جديد', icon: UserPlus },
    { href: '/dashboard/admins/add', label: 'إضافة مدير جديد', icon: UserPlus },
    { href: '/dashboard/initiatives/add', label: 'إضافة مبادرة جديدة', icon: PinIcon },
    { href: '/dashboard/projects/add', label: 'إضافة مشروع جديد', icon: Projector },
  ]

  return (
    <div className="space-y-6">
      
      
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">{stat.label}</h3>
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">إجراءات سريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-primary/5 transition-colors"
            >
              <action.icon className="w-14 h-14 m-3 md:m-7  text-primary  p-1" />
              <span>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardHome 