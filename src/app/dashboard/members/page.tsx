'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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

      <div className="bg-white rounded-lg shadow overflow-hidden">

        <table className="min-w-full divide-y divide-gray-300 table-auto">
          <thead className="bg-gray-100/50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الاسم
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                رقم الهاتف
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الانتماء/الجهة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تاريخ التسجيل
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                إجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm break-words">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.affiliation || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('en-US')}
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