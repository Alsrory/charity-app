'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import html2pdf from 'html2pdf.js'

interface User {
  id: string
  name: string
  email: string
  phoneNumber: string
  role: string
  affiliation: string | null
  createdAt: string
}

const MembersList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const tableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users')//api/users
        if (!response.ok) {
          throw new Error('فشل في جلب البيانات')
        }
        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error('تنسيق البيانات غير صحيح')
        }
        setUsers(data)
      } catch (error) {
        console.error('Error fetching users:', error)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    if (
      typeof user !== 'object' ||
      !user ||
      typeof user.name !== 'string' ||
      typeof user.email !== 'string'
    ) {
      return false
    }
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }) : []

  const handleDelete = async (userId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العضو؟')) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setUsers(users.filter(user => user.id !== userId))
        } else {
          console.error('Failed to delete user')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const printPdf = async () => {
    // Create a temporary div for PDF generation
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = `
      <div style="direction: rtl; text-align: right; padding: 20px;">
        <h2 style="text-align: center; font-size: 24px; margin-bottom: 20px;">قائمة الأعضاء</h2>
        <p style="text-align: center; color: #666; margin-bottom: 30px;">تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')}</p>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #2980b9; color: white;">
              <th style="padding: 12px; border: 1px solid #ddd;">الاسم</th>
              <th style="padding: 12px; border: 1px solid #ddd;">رقم الهاتف</th>
              <th style="padding: 12px; border: 1px solid #ddd;">الصلاحيات</th>
              <th style="padding: 12px; border: 1px solid #ddd;">تاريخ التسجيل</th>
            </tr>
          </thead>
          <tbody>
            ${filteredUsers.map(user => `
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 12px; border: 1px solid #ddd;">${user.name}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${user.phoneNumber || '-'}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${user.role || '-'}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${new Date(user.createdAt).toLocaleDateString('ar-SA')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `
    document.body.appendChild(tempDiv)

    const opt = {
      margin: 10,
      filename: 'قائمة_الأعضاء.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    }

    try {
      await html2pdf().set(opt).from(tempDiv).save()
      document.body.removeChild(tempDiv)
    } catch (error) {
      console.error('Error generating PDF:', error)
      document.body.removeChild(tempDiv)
    }
  }

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة الأعضاء</h1>
        <Link
          href="/dashboard/members/add"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          إضافة عضو جديد
        </Link>
        <button 
          className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90'
          onClick={() => printPdf()}
        >
          تصدير ملف PDF
        </button>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="بحث عن عضو..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full divide-gray-300 table-auto">
          <thead className="bg-gray-100/50">
            <tr className="bg-primary text-white">
              <th className="table-member px-9">الاسم</th>
              <th className="table-member">رقم الهاتف</th>
              <th className="table-member">الصلاحيات</th>
              <th className="table-member">تاريخ التسجيل</th>
              <th className="table-member">إجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm break-words">
            {filteredUsers.map((user) => (
              <tr key={user.id} className='hover:bg-gray-50 transition-colors'>
                <td className="p-3 text-sm md:text-base">
                  <div className="min-h-[80px] flex items-center justify-center">
                    {user.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.role || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/dashboard/members/${user.id}/updateUser`}
                    className="text-primary hover:text-primary/80 m-4"
                  >
                    تعديل
                  </Link>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(user.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MembersList 