'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Initiative {
  id: string
  title: string
  description: string
  image: string | null
  createdAt: string
}

const InitiativesList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [initiatives, setInitiatives] = useState<Initiative[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInitiatives = async () => {
      try {
        const response = await fetch('/api/initiatives')
        if (!response.ok) {
          throw new Error('فشل في جلب البيانات')
        }
        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error('تنسيق البيانات غير صحيح')
        }
        setInitiatives(data)
      } catch (error) {
        console.error('Error fetching initiatives:', error)
        setInitiatives([])
      } finally {
        setLoading(false)
      }
    }

    fetchInitiatives()
  }, [])

  const filteredInitiatives = initiatives.filter(initiative => {
    if (
      typeof initiative !== 'object' ||
      !initiative ||
      typeof initiative.title !== 'string' ||
      typeof initiative.description !== 'string'
    ) {
      return false
    }
    return (
      initiative.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      initiative.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleDelete = async (initiativeId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المبادرة؟')) {
      try {
        const response = await fetch(`/api/initiatives/${initiativeId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setInitiatives(initiatives.filter(initiative => initiative.id !== initiativeId))
        } else {
          console.error('Failed to delete initiative')
        }
      } catch (error) {
        console.error('Error deleting initiative:', error)
      }
    }
  }

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة المبادرات</h1>
        <Link
          href="/dashboard/initiatives/add"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          إضافة مبادرة جديدة
        </Link>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="بحث عن مبادرة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInitiatives.map((initiative) => (
          <div key={initiative.id} className="bg-white rounded-lg shadow overflow-hidden">
            {initiative.image && (
              <img
                src={initiative.image}
                alt={initiative.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{initiative.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{initiative.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(initiative.createdAt).toLocaleDateString('ar-SA')}
                </span>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/initiatives/${initiative.id}/edit`}
                    className="text-primary hover:text-primary/80"
                  >
                    تعديل
                  </Link>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(initiative.id)}
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InitiativesList 